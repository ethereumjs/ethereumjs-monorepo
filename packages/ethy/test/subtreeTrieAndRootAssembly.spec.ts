import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import {
  KECCAK256_RLP,
  MapDB,
  compareBytes,
  createAccount,
  equalsBytes,
  intToUnpaddedBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BinaryPathMPT, MerklePatriciaTrie, verifyMerkleRangeProof } from '@ethereumjs/mpt'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { BucketSubtreeTrie } from '../src/custody/bucketSubtreeTrie.ts'
import {
  type BucketRootCandidates,
  assembleRootBranch,
  noteSubtreeRootCandidate,
  verifyRootBranch,
} from '../src/custody/rootBranchAssembler.ts'
import { SubtreeCustodyRegistry } from '../src/custody/subtreeCustodyRegistry.ts'
import { buildLiveWitnessGroup } from '../src/custody/subtreeProofServer.ts'
import { verifyStatyMultiProof } from '../src/staty/multiProofVerify.ts'

function classicTrie() {
  return new MerklePatriciaTrie({ useKeyHashing: false, db: new MapDB() })
}

function keyWithLeadingNibble(n: number): Uint8Array {
  const k = randomBytes(32)
  k[0] = (n << 4) | (k[0]! & 0x0f)
  return k
}

function encode16WayBranch(slots: Uint8Array[]): Uint8Array {
  return RLP.encode([...slots, new Uint8Array(0)] as never)
}

async function assert16WayFromBuckets(
  classic: MerklePatriciaTrie,
  subtrees: BucketSubtreeTrie[],
): Promise<void> {
  const slots = SubtreeCustodyRegistry.slotsFromClassicSubtrees(subtrees)
  const got = ethyKeccak256(encode16WayBranch(slots))
  assert(equalsBytes(got, classic.root()), '16-way assembly root mismatch')
}

describe('WP-16f subtree trie and root assembly', () => {
  it('16 bucket tries match classic root across 50 mutation rounds', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))
    const keys: Uint8Array[] = []

    for (let i = 0; i < 512; i++) {
      const n = i % 16
      const key = keyWithLeadingNibble(n)
      const val = randomBytes(20)
      keys.push(key)
      await classic.put(key, val)
      await subtrees[n]!.accountTrie().put(key, val)
    }
    await assert16WayFromBuckets(classic, subtrees)

    for (let round = 0; round < 50; round++) {
      const key = keys[randomBytes(2)[0]! % keys.length]!
      const n = key[0]! >> 4
      const op = randomBytes(1)[0]! % 2
      if (op === 0) {
        const nv = randomBytes(24)
        await classic.put(key, nv)
        await subtrees[n]!.accountTrie().put(key, nv)
      } else {
        await classic.del(key)
        await subtrees[n]!.accountTrie().del(key)
      }
      await assert16WayFromBuckets(classic, subtrees)
    }
  })

  it('RootBranchAssembler detects Byzantine bucket gossip', () => {
    const slots: Uint8Array[] = []
    for (let i = 0; i < 16; i++) {
      slots.push(randomBytes(32))
    }
    const stateRoot = ethyKeccak256(encode16WayBranch(slots))
    const book: BucketRootCandidates = new Map()
    for (let b = 0; b < 16; b++) {
      noteSubtreeRootCandidate(book, b, `honest-${b}`, slots[b]!)
    }
    noteSubtreeRootCandidate(book, 3, 'byzantine-a', randomBytes(32))
    noteSubtreeRootCandidate(book, 7, 'byzantine-b', randomBytes(32))
    const asm = assembleRootBranch(book, stateRoot, ethyKeccak256)
    assert.strictEqual(asm.ok, true)
    if (!asm.ok) return
    assert.isTrue(asm.byzantinePeerIds.includes('byzantine-a'))
    assert.isTrue(asm.byzantinePeerIds.includes('byzantine-b'))
    assert.isTrue(verifyRootBranch(asm.slots, stateRoot, ethyKeccak256))
  })

  it('buildLiveWitnessGroup verifies with verifyStatyMultiProof', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))
    const bucket = 4
    const acct = keyWithLeadingNibble(bucket)
    const accountRlp = createAccount({
      nonce: 3n,
      balance: 99n,
      storageRoot: KECCAK256_RLP,
    }).serialize()
    for (let n = 0; n < 16; n++) {
      for (let i = 0; i < 128; i++) {
        const k =
          n === bucket && i === 0
            ? acct
            : (() => {
                const key = keyWithLeadingNibble(n)
                key[1] = i & 0xff
                return key
              })()
        const v =
          n === bucket && i === 0
            ? accountRlp
            : createAccount({
                nonce: BigInt(i),
                balance: 1n,
                storageRoot: KECCAK256_RLP,
              }).serialize()
        await classic.put(k, v)
        await subtrees[n]!.accountTrie().put(k, v)
      }
    }
    const slots = SubtreeCustodyRegistry.slotsFromClassicSubtrees(subtrees)
    const stateRoot = classic.root()
    const rootRlp = encode16WayBranch(slots)
    assert.isTrue(equalsBytes(ethyKeccak256(rootRlp), stateRoot))

    const trie = subtrees[bucket]!
    trie.captureAnchor(100n)
    const group = await buildLiveWitnessGroup({
      anchorBlock: 100n,
      anchorStateRoot: stateRoot,
      rootNodeRlp: rootRlp,
      trie,
      armed: true,
      anchorId: 100n,
      queries: [{ accountHash: acct, slotHashes: [] }],
    })
    assert.isDefined(group)
    const vrf = await verifyStatyMultiProof(group!, ethyKeccak256)
    if (!vrf.ok) assert.fail(`verifyStatyMultiProof: ${vrf.code} ${vrf.detail ?? ''}`)
  })

  it('reopens disk-backed bucket trie after BAL apply', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ethy-trie-'))
    const bucket = 0xa
    const trie = BucketSubtreeTrie.create({ bucket, dataDir: tmp })
    const key = keyWithLeadingNibble(bucket)
    const val = randomBytes(32)
    await trie.accountTrie().put(key, val)
    const before = trie.branchSlotReference()

    const reopened = await BucketSubtreeTrie.reopen({ bucket, dataDir: tmp })
    const after = reopened.branchSlotReference()
    assert.isTrue(equalsBytes(before, after))
    assert.isDefined(await reopened.accountTrie().get(key))
    await fs.rm(tmp, { recursive: true, force: true })
  })

  it('anchor proofs survive live overwrite', async () => {
    const trie = BucketSubtreeTrie.create({ bucket: 0x2 })
    const keys: Uint8Array[] = []
    for (let i = 0; i < 200; i++) {
      const key = keyWithLeadingNibble(2)
      key[1] = i & 0xff
      key[2] = (i >> 8) & 0xff
      keys.push(key)
      await trie.accountTrie().put(key, randomBytes(16))
    }
    const key = keys[42]!
    const v1 = (await trie.accountTrie().get(key))!
    trie.captureAnchor('anc')
    await trie.accountTrie().put(key, randomBytes(24))
    assert.isFalse(equalsBytes((await trie.accountTrie().get(key))!, v1))
    let anchored: Uint8Array | undefined
    for await (const row of trie.accountTrie().walkLeaves('anc')) {
      if (equalsBytes(row.key, key)) anchored = row.value
    }
    assert.isDefined(anchored)
    assert.isTrue(equalsBytes(anchored!, v1))
  })

  it('walkLeaves drives range boundary export', async () => {
    const trie = new BinaryPathMPT({ keccak256: ethyKeccak256 })
    const rows: { key: Uint8Array; value: Uint8Array }[] = []
    for (let i = 0; i < 200; i++) {
      const key = setLengthLeft(intToUnpaddedBytes(i * 17 + 3), 32)
      const val = randomBytes(10)
      rows.push({ key, value: val })
      await trie.put(key, val)
    }
    rows.sort((a, b) => compareBytes(a.key, b.key))
    const origin = rows[10]!.key
    const last = rows[80]!.key
    const walk: Uint8Array[] = []
    for await (const row of trie.walkLeaves()) {
      walk.push(row.key)
    }
    assert.strictEqual(walk.length, rows.length)
    const proof = await trie.createRangeBoundaryProof(origin, last)
    const slice = rows.slice(10, 81)
    assert.isTrue(
      await verifyMerkleRangeProof(
        trie.root(),
        origin,
        last,
        slice.map((r) => r.key),
        slice.map((r) => r.value),
        proof,
        ethyKeccak256,
      ),
    )
  })

  it('SubtreeCustodyRegistry self-audit flips trie bitmask on full assembly', async () => {
    const classic = classicTrie()
    const reg = new SubtreeCustodyRegistry(
      'local',
      Array.from({ length: 16 }, (_, n) => n),
    )
    for (let n = 0; n < 16; n++) {
      const bucketTrie = reg.trie(n)!
      for (let i = 0; i < 128; i++) {
        const key = keyWithLeadingNibble(n)
        key[1] = i & 0xff
        const val = randomBytes(18)
        await classic.put(key, val)
        await bucketTrie.accountTrie().put(key, val)
      }
      const slot = bucketTrie.branchSlotReference()
      assert.strictEqual(slot.length, 32)
      reg.notePeerSubtreeRoot(32n, n, 'local', slot)
    }
    const anchor = await reg.verifyAnchor(32n, classic.root())
    assert.isDefined(anchor)
    assert.strictEqual(reg.trieBucketsBitmask(), 0xffff)
  })
})
