import { Block, BlockHeader, getDifficulty, valuesArrayToHeaderData } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { BlobEIP4844Transaction, TransactionFactory } from '@ethereumjs/tx'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { encodeReceipt } from '@ethereumjs/vm/dist/runBlock'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { TxReceiptWithType } from '../../execution/receipt'
import type { Message, ProtocolOptions } from './protocol'
import type { BlockBodyBytes, BlockBytes, BlockHeaderBytes } from '@ethereumjs/block'
import type { Log } from '@ethereumjs/evm'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { BigIntLike, NestedUint8Array } from '@ethereumjs/util'
import type { PostByzantiumTxReceipt, PreByzantiumTxReceipt, TxReceipt } from '@ethereumjs/vm'

interface EthProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

type GetBlockHeadersOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The block's number or hash */
  block: bigint | Uint8Array
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
  hashes: Uint8Array[]
}

type GetPooledTransactionsOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The tx hashes */
  hashes: Uint8Array[]
}

type GetReceiptsOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  /* The block hashes to request receipts for */
  hashes: Uint8Array[]
}

/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface EthProtocolMethods {
  getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<[bigint, BlockHeader[]]>
  getBlockBodies: (opts: GetBlockBodiesOpts) => Promise<[bigint, BlockBodyBytes[]]>
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
      encode: (hashes: any[]) => hashes.map((hn) => [hn[0], bigIntToUnpaddedBytes(hn[1])]),
      decode: (hashes: any[]) => hashes.map((hn) => [hn[0], bytesToBigInt(hn[1])]),
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
      decode: (txs: Uint8Array[]) => {
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
        bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
        [
          typeof block === 'bigint' ? bigIntToUnpaddedBytes(block) : block,
          intToUnpaddedBytes(max),
          intToUnpaddedBytes(skip),
          intToUnpaddedBytes(!reverse ? 0 : 1),
        ],
      ],
      decode: ([reqId, [block, max, skip, reverse]]: any) => ({
        reqId: bytesToBigInt(reqId),
        block: block.length === 32 ? block : bytesToBigInt(block),
        max: bytesToInt(max),
        skip: bytesToInt(skip),
        reverse: bytesToInt(reverse) === 0 ? false : true,
      }),
    },
    {
      name: 'BlockHeaders',
      code: 0x04,
      encode: ({ reqId, headers }: { reqId: bigint; headers: BlockHeader[] }) => [
        bigIntToUnpaddedBytes(reqId),
        headers.map((h) => h.raw()),
      ],
      decode: ([reqId, headers]: [Uint8Array, BlockHeaderBytes[]]) => [
        bytesToBigInt(reqId),
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
        bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Uint8Array, Uint8Array[]]) => ({
        reqId: bytesToBigInt(reqId),
        hashes,
      }),
    },
    {
      name: 'BlockBodies',
      code: 0x06,
      encode: ({ reqId, bodies }: { reqId: bigint; bodies: BlockBodyBytes[] }) => [
        bigIntToUnpaddedBytes(reqId),
        bodies,
      ],
      decode: ([reqId, bodies]: [Uint8Array, BlockBodyBytes[]]) => [bytesToBigInt(reqId), bodies],
    },
    {
      name: 'NewBlock',
      code: 0x07,
      encode: ([block, td]: [Block, bigint]) => [block.raw(), bigIntToUnpaddedBytes(td)],
      decode: ([block, td]: [BlockBytes, Uint8Array]) => [
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
      encode: (hashes: Uint8Array[]) => hashes,
      decode: (hashes: Uint8Array[]) => hashes,
    },
    {
      name: 'GetPooledTransactions',
      code: 0x09,
      response: 0x0a,
      encode: ({ reqId, hashes }: GetPooledTransactionsOpts) => [
        bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Uint8Array, Uint8Array[]]) => ({
        reqId: bytesToBigInt(reqId),
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
        return [bigIntToUnpaddedBytes(reqId), serializedTxs]
      },
      decode: ([reqId, txs]: [Uint8Array, any[]]) => {
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
          bytesToBigInt(reqId),
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
      encode: ({ reqId, hashes }: { reqId: bigint; hashes: Uint8Array[] }) => [
        bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
        hashes,
      ],
      decode: ([reqId, hashes]: [Uint8Array, Uint8Array[]]) => ({
        reqId: bytesToBigInt(reqId),
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
        return [bigIntToUnpaddedBytes(reqId), serializedReceipts]
      },
      decode: ([reqId, receipts]: [Uint8Array, Uint8Array[]]) => [
        bytesToBigInt(reqId),
        receipts.map((r) => {
          // Legacy receipt if r[0] >= 0xc0, otherwise typed receipt with first byte as TransactionType
          const decoded = RLP.decode(r[0] >= 0xc0 ? r : r.subarray(1)) as NestedUint8Array
          const [stateRootOrStatus, cumulativeGasUsed, logsBloom, logs] = decoded as [
            Uint8Array,
            Uint8Array,
            Uint8Array,
            Log[]
          ]
          const receipt = {
            cumulativeBlockGasUsed: bytesToBigInt(cumulativeGasUsed),
            bitvector: logsBloom,
            logs,
          } as TxReceipt
          if (stateRootOrStatus.length === 32) {
            ;(receipt as PreByzantiumTxReceipt).stateRoot = stateRootOrStatus
          } else {
            ;(receipt as PostByzantiumTxReceipt).status = bytesToInt(stateRootOrStatus) as 0 | 1
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
    const chainTTD = this.config.chainCommon.hardforkTTD(Hardfork.Paris)
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
      networkId: bigIntToUnpaddedBytes(this.chain.networkId),
      td: bigIntToUnpaddedBytes(this.chain.blocks.td),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash(),
      latestBlock: bigIntToUnpaddedBytes(this.chain.blocks.latest!.header.number),
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param status status message payload
   */
  decodeStatus(status: any): any {
    return {
      networkId: bytesToBigInt(status.networkId),
      td: bytesToBigInt(status.td),
      bestHash: status.bestHash,
      genesisHash: status.genesisHash,
    }
  }
}
