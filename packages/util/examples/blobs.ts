import { bytesToHex, computeVersionedHash, getBlobs } from '@ethereumjs/util'

const blobs = getBlobs('test input')

console.log('Created the following blobs:')
console.log(blobs)

const commitment = bytesToHex(new Uint8Array([1, 2, 3]))
const blobCommitmentVersion = 0x01
const versionedHash = computeVersionedHash(commitment, blobCommitmentVersion)

console.log(`Versioned hash ${versionedHash} computed`)
