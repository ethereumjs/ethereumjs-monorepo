import { trustedSetup as slow } from '@paulmillr/trusted-setups'
import { trustedSetup as fast } from '@paulmillr/trusted-setups/fast.js'
import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, beforeAll, describe, it } from 'vitest'

import { getBlobs } from '../src/blobs.js'

import type { KZG } from '../src/kzg.js'

export const jsKZGinner = new microEthKZG(fast)

export const jsKZG: KZG = {
  blobToKZGCommitment(blob: string): string {
    return jsKZGinner.blobToKzgCommitment(blob)
  },
  computeBlobKZGProof(blob: string, commitment: string): string {
    return jsKZGinner.computeBlobProof(blob, commitment)
  },
  verifyKZGProof(polynomialKZG: string, z: string, y: string, kzgProof: string): boolean {
    return jsKZGinner.verifyProof(polynomialKZG, z, y, kzgProof)
  },
  verifyBlobKZGProofBatch(
    blobs: string[],
    expectedKZGCommitments: string[],
    kzgProofs: string[],
  ): boolean {
    return jsKZGinner.verifyBlobProofBatch(blobs, expectedKZGCommitments, kzgProofs)
  },
}

describe('KZG API tests', () => {
  let wasmKZG: KZG
  beforeAll(async () => {
    wasmKZG = await loadKZG({
      n1: 4096,
      n2: 65,
      g1: ''.concat(...slow.g1_lagrange.map((el) => el.slice(2))),
      g2: ''.concat(...slow.g2_monomial.map((el) => el.slice(2))),
    })
  })
  it('should produce the same outputs', () => {
    const blob = getBlobs('hello')[0]
    const commit = wasmKZG.blobToKZGCommitment(blob)
    const proof = wasmKZG.computeBlobKZGProof(blob, commit)

    assert.equal(
      wasmKZG.blobToKZGCommitment(blob).toLowerCase(),
      jsKZG.blobToKZGCommitment(blob).toLowerCase(),
    )

    assert.equal(
      wasmKZG.computeBlobKZGProof(blob, commit).toLowerCase(),
      jsKZG.computeBlobKZGProof(blob, commit).toLowerCase(),
    )

    assert.equal(
      wasmKZG.verifyBlobKZGProofBatch([blob], [commit], [proof]),
      jsKZG.verifyBlobKZGProofBatch([blob], [commit], [proof]),
    )
  })
})
