import {
  BIGINT_2EXP96,
  KECCAK256_NULL_S,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
} from '@ethereumjs/util'

const bytesValue = new Uint8Array([97])
console.log(`bytesToBigInt: ${bytesToBigInt(bytesValue)}`)
console.log(`bytesToHex: ${bytesToHex(bytesValue)}`)
console.log(`hexToBytes length: ${hexToBytes('0x61').length}`)

console.log(`KECCAK256 null hash: ${KECCAK256_NULL_S}`)
console.log(`BIGINT_2EXP96: ${BIGINT_2EXP96}`)
