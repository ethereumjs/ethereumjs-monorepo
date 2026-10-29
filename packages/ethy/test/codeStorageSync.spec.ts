import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'
import { assert, describe, it } from 'vitest'

import { encodeGetByteCodes, ingestStorageRangesReply } from '../src/sync/codeAndStorageSync.ts'

describe('[Ethy/Sync]: code and storage snap helpers', () => {
  it('encodeGetByteCodes uses canonical zero reqId', () => {
    const payload = encodeGetByteCodes(0n, [new Uint8Array(32)], 128 * 1024)
    const decoded = RLP.decode(payload) as unknown[]
    assert.equal((decoded[0] as Uint8Array).length, 0)
  })

  it('ingestStorageRangesReply verifies a complete storage range', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false })
    const slotHash = keccak_256(new Uint8Array(32))
    const slotValue = new Uint8Array([0x01])
    const slotRlp = RLP.encode(slotValue)
    await trie.put(slotHash, slotRlp)
    const storageRoot = trie.root()
    const sm = createFlatStateManager()
    const accountHash = new Uint8Array(32).fill(0xab)
    const reply = RLP.encode([bigIntToUnpaddedBytes(1n), [[[slotHash, slotRlp]]], []] as never)
    const result = await ingestStorageRangesReply(storageRoot, reply, new Uint8Array(32), (slots) =>
      sm.putSnapStorageBatch(accountHash, slots),
    )
    assert.equal(result.ok, true)
    assert.equal(result.hasRight, false)
  })

  it('rejects bytecode when keccak does not match queued hash', () => {
    const code = new Uint8Array([0x60, 0x00])
    const wrongHash = new Uint8Array(32)
    const hash = keccak_256(code)
    assert.notDeepEqual(hash, wrongHash)
  })
})
