import {
  Block,
  BlockBuffer,
  BlockHeader,
  BlockHeaderBuffer,
  BlockBodyBuffer,
} from '@ethereumjs/block'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'
import { BN, bufferToInt, intToBuffer, rlp } from 'ethereumjs-util'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'
import type { TxReceiptWithType } from '../../execution/receipt'
import type {
  PostByzantiumTxReceipt,
  PreByzantiumTxReceipt,
  TxReceipt,
} from '@ethereumjs/vm/dist/types'

interface EthProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

type GetBlockHeadersOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  /* The block's number or hash */
  block: BN | Buffer
  /* Max number of blocks to return */
  max: number
  /* Number of blocks to skip apart (default: 0) */
  skip?: number
  /* Fetch blocks in reverse (default: false) */
  reverse?: boolean
}

type GetBlockBodiesOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  /* The block hashes */
  hashes: Buffer[]
}

type GetPooledTransactionsOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  /* The tx hashes */
  hashes: Buffer[]
}

type GetReceiptsOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  /* The block hashes to request receipts for */
  hashes: Buffer[]
}

/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface EthProtocolMethods {
  getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<[BN, BlockHeader[]]>
  getBlockBodies: (opts: GetBlockBodiesOpts) => Promise<[BN, BlockBodyBuffer[]]>
  getPooledTransactions: (opts: GetPooledTransactionsOpts) => Promise<[BN, TypedTransaction[]]>
  getReceipts: (opts: GetReceiptsOpts) => Promise<[BN, TxReceipt[]]>
}

/**
 * Implements eth/66 protocol
 * @memberof module:net/protocol
 */
export class EthProtocol extends Protocol {
  private chain: Chain
  private nextReqId = new BN(0)

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'NewBlockHashes',
      code: 0x01,
      encode: (hashes: any[]) => hashes.map((hn) => [hn[0], hn[1].toArrayLike(Buffer)]),
      decode: (hashes: any[]) => hashes.map((hn) => [hn[0], new BN(hn[1])]),
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
        // TODO: add proper Common instance (problem: service not accesible)
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
        (reqId === undefined ? this.nextReqId.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        [BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, !reverse ? 0 : 1],
      ],
      decode: ([reqId, [block, max, skip, reverse]]: any) => ({
        reqId: new BN(reqId),
        block: block.length === 32 ? block : new BN(block),
        max: bufferToInt(max),
        skip: bufferToInt(skip),
        reverse: bufferToInt(reverse) === 0 ? false : true,
      }),
    },
    {
      name: 'BlockHeaders',
      code: 0x04,
      encode: ({ reqId, headers }: { reqId: BN; headers: BlockHeader[] }) => [
        reqId.toArrayLike(Buffer),
        headers.map((h) => h.raw()),
      ],
      decode: ([reqId, headers]: [Buffer, BlockHeaderBuffer[]]) => [
        new BN(reqId),
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
        (reqId === undefined ? this.nextReqId.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: new BN(reqId),
        hashes,
      }),
    },
    {
      name: 'BlockBodies',
      code: 0x06,
      encode: ({ reqId, bodies }: { reqId: BN; bodies: BlockBodyBuffer[] }) => [
        reqId.toArrayLike(Buffer),
        bodies,
      ],
      decode: ([reqId, bodies]: [Buffer, BlockBodyBuffer[]]) => [new BN(reqId), bodies],
    },
    {
      name: 'NewBlock',
      code: 0x07,
      encode: ([block, td]: [Block, BN]) => [block.raw(), td.toArrayLike(Buffer)],
      decode: ([block, td]: [BlockBuffer, Buffer]) => [
        Block.fromValuesArray(block, {
          common: this.config.chainCommon,
          hardforkByBlockNumber: true,
        }),
        new BN(td),
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
        (reqId === undefined ? this.nextReqId.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: new BN(reqId),
        hashes,
      }),
    },
    {
      name: 'PooledTransactions',
      code: 0x0a,
      encode: ({ reqId, txs }: { reqId: BN; txs: TypedTransaction[] }) => {
        const serializedTxs = []
        for (const tx of txs) {
          if (tx.type === 0) {
            serializedTxs.push(tx.raw())
          } else {
            serializedTxs.push(tx.serialize())
          }
        }
        return [reqId.toArrayLike(Buffer), serializedTxs]
      },
      decode: ([reqId, txs]: [Buffer, any[]]) => [
        new BN(reqId),
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
      encode: ({ reqId, hashes }: { reqId: BN; hashes: Buffer[] }) => [
        (reqId === undefined ? this.nextReqId.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        hashes,
      ],
      decode: ([reqId, hashes]: [Buffer, Buffer[]]) => ({
        reqId: new BN(reqId),
        hashes,
      }),
    },
    {
      name: 'Receipts',
      code: 0x10,
      encode: ({ reqId, receipts }: { reqId: BN; receipts: TxReceiptWithType[] }) => {
        const serializedReceipts = []
        for (const receipt of receipts) {
          let encodedReceipt = rlp.encode([
            (receipt as PreByzantiumTxReceipt).stateRoot ??
              (receipt as PostByzantiumTxReceipt).status,
            receipt.gasUsed,
            receipt.bitvector,
            receipt.logs,
          ])
          if (receipt.txType > 0) {
            // Serialize receipt according to EIP-2718:
            // `typed-receipt = tx-type || receipt-data`
            encodedReceipt = Buffer.concat([intToBuffer(receipt.txType), encodedReceipt])
          }
          serializedReceipts.push(encodedReceipt)
        }
        return [reqId.toArrayLike(Buffer), serializedReceipts]
      },
      decode: ([reqId, receipts]: [Buffer, Buffer[]]) => [
        new BN(reqId),
        receipts.map((r) => {
          // Legacy receipt if r[0] >= 0xc0, otherwise typed receipt with first byte as TransactionType
          const decoded = rlp.decode(r[0] >= 0xc0 ? r : r.slice(1)) as any
          const [stateRootOrStatus, cumulativeGasUsed, logsBloom, logs] = decoded
          const receipt = { gasUsed: cumulativeGasUsed, bitvector: logsBloom, logs } as TxReceipt
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
      networkId: this.chain.networkId.toArrayLike(Buffer),
      td: this.chain.blocks.td.isZero()
        ? Buffer.from([])
        : this.chain.blocks.td.toArrayLike(Buffer),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash,
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param status status message payload
   */
  decodeStatus(status: any): any {
    return {
      networkId: new BN(status.networkId),
      td: new BN(status.td),
      bestHash: status.bestHash,
      genesisHash: status.genesisHash,
    }
  }
}
