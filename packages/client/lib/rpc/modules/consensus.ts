import { Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BN,
  bufferToHex,
  toBuffer,
  stripHexPrefix,
  setLengthLeft,
} from 'ethereumjs-util'
import { decode } from 'rlp'
import { middleware, validators } from '../validation'
import { INVALID_PARAMS } from '../error-code'
import { RpcTx } from '../types'
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
  }
}
