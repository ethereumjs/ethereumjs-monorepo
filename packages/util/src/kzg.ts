/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface KZG {
  blobToKzgCommitment(blob: string): string
  computeBlobProof(blob: string, commitment: string): string
  verifyProof(polynomialKZG: string, z: string, y: string, KZGProof: string): boolean
  verifyBlobProofBatch(
    blobs: string[],
    expectedKZGCommitments: string[],
    KZGProofs: string[],
  ): boolean
}
