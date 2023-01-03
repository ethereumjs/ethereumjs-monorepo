export interface kzg {
  loadTrustedSetup(filePath: string): void
  freeTrustedSetup(): void
  blobToKzgCommitment(blob: Uint8Array): Uint8Array
  computeAggregateKzgProof(blobs: Uint8Array[]): Uint8Array
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array
  ): boolean
  verifyAggregateKzgProof(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgAggregatedProof: Uint8Array
  ): boolean
}
