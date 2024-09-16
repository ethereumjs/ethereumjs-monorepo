import { type Kzg, bytesToBigInt, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { KZG } from 'micro-eth-signer/kzg'
// @ts-ignore
import { trustedSetup as slow } from 'trusted-setups'
// @ts-ignore
import { trustedSetup as fast } from 'trusted-setups/fast.js'

import type { PrefixedHexString } from '@ethereumjs/util'
// import { trustedSetup as fast } from 'trusted-setups/fast.js'

const kzg = new KZG(fast)
// const slowKZG = new KZG(slow)
export const jsKZG: Kzg = {
  blobToKzgCommitment(blob: Uint8Array): Uint8Array {
    return hexToBytes(kzg.blobToKzgCommitment(bytesToHex(blob)) as PrefixedHexString)
  },
  computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array {
    console.log(kzg.computeBlobProof)
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
