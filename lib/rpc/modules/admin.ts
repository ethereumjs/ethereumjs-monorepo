import { bufferToHex } from 'ethereumjs-util'
import { Chain } from '../../blockchain'
import { EthProtocol } from '../../net/protocol'
import { RlpxServer } from '../../net/server'
import Node from '../../node'
import { EthereumService } from '../../service'
import { getClientVersion } from '../../util'
import { middleware } from '../validation'

/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
export class Admin {
  readonly _chain: Chain
  readonly _node: Node
  readonly _ethProtocol: EthProtocol

  /**
   * Create admin_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node: Node) {
    const service = node.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._node = node
    this._ethProtocol = service.protocols.find((p) => p.name === 'eth') as EthProtocol

    this.nodeInfo = middleware(this.nodeInfo.bind(this), 0, [])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo
   * @param {*} [params] An empty array
   * @param {*} [cb] A function with an error object as the first argument and the result as the second
   */
  async nodeInfo(params: any, cb: Function) {
    const rlpxInfo = (this._node.server('rlpx') as RlpxServer).getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    // TODO version not present in reference..
    // const ethVersion = Math.max.apply(Math, this._ethProtocol.versions)
    const latestHeader = (this._chain as any)._headers.latest
    const difficulty = latestHeader?.difficulty ?? 0 // should be number
    const genesis = bufferToHex(this._chain.genesis.hash)
    const head = bufferToHex(latestHeader?.mixHash ?? null)
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
