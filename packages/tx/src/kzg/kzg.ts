/**
 * The public interface of this module exposes the functions as specified by
 * https://github.com/ethereum/consensus-specs/blob/dev/specs/eip4844/polynomial-commitments.md#kzg
 */
const kzg: KZG = require('./kzg.node')

export type BLSFieldElement = Uint8Array // 32 bytes
export type KZGProof = Uint8Array // 48 bytes
export type KZGCommitment = Uint8Array // 48 bytes
export type Blob = Uint8Array // 4096 * 32 bytes

type SetupHandle = Object

// The C++ native addon interface
export type KZG = {
  FIELD_ELEMENTS_PER_BLOB: number
  BYTES_PER_FIELD_ELEMENT: number

  loadTrustedSetup: (filePath: string) => SetupHandle

  freeTrustedSetup: (setupHandle: SetupHandle) => void

  blobToKzgCommitment: (blob: Blob, setupHandle: SetupHandle) => KZGCommitment

  computeAggregateKzgProof: (blobs: Blob[], setupHandle: SetupHandle) => KZGProof

  verifyAggregateKzgProof: (
    blobs: Blob[],
    expectedKzgCommitments: KZGCommitment[],
    kzgAggregatedProof: KZGProof,
    setupHandle: SetupHandle
  ) => boolean

  // Currently unused -- not exported
  verifyKzgProof: (
    polynomialKzg: KZGCommitment,
    z: BLSFieldElement,
    y: BLSFieldElement,
    kzgProof: KZGProof,
    setupHandle: SetupHandle
  ) => boolean
}

export const FIELD_ELEMENTS_PER_BLOB = kzg.FIELD_ELEMENTS_PER_BLOB
export const BYTES_PER_FIELD_ELEMENT = kzg.BYTES_PER_FIELD_ELEMENT

// Stored as internal state
let setupHandle: SetupHandle | undefined

function requireSetupHandle(): SetupHandle {
  if (!setupHandle) {
    throw new Error('You must call loadTrustedSetup to initialize KZG.')
  }
  return setupHandle
}

export function loadTrustedSetup(filePath: string): void {
  if (setupHandle) {
    throw new Error('Call freeTrustedSetup before loading a new trusted setup.')
  }
  setupHandle = kzg.loadTrustedSetup(filePath)
}

export function freeTrustedSetup(): void {
  kzg.freeTrustedSetup(requireSetupHandle())
  setupHandle = undefined
}

export function blobToKzgCommitment(blob: Blob): KZGCommitment {
  return kzg.blobToKzgCommitment(blob, requireSetupHandle())
}

export function computeAggregateKzgProof(blobs: Blob[]): KZGProof {
  return kzg.computeAggregateKzgProof(blobs, requireSetupHandle())
}

export function verifyAggregateKzgProof(
  blobs: Blob[],
  expectedKzgCommitments: KZGCommitment[],
  kzgAggregatedProof: KZGProof
): boolean {
  return kzg.verifyAggregateKzgProof(
    blobs,
    expectedKzgCommitments,
    kzgAggregatedProof,
    requireSetupHandle()
  )
}
