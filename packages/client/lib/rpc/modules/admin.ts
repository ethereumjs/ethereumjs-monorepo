import { bufferToHex } from 'ethereumjs-util'
import { getClientVersion } from '../../util'
import { middleware } from '../validation'
import type { Chain } from '../../blockchain'
import type { EthProtocol } from '../../net/protocol'
import type { RlpxServer } from '../../net/server'
import type EthereumClient from '../../client'
import type { EthereumService } from '../../service'

/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
export class Admin {
  readonly _chain: Chain
  readonly _client: EthereumClient
  readonly _ethProtocol: EthProtocol

  /**
   * Create admin_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._client = client
    this._ethProtocol = service.protocols.find((p) => p.name === 'eth') as EthProtocol

    this.nodeInfo = middleware(this.nodeInfo.bind(this), 0, [])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo
   * @param params An empty array
   */
  async nodeInfo(_params: []) {
    const rlpxInfo = (this._client.server('rlpx') as RlpxServer).getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    // TODO version not present in reference..
    // const ethVersion = Math.max.apply(Math, this._ethProtocol.versions)
    const latestHeader = await this._chain.getLatestHeader()
    const difficulty = latestHeader.difficulty.toString()
    const genesis = bufferToHex(this._chain.genesis.hash)
    const head = bufferToHex(latestHeader.mixHash)
    const network = this._chain.networkId.toString()

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
