/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export interface Kzg {
  loadTrustedSetup(trustedSetup?: {
    g1: string // unprefixed hex string
    g2: string // unprefixed hex string
    n1: number // bytes per element
    n2: number // 65
  }): void
  blobToKzgCommitment(blob: Uint8Array): Uint8Array
  computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array
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

function kzgNotLoaded(): never {
  throw Error('kzg library not loaded')
}

// eslint-disable-next-line import/no-mutable-exports
export let kzg: Kzg = {
  loadTrustedSetup: kzgNotLoaded,
  blobToKzgCommitment: kzgNotLoaded,
  computeBlobKzgProof: kzgNotLoaded,
  verifyKzgProof: kzgNotLoaded,
  verifyBlobKzgProofBatch: kzgNotLoaded,
}

/**
 * @deprecated This initialization method is deprecated since trusted setup loading is done directly in the reference KZG library
 * initialization or should othewise be assured independently before KZG libary usage.
 *
 * @param kzgLib a KZG implementation (defaults to c-kzg)
 * @param a dictionary of trusted setup options
 */
export function loadKZG(kzgLib: Kzg, _trustedSetupPath?: string) {
  kzg = kzgLib
  kzg.loadTrustedSetup()
}
