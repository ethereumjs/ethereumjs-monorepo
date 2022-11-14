import { sha256 } from 'ethereum-cryptography/sha256'

export const BLOB_COMMITMENT_VERSION_KZG = 0x01

export const computeVersionedHash = (commitment: Uint8Array) => {
  const computedVersionedHash = new Uint8Array(32)
  computedVersionedHash.set([BLOB_COMMITMENT_VERSION_KZG], 0)
  computedVersionedHash.set(sha256(commitment).slice(1), 1)
  return computedVersionedHash
}
