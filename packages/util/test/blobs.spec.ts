import { assert, describe, it } from 'vitest'

import {
  bytesToHex,
  commitmentsToVersionedHashes,
  computeVersionedHash,
  getBlobs,
} from '../src/index.ts'

describe('getBlobs()', () => {
  it('should return an array of PrefixedHexString blobs', () => {
    const input = 'test input'
    const blobs = getBlobs(input)
    assert(Array.isArray(blobs))

    for (const blob of blobs) assert(typeof blob === 'string' && blob.slice(0, 2) === '0x')
  })

  it('should throw for invalid blob data', () => {
    const input = ''
    assert.throws(() => getBlobs(input), Error, 'invalid blob data')
  })

  it('should throw for too large blob data', () => {
    const input = 'a'.repeat(131072 * 6) // exceeds MAX_BLOB_BYTES_PER_TX * MAX_BLOBS_PER_TX
    assert.throws(() => getBlobs(input), Error, 'blob data is too large')
  })

  it('should allow for multiple inputs', () => {
    const input = ['test input', 'test input 2']
    const blobs = getBlobs(input)
    assert(Array.isArray(blobs))
    assert.lengthOf(blobs, 2)
    for (const blob of blobs) assert(typeof blob === 'string' && blob.slice(0, 2) === '0x')
  })
})

describe('computeVersionedHash()', () => {
  it('should return a versioned hash', () => {
    const commitment = new Uint8Array([1, 2, 3])
    const blobCommitmentVersion = 0x01
    const versionedHash = computeVersionedHash(bytesToHex(commitment), blobCommitmentVersion)
    assert(typeof versionedHash === 'string')
    assert.lengthOf(versionedHash, 66)
  })
})

describe('commitmentsToVersionedHashes()', () => {
  it('should return an array of versioned hashes', () => {
    const commitments = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])]
    const blobVersionedHashes = commitmentsToVersionedHashes(
      commitments.map((com) => bytesToHex(com)),
    )
    assert(Array.isArray(blobVersionedHashes))

    for (const versionedHash of blobVersionedHashes) {
      assert(typeof versionedHash === 'string')
      assert.lengthOf(versionedHash, 66)
    }
  })
})
