import type { Kzg } from '@ethereumjs/util'

export class TSKzg implements Kzg {
  tsKzg: any

  constructor(kzg: any) {
    this.tsKzg = new kzg()
  }
  static create = async () => {
    const KZG = await import('@crate-crypto/crypto-4844')
    return new TSKzg(KZG.Context)
  }

  loadTrustedSetup(_filePath: string): void {}
  blobToKzgCommitment(blob: Uint8Array): Uint8Array {
    return this.tsKzg.blobToKZGCommitment(blob)
  }
  computeBlobKzgProof(blob: Uint8Array, _Ecommitment: Uint8Array): Uint8Array {
    const proof = this.tsKzg.computeBlobKZGProf(blob)
    return proof.proof
  }
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array
  ): boolean {
    return this.tsKzg.verifyKZGProof(polynomialKzg, z, y, kzgProof)
  }
  verifyBlobKzgProofBatch(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgProofs: Uint8Array[]
  ): boolean {
    return this.tsKzg.verifyBlobKZGProofBatch(blobs, expectedKzgCommitments, kzgProofs)
  }
}
