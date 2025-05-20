import { trustedSetup as slow } from '@paulmillr/trusted-setups'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, beforeAll, describe, it } from 'vitest'

import { getBlobs } from '../src/blobs.ts'

import type { KZG } from '../src/kzg.ts'

export const jsKZG = new microEthKZG(trustedSetup)

describe('KZG API tests', () => {
  let wasm: Awaited<ReturnType<typeof loadKZG>>
  beforeAll(async () => {
    wasm = await loadKZG({
      n1: 4096,
      n2: 65,
      g1: ''.concat(...slow.g1_lagrange.map((el) => el.slice(2))),
      g2: ''.concat(...slow.g2_monomial.map((el) => el.slice(2))),
    })
  })
  const wasmKZG: KZG = {
    blobToKzgCommitment(blob: string): string {
      return wasm.blobToKZGCommitment(blob)
    },
    computeBlobProof(blob: string, commitment: string): string {
      return wasm.computeBlobKZGProof(blob, commitment)
    },
    verifyProof(polynomialKZG: string, z: string, y: string, kzgProof: string): boolean {
      return wasm.verifyKZGProof(polynomialKZG, z, y, kzgProof)
    },
    verifyBlobProofBatch(
      blobs: string[],
      expectedKZGCommitments: string[],
      kzgProofs: string[],
    ): boolean {
      return wasm.verifyBlobKZGProofBatch(blobs, expectedKZGCommitments, kzgProofs)
    },
  }
  it('should produce the same outputs', () => {
    const blob = getBlobs('hello')[0]
    const commit = wasmKZG.blobToKzgCommitment(blob)
    const proof = wasmKZG.computeBlobProof(blob, commit)

    assert.strictEqual(
      wasmKZG.blobToKzgCommitment(blob).toLowerCase(),
      jsKZG.blobToKzgCommitment(blob).toLowerCase(),
    )

    assert.strictEqual(
      wasmKZG.computeBlobProof(blob, commit).toLowerCase(),
      jsKZG.computeBlobProof(blob, commit).toLowerCase(),
    )

    assert.strictEqual(
      wasmKZG.verifyBlobProofBatch([blob], [commit], [proof]),
      jsKZG.verifyBlobProofBatch([blob], [commit], [proof]),
    )
  })
})
