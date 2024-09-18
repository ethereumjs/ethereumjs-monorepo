import { trustedSetup as slow } from '@paulmillr/trusted-setups'
import { trustedSetup as fast } from '@paulmillr/trusted-setups/fast.js'
import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, beforeAll, describe, it } from 'vitest'

import { getBlobs } from '../src/blobs.js'

import type { Kzg } from '../src/kzg.js'

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

describe('kzg API tests', () => {
  let wasmKZG: Kzg
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
    const commit = wasmKZG.blobToKzgCommitment(blob)
    const proof = wasmKZG.computeBlobKzgProof(blob, commit)

    assert.equal(
      wasmKZG.blobToKzgCommitment(blob).toLowerCase(),
      jsKZG.blobToKzgCommitment(blob).toLowerCase(),
    )

    assert.equal(
      wasmKZG.computeBlobKzgProof(blob, commit).toLowerCase(),
      jsKZG.computeBlobKzgProof(blob, commit).toLowerCase(),
    )

    assert.equal(
      wasmKZG.verifyBlobKzgProofBatch([blob], [commit], [proof]),
      jsKZG.verifyBlobKzgProofBatch([blob], [commit], [proof]),
    )
  })
})
