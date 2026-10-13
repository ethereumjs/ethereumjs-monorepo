import { RLP, utils } from '@ethereumjs/rlp'

const { bytesToHex } = utils

// Strings, numbers, bigint, and 0x-prefixed hex all encode to Uint8Array output
console.log(`encode('dog'): ${bytesToHex(RLP.encode('dog'))}`)
console.log(`encode(15): ${bytesToHex(RLP.encode(15))}`)
console.log(`encode(15n): ${bytesToHex(RLP.encode(15n))}`)
console.log(`encode('0x01'): ${bytesToHex(RLP.encode('0x01'))}`)
console.log(`encode(['cat','dog']): ${bytesToHex(RLP.encode(['cat', 'dog']))}`)
