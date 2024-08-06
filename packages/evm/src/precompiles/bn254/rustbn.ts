import type { EVMBN254Interface } from '../../types.js'
import type { PrefixedHexString } from '@ethereumjs/util'

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

  ec_add(input_str: string): PrefixedHexString {
    return this._rustbn.ec_add(input_str)
  }

  ec_mul(input_hex: string): PrefixedHexString {
    return this._rustbn.ec_mul(input_hex)
  }
  ec_pairing(input_str: string): PrefixedHexString {
    return this._rustbn.ec_pairing(input_str)
  }
}
