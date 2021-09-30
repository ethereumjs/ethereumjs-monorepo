/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address, toBuffer, toType, TypeOutput } from 'ethereumjs-util'
import { middleware, validators } from '../validation'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import type { EthereumService } from '../../service'
import type VM from '@ethereumjs/vm'
import { Block } from '@ethereumjs/block'

type ExecutionPayload = {
  parentHash: string // DATA, 32 Bytes
  coinbase: string // DATA, 20 Bytes
  stateRoot: string // DATA, 32 Bytes
  receiptRoot: string // DATA, 32 bytes
  logsBloom: string // DATA, 256 Bytes
  random: string // DATA, 32 Bytes
  blockNumber: string // QUANTITY, 64 Bits
  gasLimit: string // QUANTITY, 64 Bits
  gasUsed: string // QUANTITY, 64 Bits
  timestamp: string // QUANTITY, 64 Bits
  extraData: string // DATA, 0 to 32 Bytes
  baseFeePerGas: string // QUANTITY, 256 Bits
  blockHash: string // DATA, 32 Bytes
  transactions: string[] // Array of DATA - Array of transaction objects,
  // each object is a byte list (DATA) representing
  // TransactionType || TransactionPayload or LegacyTransaction
  // as defined in EIP-2718.
}

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private client: EthereumClient
  private _chain: Chain
  private _vm: VM | undefined

  /**
   * Create engine_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._vm = (service.synchronizer as any)?.execution?.vm

    // TODO: validation for assembleBlock and newBlock methods,
    // see https://github.com/ethereum/execution-apis/blob/v1.0.0-alpha.1/src/engine/interop/specification.md
    this.preparePayload = middleware(this.preparePayload.bind(this), 4, [
      [validators.blockHash, validators.hex, validators.hex, validators.address],
    ])
    this.getPayload = middleware(this.getPayload.bind(this), 1, [[validators.hex]])
    this.executePayload = middleware(this.executePayload.bind(this), 1, [
      [validators.hex, validators.blockHash],
    ])
    this.consensusValidated = middleware(this.consensusValidated.bind(this), 2, [
      [validators.blockHash],
    ])
    this.forkchoiceUpdated = middleware(this.forkchoiceUpdated.bind(this), 1, [
      [validators.hex, validators.blockHash],
    ])
  }

  /**
   * Notifies the client will need to propose a block at some point in the future and
   * that the payload will be requested by the corresponding engine_getPayload near
   * to that point in time.
   *
   * @param params An array of one parameter:
   *   1. An object
   *       * parentHash - hash of the parent block
   *       * timestamp - value for the `timestamp` field of the new payload
   *       * random - value for the `random` field of the new payload
   *       * feeRecipient - suggested value for the `coinbase` field of the new payload
   * @returns payloadId|Error
   */
  async preparePayload(params: [string, string, string, string]) {
    let [parentHash, timestamp, random, feeRecipient]: any = params

    parentHash = toBuffer(parentHash)
    timestamp = toType(timestamp, TypeOutput.BN)
    random = toBuffer(random)
    feeRecipient = Address.fromString(feeRecipient)

    return `Not implemented yet.`
  }

  /**
   * Given payloadId, returns the most recent version of an execution payload
   * that is available by the time of the call or responds with an error.
   *
   * @param params An array of one parameter:
   *   1. An object
   *       * payloadId - identifier of the payload building process
   * @returns Instance of {@link ExecutionPayload} or an error
   */
  async getPayload(params: [string]) {
    let [payloadId]: any = params

    payloadId = toType(payloadId, TypeOutput.BN)

    return `Not implemented yet.`
  }
  /**
   * Verifies the payload according to the execution environment rule set (EIP-3675)
   * and returns the status of the verification.
   *
   * @param params An array of one parameter:
   *   1. An object as an instance of {@link ExecutionPayload}
   * @returns An object:
   *   1. status: String - the result of the payload execution
   *        VALID - given payload is valid
   *        INVALID - given payload is invalid
   *        SYNCING - sync process is in progress
   */
  async executePayload(params: [ExecutionPayload]) {
    if (!this.client.config.synchronized) {
      return { STATUS: 'SYNCING' }
    }

    const [blockData] = params

    Block.fromBlockData(blockData as any, { common: this.client.config.chainCommon })

    return `Not implemented yet`
  }

  /**
   * Communicates that full consensus validation of an execution payload
   * is complete along with its corresponding status.
   *
   * @param params An array of one parameter:
   *   1. An object - Payload validity status with respect to the consensus rules:
   *        blockHash - block hash value of the payload
   *        status: String: VALID|INVALID - result of the payload validation with respect to the proof-of-stake consensus rules
   * @returns None or an error
   */
  async consensusValidated(params: [{ blockHash: string; status: string }]) {
    let [blockHash]: any = params[0]

    blockHash = toType(blockHash, TypeOutput.Buffer)

    return `Not implemented yet.`
  }

  /**
   * Propagates the change in the fork choice to the execution client.
   *
   * @param params An array of one parameter:
   *   1. An object - The state of the fork choice:
   *        headBlockHash - block hash of the head of the canonical chain
   *        finalizedBlockHash - block hash of the most recent finalized block
   * @returns None or an error
   */
  async forkchoiceUpdated(params: [{ headBlockHash: string; finalizedBlockHash: string }]) {
    let [headBlockHash, finalizedBlockHash]: any = params[0]

    headBlockHash = toType(headBlockHash, TypeOutput.Buffer)
    finalizedBlockHash = toType(finalizedBlockHash, TypeOutput.Buffer)

    return `Not implemented yet`
  }
}
