import BN from 'bn.js'

export type RLPInput = Buffer | string | number | Uint8Array | BN | RLPObject | RLPArray | null

export interface RLPArray extends Array<RLPInput> {}
interface RLPObject {
  [x: string]: RLPInput
}

export interface RLPDecoded {
  data: Buffer | Buffer[]
  remainder: Buffer
}
