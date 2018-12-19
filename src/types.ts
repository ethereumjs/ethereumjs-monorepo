import BN = require('bn.js')

export type Input = Buffer | string | number | Uint8Array | BN | Dictionary | List | null

// Use interface extension instead of type alias to
// make circular declaration possible.
export interface List extends Array<Input> {}

export interface Dictionary {
  [x: string]: Input
}

export interface Decoded {
  data: Buffer | Buffer[]
  remainder: Buffer
}
