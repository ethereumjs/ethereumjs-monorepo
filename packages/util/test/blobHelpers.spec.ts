import { assert, describe, it } from 'vitest'

import {
  bytesToHex,
  commitmentsToVersionedHashes,
  computeVersionedHash,
  getBlobs,
} from '../src/index.ts'

describe('blob helper tests', () => {
  it('getBlobs should return an array of PrefixedHexString blobs', () => {
    const input = 'test input'
    const blobs = getBlobs(input)
    assert(Array.isArray(blobs))

    for (const blob of blobs) assert(typeof blob === 'string' && blob.slice(0, 2) === '0x')
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
    const versionedHash = computeVersionedHash(bytesToHex(commitment), blobCommitmentVersion)
    assert(typeof versionedHash === 'string')
    assert.lengthOf(versionedHash, 66)
  })

  it('commitmentsToVersionedHashes should return an array of versioned hashes', () => {
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
