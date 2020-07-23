import { bufferToHex } from 'ethereumjs-util'
import { getClientVersion } from '../../util'
import { middleware } from '../validation'

/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
class Admin {
  /**
   * Create admin_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor(node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain
    this._node = node
    this._ethProtocol = service.protocols.find(p => p.name === 'eth')

    this.nodeInfo = middleware(this.nodeInfo.bind(this), 0, [])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo 
   * @param {*} [params] An empty array
   * @param {*} [cb] A function with an error object as the first argument and the
   */
  async nodeInfo(params, cb) {
    console.log('this._node', this._node)
    const rlpxInfo = this._node.server('rlpx').getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    // TODO version not present in reference..
    // const ethVersion = Math.max.apply(Math, this._ethProtocol.versions)
    // TODO _chain._headers might be undefined
    const latestHeader = this._chain._headers.latest
    const difficulty = latestHeader.difficulty // should be number
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
        listener
      },
      protocols: {
        eth: {
          difficulty,
          genesis,
          head,
          network
        }
      }
    }
    return cb(null, nodeInfo)
  }
}

module.exports = Admin