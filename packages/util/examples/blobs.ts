//import * as fs from 'fs'
import {
  type PrefixedHexString,
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  hexToBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const kzg = new microEthKZG(trustedSetup)

/**
 *  Uncomment for a more realistic example using a real blob, e.g. from https://blobscan.com/
 *  Use with node ./examples/blobs.ts <file path>
 */
// const filePath = process.argv[2]
//const blob: PrefixedHexString = `0x${fs.readFileSync(filePath, 'ascii')}`
const blob: PrefixedHexString = `0x${'11'.repeat(131072)}` // 128 KiB
console.log(blob)

const commitment = kzg.blobToKzgCommitment(blob)

const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment as PrefixedHexString, blobCommitmentVersion)

// EIP-4844 only
const blobProof = blobsToProofs(kzg, [blob], [commitment as PrefixedHexString])
const cellProofs = blobsToCellProofs(kzg, [blob])

console.log(`Blob size                   : ${hexToBytes(blob).length / 1024}KiB`)
console.log(`Commitment                  : ${commitment}`)
console.log(`Versioned hash              : ${versionedHash}`)
console.log(`Blob proof (EIP-4844)       : ${blobProof}`)
console.log(`First cell proof (EIP-7594) : ${cellProofs[0]}`)
console.log(`Num cell proofs (EIP-7594)  : ${cellProofs.length}`)
