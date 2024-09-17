import { getBlobs } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { bench, describe } from 'vitest'

import { jsKZG } from '../src/kzg.js'

describe('benchmarks', async () => {
  const kzg = await loadKZG()
  const blob = getBlobs('hello')[0]
  const commit = kzg.blobToKzgCommitment(blob)
  const proof = kzg.computeBlobKzgProof(blob, commit)
  describe('commitments', async () => {
    bench('wasm commits', () => {
      kzg.blobToKzgCommitment(blob)
    })
    bench('js commits', () => {
      jsKZG.blobToKzgCommitment(blob)
    })
  })
  describe('proofs', async () => {
    bench('wasm proofs', () => {
      kzg.computeBlobKzgProof(blob, commit)
    })
    bench('js proofs', () => {
      jsKZG.computeBlobKzgProof(blob, commit)
    })
  })
  describe('verifying proof', async () => {
    bench('wasm verifyProof', () => {
      kzg.verifyBlobKzgProofBatch([blob], [commit], [proof])
    })
    bench('js verifyProof', () => {
      jsKZG.verifyBlobKzgProofBatch([blob], [commit], [proof])
    })
  })
})
