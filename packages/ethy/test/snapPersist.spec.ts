import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import {
  type BALJSONBlockAccessList,
  accountToBinaryAccount,
  bytesToHex,
  bytesToUnprefixedHex,
  createAccount,
  createAddressFromString,
  createBlockLevelAccessListFromJSON,
  hexToBigInt,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import {
  countAccountJournalRecords,
  encodeAccountJournalRecord,
  readAccountJournalFile,
} from '../src/persist/journal.ts'
import { SnapPivotStore, snapBucketsUnfinished } from '../src/persist/snapStore.ts'
import { createSnapBuckets, syncBucketCursorFields } from '../src/spine/buckets.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-snap-'))
}

function segmentJournalKey(origin: Uint8Array): string {
  return bytesToUnprefixedHex(origin).slice(0, 16)
}

function encodeSlabRow(accountHash: Uint8Array, binaryAccount: Uint8Array): Uint8Array {
  const row = new Uint8Array(136)
  row.set(accountHash, 0)
  row.set(binaryAccount, 32)
  return row
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
  it('resume reopens a done bucket whose cursor is still below the limit', () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0xcd
    const store = openStore(dir)
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const buckets = createSnapBuckets()
    buckets[3]!.status = 'done'
    buckets[4]!.status = 'done'
    buckets[4]!.subRanges = []
    buckets[4]!.currentLastHash = new Uint8Array(buckets[4]!.limitHash)
    store.flushBuckets(buckets)

    const spine = createSpine('sepolia', 11155111n)
    openStore(dir).loadInto(spine, createFlatStateManager())
    assert.equal(spine.snapBuckets[3]!.status, 'pending')
    assert.equal(spine.snapBuckets[4]!.status, 'done')
  })

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
    const binary = accountToBinaryAccount(createAccount({ nonce: 1n, balance: 2n }))
    const record = { accountHash: hash, binaryAccount: binary }
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
    const stored = sm.getBinaryAccountByHash(hash)
    assert.isDefined(stored)
    assert.equal(stored!.length, 104)
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
    assert.equal(countAccountJournalRecords(torn), 1)
  })

  it('resume notes account journals left on the previous pivot', () => {
    const dir = tempDir()
    const store = openStore(dir)
    const rootA = new Uint8Array(32)
    rootA[31] = 1
    const rootB = new Uint8Array(32)
    rootB[31] = 2
    store.activatePivot({ blockNumber: 10n, blockHash: new Uint8Array(32), stateRoot: rootA })
    const hash = new Uint8Array(32)
    hash[0] = 0x01
    const binary = accountToBinaryAccount(createAccount({ nonce: 1n, balance: 2n }))
    const buckets = createSnapBuckets()
    buckets[0]!.accountsLoaded = 1
    store.appendVerifiedRange(0, [{ accountHash: hash, binaryAccount: binary }], buckets)
    store.activatePivot({ blockNumber: 80n, blockHash: new Uint8Array(32), stateRoot: rootB })

    const spine = createSpine('sepolia', 11155111n)
    const restored = openStore(dir).loadInto(spine, createFlatStateManager())
    assert.equal(restored, 0)
    assert.equal(spine.pivotBlockNumber, 80n)
    assert.deepEqual(spine.pivotCarry, { kind: 'previous', accounts: 1 })
  })

  it('resume ignores a saved count when the previous journal file is missing', () => {
    const dir = tempDir()
    const store = openStore(dir)
    const rootA = new Uint8Array(32)
    rootA[31] = 3
    const rootB = new Uint8Array(32)
    rootB[31] = 4
    store.activatePivot({ blockNumber: 10n, blockHash: new Uint8Array(32), stateRoot: rootA })
    const buckets = createSnapBuckets()
    buckets[0]!.accountsLoaded = 3_000_000
    store.flushBuckets(buckets)
    store.activatePivot({ blockNumber: 80n, blockHash: new Uint8Array(32), stateRoot: rootB })

    const spine = createSpine('sepolia', 11155111n)
    openStore(dir).loadInto(spine, createFlatStateManager())
    assert.isUndefined(spine.pivotCarry)
  })

  it('resume counts a previous journal when the saved count is zero', () => {
    const dir = tempDir()
    const store = openStore(dir)
    const rootA = new Uint8Array(32)
    rootA[31] = 5
    const rootB = new Uint8Array(32)
    rootB[31] = 6
    store.activatePivot({ blockNumber: 10n, blockHash: new Uint8Array(32), stateRoot: rootA })
    const hash = new Uint8Array(32)
    hash[0] = 0x04
    const binary = accountToBinaryAccount(createAccount({ nonce: 1n, balance: 2n }))
    const buckets = createSnapBuckets()
    store.appendVerifiedRange(0, [{ accountHash: hash, binaryAccount: binary }], buckets)
    store.activatePivot({ blockNumber: 80n, blockHash: new Uint8Array(32), stateRoot: rootB })

    const spine = createSpine('sepolia', 11155111n)
    openStore(dir).loadInto(spine, createFlatStateManager())
    assert.deepEqual(spine.pivotCarry, { kind: 'previous', accounts: 1 })
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

  it('lookup and resume restore multi-cursor segment journals in one nibble', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0x42
    const store = openStore(dir)
    store.activatePivot({
      blockNumber: 50n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const hashA = new Uint8Array(32)
    hashA[0] = 0x01
    const hashB = new Uint8Array(32)
    hashB[0] = 0x0f
    hashB[1] = 0xff
    const binary = accountToBinaryAccount(createAccount({ nonce: 1n, balance: 1n }))
    const buckets = createSnapBuckets()
    await store.appendVerifiedSlabAsync(0, encodeSlabRow(hashA, binary), buckets, 'prefix')
    const segJournal = segmentJournalKey(hashB)
    await store.appendVerifiedSlabAsync(0, encodeSlabRow(hashB, binary), buckets, segJournal)
    buckets[0]!.subRanges = [
      {
        id: 0,
        bucketIndex: 0,
        origin: new Uint8Array(buckets[0]!.startHash),
        limit: hashB,
        journal: 'prefix',
      },
      {
        id: 1,
        bucketIndex: 0,
        origin: hashB,
        limit: new Uint8Array(buckets[0]!.limitHash),
        journal: segJournal,
      },
    ]
    syncBucketCursorFields(buckets[0]!)
    store.flushBuckets(buckets)
    store.maybeFlushMetadata(true)
    await store.drainPendingFlushes()

    const lookupStore = openStore(dir)
    assert.isDefined(lookupStore.lookupBinaryAccountByHash(hashA))
    assert.isDefined(lookupStore.lookupBinaryAccountByHash(hashB))

    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    lookupStore.loadInto(spine, sm)
    assert.equal(spine.snapBuckets[0]!.subRanges?.length, 2)
    assert.equal(spine.snapBuckets[0]!.accountsLoaded, 2)

    // Appending after resume must NOT write a duplicate 4-byte magic prefix into `.seg`
    const hashC = new Uint8Array(32)
    hashC[0] = 0x0f
    hashC[1] = 0xff
    hashC[2] = 0x01
    await lookupStore.appendVerifiedSlabAsync(
      0,
      encodeSlabRow(hashC, binary),
      spine.snapBuckets,
      segJournal,
    )
    await lookupStore.drainPendingFlushes()
    assert.isDefined(lookupStore.lookupBinaryAccountByHash(hashC))
  })

  it('lookupCodeByHash reads bytecode from on-disk code shards', async () => {
    const dir = tempDir()
    const store = openStore(dir)
    const root = new Uint8Array(32)
    root[31] = 0xcc
    store.activatePivot({ blockNumber: 1n, blockHash: new Uint8Array(32), stateRoot: root })
    const codeHash = new Uint8Array(32)
    codeHash[0] = 0x0a
    codeHash[31] = 0x01
    const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
    store.appendCode(codeHash, code)
    await store.drainPendingFlushes()
    const lookup = openStore(dir)
    assert.deepEqual(lookup.lookupCodeByHash(codeHash), code)
  })

  it('sampleAccountsFromDisk fills rows when RAM sample is sparse', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0xdd
    const store = openStore(dir)
    store.activatePivot({ blockNumber: 2n, blockHash: new Uint8Array(32), stateRoot: root })
    const hash = new Uint8Array(32)
    hash[0] = 0x05
    const binary = accountToBinaryAccount(
      createAccount({ nonce: 2n, balance: 3_000_000_000_000_000_000n }),
    )
    const buckets = createSnapBuckets()
    buckets[5]!.accountsLoaded = 1
    store.appendVerifiedRange(5, [{ accountHash: hash, binaryAccount: binary }], buckets)
    await store.drainPendingFlushes()
    const lookup = openStore(dir)
    const rows = lookup.sampleAccountsFromDisk({ limit: 5, sortByBalanceDesc: true })
    assert.isAtLeast(rows.length, 1)
    assert.equal(bytesToHex(rows[0]!.accountHash), bytesToHex(hash))

    // Also verify prefix browse starts at the beginning of the sorted bucket journal, not the tail
    const hashEarly = new Uint8Array(32)
    hashEarly[0] = 0x50
    hashEarly[1] = 0x10
    const hashLate = new Uint8Array(32)
    hashLate[0] = 0x5f
    hashLate[1] = 0xff
    const dir2 = tempDir()
    const store2 = openStore(dir2)
    store2.activatePivot({ blockNumber: 3n, blockHash: new Uint8Array(32), stateRoot: root })
    store2.appendVerifiedRange(
      5,
      [
        { accountHash: hashEarly, binaryAccount: binary },
        { accountHash: hashLate, binaryAccount: binary },
      ],
      createSnapBuckets(),
    )
    await store2.drainPendingFlushes()
    const lookup2 = openStore(dir2)
    const prefixRows = lookup2.sampleAccountsFromDisk({
      prefixHex: '0x5010',
      limit: 1,
      sortByBalanceDesc: false,
    })
    assert.equal(prefixRows.length, 1)
    assert.equal(bytesToHex(prefixRows[0]!.accountHash), bytesToHex(hashEarly))
  })

  it('lookupStorageByHash reads ETY1-framed storage shards', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[0] = 0x01
    const store = openStore(dir)
    store.activatePivot({
      blockNumber: 1n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x0a
    const slotHash = new Uint8Array(32)
    slotHash[31] = 0x01
    const value = new Uint8Array([0xab, 0xcd])
    await store.appendStorageSlots(accountHash, [{ slotHash, value }])
    await store.flushStorageWrites()
    const got = openStore(dir).lookupStorageByHash(accountHash, slotHash)
    assert.isDefined(got)
    assert.deepEqual(got, value)
    const miss = openStore(dir).lookupStorageByHash(accountHash, new Uint8Array(32))
    assert.isUndefined(miss)
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
