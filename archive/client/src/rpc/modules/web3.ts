import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { getClientVersion } from '../../util/index.ts'
import { callWithStackTrace } from '../helpers.ts'
import { middleware, validators } from '../validation.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { Chain } from '../../blockchain/index.ts'
import type { EthereumClient } from '../../index.ts'
import type { FullEthereumService } from '../../service/index.ts'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class Web3 {
  private _chain?: Chain
  private _rpcDebug: boolean
  /**
   * Create web3_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient, rpcDebug: boolean) {
    const service = client.service as FullEthereumService
    this._chain = service.chain
    this._rpcDebug = rpcDebug
    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(callWithStackTrace(this.sha3.bind(this), this._rpcDebug), 1, [
      [validators.hex],
    ])
  }

  /**
   * Returns the current client version
   * @param params An empty array
   */
  clientVersion(_params = []) {
    return getClientVersion()
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data
   * @param params The data to convert into a SHA3 hash
   */
  sha3(params: PrefixedHexString[]): PrefixedHexString {
    const hexEncodedDigest = bytesToHex(keccak_256(hexToBytes(params[0])))
    return hexEncodedDigest
  }
}
