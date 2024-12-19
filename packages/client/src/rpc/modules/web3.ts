import { bytesToHex, hexToBytes, toBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { getClientVersion } from '../../util/index.js'
import { callWithStackTrace } from '../helpers.js'
import { middleware, validators } from '../validation.js'

import type { EthereumClient } from '../../index.js'
import type { PrefixedHexString } from '@ethereumjs/util'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class Web3 {
  private _rpcDebug: boolean
  /**
   * Create web3_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient, rpcDebug: boolean) {
    this._rpcDebug = rpcDebug

    this.sha3 = middleware(callWithStackTrace(this.sha3.bind(this), this._rpcDebug), 1, [
      [validators.hex],
    ])
  }

  /**
   * Returns the current client version
   * @param params An empty array
   */
  clientVersion() {
    return getClientVersion()
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data
   * @param params The data to convert into a SHA3 hash
   */
  sha3(params: PrefixedHexString[]): PrefixedHexString {
    const hexEncodedDigest = bytesToHex(keccak256(toBytes(hexToBytes(params[0]))))
    return hexEncodedDigest
  }
}
