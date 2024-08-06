import { bytesToUnprefixedHex, hexToBytes } from '@ethereumjs/util'

import type { EVMBN254Interface } from '../../types.js'

/**
 * Implementation of the `EVMBN254Interface` using the `@noble/curves` JS library,
 * see https://github.com/paulmillr/noble-curves.
 *
 * This is the EVM default implementation.
 */
export class NobleBN254 implements EVMBN254Interface {
  protected readonly _rustbn: any

  constructor(rustbn: any) {
    this._rustbn = rustbn
  }

  add(input: Uint8Array): Uint8Array {
    const inputStr = bytesToUnprefixedHex(input)
    return hexToBytes(this._rustbn.ec_add(inputStr))
  }

  mul(input: Uint8Array): Uint8Array {
    const inputHex = bytesToUnprefixedHex(input)
    return hexToBytes(this._rustbn.ec_mul(inputHex))
  }
  pairing(input: Uint8Array): Uint8Array {
    const inputStr = bytesToUnprefixedHex(input)
    return hexToBytes(this._rustbn.ec_pairing(inputStr))
  }
}
