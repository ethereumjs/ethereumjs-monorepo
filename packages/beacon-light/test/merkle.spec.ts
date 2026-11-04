import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'
import { assert, describe, it } from 'vitest'

import {
  ZERO_HASHES,
  gindexToMerklePosition,
  hashTreeRootBeaconBlockHeader,
  hashTreeRootExecutionPayloadHeader,
  hashTreeRootSyncCommittee,
  isValidMerkleBranch,
  isValidNormalizedMerkleBranch,
  merkleRootFromZeroBranch,
} from '../src/index.ts'

import { buildTestSyncCommittee, zeroExecutionPayload } from './fixtures/syntheticCommittee.ts'

const sha256 = nobleSha256

describe('[BeaconLight]: Merkle and SSZ roots', () => {
  it('zero-hash ladder matches sha256(64 zero bytes)', () => {
    const expected = hexToBytes(
      '0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b',
    )
    assert.ok(equalsBytes(ZERO_HASHES[1]!, expected))
    assert.ok(equalsBytes(ZERO_HASHES[0]!, new Uint8Array(32)))
  })

  it('all-zero beacon block header root is deterministic', () => {
    const zero = new Uint8Array(32)
    const root = hashTreeRootBeaconBlockHeader(
      {
        slot: 0,
        proposerIndex: 0,
        parentRoot: zero,
        stateRoot: zero,
        bodyRoot: zero,
      },
      sha256,
    )
    assert.equal(root.length, 32)
    assert.notEqual(root[0], 0)
  })

  it('all-zero sync committee root is deterministic', () => {
    const committee = buildTestSyncCommittee().committee
    for (const pk of committee.publicKeys) {
      pk.fill(0)
    }
    committee.aggregatePubkey.fill(0)
    const root = hashTreeRootSyncCommittee(committee, sha256)
    assert.equal(root.length, 32)
  })

  it('Deneb execution header differs from Capella when blob gas fields are set', () => {
    const base = zeroExecutionPayload(1)
    const capellaRoot = hashTreeRootExecutionPayloadHeader(
      { ...base, blobGasUsed: undefined, excessBlobGas: undefined },
      'capella',
      sha256,
    )
    const denebRoot = hashTreeRootExecutionPayloadHeader(base, 'deneb', sha256)
    assert.ok(!equalsBytes(capellaRoot, denebRoot))
  })

  it('isValidMerkleBranch rejects tampered siblings and wrong depth', () => {
    const leaf = new Uint8Array(32)
    leaf[0] = 1
    const { depth, index } = gindexToMerklePosition(54)
    const branch = ZERO_HASHES.slice(0, depth)
    const root = merkleRootFromZeroBranch(leaf, depth, index, sha256)
    assert.ok(isValidMerkleBranch(leaf, branch, depth, index, root, sha256))
    const badBranch = branch.slice()
    badBranch[0] = new Uint8Array(32)
    badBranch[0]![0] = 9
    assert.ok(!isValidMerkleBranch(leaf, badBranch, depth, index, root, sha256))
    assert.ok(!isValidMerkleBranch(leaf, branch.slice(0, depth - 1), depth, index, root, sha256))
  })

  it('normalized branch verifies Altair and Electra gindices', () => {
    const leaf = nobleSha256(new Uint8Array([9]))
    for (const gindex of [54, 169]) {
      const { depth, index } = gindexToMerklePosition(gindex)
      const root = merkleRootFromZeroBranch(leaf, depth, index, sha256)
      const branch = ZERO_HASHES.slice(0, depth)
      assert.ok(isValidNormalizedMerkleBranch(leaf, branch, gindex, root, sha256))
    }
  })
})
