import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  EthyChunkStore,
  EthyMessageCodeNames,
  EthyMessageCodes,
  EthyStorageStore,
  EthySubtreeRootBook,
  EthyWitnessStore,
  RollingBlockStore,
  SharedCodeDisk,
  SnapMessageCodes,
  tryServeEthyGet,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  Address,
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import {
  CustodyStateResolver,
  createCustodyResolverHooks,
} from '../src/custody/custodyStateResolver.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { type RpcHandlerContext, dispatchRpcMethod } from '../src/rpc/methods.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'
import { seedDemoEthyPivot } from '../src/sync/seedDemoState.ts'
import { verifyProvenAccountChunkJob } from '../src/sync/snapVerifyJob.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

const CUSTODIAN_NODE_ID = new Uint8Array(32).fill(0xcd)
const CUSTODIAN_PEER_ID = `0x${bytesToUnprefixedHex(CUSTODIAN_NODE_ID)}`

function buildRpcCtx(sm: ReturnType<typeof createFlatStateManager>): RpcHandlerContext {
  const spine = createSpine('mainnet', 1n)
  spine.phase = 'HEAD_FOLLOWING'
  spine.headBlockNumber = 200n
  spine.lastVerifiedBlockNumber = 200n
  const chain = chainConfigForNetwork('mainnet')
  const hardfork = activeHardfork(chain)
  const blockWindow = new RpcBlockWindowStore(chain, hardfork)
  const sandbox = createEthySandbox({ spine, stateManager: sm, chain, hardfork, blockWindow })
  return { spine, stateManager: sm, chain, hardfork, demo: false, blockWindow, sandbox }
}

function stubCustodianPeer(pivotBlock: bigint) {
  return {
    id: CUSTODIAN_PEER_ID,
    clientId: 'custody-cold-miss',
    caps: [],
    ethySession: true,
    ethyStatus: {
      basePivotBlock: pivotBlock.toString(),
      basePivotStateRoot: `${'aa'.repeat(64)}`,
      bucketsBitmask: '0x1',
      codeBucketsBitmask: '0xffff',
      storageBucketsBitmask: '0xffff',
      balEarliestBlock: '0',
      balLatestBlock: pivotBlock.toString(),
      latestBlockHash: `${'bb'.repeat(64)}`,
    },
  }
}

describe('custodyColdMissLoopback', () => {
  it('1-hop PROVEN_ACCOUNT_CHUNK resolves open-world balance with zero snap/1', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-cold-miss-'))
    try {
      const demo = await SyntheticSnapPeer.create(1)
      const seed = await seedDemoEthyPivot({ dataDir: dir, network: 'mainnet', chainId: 1n })
      assert.isTrue(equalsBytes(seed.stateRoot, demo.rootHash))
      const row = demo.accounts.find((a) => a.accountHash[0]! >> 4 === 0)
      assert.isDefined(row)

      const chunks = new EthyChunkStore()
      chunks.setPivotAccountsDir(seed.accountsDir)
      const chunkRec = chunks.getAccountChunk(0, row!.accountHash)
      assert.isDefined(chunkRec)
      const servedProbe = tryServeEthyGet(
        chunks,
        new RollingBlockStore(),
        [],
        CUSTODIAN_NODE_ID,
        undefined,
        'GET_PROVEN_ACCOUNT_CHUNK',
        [bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), row!.accountHash],
        new SharedCodeDisk(),
        new EthyStorageStore(),
        {
          witnessStore: new EthyWitnessStore(),
          subtreeBook: new EthySubtreeRootBook(),
          remoteBucketsBitmask: 0xffff,
          witnessThrottle: { windowStartMs: 0, count: 0 },
        },
      )
      assert.isDefined(servedProbe)
      const probeRlp = servedProbe!.rlp as unknown[]
      const verified = await verifyProvenAccountChunkJob({
        chunkStateRoot: probeRlp[5] as Uint8Array,
        originHash: probeRlp[2] as Uint8Array,
        binaryAccountsSlab: probeRlp[7] as Uint8Array,
        proofNodes: (probeRlp[8] as Uint8Array[]) ?? [],
        hasRightHint: Number(probeRlp[4]) !== 0,
      })
      assert.isTrue(verified.ok, verified.reason)

      const spine = createSpine('mainnet', 1n)
      spine.pivotBlockNumber = seed.pivotBlock
      spine.headBlockNumber = seed.pivotBlock
      const writeIndex = new StatyWriteIndex(keccak_256)

      let snapSends = 0
      let accountChunkSends = 0
      let witnessSends = 0
      const resolver = new CustodyStateResolver({
        getClient: () =>
          ({
            sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
              if (
                code === SnapMessageCodes.GET_ACCOUNT_RANGE ||
                code === SnapMessageCodes.GET_STORAGE_RANGES
              ) {
                snapSends += 1
                return
              }
              if (code === EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK) accountChunkSends += 1
              if (code === EthyMessageCodes.GET_STATE_WITNESS) witnessSends += 1
              const name = EthyMessageCodeNames[code as EthyMessageCodes]
              if (!name.startsWith('GET_')) return
              const decoded = RLP.decode(payload) as unknown
              if (code === EthyMessageCodes.GET_STATE_WITNESS) {
                const reqId = (decoded as unknown[])[0]
                resolver.handleEthyResponse(
                  CUSTODIAN_PEER_ID,
                  EthyMessageCodes.STATE_WITNESS,
                  RLP.encode([reqId, []] as never),
                )
                return
              }
              const served = tryServeEthyGet(
                chunks,
                new RollingBlockStore(),
                [],
                CUSTODIAN_NODE_ID,
                undefined,
                name,
                decoded,
                new SharedCodeDisk(),
                new EthyStorageStore(),
                {
                  witnessStore: new EthyWitnessStore(),
                  subtreeBook: new EthySubtreeRootBook(),
                  remoteBucketsBitmask: 0xffff,
                  witnessThrottle: { windowStartMs: 0, count: 0 },
                },
              )
              if (served === undefined) return
              resolver.handleEthyResponse(
                CUSTODIAN_PEER_ID,
                served.code,
                RLP.encode(served.rlp as never),
              )
            },
          }) as never,
        getPeers: () => [stubCustodianPeer(seed.pivotBlock)],
        spine,
        writeIndex,
        snapBootstrapEnabled: false,
        balEarliestBlock: () => 0n,
        witnessBatchWindowMs: 0,
      })

      const sm = createFlatStateManager({
        closedBucketsMask: 0x0000,
        resolutionPolicy: 'full',
        ...createCustodyResolverHooks(resolver),
      })
      const addr = new Address(row!.address)
      const account = await sm.getAccount(addr)
      assert.isDefined(account)
      assert.equal(account!.balance, row!.account.balance)
      assert.isAbove(accountChunkSends, 0)
      assert.isAbove(witnessSends, 0)
      assert.equal(snapSends, 0)

      const rpcOut = await dispatchRpcMethod(buildRpcCtx(sm), 'eth_getBalance', [
        addr.toString(),
        'latest',
      ])
      const expectedHex = `0x${row!.account.balance.toString(16)}`
      assert.equal(rpcOut.result, expectedHex)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('markBucketClosed stops further ETHY resolver traffic on cache hit', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-cold-flip-'))
    try {
      const demo = await SyntheticSnapPeer.create(1)
      const seed = await seedDemoEthyPivot({ dataDir: dir, network: 'mainnet', chainId: 1n })
      const row = demo.accounts.find((a) => a.accountHash[0]! >> 4 === 0)
      assert.isDefined(row)
      const bucket = row!.accountHash[0]! >> 4

      const chunks = new EthyChunkStore()
      chunks.setPivotAccountsDir(seed.accountsDir)
      const spine = createSpine('mainnet', 1n)
      spine.pivotBlockNumber = seed.pivotBlock
      const writeIndex = new StatyWriteIndex(keccak_256)

      let ethySends = 0
      const resolver = new CustodyStateResolver({
        getClient: () =>
          ({
            sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
              ethySends += 1
              const name = EthyMessageCodeNames[code as EthyMessageCodes]
              if (!name.startsWith('GET_')) return
              const decoded = RLP.decode(payload) as unknown
              if (code === EthyMessageCodes.GET_STATE_WITNESS) {
                const reqId = (decoded as unknown[])[0]
                resolver.handleEthyResponse(
                  CUSTODIAN_PEER_ID,
                  EthyMessageCodes.STATE_WITNESS,
                  RLP.encode([reqId, []] as never),
                )
                return
              }
              const served = tryServeEthyGet(
                chunks,
                new RollingBlockStore(),
                [],
                CUSTODIAN_NODE_ID,
                undefined,
                name,
                decoded,
                new SharedCodeDisk(),
                new EthyStorageStore(),
                {
                  witnessStore: new EthyWitnessStore(),
                  subtreeBook: new EthySubtreeRootBook(),
                  remoteBucketsBitmask: 0xffff,
                  witnessThrottle: { windowStartMs: 0, count: 0 },
                },
              )
              if (served === undefined) return
              resolver.handleEthyResponse(
                CUSTODIAN_PEER_ID,
                served.code,
                RLP.encode(served.rlp as never),
              )
            },
          }) as never,
        getPeers: () => [stubCustodianPeer(seed.pivotBlock)],
        spine,
        writeIndex,
        snapBootstrapEnabled: false,
        balEarliestBlock: () => 0n,
        witnessBatchWindowMs: 0,
      })

      const sm = createFlatStateManager({
        closedBucketsMask: 0x0000,
        resolutionPolicy: 'full',
        ...createCustodyResolverHooks(resolver),
      })
      const first = await sm.getAccount(new Address(row!.address))
      assert.isDefined(first)
      const sendsAfterWarm = ethySends
      assert.isAbove(sendsAfterWarm, 0)

      sm.markBucketClosed(bucket)
      const second = await sm.getAccount(new Address(row!.address))
      assert.isDefined(second)
      assert.equal(second!.balance, first!.balance)
      assert.equal(ethySends, sendsAfterWarm)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
