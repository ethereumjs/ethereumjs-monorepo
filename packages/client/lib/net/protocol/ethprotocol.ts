import {
  Block,
  BlockBuffer,
  BlockHeader,
  BlockHeaderBuffer,
  BlockBodyBuffer,
} from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { encodeReceipt } from '@ethereumjs/vm/dist/runBlock'
import {
  arrToBufArr,
  bigIntToBuffer,
  bufArrToArr,
  bufferToBigInt,
  bufferToInt,
  intToBuffer,
} from '@ethereumjs/util'
import RLP from 'rlp'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'
import type { TxReceiptWithType } from '../../execution/receipt'
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

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'NewBlockHashes',
      code: 0x01,
      encode: (hashes: any[]) => hashes.map((hn) => [hn[0], bigIntToBuffer(hn[1])]),
      decode: (hashes: any[]) => hashes.map((hn) => [hn[0], bufferToBigInt(hn[1])]),
    },
    {
      name: 'Transactions',
      code: 0x02,
      encode: (txs: TypedTransaction[]) => {
        const serializedTxs = []
        for (const tx of txs) {
          if (tx.type === 0) {
            serializedTxs.push(tx.raw())
          } else {
            serializedTxs.push(tx.serialize())
          }
        }
        return serializedTxs
      },
      decode: ([txs]: [Buffer[]]) => {
        // TODO: add proper Common instance (problem: service not accessible)
        //const common = this.config.chainCommon.copy()
        //common.setHardforkByBlockNumber(this.config.syncTargetHeight, this.chain.headers.td)
        return txs.map((txData) => TransactionFactory.fromBlockBodyData(txData))
      },
    },
    {
      name: 'GetBlockHeaders',
      code: 0x03,
      response: 0x04,
      encode: ({ reqId, block, max, skip = 0, reverse = false }: GetBlockHeadersOpts) => [
        bigIntToBuffer(reqId ?? ++this.nextReqId),
        [
          typeof block === 'bigint' ? bigIntToBuffer(block) : block,
          max === 0 ? Buffer.from([]) : intToBuffer(max),
          skip === 0 ? Buffer.from([]) : intToBuffer(skip),
          !reverse ? Buffer.from([]) : Buffer.from([1]),
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
        bigIntToBuffer(reqId),
        headers.map((h) => h.raw()),
      ],
      decode: ([reqId, headers]: [Buffer, BlockHeaderBuffer[]]) => [
        bufferToBigInt(reqId),
        headers.map((h) =>
          // TODO: need to implement hardforkByTD otherwise
          // pre-merge blocks will fail to init if chainCommon is past merge
          // and we request pre-mergs blocks (e.g. if we have a different terminal block
          // and we look backwards for the correct block)
          BlockHeader.fromValuesArray(h, {
            hardforkByBlockNumber: true,
            common: this.config.chainCommon,
          })
        ),
      ],
    },
    {
      name: 'GetBlockBodies',
      code: 0x05,
      response: 0x06,
      encode: ({ reqId, hashes }: GetBlockBodiesOpts) => [
        bigIntToBuffer(reqId ?? ++this.nextReqId),
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
        bigIntToBuffer(reqId),
        bodies,
      ],
      decode: ([reqId, bodies]: [Buffer, BlockBodyBuffer[]]) => [bufferToBigInt(reqId), bodies],
    },
    {
      name: 'NewBlock',
      code: 0x07,
      encode: ([block, td]: [Block, bigint]) => [block.raw(), bigIntToBuffer(td)],
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
    },
    {
      name: 'GetPooledTransactions',
      code: 0x09,
      response: 0x0a,
      encode: ({ reqId, hashes }: GetPooledTransactionsOpts) => [
        bigIntToBuffer(reqId ?? ++this.nextReqId),
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
          if (tx.type === 0) {
            serializedTxs.push(tx.raw())
          } else {
            serializedTxs.push(tx.serialize())
          }
        }
        return [bigIntToBuffer(reqId), serializedTxs]
      },
      decode: ([reqId, txs]: [Buffer, any[]]) => [
        bufferToBigInt(reqId),
        // TODO: add proper Common instance (problem: service not accesible)
        //const common = this.config.chainCommon.copy()
        //common.setHardforkByBlockNumber(this.config.syncTargetHeight)
        txs.map((txData) => TransactionFactory.fromBlockBodyData(txData)),
      ],
    },
    {
      name: 'GetReceipts',
      code: 0x0f,
      response: 0x10,
      encode: ({ reqId, hashes }: { reqId: bigint; hashes: Buffer[] }) => [
        bigIntToBuffer(reqId ?? ++this.nextReqId),
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
        return [bigIntToBuffer(reqId), serializedReceipts]
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
      networkId: bigIntToBuffer(this.chain.networkId),
      td:
        this.chain.blocks.td === BigInt(0) ? Buffer.from([]) : bigIntToBuffer(this.chain.blocks.td),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash(),
      latestBlock: bigIntToBuffer(this.chain.blocks.latest!.header.number),
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
