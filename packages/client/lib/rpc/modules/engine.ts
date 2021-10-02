import { Block } from '@ethereumjs/block'
import { Address, BN, toBuffer, toType, TypeOutput } from 'ethereumjs-util'
import { middleware, validators } from '../validation'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import type { EthereumService } from '../../service'
import type VM from '@ethereumjs/vm'

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

type PreparePayloadParamsObject = {
  parentHash: string
  timestamp: string
  random: string
  feeRecipient: string
}

type PayloadCache = {
  parentHash: Buffer
  timestamp: BN
  random: Buffer
  feeRecipient: Address
}

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private client: EthereumClient
  private _chain: Chain
  private _vm: VM | undefined
  private payloadCache: Map<BN, PayloadCache>
  private nextPayloadId = new BN(0)

  /**
   * Create engine_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._vm = (service.synchronizer as any)?.execution?.vm
    this.payloadCache = new Map()

    this.preparePayload = middleware(this.preparePayload.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          timestamp: validators.hex,
          random: validators.hex,
          feeRecipient: validators.address,
        }),
      ],
    ])
    this.getPayload = middleware(this.getPayload.bind(this), 1, [[validators.hex]])
    this.executePayload = middleware(this.executePayload.bind(this), 1, [
      [
        validators.object({
          parentHash: validators.blockHash,
          coinbase: validators.address,
          stateRoot: validators.hex,
          receiptRoot: validators.hex,
          logsBloom: validators.hex,
          random: validators.hex,
          blockNumber: validators.hex,
          gasLimit: validators.hex,
          gasUsed: validators.hex,
          timestamp: validators.hex,
          extraData: validators.hex,
          baseFeePerGas: validators.hex,
          blockHash: validators.blockHash,
          transactions: validators.array(validators.hex),
        }),
      ],
    ])
    this.consensusValidated = middleware(this.consensusValidated.bind(this), 1, [
      [
        validators.object({
          blockHash: validators.blockHash,
          status: validators.values(['VALID', 'INVALID']),
        }),
      ],
    ])
    this.forkchoiceUpdated = middleware(this.forkchoiceUpdated.bind(this), 1, [
      [
        validators.object({
          headBlockHash: validators.blockHash,
          finalizedBlockHash: validators.blockHash,
        }),
      ],
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
   * @returns A response object or an error. Response object:
   *       * payloadId - identifier of the payload building process
   */
  async preparePayload(params: [PreparePayloadParamsObject]) {
    const { parentHash, timestamp, random, feeRecipient } = params[0]

    const payloadCache = {
      parentHash: toBuffer(parentHash),
      timestamp: toType(timestamp, TypeOutput.BN),
      random: toBuffer(random),
      feeRecipient: Address.fromString(feeRecipient),
    }

    const payloadId = this.nextPayloadId.clone()
    this.payloadCache.set(payloadId, payloadCache)
    this.nextPayloadId.iaddn(1)
    return { payloadId: `0x${payloadId.toString('hex')}` }
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

    const payloadCache = this.payloadCache.get(payloadId)
    if (!payloadCache) {
      // https://notes.ethereum.org/@9AeMAlpyQYaAAyuj47BzRw/rkwW3ceVY#unknown-payload
      throw {
        code: 5,
        message: 'unknown payload',
      }
    }

    // Assemble block and return toJSON() with random, transactions
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
      return { status: 'SYNCING' }
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
    let { blockHash }: any = params[0]
    const { status } = params[0]

    blockHash = toType(blockHash, TypeOutput.Buffer)

    const blockHashFound = false
    if (!blockHashFound) {
      // https://notes.ethereum.org/@9AeMAlpyQYaAAyuj47BzRw/rkwW3ceVY#unknown-header
      throw {
        code: 4,
        message: 'unknown header',
      }
    }

    return `Not implemented yet. ${blockHash}, ${status}`
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

    return `Not implemented yet. ${headBlockHash}, ${finalizedBlockHash}`
  }
}
