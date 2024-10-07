import { keccak256 } from 'ethereum-cryptography/keccak.js'

let curr = keccak256(new Uint8Array(32))

export const keys: Uint8Array[] = []

for (let i = 0; i < 5000; curr = keccak256(curr), i++) {
  keys.push(curr)
}
