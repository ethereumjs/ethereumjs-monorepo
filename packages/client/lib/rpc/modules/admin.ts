import { bufferToHex } from 'ethereumjs-util'
import { Chain } from '../../blockchain'
import { EthProtocol } from '../../net/protocol'
import { RlpxServer } from '../../net/server'
import EthereumClient from '../../client'
import { EthereumService } from '../../service'
import { getClientVersion } from '../../util'
import { middleware } from '../validation'

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
   * @param {client} EthereumClient to which the module binds
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
   * @param {*} [params] An empty array
   * @param {*} [cb] A function with an error object as the first argument and the result as the second
   */
  async nodeInfo(params: [], cb: Function) {
    const rlpxInfo = (this._client.server('rlpx') as RlpxServer).getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    // TODO version not present in reference..
    // const ethVersion = Math.max.apply(Math, this._ethProtocol.versions)
    const latestHeader = await this._chain.getLatestHeader()
    const difficulty = latestHeader.difficulty
    const genesis = bufferToHex(this._chain.genesis.hash)
    const head = bufferToHex(latestHeader.mixHash)
    const network = this._chain.networkId

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
    return cb(null, nodeInfo)
  }
}
