import { addHexPrefix, toBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'

import { getClientVersion } from '../../util'
import { middleware, validators } from '../validation'

import type { EthereumClient } from '../..'
import type { Chain } from '../../blockchain'
import type { EthereumService } from '../../service'

/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export class Web3 {
  private _chain?: Chain

  /**
   * Create web3_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain

    this.clientVersion = middleware(this.clientVersion.bind(this), 0, [])

    this.sha3 = middleware(this.sha3.bind(this), 1, [[validators.hex]])
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
  sha3(params: string[]) {
    const hexEncodedDigest = addHexPrefix(bytesToHex(keccak256(toBytes(params[0]))))
    return hexEncodedDigest
  }
}
