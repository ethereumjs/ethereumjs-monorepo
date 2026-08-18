import { createLegacyTx, createLegacyTxFromBytesArray } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes, randomBytes } from '@ethereumjs/util'

// Create and sign a contract-creation tx
const tx = createLegacyTx({
  nonce: 0,
  gasPrice: 100,
  gasLimit: 1_000_000_000,
  value: 0,
  data: '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700',
})

const signedTx = tx.sign(randomBytes(32))
console.log(`Upfront cost: ${signedTx.getUpfrontCost()} wei`)
console.log(`Serialized: ${bytesToHex(signedTx.serialize())}`)

// Parse a signed legacy tx from its values array
const rawTx = [
  '0x',
  '0x09184e72a000',
  '0x2710',
  '0x0000000000000000000000000000000000000000',
  '0x',
  '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  '0x1c',
  '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
].map(hexToBytes)

const parsed = createLegacyTxFromBytesArray(rawTx)
console.log(`Sender: ${parsed.getSenderAddress().toString()}`)
console.log(`Signature valid: ${parsed.verifySignature()}`)
