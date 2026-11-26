import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Common, Mainnet, Sepolia } from '@ethereumjs/common'
import { FlatStateManager, type StateResolutionPolicy } from '@ethereumjs/statemanager'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  accountToBinaryAccount,
  bytesToHex,
  createAddressFromString,
} from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import { parseEthyArgs } from '../src/cli/args.ts'
import { IdentityResolver } from '../src/contracts/identityResolver.ts'
import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { noteAccountProvenance, provenanceLabelForAccountHash } from '../src/custody/provenance.ts'
import { getCommandAvailability } from '../src/domains/commandAvailability.ts'
import { awaitSandboxIdle, enqueueSandbox, resolveSandboxOpts } from '../src/evm/queue.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import {
  mergeUserConfig,
  readUserConfig,
  resolveEffectiveCustodyCount,
  writeUserConfig,
} from '../src/persist/userConfig.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { custodyStatusPayload } from '../src/rpc/custodyStatus.ts'
import { dispatchRpcMethod } from '../src/rpc/methods.ts'
import { createSpine, deriveCapabilities, setPhase } from '../src/spine/createSpine.ts'
import { inspectAccount } from '../src/tools/headTools.ts'
import { validateRawTransaction } from '../src/txpool/validate.ts'

describe('WP-16h client-wide custody leverage', () => {
  it('priority pool: hot rpc completes while ai_probe work is in flight and drains ahead of queued ai_probe', async () => {
    const order: string[] = []
    let releaseBlockers!: () => void
    const blocker = new Promise<void>((r) => {
      releaseBlockers = r
    })
    // Fill all 4 concurrent slots
    const slots = [0, 1, 2, 3].map(() =>
      enqueueSandbox(
        async () => {
          await blocker
          return 'slot'
        },
        { lane: 'ai_probe', timeoutMs: 2_000 },
      ),
    )
    // Queue low-priority ai_probe first, then identity, then rpc
    const pAi = enqueueSandbox(
      async () => {
        order.push('ai_probe')
        return 'ai'
      },
      { lane: 'ai_probe', timeoutMs: 2_000 },
    )
    const pId = enqueueSandbox(
      async () => {
        order.push('identity')
        return 'id'
      },
      { lane: 'identity', timeoutMs: 2_000 },
    )
    const pRpc = enqueueSandbox(
      async () => {
        order.push('rpc')
        return 'rpc'
      },
      { lane: 'rpc', timeoutMs: 2_000 },
    )
    releaseBlockers()
    await Promise.all([...slots, pAi, pId, pRpc])
    expect(order).toEqual(['rpc', 'identity', 'ai_probe'])
    await awaitSandboxIdle()
  })

  it('ai_probe lane defaults to swarm-only resolution policy', () => {
    const opts = resolveSandboxOpts({ lane: 'ai_probe' })
    expect(opts.resolutionPolicy).toBe('swarm-only')
    expect(opts.timeoutMs).toBe(600)
  })

  it('sandbox timeout maps cleanly to JSON-RPC -32000 instead of unhandled rejection', async () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    const stateManager = new FlatStateManager({
      closedBucketsMask: 0,
      resolveAccountMiss: async () => {
        await new Promise((r) => setTimeout(r, 120))
        return undefined
      },
    })
    const sandbox = createEthySandbox({
      spine,
      stateManager,
      chain: Sepolia,
      hardfork: 'amsterdam',
      blockWindow: new RpcBlockWindowStore(Sepolia, 'amsterdam'),
    })
    const out = await sandbox.runEthCall(
      { to: '0x0000000000000000000000000000000000001234', data: '0x' },
      undefined,
      { lane: 'ai_probe', timeoutMs: 25 },
    )
    expect('error' in out).toBe(true)
    if ('error' in out) {
      expect(out.error.code).toBe(-32000)
      expect(out.error.message).toBe('EVM sandbox timed out')
    }
    await awaitSandboxIdle()
  })

  it('false-zero safety: open-world miss returns -32000 across RPC + tx validate, while closed bucket and proven-empty return 0x0', async () => {
    const openAddrStr = '0x1111111111111111111111111111111111111111'
    const openAddr = createAddressFromString(openAddrStr)
    const openBucket = ethyKeccak256(openAddr.bytes)[0]! >> 4

    const emptyAddrStr = '0x2222222222222222222222222222222222222222'
    const emptyAddr = createAddressFromString(emptyAddrStr)
    const emptyHash = ethyKeccak256(emptyAddr.bytes)

    // Pick a closed address whose nibble differs from openBucket
    let closedAddrStr = '0x3333333333333333333333333333333333333333'
    for (let i = 1; i < 64; i++) {
      const candidate = `0x${i.toString(16).padStart(40, '3')}`
      const b = ethyKeccak256(createAddressFromString(candidate).bytes)[0]! >> 4
      if (b !== openBucket) {
        closedAddrStr = candidate
        break
      }
    }
    const closedBucket = ethyKeccak256(createAddressFromString(closedAddrStr).bytes)[0]! >> 4

    const stateManager = new FlatStateManager({
      closedBucketsMask: 1 << closedBucket,
      resolveAccountMiss: async (hash) => {
        if (bytesToHex(hash) === bytesToHex(emptyHash)) return 'empty'
        return undefined
      },
      resolveStorageMiss: async () => undefined,
    })

    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.headBlockNumber = 100n
    const blockWindow = new RpcBlockWindowStore(Sepolia, 'amsterdam')
    const sandbox = createEthySandbox({
      spine,
      stateManager,
      chain: Sepolia,
      hardfork: 'amsterdam',
      blockWindow,
    })
    const ctx = {
      spine,
      stateManager,
      chain: Sepolia,
      hardfork: 'amsterdam',
      blockWindow,
      sandbox,
      demo: false,
    }

    // Open-world unresolved account -> -32000 on all account/storage/EVM methods (never 0x0!)
    for (const [method, params] of [
      ['eth_getBalance', [openAddrStr, 'latest']],
      ['eth_getTransactionCount', [openAddrStr, 'latest']],
      ['eth_getCode', [openAddrStr, 'latest']],
      ['eth_getStorageAt', [openAddrStr, `0x${'00'.repeat(32)}`, 'latest']],
      ['eth_call', [{ to: openAddrStr, data: '0x' }, 'latest']],
      ['eth_estimateGas', [{ from: openAddrStr, to: closedAddrStr, value: '0x0' }, 'latest']],
      ['eth_createAccessList', [{ from: openAddrStr, to: closedAddrStr, value: '0x0' }, 'latest']],
    ] as [string, unknown[]][]) {
      const res = await dispatchRpcMethod(ctx, method, params)
      expect(res.error, `${method} must return error on unresolved open-world miss`).toBeDefined()
      expect(res.error?.code).toBe(-32000)
      expect(res.error?.message).toContain('State witness unavailable')
    }

    // Closed-world empty account -> 0x0 / 0x cleanly
    const closedBal = await dispatchRpcMethod(ctx, 'eth_getBalance', [closedAddrStr, 'latest'])
    expect(closedBal).toEqual({ result: '0x0' })
    const closedCode = await dispatchRpcMethod(ctx, 'eth_getCode', [closedAddrStr, 'latest'])
    expect(closedCode).toEqual({ result: '0x' })

    // Proven-empty open-world tombstone -> 0x0 cleanly
    const tombBal = await dispatchRpcMethod(ctx, 'eth_getBalance', [emptyAddrStr, 'latest'])
    expect(tombBal).toEqual({ result: '0x0' })

    // validateRawTransaction against open-world sender -> -32000 (never nonce=0 / balance=0)
    const common = new Common({ chain: Sepolia, hardfork: 'amsterdam' })
    const privKey = new Uint8Array(32).fill(7)
    const signedTx = createLegacyTx(
      {
        nonce: 0n,
        gasPrice: 1_000_000_000n,
        gasLimit: 21_000n,
        to: createAddressFromString(closedAddrStr),
        value: 0n,
      },
      { common },
    ).sign(privKey)
    const senderBucket = ethyKeccak256(signedTx.getSenderAddress().bytes)[0]! >> 4
    const smTx = new FlatStateManager({
      closedBucketsMask: 0xffff & ~(1 << senderBucket),
      resolveAccountMiss: async () => undefined,
    })
    const txOut = await validateRawTransaction(
      signedTx.serialize(),
      smTx,
      Sepolia,
      'amsterdam',
      11155111n,
    )
    expect('error' in txOut).toBe(true)
    if ('error' in txOut) {
      expect(txOut.error.code).toBe(-32000)
      expect(txOut.error.message).toContain('State witness unavailable')
    }
    await awaitSandboxIdle()
  })

  it('ENS warmEnsBootstrap uses swarm-only policy and activates hasLocalEnsRegistry()', async () => {
    const ensAddr = createAddressFromString('0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e')
    const ensHashHex = bytesToHex(ethyKeccak256(ensAddr.bytes))
    const dummyCode = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xf3])
    const codeHash = ethyKeccak256(dummyCode)
    const policiesSeen: StateResolutionPolicy[] = []

    const stateManager = new FlatStateManager({
      closedBucketsMask: 0,
      resolveAccountMiss: async (hash, policy) => {
        policiesSeen.push(policy)
        if (bytesToHex(hash) === ensHashHex) {
          return accountToBinaryAccount(new Account(1n, 0n, undefined, codeHash))
        }
        return 'empty'
      },
      resolveCodeMiss: async (cHash, policy) => {
        policiesSeen.push(policy)
        if (bytesToHex(cHash) === bytesToHex(codeHash)) return dummyCode
        return undefined
      },
    })

    const spine = createSpine('mainnet', 1n)
    setPhase(spine, 'HEAD_FOLLOWING')
    const resolver = new IdentityResolver({
      chain: Mainnet,
      spine,
      stateManager,
    })
    expect(resolver.hasLocalEnsRegistry()).toBe(false)
    await resolver.warmEnsBootstrap()
    expect(resolver.hasLocalEnsRegistry()).toBe(true)
    expect(policiesSeen.length).toBeGreaterThan(0)
    expect(policiesSeen.every((p) => p === 'swarm-only')).toBe(true)
    await awaitSandboxIdle()
  })

  it('HEAD_FOLLOWING unlocks /account and /simulate without 16 snap buckets and avoids 16/2 pill label', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.custodyDialCount = 2
    spine.custodyBuckets = [0, 8]
    spine.closedBucketsMask = (1 << 0) | (1 << 8)
    spine.machine = {
      mode: 'custody-live-calm',
      modeReason: 'custody live steady',
      nextEventSummary: 'Live',
      planes: { eth: 'active', ethy: 'active', snap: 'off', discovery: 'standby', cl: 'active' },
      servingEthy: 'serving',
      ethyDiscoveryTag: true,
      transitions: [],
      vipTarget: 6,
      discoveryMode: 'quiet',
      hopBuckets: 16,
    }
    setPhase(spine, 'HEAD_FOLLOWING')
    deriveCapabilities(spine)
    expect(spine.capabilities.state.label).toBe('Live 16/16')
    expect(getCommandAvailability('/account', spine).status).toBe('ready')
    expect(getCommandAvailability('/simulate', spine).status).toBe('ready')
    expect(getCommandAvailability('/contract', spine).status).toBe('ready')
  })

  it('provenance LRU and local closed custody label appear on /account', async () => {
    noteAccountProvenance('abcd', 'ETHY 1-Hop Proof')
    expect(provenanceLabelForAccountHash('AbCd')).toBe('ETHY 1-Hop Proof')

    const addrStr = '0x4444444444444444444444444444444444444444'
    const addr = createAddressFromString(addrStr)
    const hash = ethyKeccak256(addr.bytes)
    const bucket = hash[0]! >> 4
    const sm = new FlatStateManager()
    await sm.putAccount(addr, new Account(2n, 1000n))
    const spine = createSpine('sepolia', 11155111n)
    spine.closedBucketsMask = 1 << bucket
    const widget = inspectAccount(spine, sm, addrStr)
    expect(widget.kind).toBe('key_value')
    if (widget.kind === 'key_value') {
      expect(widget.entries.some((e) => e.key === 'Source' && e.value === 'Local Custody 🔒')).toBe(
        true,
      )
    }
  })

  it('ethy_custodyStatus honestly derives swarmReachableBucketsMask even before machine ticks', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.custodyDialCount = 2
    spine.custodyBuckets = [0, 8]
    spine.closedBucketsMask = 1
    spine.custodyResolve = { local: 1, tombstone: 0, ethyProof: 0, ethyChunk: 0, snap: 0 }
    const payload = custodyStatusPayload(spine)
    expect(payload.custodyCount).toBe(2)
    expect(payload.closedBucketsMask).toBe('0x1')
    expect(payload.swarmReachableBucketsMask).toBe('0x1')
    expect(payload.hopBuckets).toBe(1)
    expect(payload.privateBucketsCount).toBe(1)
    expect(payload.resolutionStats).toBeDefined()
  })

  it('custodyCount precedence and non-clobbering config.json merge', () => {
    const cliExplicit = parseEthyArgs(['node', 'sepolia', '--custody', '4'])
    const resolvedExplicit = resolveEffectiveCustodyCount(
      { schemaVersion: 1, updatedAt: '', custodyCount: 8 },
      cliExplicit,
    )
    expect(resolvedExplicit).toEqual({ count: 4, persistOnBoot: true })

    const cliFull = parseEthyArgs(['node', 'sepolia', '--full'])
    expect(resolveEffectiveCustodyCount(undefined, cliFull)).toEqual({
      count: 16,
      persistOnBoot: true,
    })

    const cliFullNoSave = parseEthyArgs(['node', 'sepolia', '--full', '--no-save'])
    expect(resolveEffectiveCustodyCount(undefined, cliFullNoSave)).toEqual({
      count: 16,
      persistOnBoot: false,
    })

    const cliDefault = parseEthyArgs(['node', 'sepolia'])
    expect(
      resolveEffectiveCustodyCount(
        { schemaVersion: 1, updatedAt: '', custodyCount: 6 },
        cliDefault,
      ),
    ).toEqual({ count: 6, persistOnBoot: false })

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-cfg-'))
    try {
      writeUserConfig(tmpDir, { mode: 'off' })
      mergeUserConfig(tmpDir, { custodyCount: 4 })
      const loaded = readUserConfig(tmpDir)
      expect(loaded?.ai?.mode).toBe('off')
      expect(loaded?.custodyCount).toBe(4)
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})
