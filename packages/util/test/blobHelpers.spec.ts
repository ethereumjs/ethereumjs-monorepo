import { assert, describe, it } from 'vitest'

import { commitmentsToVersionedHashes, computeVersionedHash, getBlobs } from '../src/index.js'

describe('blob helper tests', () => {
  it('getBlobs should return an array of Uint8Array blobs', () => {
    const input = 'test input'
    const blobs = getBlobs(input)
    assert(Array.isArray(blobs))

    for (const blob of blobs) assert(blob instanceof Uint8Array)
  })

  it('getBlobs should throw an error for invalid blob data', () => {
    const input = ''
    assert.throws(() => getBlobs(input), Error, 'invalid blob data')
  })

  it('getBlobs should throw an error for too large blob data', () => {
    const input = 'a'.repeat(262144) // exceeds MAX_USEFUL_BYTES_PER_TX
    assert.throws(() => getBlobs(input), Error, 'blob data is too large')
  })

  it('computeVersionedHash should return a versioned hash', () => {
    const commitment = new Uint8Array([1, 2, 3])
    const blobCommitmentVersion = 0x01
    const versionedHash = computeVersionedHash(commitment, blobCommitmentVersion)
    assert(versionedHash instanceof Uint8Array)
    assert.lengthOf(versionedHash, 32)
  })

  it('commitmentsToVersionedHashes should return an array of versioned hashes', () => {
    const commitments = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])]
    const versionedHashes = commitmentsToVersionedHashes(commitments)
    assert(Array.isArray(versionedHashes))

    for (const versionedHash of versionedHashes) {
      assert(versionedHash instanceof Uint8Array)
      assert.lengthOf(versionedHash, 32)
    }
  })
})
