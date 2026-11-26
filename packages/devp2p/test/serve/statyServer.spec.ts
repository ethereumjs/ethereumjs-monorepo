import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, equalsBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { StatyMessageCodes } from '../../src/protocol/staty/codes.ts'
import { SharedCodeDisk } from '../../src/serve/sharedCodeDisk.ts'
import { tryServeStatyGet } from '../../src/serve/statyServer.ts'
import { StatyStore } from '../../src/serve/statyStore.ts'

describe('[Devp2p/STATY]: serving', () => {
  const localId = new Uint8Array(64).fill(0x11)

  it('manifest hit and empty miss', () => {
    const store = new StatyStore()
    const root = new Uint8Array(32).fill(0x22)
    store.putManifest({
      epochNumber: 2n,
      anchorBlock: 100n,
      anchorStateRoot: root,
      dedupBaseEpoch: 1n,
      shards: [{ shardIndex: 0, partCount: 1, accountCount: 1, slotCount: 0, totalBytes: 64 }],
    })
    const hitReq = RLP.decode(RLP.encode([bigIntToUnpaddedBytes(1n), bigIntToUnpaddedBytes(2n)]))
    const hit = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_EPOCH_MANIFEST',
      hitReq,
    )
    assert.equal(hit?.code, StatyMessageCodes.EPOCH_MANIFEST)
    assert.isTrue(equalsBytes(hit?.rlp[1] as Uint8Array, bigIntToUnpaddedBytes(2n)))

    const missReq = RLP.decode(RLP.encode([bigIntToUnpaddedBytes(2n), bigIntToUnpaddedBytes(9n)]))
    const miss = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_EPOCH_MANIFEST',
      missReq,
    )
    assert.isTrue(equalsBytes(miss?.rlp[2] as Uint8Array, bigIntToUnpaddedBytes(0n)))
  })

  it('part hit and empty miss', () => {
    const store = new StatyStore()
    const accountHash = new Uint8Array(32).fill(0x33)
    store.putEpochPart({
      epochNumber: 1n,
      shardIndex: 0,
      partIndex: 0,
      anchorBlock: 50n,
      anchorStateRoot: new Uint8Array(32).fill(0x44),
      accounts: [{ accountHash, accountRlpOrEmpty: new Uint8Array(0) }],
      slots: [],
      proofNodes: [],
    })
    const req = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(1n),
        bigIntToUnpaddedBytes(1n),
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(0),
      ]),
    )
    const hit = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_EPOCH_PART',
      req,
    )
    assert.equal(hit?.metric, 'part')

    const missReq = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(2n),
        bigIntToUnpaddedBytes(1n),
        intToUnpaddedBytes(0),
        intToUnpaddedBytes(9),
      ]),
    )
    const miss = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_EPOCH_PART',
      missReq,
    )
    assert.isTrue(equalsBytes(miss?.rlp[4] as Uint8Array, bigIntToUnpaddedBytes(0n)))
  })

  it('witnesses drop low anchor and omit unknown', () => {
    const store = new StatyStore()
    const accountHash = new Uint8Array(32).fill(0x55)
    store.putWitness({
      accountHash,
      anchorBlock: 20n,
      anchorStateRoot: new Uint8Array(32).fill(0x66),
      accountRlpOrEmpty: new Uint8Array(0),
      slots: [],
      proofNodes: [],
    })
    const unknown = new Uint8Array(32).fill(0x77)
    const hitReq = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(1n),
        bigIntToUnpaddedBytes(10n),
        intToUnpaddedBytes(524288),
        [[accountHash, []]],
      ]),
    )
    const hit = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_WITNESSES',
      hitReq,
    )
    assert.equal(hit?.metric, 'witness')
    assert.equal((hit?.rlp[1] as unknown[]).length, 1)

    const missReq = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(2n),
        bigIntToUnpaddedBytes(30n),
        intToUnpaddedBytes(524288),
        [[accountHash, []]],
      ]),
    )
    const miss = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_WITNESSES',
      missReq,
    )
    assert.equal((miss?.rlp[1] as unknown[]).length, 0)
  })

  it('witnesses merge and deduplicate proofNodes for multiple accounts sharing an anchor group', () => {
    const store = new StatyStore()
    const root = new Uint8Array(32).fill(0x66)
    const acctA = new Uint8Array(32).fill(0x11)
    const acctB = new Uint8Array(32).fill(0x22)
    const sharedNode = new Uint8Array([0xaa, 0xbb])
    const nodeA = new Uint8Array([0x01, 0x02])
    const nodeB = new Uint8Array([0x03, 0x04])
    store.putWitness({
      accountHash: acctA,
      anchorBlock: 100n,
      anchorStateRoot: root,
      accountRlpOrEmpty: new Uint8Array(0),
      slots: [],
      proofNodes: [sharedNode, nodeA],
    })
    store.putWitness({
      accountHash: acctB,
      anchorBlock: 100n,
      anchorStateRoot: root,
      accountRlpOrEmpty: new Uint8Array(0),
      slots: [],
      proofNodes: [sharedNode, nodeB],
    })
    const req = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(3n),
        bigIntToUnpaddedBytes(50n),
        intToUnpaddedBytes(524288),
        [
          [acctA, []],
          [acctB, []],
        ],
      ]),
    )
    const res = tryServeStatyGet(
      store,
      new SharedCodeDisk(),
      [],
      localId,
      undefined,
      'GET_WITNESSES',
      req,
    )
    assert.equal(res?.metric, 'witness')
    const groups = res?.rlp[1] as unknown[][]
    assert.equal(groups.length, 1)
    const accounts = groups[0]![2] as unknown[]
    const proofs = groups[0]![4] as Uint8Array[]
    assert.equal(accounts.length, 2)
    assert.equal(proofs.length, 3)
    assert.isBelow(res!.bytesEstimate, 1024)
  })

  it('bytecodes omit misses and respect budget', () => {
    const disk = new SharedCodeDisk()
    const h1 = new Uint8Array(32).fill(0x88)
    const h2 = new Uint8Array(32).fill(0x99)
    disk.put(h1, new Uint8Array([0x60, 0x00]))
    const req = RLP.decode(
      RLP.encode([bigIntToUnpaddedBytes(1n), [h1, h2], intToUnpaddedBytes(128)]),
    )
    const served = tryServeStatyGet(
      new StatyStore(),
      disk,
      [],
      localId,
      undefined,
      'GET_BYTECODES',
      req,
    )
    const rows = served?.rlp[1] as unknown[]
    assert.equal(rows.length, 1)
    assert.isTrue(equalsBytes(rows[0] as Uint8Array, new Uint8Array([0x60, 0x00])))
  })
})
