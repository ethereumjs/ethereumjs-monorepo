import { bytesToHex } from '@ethereumjs/util'

import { getClientVersion } from '../../util/index.js'
import { callWithStackTrace } from '../helpers.js'
import { middleware } from '../validation.js'

import type { Chain } from '../../blockchain/index.js'
import type { EthereumClient } from '../../client.js'
import type { RlpxPeer } from '../../net/peer/rlpxpeer.js'
import type { FullEthereumService } from '../../service/index.js'

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
    const service = client.service as FullEthereumService
    this._chain = service.chain
    this._client = client
    this._rpcDebug = rpcDebug

    this.nodeInfo = middleware(callWithStackTrace(this.nodeInfo.bind(this), this._rpcDebug), 0, [])
    this.peers = middleware(callWithStackTrace(this.peers.bind(this), this._rpcDebug), 0, [])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-admin#admin_peers
   */
  async nodeInfo() {
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

  /**
   * Returns information about currently connected peers
   * @returns an array of objects containing information about peers (including id, eth protocol versions supported, client name, etc.)
   */
  async peers() {
    const peers = this._client.service!.pool.peers as RlpxPeer[]

    return peers?.map((peer) => {
      return {
        id: peer.id,
        name: peer.rlpxPeer?.['_hello']?.clientId ?? null,
        protocols: {
          eth: {
            head: peer.eth?.updatedBestHeader
              ? bytesToHex(peer.eth.updatedBestHeader?.hash())
              : bytesToHex(peer.eth?.status.bestHash),
            difficulty: peer.eth?.status.td.toString(10),
            version: peer.eth?.['versions'].slice(-1)[0] ?? null,
          },
        },
        caps: peer.eth?.['versions'].map((ver) => 'eth/' + ver),
        network: {
          remoteAddress: peer.address,
        },
      }
    })
  }
}
