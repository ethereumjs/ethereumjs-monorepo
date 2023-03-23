import { Block, BlockHeader, getDifficulty, valuesArrayToHeaderData } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { BlobEIP4844Transaction, TransactionFactory } from '@ethereumjs/tx'
import {
  arrToBufArr,
  bigIntToUnpaddedBuffer,
  bufArrToArr,
  bufferToBigInt,
  bufferToInt,
  intToUnpaddedBuffer,
} from '@ethereumjs/util'
import { encodeReceipt } from '@ethereumjs/vm/dist/runBlock'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { TxReceiptWithType } from '../../execution/receipt'
import type { Message, ProtocolOptions } from './protocol'
import type { BlockBodyBuffer, BlockBuffer, BlockHeaderBuffer } from '@ethereumjs/block'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { BigIntLike } from '@ethereumjs/util'
import type { PostByzantiumTxReceipt, PreByzantiumTxReceipt, TxReceipt } from '@ethereumjs/vm'

interface EthProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

type GetBlockHeadersOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The block's number or hash */
  block: bigint | Buffer
  /* Max number of blocks to return */
  max: number
  /* Number of blocks to skip apart (default: 0) */
  skip?: number
  /* Fetch blocks in reverse (default: false) */
  reverse?: boolean
}

type GetBlockBodiesOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The block hashes */
  hashes: Buffer[]
}

type GetPooledTransactionsOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The tx hashes */
  hashes: Buffer[]
}

type GetReceiptsOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The block hashes to request receipts for */
  hashes: Buffer[]
}

/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface EthProtocolMethods {
  getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<[bigint, BlockHeader[]]>
  getBlockBodies: (opts: GetBlockBodiesOpts) => Promise<[bigint, BlockBodyBuffer[]]>
  getPooledTransactions: (opts: GetPooledTransactionsOpts) => Promise<[bigint, TypedTransaction[]]>
  getReceipts: (opts: GetReceiptsOpts) => Promise<[bigint, TxReceipt[]]>
}

/**
 * Implements eth/66 protocol
 * @memberof module:net/protocol
 */
export class EthProtocol extends Protocol {
  private chain: Chain
  private nextReqId = BigInt(0)
  private chainTTD?: BigIntLike

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'NewBlockHashes',
      code: 0x01,
      encode: (hashes: any[]) => hashes.map((hn) => [hn[0], bigIntToUnpaddedBuffer(hn[1])]),
      decode: (hashes: any[]) => hashes.map((hn) => [hn[0], bufferToBigInt(hn[1])]),
    },
    {
      name: 'Transactions',
      code: 0x02,
      encode: (txs: TypedTransaction[]) => {
        const serializedTxs = []
        for (const tx of txs) {
          // Don't automatically broadcast blob transactions - they should only be announced using NewPooledTransactionHashes
          if (tx instanceof BlobEIP4844Transaction) continue
          serializedTxs.push(tx.serialize())
        }
        return serializedTxs
      },
      decode: (txs: Buffer[]) => {
        if (!this.config.synchronized) return
        const common = this.config.chainCommon.copy()
        common.setHardforkByBlockNumber(
          this.chain.headers.latest?.number ?? // Use latest header number if available OR
            this.config.syncTargetHeight ?? // Use sync target height if available OR
            common.hardforkBlock(common.hardfork()) ?? // Use current hardfork block number OR
            BigInt(0), // Use chainstart,
          undefined,
          this.chain.headers.latest?.timestamp ?? Math.floor(Date.now() / 1000)
        )
        return txs.map((txData) => TransactionFactory.fromSerializedData(txData, { common }))
      },
    },
    {
      name: 'GetBlockHeaders',
      code: 0x03,
      response: 0x04,
      encode: ({ reqId, block, max, skip = 0, reverse = false }: GetBlockHeadersOpts) => [
        bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
        [
          typeof block === 'bigint' ? bigIntToUnpaddedBuffer(block) : block,
          intToUnpaddedBuffer(max),
          intToUnpaddedBuffer(skip),
          intToUnpaddedBuffer(!reverse ? 0 : 1),
        ],
      ],
      decode: ([reqId, [block, max, skip, reverse]]: any) => ({
        reqId: bufferToBigInt(reqId),
        block: block.length === 32 ? block : bufferToBigInt(block),
        max: bufferToInt(max),
        skip: bufferToInt(skip),
        reverse: bufferToInt(reverse) === 0 ? false : true,
      }),
    },
    {
      name: 'BlockHeaders',
      code: 0x04,
      encode: ({ reqId, headers }: { reqId: bigint; headers: BlockHeader[] }) => [
        bigIntToUnpaddedBuffer(reqId),
        headers.map((h) => h.raw()),
      ],
      decode: ([reqId, headers]: [Buffer, BlockHeaderBuffer[]]) => [
        bufferToBigInt(reqId),
        headers.map((h) => {
          const headerData = valuesArrayToHeaderData(h)
          const difficulty = getDifficulty(headerData)!
          const common = this.config.chainCommon
          // If this is a post merge block, we can still send chainTTD since it would still lead
          // to correct hardfork choice
          const header = BlockHeader.fromValuesArray(
            h,
            difficulty > 0
              ? { common, hardforkByBlockNumber: true }
              : { common, hardforkByTTD: this.chainTTD }
          )
          return header
        }),
      ],
    },
    {
      name: 'GetBlockBodies',
      code: 0x05,
      response: 0x06,
      encode: ({ reqId, hashes }: GetBlockBodiesOpts) => [
        bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: bufferToBigInt(reqId),
        hashes,
      }),
    },
    {
      name: 'BlockBodies',
      code: 0x06,
      encode: ({ reqId, bodies }: { reqId: bigint; bodies: BlockBodyBuffer[] }) => [
        bigIntToUnpaddedBuffer(reqId),
        bodies,
      ],
      decode: ([reqId, bodies]: [Buffer, BlockBodyBuffer[]]) => [bufferToBigInt(reqId), bodies],
    },
    {
      name: 'NewBlock',
      code: 0x07,
      encode: ([block, td]: [Block, bigint]) => [block.raw(), bigIntToUnpaddedBuffer(td)],
      decode: ([block, td]: [BlockBuffer, Buffer]) => [
        Block.fromValuesArray(block, {
          common: this.config.chainCommon,
          hardforkByBlockNumber: true,
        }),
        td,
      ],
    },
    {
      name: 'NewPooledTransactionHashes',
      code: 0x08,
      encode: (hashes: Buffer[]) => hashes,
      decode: (hashes: Buffer[]) => hashes,
    },
    {
      name: 'GetPooledTransactions',
      code: 0x09,
      response: 0x0a,
      encode: ({ reqId, hashes }: GetPooledTransactionsOpts) => [
        bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: bufferToBigInt(reqId),
        hashes,
      }),
    },
    {
      name: 'PooledTransactions',
      code: 0x0a,
      encode: ({ reqId, txs }: { reqId: bigint; txs: TypedTransaction[] }) => {
        const serializedTxs = []
        for (const tx of txs) {
          switch (tx.type) {
            case 0:
              serializedTxs.push(tx.raw())
              break
            case 5:
              serializedTxs.push((tx as BlobEIP4844Transaction).serializeNetworkWrapper())
              break
            default:
              serializedTxs.push(tx.serialize())
              break
          }
        }
        return [bigIntToUnpaddedBuffer(reqId), serializedTxs]
      },
      decode: ([reqId, txs]: [Buffer, any[]]) => {
        const common = this.config.chainCommon.copy()
        common.setHardforkByBlockNumber(
          this.chain.headers.latest?.number ?? // Use latest header number if available OR
            this.config.syncTargetHeight ?? // Use sync target height if available OR
            common.hardforkBlock(common.hardfork()) ?? // Use current hardfork block number OR
            BigInt(0), // Use chainstart,
          undefined,
          this.chain.headers.latest?.timestamp ?? Math.floor(Date.now() / 1000)
        )
        return [
          bufferToBigInt(reqId),
          txs.map((txData) => {
            if (txData[0] === 5) {
              // Blob transactions are deserialized with network wrapper
              return BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txData)
            }
            return TransactionFactory.fromBlockBodyData(txData)
          }),
        ]
      },
    },
    {
      name: 'GetReceipts',
      code: 0x0f,
      response: 0x10,
      encode: ({ reqId, hashes }: { reqId: bigint; hashes: Buffer[] }) => [
        bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: bufferToBigInt(reqId),
        hashes,
      }),
    },
    {
      name: 'Receipts',
      code: 0x10,
      encode: ({ reqId, receipts }: { reqId: bigint; receipts: TxReceiptWithType[] }) => {
        const serializedReceipts = []
        for (const receipt of receipts) {
          const encodedReceipt = encodeReceipt(receipt, receipt.txType)
          serializedReceipts.push(encodedReceipt)
        }
        return [bigIntToUnpaddedBuffer(reqId), serializedReceipts]
      },
      decode: ([reqId, receipts]: [Buffer, Buffer[]]) => [
        bufferToBigInt(reqId),
        receipts.map((r) => {
          // Legacy receipt if r[0] >= 0xc0, otherwise typed receipt with first byte as TransactionType
          const decoded = arrToBufArr(RLP.decode(bufArrToArr(r[0] >= 0xc0 ? r : r.slice(1)))) as any
          const [stateRootOrStatus, cumulativeGasUsed, logsBloom, logs] = decoded
          const receipt = {
            cumulativeBlockGasUsed: bufferToBigInt(cumulativeGasUsed),
            bitvector: logsBloom,
            logs,
          } as TxReceipt
          if (stateRootOrStatus.length === 32) {
            ;(receipt as PreByzantiumTxReceipt).stateRoot = stateRootOrStatus
          } else {
            ;(receipt as PostByzantiumTxReceipt).status = bufferToInt(stateRootOrStatus) as 0 | 1
          }
          return receipt
        }),
      ],
    },
  ]

  /**
   * Create eth protocol
   */
  constructor(options: EthProtocolOptions) {
    super(options)

    this.chain = options.chain
    const chainTTD = this.config.chainCommon.hardforkTTD(Hardfork.Merge)
    if (chainTTD !== null && chainTTD !== undefined) {
      this.chainTTD = chainTTD
    }
  }

  /**
   * Name of protocol
   */
  get name() {
    return 'eth'
  }

  /**
   * Protocol versions supported
   */
  get versions() {
    return [66]
  }

  /**
   * Messages defined by this protocol
   */
  get messages() {
    return this.protocolMessages
  }

  /**
   * Opens protocol and any associated dependencies
   */
  async open(): Promise<boolean | void> {
    if (this.opened) {
      return false
    }
    await this.chain.open()
    this.opened = true
  }

  /**
   * Encodes status into ETH status message payload
   */
  encodeStatus(): any {
    return {
      networkId: bigIntToUnpaddedBuffer(this.chain.networkId),
      td: bigIntToUnpaddedBuffer(this.chain.blocks.td),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash(),
      latestBlock: bigIntToUnpaddedBuffer(this.chain.blocks.latest!.header.number),
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param status status message payload
   */
  decodeStatus(status: any): any {
    return {
      networkId: bufferToBigInt(status.networkId),
      td: bufferToBigInt(status.td),
      bestHash: status.bestHash,
      genesisHash: status.genesisHash,
    }
  }
}
