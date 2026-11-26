import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  EthyChunkStore,
  EthyStorageStore,
  EthyWitnessStore,
  SharedCodeDisk,
} from '@ethereumjs/devp2p'
import { createMerkleProof } from '@ethereumjs/mpt'
import type { BALInput } from '@ethereumjs/util'
import { Address, bytesToHex, equalsBytes, setLengthLeft } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256, initEthyKeccak } from '../src/crypto/keccak.ts'
import { buildWitnessFoldContext } from '../src/custody/custodyWitnessFold.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { type RpcHandlerContext, dispatchRpcMethod } from '../src/rpc/methods.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import type { EthySpine } from '../src/spine/types.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'
import { seedDemoEthyPivot } from '../src/sync/seedDemoState.ts'
import { verifyProvenStorageKind1Job } from '../src/sync/snapVerifyJob.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'
import { createCustodyLoopback, stubCustodianPeer } from './helpers/custodyLoopbackHarness.ts'

function buildRpcCtx(
  sm: ReturnType<typeof createCustodyLoopback>['stateManager'],
  spine: EthySpine,
): RpcHandlerContext {
  const chain = chainConfigForNetwork('mainnet')
  const hardfork = activeHardfork(chain)
  const blockWindow = new RpcBlockWindowStore(chain, hardfork)
  const sandbox = createEthySandbox({ spine, stateManager: sm, chain, hardfork, blockWindow })
  return { spine, stateManager: sm, chain, hardfork, demo: false, blockWindow, sandbox }
}

async function primeContractCustodian(
  demo: SyntheticSnapPeer,
  seed: Awaited<ReturnType<typeof seedDemoEthyPivot>>,
): Promise<{
  contract: (typeof demo.accounts)[0]
  chunks: EthyChunkStore
  storageStore: EthyStorageStore
  codeDisk: SharedCodeDisk
}> {
  const contract = demo.accounts.find((a) => a.code !== undefined)
  assert.isDefined(contract)
  assert.isDefined(contract.code)
  assert.isDefined(contract.storageTrie)

  const chunks = new EthyChunkStore()
  chunks.setPivotAccountsDir(seed.accountsDir)
  assert.isDefined(chunks.getAccountChunk(contract.accountHash[0]! >> 4, contract.accountHash))

  const codeDisk = new SharedCodeDisk()
  codeDisk.put(contract.account.codeHash, contract.code)

  const slotKey = keccak_256(setLengthLeft(new Uint8Array([0x01]), 32))
  const slab = new Uint8Array(64)
  slab.set(slotKey, 0)
  const val32 = new Uint8Array(32)
  val32[31] = 2
  slab.set(val32, 32)
  const proofs = await createMerkleProof(contract.storageTrie, slotKey)

  const storageStore = new EthyStorageStore()
  storageStore.put({
    accountHash: contract.accountHash,
    storageRoot: contract.account.storageRoot,
    chunkBlockNumber: seed.pivotBlock,
    slotsSlab64B: slab,
    complete: false,
    proofNodes: proofs,
  })

  return { contract: contract!, chunks, storageStore, codeDisk }
}

describe('custodySection4', () => {
  it('prime contract storage satisfies kind-1 verify', async () => {
    await initEthyKeccak()
    const demo = await SyntheticSnapPeer.create(1)
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-s4-prime-'))
    try {
      const seed = await seedDemoEthyPivot({ dataDir: dir, network: 'mainnet', chainId: 1n })
      const { contract } = await primeContractCustodian(demo, seed)
      const slotKey = keccak_256(setLengthLeft(new Uint8Array([0x01]), 32))
      assert.isDefined(contract.storageTrie)
      const proofs = await createMerkleProof(contract.storageTrie, slotKey)
      const slab = new Uint8Array(64)
      slab.set(slotKey, 0)
      const val32 = new Uint8Array(32)
      val32[31] = 2
      slab.set(val32, 32)
      const verified = await verifyProvenStorageKind1Job({
        storageRoot: contract.account.storageRoot,
        originSlotHash: slotKey,
        slotsSlab64B: slab,
        proofNodes: proofs,
        hasRightHint: true,
      })
      assert.equal(verified.ok, true, verified.ok ? '' : (verified as { reason?: string }).reason)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('zero-snap ladder: balance, code, storage, proven-empty, eth_call', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-s4-'))
    try {
      const demo = await SyntheticSnapPeer.create(1)
      const seed = await seedDemoEthyPivot({ dataDir: dir, network: 'mainnet', chainId: 1n })
      const { contract, chunks, storageStore, codeDisk } = await primeContractCustodian(demo, seed)
      const bucket = contract.accountHash[0]! >> 4

      const spine = createSpine('mainnet', 1n)
      spine.pivotBlockNumber = seed.pivotBlock
      spine.headBlockNumber = seed.pivotBlock
      spine.pivotStateRoot = seed.stateRoot
      await initEthyKeccak()
      const writeIndex = new StatyWriteIndex(ethyKeccak256)
      const witnessStore = new EthyWitnessStore()

      const loop = createCustodyLoopback({
        seed,
        spine,
        writeIndex,
        bucket,
        chunks,
        storageStore,
        codeDisk,
        witnessStore,
      })

      const addr = new Address(contract.address)
      const account = await loop.stateManager.getAccount(addr)
      assert.isDefined(account)
      assert.equal(account!.balance, contract.account.balance)

      const presentSlot = setLengthLeft(new Uint8Array([0x01]), 32)
      const accountHash = keccak_256(addr.bytes)
      const slotHash = keccak_256(presentSlot)
      const warmed = await loop.resolver.resolveStorageMiss(accountHash, slotHash, 'full')
      assert.isDefined(warmed)
      assert.notEqual(warmed, 'empty')
      loop.stateManager.putSnapStorageBatch(accountHash, [
        { slotHash, value: warmed as Uint8Array },
      ])
      const present = loop.stateManager.getStorageByHash(accountHash, slotHash)
      assert.isDefined(present)
      assert.equal(present![31], 2)

      const code = await loop.stateManager.getCode(addr)
      assert.isTrue(equalsBytes(code, contract.code!))
      const call = await dispatchRpcMethod(buildRpcCtx(loop.stateManager, spine), 'eth_call', [
        { from: addr.toString(), to: addr.toString(), data: '0x' },
        'latest',
      ])
      assert.notProperty(call, 'error')

      assert.equal(loop.snapSendCount(), 0)
      assert.isAbove(loop.ethySendCount(), 0)
      assert.isDefined(stubCustodianPeer(bucket, seed.pivotBlock))
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('folds account chunk through local BAL window to head', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-s4-bal-'))
    try {
      const demo = await SyntheticSnapPeer.create(1)
      const pivot = 100n
      const seed = await seedDemoEthyPivot({
        dataDir: dir,
        network: 'mainnet',
        chainId: 1n,
        pivotBlock: pivot,
      })
      const row = demo.accounts.find((a) => a.accountHash[0]! >> 4 === 0)
      assert.isDefined(row)
      const bucket = row!.accountHash[0]! >> 4

      const chunks = new EthyChunkStore()
      chunks.setPivotAccountsDir(seed.accountsDir)
      const storageStore = new EthyStorageStore()
      const codeDisk = new SharedCodeDisk()
      const witnessStore = new EthyWitnessStore()
      await initEthyKeccak()
      const writeIndex = new StatyWriteIndex(ethyKeccak256)

      const addrHex = bytesToHex(row!.address)
      const bal: BALInput = [
        {
          address: addrHex,
          balanceChanges: [{ blockAccessIndex: '0x1', postBalance: '0xfa' }],
          nonceChanges: [],
          codeChanges: [],
          storageReads: [],
          storageChanges: [],
        },
      ]
      writeIndex.ingestVerifiedBal(101, bal)

      const spine = createSpine('mainnet', 1n)
      spine.pivotBlockNumber = pivot
      spine.pivotStateRoot = seed.stateRoot
      spine.headBlockNumber = 105n
      spine.lastVerifiedBlockNumber = 105n
      spine.balWindow = [{ blockNumber: 101n, balJson: bal, accountCount: 1 }]

      const loop = createCustodyLoopback({
        seed,
        spine,
        writeIndex,
        bucket,
        chunks,
        storageStore,
        codeDisk,
        witnessStore,
      })

      const account = await loop.stateManager.getAccount(new Address(row!.address))
      assert.isDefined(account)
      assert.equal(account!.balance, 250n)
      assert.equal(loop.snapSendCount(), 0)
      assert.isTrue(buildWitnessFoldContext(spine, writeIndex).latestVerifiedBlock >= 105)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('hybrid open-world eth_call stays green after markBucketClosed', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-s4-hybrid-'))
    try {
      const demo = await SyntheticSnapPeer.create(1)
      const seed = await seedDemoEthyPivot({ dataDir: dir, network: 'mainnet', chainId: 1n })
      const { contract, chunks, storageStore, codeDisk } = await primeContractCustodian(demo, seed)
      const bucket = contract.accountHash[0]! >> 4

      const spine = createSpine('mainnet', 1n)
      spine.pivotBlockNumber = seed.pivotBlock
      spine.headBlockNumber = seed.pivotBlock
      spine.lastVerifiedBlockNumber = seed.pivotBlock
      spine.pivotStateRoot = seed.stateRoot
      await initEthyKeccak()
      const writeIndex = new StatyWriteIndex(ethyKeccak256)

      const loop = createCustodyLoopback({
        seed,
        spine,
        writeIndex,
        bucket,
        chunks,
        storageStore,
        codeDisk,
        witnessStore: new EthyWitnessStore(),
      })

      const addr = new Address(contract.address)
      await loop.stateManager.getAccount(addr)
      await loop.stateManager.getCode(addr)
      const ctx = buildRpcCtx(loop.stateManager, spine)
      const warm = await dispatchRpcMethod(ctx, 'eth_call', [
        { from: addr.toString(), to: addr.toString(), data: '0x' },
        'latest',
      ])
      assert.notProperty(warm, 'error')
      const ethyAfterWarm = loop.ethySendCount()

      loop.stateManager.markBucketClosed(bucket)
      const again = await dispatchRpcMethod(ctx, 'eth_call', [
        { from: addr.toString(), to: addr.toString(), data: '0x' },
        'latest',
      ])
      assert.notProperty(again, 'error')
      assert.equal(loop.ethySendCount(), ethyAfterWarm)
      assert.equal(loop.snapSendCount(), 0)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
