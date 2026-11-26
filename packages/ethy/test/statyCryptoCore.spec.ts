import fs from 'node:fs'

import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
import {
  Account,
  Address,
  bytesToUnprefixedHex,
  createAccount,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { MAX_STATY_PROOF_NODES } from '../src/staty/constants.ts'
import { verifyStatyMultiProof } from '../src/staty/multiProofVerify.ts'
import { EthyStatyStore } from '../src/staty/statyStore.ts'
import { foldWitnessToHead } from '../src/staty/witnessFold.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'

describe('staty crypto core (WP-16b)', () => {
  it('verifyStatyMultiProof accepts inclusion account proof', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false })
    const address = new Address(hexToBytes(`0x${'11'.repeat(20)}`))
    const accountHash = keccak_256(address.bytes)
    const acc = createAccount({ nonce: 5n, balance: 100n })
    const rlp = acc.serialize()
    await trie.put(accountHash, rlp)
    const root = trie.root()
    const proof = await createMerkleProof(trie, accountHash)
    const res = await verifyStatyMultiProof(
      {
        anchorStateRoot: root,
        accounts: [{ accountHash, accountRlpOrEmpty: rlp }],
        slots: [],
        proofNodes: proof,
      },
      keccak_256,
    )
    assert.isTrue(res.ok)
  })

  it('rejects unsorted account keys', async () => {
    const h1 = new Uint8Array(32).fill(2)
    const h2 = new Uint8Array(32).fill(1)
    const res = await verifyStatyMultiProof(
      {
        anchorStateRoot: new Uint8Array(32),
        accounts: [
          { accountHash: h1, accountRlpOrEmpty: new Uint8Array() },
          { accountHash: h2, accountRlpOrEmpty: new Uint8Array() },
        ],
        slots: [],
        proofNodes: [],
      },
      keccak_256,
    )
    assert.isFalse(res.ok)
    if (!res.ok) assert.strictEqual(res.code, 'unsorted_keys')
  })

  it('rejects proof_cap_exceeded', async () => {
    const nodes = Array.from({ length: MAX_STATY_PROOF_NODES + 1 }, () => new Uint8Array([0x80]))
    const res = await verifyStatyMultiProof(
      {
        anchorStateRoot: new Uint8Array(32),
        accounts: [],
        slots: [],
        proofNodes: nodes,
      },
      keccak_256,
    )
    assert.isFalse(res.ok)
    if (!res.ok) assert.strictEqual(res.code, 'proof_cap_exceeded')
  })

  it('foldWitnessToHead keeps-live when slot written after anchor', () => {
    const idx = new StatyWriteIndex((a) => bytesToUnprefixedHex(keccak_256(a)))
    const address = hexToBytes(`0x${'11'.repeat(20)}`)
    const accountHashHex = bytesToUnprefixedHex(keccak_256(address))
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const slotHex = bytesToUnprefixedHex(keccak_256(slot))
    idx.noteSlotWrite(accountHashHex, slotHex, 200)
    const root = new Uint8Array(32).fill(0xab)
    const fold = foldWitnessToHead(
      {
        anchorBlock: 100,
        anchorStateRoot: root,
        accountHashHex,
        accountRlpOrEmpty: new Account().serialize(),
        slotWitnesses: [
          { slotHashHex: slotHex, slotValOrEmpty: setLengthLeft(hexToBytes('0x99'), 32) },
        ],
      },
      {
        localBalEarliestBlock: 50,
        latestVerifiedBlock: 250,
        stateRootAt: (b) => (b === 100 ? root : undefined),
        readVerifiedBal: () => undefined,
        writeIndex: idx,
        accountExistsAtHead: () => true,
      },
    )
    assert.isTrue(fold.ok)
    if (fold.ok) {
      const slot = fold.slots[0]
      assert.strictEqual(slot?.action.kind, 'keep-live')
    }
  })

  it('EthyStatyStore manifest round-trips on disk', () => {
    const dir = `${process.cwd()}/.ci-staty-store-${Date.now()}`
    const store = new EthyStatyStore(dir)
    store.writeManifest({
      epochNumber: 42n,
      anchorBlock: 10752n,
      anchorStateRoot: new Uint8Array(32).fill(7),
      dedupBaseEpoch: 32n,
      shards: [{ shardIndex: 0, partCount: 1, accountCount: 2, slotCount: 0, totalBytes: 100 }],
    })
    const read = store.readManifest(42n)
    assert.isDefined(read)
    assert.strictEqual(read?.epochNumber, 42n)
    assert.strictEqual(read?.anchorBlock, 10752n)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
