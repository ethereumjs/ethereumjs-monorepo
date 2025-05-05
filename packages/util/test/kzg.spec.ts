import { trustedSetup as slow } from '@paulmillr/trusted-setups'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, beforeAll, describe, it } from 'vitest'

import { getBlobs } from '../src/blobs.ts'

import type { KZG } from '../src/kzg.ts'

import * as ckzg from 'c-kzg'
import { bytesToHex, hexToBytes } from '../src/bytes.ts'

export const jsKZG = new microEthKZG(trustedSetup)
const cKzg = {
  blobToKzgCommitment: (blob: string) => {
    const blobBytes = hexToBytes(blob)
    const commitmentBytes = ckzg.blobToKzgCommitment(blobBytes)
    return bytesToHex(commitmentBytes)
  },
  computeBlobProof: (blob: string, commitment: string) => {
    const blobBytes = hexToBytes(blob)
    const commitmentBytes = hexToBytes(commitment)
    const proofBytes = ckzg.computeBlobKzgProof(blobBytes, commitmentBytes)
    return bytesToHex(proofBytes)
  },
  verifyProof: (commitment: string, z: string, y: string, proof: string) => {
    const commitmentBytes = hexToBytes(commitment)
    const zBytes = hexToBytes(z)
    const yBytes = hexToBytes(y)
    const proofBytes = hexToBytes(proof)
    return ckzg.verifyKzgProof(commitmentBytes, zBytes, yBytes, proofBytes)
  },
  verifyBlobProofBatch: (blobs: string[], commitments: string[], proofs: string[]) => {
    const blobsBytes = blobs.map((blb) => hexToBytes(blb))
    const commitmentsBytes = commitments.map((cmt) => hexToBytes(cmt))
    const proofsBytes = proofs.map((prf) => hexToBytes(prf))
    return ckzg.verifyBlobKzgProofBatch(blobsBytes, commitmentsBytes, proofsBytes)
  },
  computeCells: (blob: string) => {
    const blobBytes = hexToBytes(blob)
    const cellsBytes = ckzg.computeCells(blobBytes)
    return cellsBytes.map((cellBytes) => bytesToHex(cellBytes))
  },
  computeCellsAndProofs: (blob: string) => {
    const blobBytes = hexToBytes(blob)
    const [cellsBytes, proofsBytes] = ckzg.computeCellsAndKzgProofs(blobBytes)
    return [
      cellsBytes.map((cellBytes) => bytesToHex(cellBytes)),
      proofsBytes.map((prfBytes) => bytesToHex(prfBytes)),
    ] as [string[], string[]]
  },
  recoverCellsAndProofs: (indices: number[], cells: string[]) => {
    const cellsBytes = cells.map((cell) => hexToBytes(cell))
    const [allCellsBytes, allProofsBytes] = ckzg.recoverCellsAndKzgProofs(indices, cellsBytes)
    return [
      allCellsBytes.map((cellBytes) => bytesToHex(cellBytes)),
      allProofsBytes.map((prfBytes) => bytesToHex(prfBytes)),
    ] as [string[], string[]]
  },
  verifyCellKzgProofBatch: (
    commitments: string[],
    indices: number[],
    cells: string[],
    proofs: string[],
  ) => {
    const commitmentsBytes = commitments.map((commit) => hexToBytes(commit))
    const cellsBytes = cells.map((cell) => hexToBytes(cell))
    const proofsBytes = proofs.map((prf) => hexToBytes(prf))
    return ckzg.verifyCellKzgProofBatch(commitmentsBytes, indices, cellsBytes, proofsBytes)
  },
}

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
    console.log(jsKZG.blobToKzgCommitment(blob).toLowerCase())
    console.log(cKzg.blobToKzgCommitment(blob).toLowerCase())

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
