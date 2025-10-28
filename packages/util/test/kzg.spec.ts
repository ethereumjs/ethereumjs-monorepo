import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, beforeAll, describe, it } from 'vitest'

import { getBlobs } from '../src/blobs.ts'

import type { KZG } from '../src/kzg.ts'

const jsKZG = new microEthKZG(trustedSetup)

describe('KZG API tests', () => {
  let wasmKZG: KZG
  beforeAll(async () => {
    wasmKZG = await loadKZG()
  }, 50000)

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
