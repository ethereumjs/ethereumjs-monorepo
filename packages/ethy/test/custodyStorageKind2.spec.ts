import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, intToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import {
  parseProvenStorageKind2Entries,
  storageSlotsFromKindSlab,
} from '../src/custody/custodyStorageCodec.ts'
import { verifyProvenStorageKind2Slab } from '../src/sync/snapVerifyJob.ts'

describe('custody storage kind-2', () => {
  it('verifyProvenStorageKind2Slab accepts trie-backed slab', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashingFunction: ethyKeccak256 })
    const slotHash = keccak_256(new Uint8Array([9]))
    const slotValBe = new Uint8Array(32)
    slotValBe[31] = 0x03
    await trie.put(slotHash, RLP.encode(bytesToBigInt(slotValBe)))
    const storageRoot = trie.root()
    const slab = new Uint8Array(64)
    slab.set(slotHash, 0)
    slab.set(slotValBe, 32)
    const verified = await verifyProvenStorageKind2Slab(storageRoot, slab)
    assert.equal(verified.ok, true)
    const slots = storageSlotsFromKindSlab(slab)
    assert.equal(slots.length, 1)
    assert.deepEqual(slots[0]!.value[31], 0x03)
  })

  it('parseProvenStorageKind2Entries decodes RLP rows', () => {
    const acct = new Uint8Array(32).fill(0x77)
    const root = new Uint8Array(32).fill(0x88)
    const slab = new Uint8Array(64)
    const wrapped = RLP.decode(
      RLP.encode([new Uint8Array(0), intToUnpaddedBytes(2), [[acct, root, slab]]] as never),
    ) as unknown[]
    const rows = parseProvenStorageKind2Entries(wrapped)
    assert.equal(rows.length, 1)
    assert.equal(rows[0]!.slotsSlab64B.length, 64)
  })
})
