import { middleware, validators } from '../validation'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import type { EthereumService } from '../../service'
import type VM from '@ethereumjs/vm'

/**
 * consensus_* RPC module
 * @memberof module:rpc/modules
 */
export class Consensus {
  private _chain: Chain
  private _vm: VM | undefined

  /**
   * Create consensus_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._vm = (service.synchronizer as any)?.execution?.vm

    // TODO: validation for assembleBlock and newBlock methods, see https://github.com/ethereum/rayonism/blob/master/specs/merge.md#consensus-json-rpc
    this.assembleBlock = middleware(this.assembleBlock.bind(this), 2, [[validators.blockHash]])
    this.finaliseBlock = middleware(this.finaliseBlock.bind(this), 1, [[validators.blockHash]])
    this.newBlock = middleware(this.newBlock.bind(this), 1)
    this.setHead = middleware(this.setHead.bind(this), 1, [[validators.blockHash]])
  }

  /**
   * Grabs a set of transactions from the pool and creates a new block on top of given parent. (similar to eth_getWork)
   * @param params An array of one parameter:
   *   1. An object
   *       * parentHash - The hash of the parent block
   *       * timestamp - Unix timestamp of a new block
   * @returns An object:
   *   * blockHash - hash of assembled block, i.e. keccak256(RLP.encode(BlockHeader)).
   *   * parentHash - hash of the parent block.
   *   * miner - the address of the beneficiary to whom transaction fees are given.
   *   * stateRoot - the root of the final state trie of the block.
   *   * number - the block number.
   *   * gasLimit - the maximum gas allowed in this block.
   *   * gasUsed - the total used gas by all transactions in this block.
   *   * timestamp - unix timestamp of the block; must be equal to the value of timestamp parameter.
   *   * receiptsRoot - the root of the receipts trie of the block.
   *   * logsBloom - the bloom filter for the logs of the block.
   *   * transactions - Array of encoded transactions, each transaction is a byte list, representing TransactionType || TransactionPayload or LegacyTransaction as defined in EIP 2718
   */
  async assembleBlock(params: [string, number]) {
    const [parentHash, timestamp] = params

    return `Not implemented yet. Parent hash: ${parentHash}. Timestamp: ${timestamp}`
  }
  /**
   * Notifies the execution engine that the block identified by blockHash has been finalised by consensus-layer.
   * @param params An array of one parameter: A block hash
   * @returns An object with one property: success: Boolean - set to true if block has been finalised successfully, otherwise false.
   */
  async finaliseBlock(params: [string]) {
    const [blockHash] = params
    return `Not implemented yet. Block hash: ${blockHash}`
  }

  /**
   * Assembles a block, executes transactions and inserts a block into the chain if the block is valid.
   * @param params An array of one parameter:
   *   1. An object - the execution payload of the new block:
   *       * blockHash - hash of this block.
   *       * parentHash - hash of the parent block.
   *       * miner - the address of the beneficiary to whom transaction fees are given.
   *       * stateRoot - the root of the final state trie of the block.
   *       * number - the block number.
   *       * gasLimit - the maximum gas allowed in this block.
   *       * gasUsed - the total used gas by all transactions in this block.
   *       * timestamp - unix timestamp of the block.
   *       * receiptsRoot - the root of the receipts trie of the block.
   *       * logsBloom - the bloom filter for the logs of the block.
   *       * transactions - Array of encoded transactions, each transaction is a byte list, representing TransactionType || TransactionPayload or LegacyTransaction as defined in EIP 2718
   * @returns An object with one property: valid: Boolean - set to true if block is valid, otherwise false.
   */
  async newBlock(params: [any]) {
    const [block] = params
    return `Not implemented yet. Block: ${block.blockHash}`
  }
  /**
   * Sets the head of the chain to the block specified by the blockHash parameter.
   * @param params An array of one parameter: A block hash
   * @returns An object with one property: success: Boolean - set to true if head has been changed successfully, otherwise false.
   */
  async setHead(params: [string]) {
    const [blockHash] = params
    return `Not implemented yet. Block hash: ${blockHash}`
  }
}
