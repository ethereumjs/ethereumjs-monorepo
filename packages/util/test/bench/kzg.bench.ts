import { getBlobs } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { bench, describe } from 'vitest'

import { jsKZG } from '../kzg.spec.ts'

/**
 * These benchmarks compare performance of various KZG related functions for our two supported backends
 */
describe('benchmarks', async () => {
  const kzg = await loadKZG()
  const blob = getBlobs('hello')[0]
  const commit = kzg.blobToKZGCommitment(blob)
  const proof = kzg.computeBlobKZGProof(blob, commit)
  describe('commitments', async () => {
    bench('wasm commits', () => {
      kzg.blobToKZGCommitment(blob)
    })
    bench('js commits', () => {
      jsKZG.blobToKzgCommitment(blob)
    })
  })
  describe('proofs', async () => {
    bench('wasm proofs', () => {
      kzg.computeBlobKZGProof(blob, commit)
    })
    bench('js proofs', () => {
      jsKZG.computeBlobProof(blob, commit)
    })
  })
  describe('verifying proof', async () => {
    bench('wasm verifyProof', () => {
      kzg.verifyBlobKZGProofBatch([blob], [commit], [proof])
    })
    bench('js verifyProof', () => {
      jsKZG.verifyBlobProofBatch([blob], [commit], [proof])
    })
  })
})
