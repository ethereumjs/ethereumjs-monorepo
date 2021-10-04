import { Block, HeaderData } from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { Address, BN, toBuffer, toType, TypeOutput, bufferToHex, intToHex } from 'ethereumjs-util'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { encode } from 'rlp'
import { middleware, validators } from '../validation'
import type VM from '@ethereumjs/vm'
import type EthereumClient from '../../client'
import type { Chain } from '../../blockchain'
import type { Config } from '../../config'
import type { EthereumService } from '../../service'
import type { FullSynchronizer } from '../../sync'
import type { TxPool } from '../../sync/txpool'

enum Status {
  VALID = 'VALID',
  INVALID = 'INVALID',
  SYNCING = 'SYNCING',
}

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
  executionPayload?: ExecutionPayload
  block?: Block
}

const EngineError = {
  ActionNotAllowed: {
    code: 2,
    message: 'Action not allowed',
  },
  UnknownHeader: {
    code: 4,
    message: 'Unknown header',
  },
  UnknownPayload: {
    code: 5,
    message: 'Unknown payload',
  },
  TimeExceeded: {
    code: -999, // TODO need proper code if error is added to spec, otherwise spec says to use ActionNotAllowed
    message: 'Time allowance exceeded (Date.now() > timestamp + SECONDS_PER_SLOT)',
  },
}

/**
 *  Finds a block in validBlocks or the blockchain, otherwise throws UnknownHeader.
 */
const findBlock = async (hash: Buffer, validBlocks: Map<String, Block>, chain: Chain) => {
  const parentBlock = validBlocks.get(hash.toString('hex'))
  if (parentBlock) {
    return parentBlock
  } else {
    // search in chain
    const parentBlock = await chain.getBlock(hash)
    if (parentBlock) {
      return parentBlock
    } else {
      throw EngineError.UnknownHeader
    }
  }
}

/**
 * Recursively finds parent blocks starting from the parentHash.
 */
const recursivelyFindParents = async (
  vmHeadHash: Buffer,
  parentHash: Buffer,
  validBlocks: Map<String, Block>,
  chain: Chain
) => {
  if (parentHash.equals(vmHeadHash)) {
    return []
  }
  const parentBlocks = []
  const block = await findBlock(parentHash, validBlocks, chain)
  parentBlocks.push(block)
  while (!vmHeadHash.equals(parentBlocks[parentBlocks.length - 1].header.parentHash)) {
    const block: Block = await findBlock(
      parentBlocks[parentBlocks.length - 1].header.parentHash,
      validBlocks,
      chain
    )
    parentBlocks.push(block)
  }
  return parentBlocks
}

/**
 * Calculates and returns the transactionsTrie for the block.
 */
const transactionsTrie = async (transactions: TypedTransaction[]) => {
  const trie = new Trie()
  for (const [i, tx] of transactions.entries()) {
    await trie.put(encode(i), tx.serialize())
  }
  return trie.root
}

/**
 * engine_* RPC module
 * @memberof module:rpc/modules
 */
export class Engine {
  private SECONDS_PER_SLOT = new BN(12) // from beacon chain mainnet config
  private client: EthereumClient
  private chain: Chain
  private config: Config
  private vm: VM
  private txPool: TxPool
  private pendingPayloads: Map<Number, PayloadCache> // payloadId, payload
  private validBlocks: Map<String, Block> // blockHash, block
  private nextPayloadId = 0

  /**
   * Create engine_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this.chain = service.chain
    this.config = this.chain.config
    this.vm = (service.synchronizer as FullSynchronizer).execution?.vm
    this.txPool = (service.synchronizer as FullSynchronizer).txPool
    this.pendingPayloads = new Map()
    this.validBlocks = new Map()

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

    const payload = {
      parentHash: toBuffer(parentHash),
      timestamp: toType(timestamp, TypeOutput.BN),
      random: toBuffer(random),
      feeRecipient: Address.fromString(feeRecipient),
    }

    const payloadId = this.nextPayloadId.valueOf() // clone with valueOf()
    this.pendingPayloads.set(payloadId, payload)
    this.nextPayloadId++

    return { payloadId: intToHex(payloadId) }
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
    if (!this.client.config.synchronized) {
      return EngineError.ActionNotAllowed // TODO: EngineError.SyncInProgress?
    }

    let [payloadId]: any = params

    payloadId = toType(payloadId, TypeOutput.Number)

    const payload = this.pendingPayloads.get(payloadId)
    if (!payload) {
      throw EngineError.UnknownPayload
    }

    const { parentHash, timestamp, feeRecipient: coinbase } = payload

    if (new BN(Date.now()).divn(1000).gt(timestamp.add(this.SECONDS_PER_SLOT))) {
      throw EngineError.TimeExceeded
    }

    // Use a copy of the vm to not modify the existing state.
    // The state will be updated when the newly assembled block
    // is inserted into the canonical chain.
    const vmCopy = this.vm.copy()

    const vmHead = await vmCopy.blockchain.getLatestBlock()
    const parentBlocks = await recursivelyFindParents(
      vmHead.hash(),
      parentHash,
      this.validBlocks,
      this.chain
    )

    for (const parent of parentBlocks.reverse()) {
      await vmCopy.runBlock({ block: parent })
      await vmCopy.blockchain.putBlock(parent)
    }

    const parentBlock = await vmCopy.blockchain.getBlock(parentHash)
    const number = parentBlock.header.number.addn(1)
    const { gasLimit } = parentBlock.header
    const baseFeePerGas = parentBlock.header.calcNextBaseFee()

    // Set the state root to ensure the resulting state
    // is based on the parent block's state
    await vmCopy.stateManager.setStateRoot(parentBlock.header.stateRoot)

    const blockBuilder = await vmCopy.buildBlock({
      parentBlock,
      headerData: {
        timestamp,
        number,
        gasLimit,
        baseFeePerGas,
        coinbase,
      },
    })

    const txs = await this.txPool.txsByPriceAndNonce(vmCopy.stateManager, baseFeePerGas)
    this.config.logger.info(
      `Engine: Assembling block from ${txs.length} eligible txs (baseFee: ${baseFeePerGas})`
    )

    let index = 0
    let blockFull = false
    while (index < txs.length && !blockFull) {
      try {
        await blockBuilder.addTransaction(txs[index])
      } catch (error: any) {
        if (error.message === 'tx has a higher gas limit than the remaining gas in the block') {
          if (blockBuilder.gasUsed.gt(gasLimit.subn(21000))) {
            // If block has less than 21000 gas remaining, consider it full
            blockFull = true
            this.config.logger.info(
              `Engine: Assembled block full (gasLeft: ${gasLimit.sub(blockBuilder.gasUsed)})`
            )
          }
        } else {
          // If there is an error adding a tx, it will be skipped
          const hash = bufferToHex(txs[index].hash())
          this.config.logger.debug(
            `Skipping tx ${hash}, error encountered when trying to add tx:\n${error}`
          )
        }
      }
      index++
    }

    const block = await blockBuilder.build()
    const json = block.toJSON()
    const header: any = json.header
    const transactions = json.transactions ?? []

    // reassign aliased fields
    header.blockNumber = header.number
    delete header.number
    header.receiptRoot = header.receiptTrie
    delete header.receiptTrie
    // remove unneeded legacy fields
    delete header.uncleHash
    delete header.difficulty
    delete header.mixHash
    delete header.nonce
    // remove deprecated block fields, remove in next major release
    delete header.bloom
    delete header.baseFee

    const executionPayload: ExecutionPayload = {
      ...header,
      random: bufferToHex(payload.random),
      blockHash: bufferToHex(block.hash()),
      transactions,
    }

    this.pendingPayloads.delete(payloadId)
    this.validBlocks.set(block.hash().toString('hex'), block)

    return executionPayload
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
    if (!this.config.synchronized) {
      return { status: Status.SYNCING }
    }

    const [payloadData] = params

    const transactions = []
    for (const [index, serializedTx] of payloadData.transactions.entries()) {
      try {
        const tx = TransactionFactory.fromSerializedData(toBuffer(serializedTx), {
          common: this.config.chainCommon,
        })
        transactions.push(tx)
      } catch (error) {
        this.config.logger.error(`Invalid tx at index ${index}: ${error}`)
        return { status: Status.INVALID }
      }
    }

    // Format block header
    const header: HeaderData = {
      ...payloadData,
      number: payloadData.blockNumber,
      receiptTrie: payloadData.receiptRoot,
      transactionsTrie: await transactionsTrie(transactions),
    }

    let block
    try {
      block = Block.fromBlockData({ header, transactions }, { common: this.config.chainCommon })
    } catch (error) {
      this.config.logger.debug(`Error verifying block: ${error}`)
      return { status: Status.INVALID }
    }

    const vmCopy = this.vm.copy()

    const vmHeadHash = (await vmCopy.blockchain.getLatestHeader()).hash()
    const parentBlocks = await recursivelyFindParents(
      vmHeadHash,
      block.header.parentHash,
      this.validBlocks,
      this.chain
    )

    for (const parent of parentBlocks.reverse()) {
      await vmCopy.runBlock({ block: parent })
      await vmCopy.blockchain.putBlock(parent)
    }

    try {
      await vmCopy.runBlock({ block })
    } catch (error) {
      this.config.logger.debug(`Error verifying block: ${error}`)
      return { status: Status.INVALID }
    }

    this.validBlocks.set(block.hash().toString('hex'), block)

    return { status: Status.VALID }
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
    let { blockHash, status }: any = params[0]

    blockHash = toType(blockHash, TypeOutput.Buffer)
    status = (Status as any)[status]

    const block = this.validBlocks.get(blockHash)

    if (!block && status === Status.VALID) {
      throw EngineError.UnknownHeader
    }

    if (block && status === Status.INVALID) {
      this.validBlocks.delete(block.hash().toString('hex'))
    }

    return null
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

    const headBlock = this.validBlocks.get(headBlockHash)
    if (!headBlock) {
      throw EngineError.UnknownHeader
    }

    if (finalizedBlockHash.equals(Buffer.alloc(32))) {
      // All zeros means no finalized block yet
    } else {
      const finalizedBlock = this.validBlocks.get(finalizedBlockHash)
      if (!finalizedBlock) {
        throw EngineError.UnknownHeader
      }
      if (!this.chain.mergeFirstFinalizedBlockNumber) {
        this.chain.mergeFirstFinalizedBlockNumber = finalizedBlock.header.number
      }
    }

    await this.chain.putBlocks([headBlock])

    return null
  }
}
