import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

import { trustedSetup as fast } from './fast.js'

/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface Kzg {
  blobToKzgCommitment(blob: string): string
  computeBlobKzgProof(blob: string, commitment: string): string
  verifyKzgProof(polynomialKzg: string, z: string, y: string, kzgProof: string): boolean
  verifyBlobKzgProofBatch(
    blobs: string[],
    expectedKzgCommitments: string[],
    kzgProofs: string[],
  ): boolean
}

export const jsKZGinner = new microEthKZG(fast)

export const jsKZG: Kzg = {
  blobToKzgCommitment(blob: string): string {
    return jsKZGinner.blobToKzgCommitment(blob)
  },
  computeBlobKzgProof(blob: string, commitment: string): string {
    return jsKZGinner.computeBlobProof(blob, commitment)
  },
  verifyKzgProof(polynomialKzg: string, z: string, y: string, kzgProof: string): boolean {
    return jsKZGinner.verifyProof(polynomialKzg, z, y, kzgProof)
  },
  verifyBlobKzgProofBatch(
    blobs: string[],
    expectedKzgCommitments: string[],
    kzgProofs: string[],
  ): boolean {
    return jsKZGinner.verifyBlobProofBatch(blobs, expectedKzgCommitments, kzgProofs)
  },
}
