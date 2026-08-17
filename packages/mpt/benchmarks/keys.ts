import { keccak_256 } from '@noble/hashes/sha3.js'

let curr = keccak_256(new Uint8Array(32))

export const keys: Uint8Array[] = []

for (let i = 0; i < 5000; curr = keccak_256(curr), i++) {
  keys.push(curr)
}
