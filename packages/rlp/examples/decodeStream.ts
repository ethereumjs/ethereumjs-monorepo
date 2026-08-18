import { RLP, utils } from '@ethereumjs/rlp'

const { bytesToHex, concatBytes, hexToBytes } = utils

// Stream mode decodes the first RLP item and returns the remainder buffer
const buffer = concatBytes(RLP.encode(1), RLP.encode('hello'), RLP.encode([2, 3]))

let decoded = RLP.decode(buffer, true)
console.log(`item 1: ${bytesToHex(decoded.data as Uint8Array)}`)

decoded = RLP.decode(decoded.remainder, true)
console.log(`item 2: ${new TextDecoder().decode(decoded.data as Uint8Array)}`)

decoded = RLP.decode(decoded.remainder, true)
const list = decoded.data as Uint8Array[]
console.log(`item 3: [${list.map((x) => bytesToHex(x)).join(', ')}]`)
console.log(`remainder length: ${decoded.remainder.length}`)

// utils: hex ↔ bytes without pulling in @ethereumjs/util
console.log(`hexToBytes('0x05'): ${bytesToHex(hexToBytes('0x05'))}`)
