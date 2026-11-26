import fs from 'node:fs'

import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  bytesToHex,
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

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

describe('staty crypto core (WP-16b)', () => {
  it('verifyStatyMultiProof verifies mixed account + storage inclusion and exclusion proofs', async () => {
    const storageTrie = new MerklePatriciaTrie({ useKeyHashing: false })
    const slotKey1 = setLengthLeft(hexToBytes('0x01'), 32)
    const slotKey2 = setLengthLeft(hexToBytes('0x02'), 32)
    const slotHash1 = keccak_256(slotKey1)
    const slotHash2 = keccak_256(slotKey2)
    const slotVal1 = hexToBytes('0x06')
    await storageTrie.put(slotHash1, RLP.encode(slotVal1))
    const storageRoot = storageTrie.root()
    const storageProof1 = await createMerkleProof(storageTrie, slotHash1)
    const storageProof2 = await createMerkleProof(storageTrie, slotHash2)

    const stateTrie = new MerklePatriciaTrie({ useKeyHashing: false })
    const address1 = new Address(hexToBytes(`0x${'11'.repeat(20)}`))
    const address2 = new Address(hexToBytes(`0x${'22'.repeat(20)}`))
    const accountHash1 = keccak_256(address1.bytes)
    const accountHash2 = keccak_256(address2.bytes)
    const acc1 = createAccount({ nonce: 5n, balance: 100n, storageRoot })
    const acc1Rlp = acc1.serialize()
    await stateTrie.put(accountHash1, acc1Rlp)
    const root = stateTrie.root()
    const acctProof1 = await createMerkleProof(stateTrie, accountHash1)
    const acctProof2 = await createMerkleProof(stateTrie, accountHash2)

    const proofNodes = [...acctProof1, ...acctProof2, ...storageProof1, ...storageProof2]
    const accounts = [
      { accountHash: accountHash1, accountRlpOrEmpty: acc1Rlp },
      { accountHash: accountHash2, accountRlpOrEmpty: new Uint8Array(0) },
    ].sort((a, b) => compareBytes32(a.accountHash, b.accountHash))
    const slots = [
      { accountHash: accountHash1, slotHash: slotHash1, slotValOrEmpty: slotVal1 },
      { accountHash: accountHash1, slotHash: slotHash2, slotValOrEmpty: new Uint8Array(0) },
    ].sort((a, b) => compareBytes32(a.slotHash, b.slotHash))

    const ok = await verifyStatyMultiProof(
      { anchorStateRoot: root, accounts, slots, proofNodes },
      keccak_256,
    )
    assert.isTrue(ok.ok)

    // Forged slot value fails with invalid_storage_proof
    const forged = await verifyStatyMultiProof(
      {
        anchorStateRoot: root,
        accounts,
        slots: [
          { accountHash: accountHash1, slotHash: slotHash1, slotValOrEmpty: hexToBytes('0x07') },
        ],
        proofNodes,
      },
      keccak_256,
    )
    assert.isFalse(forged.ok)
    if (!forged.ok) assert.strictEqual(forged.code, 'invalid_storage_proof')
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

  it('folds per-field BAL balanceChanges while preserving anchor nonce and codeHash, and proves untouched slot across 50 mutating BAL blocks', () => {
    const idx = new StatyWriteIndex(keccak_256)
    const address = hexToBytes(`0x${'11'.repeat(20)}`)
    const addrHex = bytesToHex(address)
    const accountHashHex = bytesToUnprefixedHex(keccak_256(address))
    const untouchedSlot = setLengthLeft(hexToBytes('0x01'), 32)
    const untouchedSlotHash = bytesToUnprefixedHex(keccak_256(untouchedSlot))
    const mutatedSlot = setLengthLeft(hexToBytes('0x02'), 32)
    const mutatedSlotHash = bytesToUnprefixedHex(keccak_256(mutatedSlot))

    const balByBlock = new Map<number, import('@ethereumjs/util').BALInput>()
    for (let b = 101; b <= 150; b++) {
      const otherSlot = setLengthLeft(hexToBytes(`0x${(b + 10).toString(16)}`), 32)
      const bal: import('@ethereumjs/util').BALInput = [
        {
          address: addrHex,
          balanceChanges: b === 105 ? [{ blockAccessIndex: '0x1', postBalance: '0xfa' }] : [],
          nonceChanges: [],
          codeChanges: [],
          storageReads: [],
          storageChanges: [
            {
              slot: bytesToHex(otherSlot),
              slotChanges: [{ blockAccessIndex: '0x1', postValue: '0x01' }],
            },
            ...(b === 120
              ? [
                  {
                    slot: bytesToHex(mutatedSlot),
                    slotChanges: [{ blockAccessIndex: '0x1' as const, postValue: '0x99' as const }],
                  },
                ]
              : []),
          ],
        },
      ]
      balByBlock.set(b, bal)
      idx.ingestVerifiedBal(b, bal)
    }

    // Checkpoint round-trips both accounts and slots
    const restored = new StatyWriteIndex(keccak_256)
    assert.isTrue(restored.loadCheckpoint(idx.encodeCheckpoint()))
    assert.strictEqual(restored.lastSlotWriteBlock(accountHashHex, mutatedSlotHash), 120)
    assert.isUndefined(restored.lastSlotWriteBlock(accountHashHex, untouchedSlotHash))

    const root = new Uint8Array(32).fill(0xab)
    const codeHash = new Uint8Array(32).fill(0xcd)
    const anchorAcc = createAccount({ nonce: 5n, balance: 100n, codeHash })

    const fold = foldWitnessToHead(
      {
        anchorBlock: 100,
        anchorStateRoot: root,
        accountHashHex,
        accountRlpOrEmpty: anchorAcc.serialize(),
        slotWitnesses: [
          { slotHashHex: untouchedSlotHash, slotValOrEmpty: hexToBytes('0x06') },
          { slotHashHex: mutatedSlotHash, slotValOrEmpty: hexToBytes('0x01') },
        ],
      },
      {
        localBalEarliestBlock: 50,
        latestVerifiedBlock: 150,
        stateRootAt: (b) => (b === 100 ? root : undefined),
        readVerifiedBal: (b) => balByBlock.get(b),
        writeIndex: restored,
        keccak256: keccak_256,
      },
    )
    assert.isTrue(fold.ok)
    if (fold.ok) {
      assert.strictEqual(fold.account?.nonce, 5n)
      assert.strictEqual(fold.account?.balance, 250n)
      assert.deepEqual(fold.account?.codeHash, codeHash)
      assert.strictEqual(fold.slots[0]?.action.kind, 'commit')
      assert.strictEqual(fold.slots[1]?.action.kind, 'keep-live')
    }

    // Stale anchorBlock < localBalEarliestBlock is strictly rejected
    const stale = foldWitnessToHead(
      {
        anchorBlock: 49,
        anchorStateRoot: root,
        accountHashHex,
        accountRlpOrEmpty: anchorAcc.serialize(),
      },
      {
        localBalEarliestBlock: 50,
        latestVerifiedBlock: 150,
        stateRootAt: () => root,
        readVerifiedBal: () => undefined,
        writeIndex: restored,
      },
    )
    assert.isFalse(stale.ok)
  })

  it('EthyStatyStore manifest round-trips multi-byte shard stats on disk', () => {
    const dir = `${process.cwd()}/.ci-staty-store-${Date.now()}`
    const store = new EthyStatyStore(dir)
    store.writeManifest({
      epochNumber: 42n,
      anchorBlock: 10752n,
      anchorStateRoot: new Uint8Array(32).fill(7),
      dedupBaseEpoch: 32n,
      shards: [
        { shardIndex: 0, partCount: 300, accountCount: 1500, slotCount: 4096, totalBytes: 123456 },
      ],
    })
    const read = store.readManifest(42n)
    assert.isDefined(read)
    assert.strictEqual(read?.epochNumber, 42n)
    assert.strictEqual(read?.anchorBlock, 10752n)
    assert.strictEqual(read?.shards[0]?.totalBytes, 123456)
    assert.strictEqual(read?.shards[0]?.accountCount, 1500)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
