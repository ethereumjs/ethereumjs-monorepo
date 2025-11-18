import * as fs from 'fs'
import {
  type PrefixedHexString,
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  getBlob,
  getBlobs,
  hexToBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const kzg = new microEthKZG(trustedSetup)

// Use with node ./examples/blobs.ts <file path>
const filePath = process.argv[2]
let blobData: string = fs.readFileSync(filePath, 'ascii')
console.log(blobData)
console.log(blobData.length)
blobData = blobData.substring(0, 100)

const blobs = [getBlob(hexToBytes(`0x${blobData}`))]

//const blobData = 'hello'
//const blobs = getBlobs(blobData)

console.log('Created the following blobs:')
//console.log(blobs)

const commitment = kzg.blobToKzgCommitment(blobs[0])

const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment as PrefixedHexString, blobCommitmentVersion)

// EIP-4844 only
const blobProof = blobsToProofs(kzg, blobs, [commitment as PrefixedHexString])
const cellProofs = blobsToCellProofs(kzg, blobs)

console.log(`Commitment                  : ${commitment}`)
console.log(`Versioned hash              : ${versionedHash}`)
console.log(`Blob proof (EIP-4844)       : ${blobProof}`)
console.log(`First cell proof (EIP-7594) : ${cellProofs[0]}`)
console.log(`Num cell proofs (EIP-7594)  : ${cellProofs.length}`)
