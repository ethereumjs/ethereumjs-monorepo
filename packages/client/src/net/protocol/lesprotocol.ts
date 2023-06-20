import { BlockHeader } from '@ethereumjs/block'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  hexStringToBytes,
  intToBytes,
} from '@ethereumjs/util'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { FlowControl } from './flowcontrol'
import type { Message, ProtocolOptions } from './protocol'
import type { BlockHeaderBytes } from '@ethereumjs/block'

export interface LesProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain

  /* Flow control manager. If undefined, header serving will be disabled. */
  flow?: FlowControl
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
/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface LesProtocolMethods {
  getBlockHeaders: (
    opts: GetBlockHeadersOpts
  ) => Promise<{ reqId: bigint; bv: bigint; headers: BlockHeader[] }>
}

/**
 * Implements les/1 and les/2 protocols
 * @memberof module:net/protocol
 */
export class LesProtocol extends Protocol {
  private chain: Chain
  private flow: FlowControl | undefined
  private isServer: boolean
  private nextReqId = BigInt(0)

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'Announce',
      code: 0x01,
      encode: ({ headHash, headNumber, headTd, reorgDepth }: any) => [
        // TO DO: handle state changes
        headHash,
        bigIntToUnpaddedBytes(headNumber),
        bigIntToUnpaddedBytes(headTd),
        intToBytes(reorgDepth),
      ],
      decode: ([headHash, headNumber, headTd, reorgDepth]: any) => ({
        // TO DO: handle state changes
        headHash,
        headNumber: bytesToBigInt(headNumber),
        headTd: bytesToBigInt(headTd),
        reorgDepth: bytesToInt(reorgDepth),
      }),
    },
    {
      name: 'GetBlockHeaders',
      code: 0x02,
      response: 0x03,
      encode: ({ reqId, block, max, skip = 0, reverse = false }: GetBlockHeadersOpts) => [
        bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
        [
          typeof block === 'bigint' ? bigIntToUnpaddedBytes(block) : block,
          intToBytes(max),
          intToBytes(skip),
          intToBytes(!reverse ? 0 : 1),
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
      code: 0x03,
      encode: ({ reqId, bv, headers }: any) => [
        bigIntToUnpaddedBytes(reqId),
        bigIntToUnpaddedBytes(bv),
        headers.map((h: BlockHeader) => h.raw()),
      ],
      decode: ([reqId, bv, headers]: any) => ({
        reqId: bytesToBigInt(reqId),
        bv: bytesToBigInt(bv),
        headers: headers.map((h: BlockHeaderBytes) =>
          BlockHeader.fromValuesArray(h, {
            setHardfork: true,
            common: this.config.chainCommon, // eslint-disable-line no-invalid-this
          })
        ),
      }),
    },
  ]

  /**
   * Create les protocol
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
   */
  get name() {
    return 'les'
  }

  /**
   * Protocol versions supported
   */
  get versions() {
    return [4, 3, 2]
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
   * Encodes status into LES status message payload
   */
  encodeStatus(): any {
    let serveOptions = {}

    if (this.flow) {
      serveOptions = {
        serveHeaders: 1,
        serveChainSince: 0,
        serveStateSince: 0,
        // txRelay: 1, TODO: uncomment with client tx pool functionality
        'flowControl/BL': intToBytes(this.flow.bl),
        'flowControl/MRR': intToBytes(this.flow.mrr),
        'flowControl/MRC': Object.entries(this.flow.mrc).map(([name, { base, req }]) => {
          const { code } = this.messages.find((m) => m.name === name)!
          return [intToBytes(code), intToBytes(base), intToBytes(req)]
        }),
      }
    }

    const forkHash = this.config.chainCommon.forkHash(
      this.config.chainCommon.hardfork(),
      this.chain.genesis.hash()
    )
    const nextFork = this.config.chainCommon.nextHardforkBlockOrTimestamp(
      this.config.chainCommon.hardfork()
    )
    const forkID = [hexStringToBytes(forkHash.slice(2)), bigIntToUnpaddedBytes(nextFork ?? 0n)]

    return {
      networkId: bigIntToUnpaddedBytes(this.chain.networkId),
      headTd: bigIntToUnpaddedBytes(this.chain.headers.td),
      headHash: this.chain.headers.latest?.hash(),
      headNum: bigIntToUnpaddedBytes(this.chain.headers.height),
      genesisHash: this.chain.genesis.hash(),
      forkID,
      recentTxLookup: intToBytes(1),
      ...serveOptions,
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param status status message payload
   */
  decodeStatus(status: any): any {
    this.isServer = status.serveHeaders !== undefined && status.serveHeaders !== false
    const mrc: any = {}
    if (status['flowControl/MRC'] !== undefined) {
      for (let entry of status['flowControl/MRC']) {
        entry = entry.map((e: any) => bytesToInt(e))
        mrc[entry[0]] = { base: entry[1], req: entry[2] }
        const message = this.messages.find((m) => m.code === entry[0])
        if (message) {
          mrc[message.name] = mrc[entry[0]]
        }
      }
    }
    return {
      networkId: bytesToBigInt(status.networkId),
      headTd: bytesToBigInt(status.headTd),
      headHash: status.headHash,
      headNum: bytesToBigInt(status.headNum),
      genesisHash: status.genesisHash,
      forkID: status.forkID,
      recentTxLookup: status.recentTxLookup,
      serveHeaders: this.isServer,
      serveChainSince: status.serveChainSince ?? 0,
      serveStateSince: status.serveStateSince ?? 0,
      txRelay: status.txRelay === true,
      bl: status['flowControl/BL'] !== undefined ? bytesToInt(status['flowControl/BL']) : undefined,
      mrr:
        status['flowControl/MRR'] !== undefined ? bytesToInt(status['flowControl/MRR']) : undefined,
      mrc,
    }
  }
}
