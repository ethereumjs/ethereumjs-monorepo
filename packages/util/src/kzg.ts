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
