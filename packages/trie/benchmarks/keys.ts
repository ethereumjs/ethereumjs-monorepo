import { keccak256 } from 'ethereum-cryptography/keccak'

let curr = keccak256(new Uint8Array(32));

export const keys: Buffer[] = [];

for (let i = 0; i < 5000; curr = keccak256(curr), i++) {
  keys.push(Buffer.from(curr));
}
