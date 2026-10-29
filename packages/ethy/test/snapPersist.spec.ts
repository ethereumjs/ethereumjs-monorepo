import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import {
  type BALJSONBlockAccessList,
  bytesToHex,
  createAccount,
  createAddressFromString,
  createBlockLevelAccessListFromJSON,
  hexToBigInt,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { encodeAccountJournalRecord, readAccountJournalFile } from '../src/persist/journal.ts'
import { SnapPivotStore, snapBucketsUnfinished } from '../src/persist/snapStore.ts'
import { createSnapBuckets } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-snap-'))
}

function openStore(dir: string, network = 'sepolia'): SnapPivotStore {
  return SnapPivotStore.open({
    dataDir: dir,
    network,
    chainId: 11155111n,
    genesisHash: networkGenesisHash(network),
    enabled: true,
  })
}

describe('[Ethy/Persist]: snap pivot store', () => {
  it('resume restores accounts and bucket cursor', () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0xab
    const store = openStore(dir)
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x01
    const rlp = createAccount({ nonce: 1n, balance: 2n }).serialize()
    const record = { accountHash: hash, accountRlp: rlp }
    const buckets = createSnapBuckets()
    buckets[0]!.accountsLoaded = 1
    buckets[0]!.status = 'pending'
    store.appendVerifiedRange(0, [record], buckets)

    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    const restored = openStore(dir).loadInto(spine, sm)
    assert.equal(restored, 1)
    assert.equal(sm.accountCount(), 1)
    assert.equal(spine.snapBuckets[0]!.accountsLoaded, 1)
    assert.notEqual(spine.snapBuckets[0]!.currentLastHash[0], 0)
  })

  it('drops a torn tail record on read', () => {
    const hash = new Uint8Array(32)
    hash[0] = 0x02
    const rlp = new Uint8Array([0xc0])
    const good = encodeAccountJournalRecord({ accountHash: hash, accountRlp: rlp })
    const torn = new Uint8Array(good.length + 5)
    torn.set(good)
    const { records } = readAccountJournalFile(torn)
    assert.equal(records.length, 1)
  })

  it('refuses a genesis mismatch without deleting files', () => {
    const dir = tempDir()
    openStore(dir)
    assert.throws(() =>
      SnapPivotStore.open({
        dataDir: dir,
        network: 'sepolia',
        chainId: 11155111n,
        genesisHash: '0xdead',
        enabled: true,
      }),
    )
    assert.isTrue(fs.existsSync(path.join(dir, 'networks', 'sepolia', 'chain.json')))
  })

  it('prune keeps active and previous pivot only', () => {
    const dir = tempDir()
    const store = openStore(dir)
    const mkRoot = (n: number) => {
      const r = new Uint8Array(32)
      r[31] = n
      return r
    }
    store.activatePivot({ blockNumber: 1n, blockHash: new Uint8Array(32), stateRoot: mkRoot(1) })
    store.activatePivot({ blockNumber: 2n, blockHash: new Uint8Array(32), stateRoot: mkRoot(2) })
    store.activatePivot({ blockNumber: 3n, blockHash: new Uint8Array(32), stateRoot: mkRoot(3) })
    const pivotsDir = path.join(dir, 'networks', 'sepolia', 'pivots')
    const names = fs.readdirSync(pivotsDir).sort()
    assert.deepEqual(names, [
      bytesToHex(mkRoot(2)).slice(2).toLowerCase(),
      bytesToHex(mkRoot(3)).slice(2).toLowerCase(),
    ])
  })

  it('snapBucketsUnfinished() reflects open buckets', () => {
    const buckets = createSnapBuckets()
    assert.isTrue(snapBucketsUnfinished(buckets))
    for (const b of buckets) b.status = 'done'
    assert.isFalse(snapBucketsUnfinished(buckets))
  })

  it('sepolia data does not load under mainnet', () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0x55
    openStore(dir).activatePivot({
      blockNumber: 1n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const mainnetSpine = createSpine('mainnet', 1n)
    const restored = SnapPivotStore.open({
      dataDir: dir,
      network: 'mainnet',
      chainId: 1n,
      genesisHash: networkGenesisHash('mainnet'),
      enabled: true,
    }).loadInto(mainnetSpine, createFlatStateManager())
    assert.equal(restored, 0)
    assert.isUndefined(mainnetSpine.pivotStateRoot)
  })

  it('replayPersistedHealBalJournal applies heal journal on disk', async () => {
    const bal = createBlockLevelAccessListFromJSON(
      balSimpleJSON.filter(
        (entry) =>
          entry.balanceChanges.length > 0 ||
          entry.storageChanges.length > 0 ||
          entry.nonceChanges.length > 0,
      ) as BALJSONBlockAccessList,
    )
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0xcd
    const store = openStore(dir)
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    store.appendHealBal(101n, bal.serialize())
    const sm = createFlatStateManager()
    const replayed = await openStore(dir).replayPersistedHealBalJournal(sm)
    assert.equal(replayed, 1)
    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const account = await sm.getAccount(balanceAddr)
    assert.equal(account?.balance, hexToBigInt('0x01ec30'))
  })

  it('demo store does not touch disk', () => {
    const dir = tempDir()
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: false,
    })
    const spine = createSpine('sepolia', 11155111n)
    assert.equal(store.loadInto(spine, createFlatStateManager()), 0)
    assert.isFalse(fs.existsSync(path.join(dir, 'meta.json')))
  })
})
