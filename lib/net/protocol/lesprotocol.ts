import { Message, Protocol } from './protocol'
import { BN, bufferToInt } from 'ethereumjs-util'
import { BlockHeader, BlockHeaderBuffer } from '@ethereumjs/block'

const id = new BN(0)

const messages: Message[] = [
  {
    name: 'Announce',
    code: 0x01,
    encode: ({ headHash, headNumber, headTd, reorgDepth }: any) => [
      // TO DO: handle state changes
      headHash,
      headNumber.toArrayLike(Buffer),
      headTd.toArrayLike(Buffer),
      new BN(reorgDepth).toArrayLike(Buffer),
    ],
    decode: ([headHash, headNumber, headTd, reorgDepth]: any) => ({
      // TO DO: handle state changes
      headHash: headHash,
      headNumber: new BN(headNumber),
      headTd: new BN(headTd),
      reorgDepth: bufferToInt(reorgDepth),
    }),
  },
  {
    name: 'GetBlockHeaders',
    code: 0x02,
    response: 0x03,
    encode: ({ reqId, block, max, skip = 0, reverse = 0 }: any) => [
      (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
      [BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, reverse],
    ],
    decode: ([reqId, [block, max, skip, reverse]]: any) => ({
      reqId: new BN(reqId),
      block: block.length === 32 ? block : new BN(block),
      max: bufferToInt(max),
      skip: bufferToInt(skip),
      reverse: bufferToInt(reverse),
    }),
  },
  {
    name: 'BlockHeaders',
    code: 0x03,
    encode: ({ reqId, bv, headers }: any) => [
      new BN(reqId).toArrayLike(Buffer),
      new BN(bv).toArrayLike(Buffer),
      headers.map((h: any) => h.raw()),
    ],
    decode: ([reqId, bv, headers]: any) => ({
      reqId: new BN(reqId),
      bv: new BN(bv),
      headers: headers.map((h: BlockHeaderBuffer) => BlockHeader.fromValuesArray(h, {})),
    }),
  },
]

/**
 * Implements les/1 and les/2 protocols
 * @memberof module:net/protocol
 */
export class LesProtocol extends Protocol {
  private chain: any
  private flow: any
  private isServer: boolean

  /**
   * Create les protocol
   * @param {Object}      options constructor parameters
   * @param {Chain}       options.chain blockchain
   * @param {FlowControl} [options.flow] flow control manager. if undefined,
   * header serving will be disabled
   * @param {number}      [options.timeout=8000] handshake timeout in ms
   */
  constructor(options: any) {
    super(options)

    this.chain = options.chain
    this.flow = options.flow

    // TODO: "no init value" error was caught by TS compiler. Is `false` the correct default?
    this.isServer = false
  }

  /**
   * Name of protocol
   * @type {string}
   */
  get name(): string {
    return 'les'
  }

  /**
   * Protocol versions supported
   * @type {number[]}
   */
  get versions(): number[] {
    return [2, 1]
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages(): any {
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
   * Encodes status into LES status message payload
   * @return {Object}
   */
  encodeStatus(): any {
    const serveOptions = this.flow
      ? {
          serveHeaders: 1,
          serveChainSince: 0,
          serveStateSince: 0,
          txRelay: 1,
          'flowControl/BL': new BN(this.flow.bl).toArrayLike(Buffer),
          'flowControl/MRR': new BN(this.flow.mrr).toArrayLike(Buffer),
          'flowControl/MRC': Object.entries(this.flow.mrc).map(([name, { base, req }]: any) => {
            const { code }: any = messages.find((m) => m.name === name)
            return [code, base, req]
          }),
        }
      : {}

    return {
      networkId: this.chain.networkId,
      headTd: this.chain.headers.td.toArrayLike(Buffer),
      headHash: this.chain.headers.latest.hash(),
      headNum: this.chain.headers.latest.number,
      genesisHash: this.chain.genesis.hash,
      ...serveOptions,
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param {Object} status status message payload
   * @return {Object}
   */
  decodeStatus(status: any): any {
    this.isServer = !!status.serveHeaders
    const mrc: any = {}
    if (status['flowControl/MRC']) {
      for (let entry of status['flowControl/MRC']) {
        entry = entry.map((e: any) => new BN(e).toNumber())
        mrc[entry[0]] = { base: entry[1], req: entry[2] }
        const message = messages.find((m) => m.code === entry[0])
        if (message) {
          mrc[message.name] = mrc[entry[0]]
        }
      }
    }
    return {
      networkId: bufferToInt(status.networkId),
      headTd: new BN(status.headTd),
      headHash: status.headHash,
      headNum: new BN(status.headNum),
      genesisHash: status.genesisHash,
      serveHeaders: this.isServer,
      serveChainSince: status.serveChainSince && new BN(status.serveChainSince),
      serveStateSince: status.serveStateSince && new BN(status.serveStateSince),
      txRelay: !!status.txRelay,
      bl: status['flowControl/BL'] && new BN(status['flowControl/BL']).toNumber(),
      mrr: status['flowControl/MRR'] && new BN(status['flowControl/MRR']).toNumber(),
      mrc: mrc,
    }
  }
}
