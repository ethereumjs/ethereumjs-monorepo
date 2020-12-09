import { BN, bufferToInt } from 'ethereumjs-util'
import { Block, BlockHeader, BlockHeaderBuffer } from '@ethereumjs/block'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'

interface EthProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

/* Messages with responses that are added as methods in camelCase to BoundProtocol. */
export interface EthProtocolMethods {
  getBlockHeaders: (opts: {
    block: BN | Buffer
    max: number
    skip?: number
    reverse?: number
  }) => Promise<BlockHeader[]>
  getBlockBodies: (hashes: Buffer[]) => Promise<Block[]>
}

const messages: Message[] = [
  {
    name: 'NewBlockHashes',
    code: 0x01,
    encode: (hashes: any[]) => hashes.map((hn) => [hn[0], hn[1].toArrayLike(Buffer)]),
    decode: (hashes: any[]) => hashes.map((hn) => [hn[0], new BN(hn[1])]),
  },
  {
    name: 'GetBlockHeaders',
    code: 0x03,
    response: 0x04,
    encode: ({ block, max, skip = 0, reverse = 0 }: any) => [
      BN.isBN(block) ? block.toArrayLike(Buffer) : block,
      max,
      skip,
      reverse,
    ],
    decode: ([block, max, skip, reverse]: any) => ({
      block: block.length === 32 ? block : new BN(block),
      max: bufferToInt(max),
      skip: bufferToInt(skip),
      reverse: bufferToInt(reverse),
    }),
  },
  {
    name: 'BlockHeaders',
    code: 0x04,
    encode: (headers: BlockHeader[]) => headers.map((h) => h.raw()),
    decode: (headers: BlockHeaderBuffer[]) =>
      headers.map((h) => BlockHeader.fromValuesArray(h, {})),
  },
  {
    name: 'GetBlockBodies',
    code: 0x05,
    response: 0x06,
  },
  {
    name: 'BlockBodies',
    code: 0x06,
  },
]

/**
 * Implements eth/62 and eth/63 protocols
 * @memberof module:net/protocol
 */
export class EthProtocol extends Protocol {
  private chain: Chain

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
    return [63, 62]
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages(): Message[] {
    return messages
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
      networkId: this.chain.networkId,
      td: this.chain.blocks.td.toArrayLike(Buffer),
      bestHash: this.chain.blocks.latest!.hash(),
      genesisHash: this.chain.genesis.hash,
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param {Object} status status message payload
   * @return {Object}
   */
  decodeStatus(status: any): any {
    return {
      networkId: bufferToInt(status.networkId),
      td: new BN(status.td),
      bestHash: status.bestHash,
      genesisHash: status.genesisHash,
    }
  }
}
