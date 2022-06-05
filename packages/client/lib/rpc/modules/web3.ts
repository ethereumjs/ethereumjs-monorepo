import ethCryptoKeccak = require('ethereum-cryptography/keccak')
import ethCryptoUtils = require('ethereum-cryptography/utils')
import { addHexPrefix, toBuffer } from 'ethereumjs-util'
import { middleware, validators } from '../validation.js'
import { getClientVersion } from '../../util/index.js'
import type { EthereumClient } from '../../index.js'
import type { Chain } from '../../blockchain/index.js'
import type { EthereumService } from '../../service/index.js'

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
    const hexEncodedDigest = addHexPrefix(
      ethCryptoUtils.bytesToHex(ethCryptoKeccak.keccak256(toBuffer(params[0])))
    )
    return hexEncodedDigest
  }
}
