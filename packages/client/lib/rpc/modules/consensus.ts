import { middleware, validators } from '../validation'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import type { EthereumService } from '../../service'
import type { EthProtocol } from '../../net/protocol'
import type VM from '@ethereumjs/vm'

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Consensus {
  private _chain: Chain
  private _vm: VM | undefined
  public ethVersion: number

  /**
   * Create eth_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._vm = (service.synchronizer as any)?.execution?.vm

    const ethProtocol = service.protocols.find((p) => p.name === 'eth') as EthProtocol
    this.ethVersion = Math.max(...ethProtocol.versions)

    this.consensus_setHead = middleware(this.consensus_setHead.bind(this), 1, [
      validators.blockHash,
    ])
  }

  /**
   * Sets the head of the chain to the block specified by the blockHash parameter.
   * Returns: An object with one property: success: Boolean - set to true if head has been changed successfully, otherwise false.
   * @param params An array of one parameter: A block hash
   */
  async consensus_setHead(params: [string]) {
    const [blockHash] = params
    console.log('setHead: ', blockHash)
    //  TODO: Not yet implemented
  }
}
