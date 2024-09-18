/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface KZG {
  blobToKZGCommitment(blob: string): string
  computeBlobKZGProof(blob: string, commitment: string): string
  verifyKZGProof(polynomialKZG: string, z: string, y: string, KZGProof: string): boolean
  verifyBlobKZGProofBatch(
    blobs: string[],
    expectedKZGCommitments: string[],
    KZGProofs: string[],
  ): boolean
}
