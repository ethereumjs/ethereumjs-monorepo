import { bytesToHex } from '@ethereumjs/util'

import { getClientVersion } from '../../util/index.js'
import { callWithStackTrace } from '../helpers.js'
import { middleware } from '../validation.js'

import type { Chain } from '../../blockchain/index.js'
import type { EthereumClient } from '../../client.js'
import type { Service } from '../../service/index.js'

/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
export class Admin {
  readonly _chain: Chain
  readonly _client: EthereumClient
  private _rpcDebug: boolean

  /**
   * Create admin_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient, rpcDebug: boolean) {
    const service = client.services.find((s) => s.name === 'eth') as Service
    this._chain = service.chain
    this._client = client
    this._rpcDebug = rpcDebug

    this.nodeInfo = middleware(callWithStackTrace(this.nodeInfo.bind(this), this._rpcDebug), 0, [])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo
   * @param params An empty array
   */
  async nodeInfo(_params: []) {
    const rlpxInfo = this._client.config.server!.getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    const latestHeader = this._chain.headers.latest!
    const difficulty = latestHeader.difficulty.toString()
    const genesis = bytesToHex(this._chain.genesis.hash())
    const head = bytesToHex(latestHeader.mixHash)
    const network = this._chain.chainId.toString()

    const nodeInfo = {
      name: clientName,
      enode,
      id,
      ip,
      listenAddr,
      ports: {
        discovery,
        listener,
      },
      protocols: {
        eth: {
          difficulty,
          genesis,
          head,
          network,
        },
      },
    }
    return nodeInfo
  }
}
