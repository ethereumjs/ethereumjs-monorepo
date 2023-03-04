/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface Kzg {
  loadTrustedSetup(filePath: string): void
  freeTrustedSetup(): void
  blobToKzgCommitment(blob: Uint8Array): Uint8Array
  computeBlobKzgProof(blob: Uint8Array): Uint8Array
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array
  ): boolean
  verifyBlobKzgProofBatch(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgProofs: Uint8Array[]
  ): boolean
}
