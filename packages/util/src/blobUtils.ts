import { sha256 } from 'ethereum-cryptography/sha256'

export const BLOB_COMMITMENT_VERSION_KZG = 0x01

export const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

export const computeVersionedHash = (commitment: Uint8Array) => {
  const computedVersionedHash = new Uint8Array(32)
  computedVersionedHash.set([BLOB_COMMITMENT_VERSION_KZG], 0)
  computedVersionedHash.set(sha256(commitment).slice(1), 1)
  return computedVersionedHash
}
