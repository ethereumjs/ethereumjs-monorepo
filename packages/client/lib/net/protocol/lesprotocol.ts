import { BN, bufferToInt } from 'ethereumjs-util'
import { BlockHeader, BlockHeaderBuffer } from '@ethereumjs/block'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'
import { FlowControl } from './flowcontrol'

export interface LesProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain

  /* Flow control manager. If undefined, header serving will be disabled. */
  flow?: FlowControl
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
/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface LesProtocolMethods {
  getBlockHeaders: (
    opts: GetBlockHeadersOpts
  ) => Promise<{ reqId: BN; bv: BN; headers: BlockHeader[] }>
}

const id = new BN(0)

/**
 * Implements les/1 and les/2 protocols
 * @memberof module:net/protocol
 */
export class LesProtocol extends Protocol {
  private chain: Chain
  private flow: FlowControl | undefined
  private isServer: boolean

  private protocolMessages: Message[] = [
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
      code: 0x03,
      encode: ({ reqId, bv, headers }: any) => [
        new BN(reqId).toArrayLike(Buffer),
        new BN(bv).toArrayLike(Buffer),
        headers.map((h: BlockHeader) => h.raw()),
      ],
      decode: ([reqId, bv, headers]: any) => ({
        reqId: new BN(reqId),
        bv: new BN(bv),
        headers: headers.map((h: BlockHeaderBuffer) => {
          return BlockHeader.fromValuesArray(h, {
            hardforkByBlockNumber: true,
            common: this.config.chainCommon, // eslint-disable-line no-invalid-this
          })
        }),
      }),
    },
  ]

  /**
   * Create les protocol
   * @param {LesProtocolOptions}
   */
  constructor(options: LesProtocolOptions) {
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
   * Encodes status into LES status message payload
   * @return {Object}
   */
  encodeStatus(): any {
    let serveOptions = {}

    if (this.flow) {
      serveOptions = {
        serveHeaders: 1,
        serveChainSince: 0,
        serveStateSince: 0,
        txRelay: 1,
        'flowControl/BL': new BN(this.flow.bl).toArrayLike(Buffer),
        'flowControl/MRR': new BN(this.flow.mrr).toArrayLike(Buffer),
        'flowControl/MRC': Object.entries(this.flow.mrc).map(([name, { base, req }]) => {
          const { code } = this.messages.find((m) => m.name === name)!
          return [code, base, req]
        }),
      }
    }

    return {
      networkId: this.chain.networkId.toArrayLike(Buffer),
      headTd: this.chain.headers.td.toArrayLike(Buffer),
      headHash: this.chain.headers.latest?.hash(),
      headNum: this.chain.headers.latest?.number.toArrayLike(Buffer),
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
        const message = this.messages.find((m) => m.code === entry[0])
        if (message) {
          mrc[message.name] = mrc[entry[0]]
        }
      }
    }
    return {
      networkId: new BN(status.networkId),
      headTd: new BN(status.headTd),
      headHash: status.headHash,
      headNum: new BN(status.headNum),
      genesisHash: status.genesisHash,
      serveHeaders: this.isServer,
      serveChainSince: status.serveChainSince ?? 0,
      serveStateSince: status.serveStateSince ?? 0,
      txRelay: !!status.txRelay,
      bl: status['flowControl/BL'] ? new BN(status['flowControl/BL']).toNumber() : undefined,
      mrr: status['flowControl/MRR'] ? new BN(status['flowControl/MRR']).toNumber() : undefined,
      mrc: mrc,
    }
  }
}
