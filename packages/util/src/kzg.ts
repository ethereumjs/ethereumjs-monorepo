import { KZG } from 'micro-eth-signer/kzg'

import { bytesToBigInt, bytesToHex, hexToBytes } from './bytes.js'
import { trustedSetup as fast } from './fast.js'

import type { PrefixedHexString } from './types.js'

/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface Kzg {
  blobToKzgCommitment(blob: Uint8Array): Uint8Array
  computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array,
  ): boolean
  verifyBlobKzgProofBatch(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgProofs: Uint8Array[],
  ): boolean
}

const kzg = new KZG(fast)

export const jsKZG: Kzg = {
  blobToKzgCommitment(blob: Uint8Array): Uint8Array {
    return hexToBytes(kzg.blobToKzgCommitment(bytesToHex(blob)) as PrefixedHexString)
  },
  computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array {
    return hexToBytes(
      kzg.computeBlobProof(bytesToHex(blob), bytesToHex(commitment)) as PrefixedHexString,
    )
  },
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array,
  ): boolean {
    return kzg.verifyProof(
      bytesToHex(polynomialKzg),
      bytesToBigInt(z),
      bytesToBigInt(y),
      bytesToHex(kzgProof),
    )
  },
  verifyBlobKzgProofBatch(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgProofs: Uint8Array[],
  ): boolean {
    return kzg.verifyBlobProofBatch(
      blobs.map((blob) => bytesToHex(blob)),
      expectedKzgCommitments.map((com) => bytesToHex(com)),
      kzgProofs.map((proof) => bytesToHex(proof)),
    )
  },
}
