import { BN, bufferToInt } from 'ethereumjs-util'
import { BlockHeader, BlockHeaderBuffer } from '@ethereumjs/block'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'
import { BlockBodyBuffer } from '@ethereumjs/block'

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

/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface EthProtocolMethods {
  getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<[BN, BlockHeader[]]>
  getBlockBodies: (opts: GetBlockBodiesOpts) => Promise<[BN, BlockBodyBuffer[]]>
  getPooledTransactions: (opts: GetPooledTransactionsOpts) => Promise<[BN, any[]]>
}

const id = new BN(0)

/**
 * Implements eth/66 protocol
 * @memberof module:net/protocol
 */
export class EthProtocol extends Protocol {
  private chain: Chain

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
    },
    {
      name: 'GetBlockHeaders',
      code: 0x03,
      response: 0x04,
      encode: ({ reqId, block, max, skip = 0, reverse = false }: GetBlockHeadersOpts) => [
        (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
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
          BlockHeader.fromValuesArray(h, {
            hardforkByBlockNumber: true,
            common: this.config.chainCommon, // eslint-disable-line no-invalid-this
          })
        ),
      ],
    },
    {
      name: 'GetBlockBodies',
      code: 0x05,
      response: 0x06,
      encode: ({ reqId, hashes }: GetBlockBodiesOpts) => [
        (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
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
      name: 'NewPooledTransactionHashes',
      code: 0x08,
    },
    {
      name: 'GetPooledTransactions',
      code: 0x09,
      response: 0x0a,
      encode: ({ reqId, hashes }: GetPooledTransactionsOpts) => [
        (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        hashes,
      ],
    },
    {
      name: 'PooledTransactions',
      code: 0x0a,
      decode: ([reqId, txs]: [Buffer, any[]]) => [new BN(reqId), txs],
    },
  ]

  /**
   * Create eth protocol
   * @param {EthProtocolOptions}
   */
  constructor(options: EthProtocolOptions) {
    super(options)

    this.chain = options.chain
  }

  /**
   * Name of protocol
   * @type {string}
   */
  get name(): string {
    return 'eth'
  }

  /**
   * Protocol versions supported
   * @type {number[]}
   */
  get versions(): number[] {
    return [66]
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages(): Message[] {
    return this.protocolMessages
  }

  /**
   * Opens protocol and any associated dependencies
   * @return {Promise}
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
   * @return {Object}
   */
  encodeStatus(): any {
    return {
      networkId: this.chain.networkId.toArrayLike(Buffer),
      td: this.chain.blocks.td.toArrayLike(Buffer),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash,
      latestBlock: this.chain.blocks.latest!.header.number.toArrayLike(Buffer),
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param {Object} status status message payload
   * @return {Object}
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
