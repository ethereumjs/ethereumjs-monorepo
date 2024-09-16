import { type Kzg, bytesToBigInt, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { KZG } from 'micro-eth-signer/kzg'

//@ts-ignore  NOTE: Have placed the "fast" version of the trusted setup here for now till the `trusted-setups` package is published
import { trustedSetup as fast } from './fast.js'

import type { PrefixedHexString } from '@ethereumjs/util'
// import { trustedSetup as fast } from 'trusted-setups/fast.js'

const kzg = new KZG(fast)

export const jsKZG: Kzg = {
  blobToKzgCommitment(blob: Uint8Array): Uint8Array {
    return hexToBytes(kzg.blobToKzgCommitment(bytesToHex(blob)) as PrefixedHexString)
  },
  computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array {
    return hexToBytes(
      kzg.computeBlobProof(bytesToHex(blob), bytesToHex(commitment)) as PrefixedHexString,
    )
  },
  verifyKzgProof(
    polynomialKzg: Uint8Array,
    z: Uint8Array,
    y: Uint8Array,
    kzgProof: Uint8Array,
  ): boolean {
    return kzg.verifyProof(
      bytesToHex(polynomialKzg),
      bytesToBigInt(z),
      bytesToBigInt(y),
      bytesToHex(kzgProof),
    )
  },
  verifyBlobKzgProofBatch(
    blobs: Uint8Array[],
    expectedKzgCommitments: Uint8Array[],
    kzgProofs: Uint8Array[],
  ): boolean {
    return kzg.verifyBlobProofBatch(
      blobs.map((blob) => bytesToHex(blob)),
      expectedKzgCommitments.map((com) => bytesToHex(com)),
      kzgProofs.map((proof) => bytesToHex(proof)),
    )
  },
}
