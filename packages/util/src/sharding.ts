import { sha256 } from 'ethereum-cryptography/sha256'

export const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

/**
 * Converts a vector commitment for a given data blob to its versioned hash.  For 4844, this version
 * number will be 0x01 for KZG vector commitments but could be different if future vector commitment
 * types are introduced
 * @param commitment a vector commitment to a blob
 * @param blobCommitmentVersion the version number corresponding to the type of vector commitment
 * @returns a versioned hash corresponding to a given blob vector commitment
 */
export const computeVersionedHash = (commitment: Uint8Array, blobCommitmentVersion: number) => {
  const computedVersionedHash = new Uint8Array(32)
  computedVersionedHash.set([blobCommitmentVersion], 0)
  computedVersionedHash.set(sha256(commitment).slice(1), 1)
  return computedVersionedHash
}
