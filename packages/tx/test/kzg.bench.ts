import { getBlobs } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { beforeAll, bench, describe } from 'vitest'

import { jsKZG } from '../src/jsKZGWrapper.js'

import type { Kzg } from '@ethereumjs/util'

describe('benchmarks', async () => {
  const kzg = await loadKZG()
  const blob = getBlobs('hello')[0]
  bench('wasm commits', () => {
    kzg.blobToKzgCommitment(blob)
  })
  bench('js commits', () => {
    jsKZG.blobToKzgCommitment(blob)
  })
  const commit = kzg.blobToKzgCommitment(blob)
  bench('wasm proofs', () => {
    kzg.computeBlobKzgProof(blob, commit)
  })
  bench('js proofs', () => {
    jsKZG.computeBlobKzgProof(blob, commit)
  })
  const proof = kzg.computeBlobKzgProof(blob, commit)
  bench('wasm verifyProof', () => {
    kzg.verifyBlobKzgProofBatch([blob], [commit], [proof])
  })
  bench('js verifyProof', () => {
    jsKZG.verifyBlobKzgProofBatch([blob], [commit], [proof])
  })
})
