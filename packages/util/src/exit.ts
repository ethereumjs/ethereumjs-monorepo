import { bytesToHex } from './bytes.js'
import { TypeOutput, toType } from './types.js'

import type { BytesLike, PrefixedHexString } from './types.js'

/**
 * Flexible input data type for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 */
export type ExitData = {
  address: BytesLike
  validatorPubkey: BytesLike
}

/**
 * JSON RPC interface for EIP-7002 exit data
 */
export interface JsonRpcExit {
  address: PrefixedHexString // 20 bytes
  validatorPubkey: PrefixedHexString // 48 bytes
}

export type ExitBytes = [Uint8Array, Uint8Array]

/**
 * Representation of EIP-7002 exit data
 */
export class Exit {
  constructor(public readonly address: Uint8Array, public readonly validatorPubkey: Uint8Array) {}

  public static fromExitData(exitData: ExitData) {
    const { address, validatorPubkey } = exitData

    const vPubKey = toType(validatorPubkey, TypeOutput.Uint8Array)
    const addr = toType(address, TypeOutput.Uint8Array)

    return new Exit(addr, vPubKey)
  }

  public static fromValuesArray(exitArray: ExitBytes) {
    if (exitArray.length !== 2) {
      throw Error(`Invalid exitArray length expected=2 actual=${exitArray.length}`)
    }
    const [address, validatorPubkey] = exitArray
    return Exit.fromExitData({ validatorPubkey, address })
  }

  /**
   * Convert a withdrawal to a buffer array
   * @param withdrawal the withdrawal to convert
   * @returns buffer array of the withdrawal
   */
  public static toBytesArray(exit: Exit | ExitData): ExitBytes {
    const { validatorPubkey, address } = exit
    const validatorPubkeyBytes = toType(validatorPubkey, TypeOutput.Uint8Array)
    const addressBytes = toType(address, TypeOutput.Uint8Array)

    return [addressBytes, validatorPubkeyBytes]
  }

  raw() {
    return Exit.toBytesArray(this)
  }

  toValue() {
    return {
      address: this.address,
      validatorPubkey: this.validatorPubkey,
    }
  }

  toJSON() {
    return {
      address: this.address.toString(),
      validatorPubkey: bytesToHex(this.validatorPubkey),
    }
  }
}
