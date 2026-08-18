import { RLP } from '@ethereumjs/rlp'

const nestedList = [[], [[]], [[], [[]]]]
const encoded = RLP.encode(nestedList)
const decoded = RLP.decode(encoded)

console.log(`Encoded ${encoded.length} bytes`)
console.log(`Decoded top-level is array: ${Array.isArray(decoded)}`)
