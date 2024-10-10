import { bytesToUnprefixedHex, hexToBytes } from '@ethereumjs/util'

import type { EVMBN254Interface } from '../../types.js'

/**
 * Implementation of the `EVMBN254Interface` using a WASM wrapper https://github.com/ethereumjs/rustbn.js
 * around the Parity fork of the Zcash bn pairing cryptography library.
 *
 * This can be optionally used to replace the build-in Noble implementation (`NobleBN254`) with
 * a more performant WASM variant. See EVM `bls` constructor option on how to use.
 */
export class RustBN254 implements EVMBN254Interface {
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
