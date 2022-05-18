import { BN } from 'ethereumjs-util'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'

interface SnapProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

type AccountData = {
  hash: Buffer
  body: Buffer
}

type GetAccountRangeOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  root: Buffer
  origin: Buffer
  limit: Buffer
  bytes: BN
}

/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface SnapProtocolMethods {
  getAccountRange: (opts: GetAccountRangeOpts) => Promise<[BN, AccountData[], Buffer[][]]>
}

const id = new BN(0)

/**
 * Implements snap/1 protocol
 * @memberof module:net/protocol
 */
export class SnapProtocol extends Protocol {
  private chain: Chain

  private protocolMessages: Message[] = [
    {
      name: 'GetAccountRange',
      code: 0x00,
      response: 0x04,
      encode: ({ reqId, root, origin, limit, bytes }: GetAccountRangeOpts) => [
        (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
        [root, origin, limit, bytes],
      ],
      decode: ([reqId, [root, origin, limit, bytes]]: any) => ({
        reqId: new BN(reqId),
        root,
        origin,
        limit,
        bytes: new BN(bytes),
      }),
    },
  ]

  /**
   * Create snap protocol
   */
  constructor(options: SnapProtocolOptions) {
    super(options)

    this.chain = options.chain
  }

  /**
   * Name of protocol
   */
  get name() {
    return 'snap'
  }

  /**
   * Protocol versions supported
   */
  get versions() {
    return [1]
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
}
