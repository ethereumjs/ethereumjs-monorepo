import { BN, AccountData as AccountDataBody } from 'ethereumjs-util'
import { Chain } from './../../blockchain'
import { Message, Protocol, ProtocolOptions } from './protocol'

interface SnapProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
}

type AccountData = {
  hash: Buffer
  body: AccountDataBody
}

type GetAccountRangeOpts = {
  /* Request id (default: next internal id) */
  reqId?: BN
  root: Buffer
  origin: Buffer
  limit: Buffer
  bytes: BN
}

type GetStorageRangesOpts = {
  reqId?: BN
  root: Buffer
  accounts: Buffer[]
  origin: Buffer
  limit: Buffer
  bytes: BN
}

type StorageData = {
  hash: Buffer
  body: Buffer
}

type GetByteCodesOpts = {
  reqId?: BN
  hashes: Buffer[]
  bytes: BN
}

type GetTrieNodesOpts = {
  reqId?: BN
  root: Buffer
  paths: Buffer[][]
  bytes: BN
}
/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface SnapProtocolMethods {
  getAccountRange: (
    opts: GetAccountRangeOpts
  ) => Promise<{ reqId: BN; accounts: AccountData[]; proof: Buffer[][] }>
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
      response: 0x01,
      encode: ({ reqId, root, origin, limit, bytes }: GetAccountRangeOpts) => {
        return [
          (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
          root,
          origin,
          limit,
          bytes,
        ]
      },
      decode: ([reqId, root, origin, limit, bytes]: any) => {
        return {
          reqId: new BN(reqId),
          root,
          origin,
          limit,
          bytes: new BN(bytes),
        }
      },
    },
    {
      name: 'AccountRange',
      code: 0x01,
      encode: ({
        reqId,
        accounts,
        proof,
      }: {
        reqId: BN
        accounts: AccountData[]
        proof: Buffer[]
      }) => {
        return [
          reqId.toArrayLike(Buffer),
          accounts.map((account) => [account.hash, account.body]),
          proof,
        ]
      },
      decode: ([reqId, accounts, proof]: any) => {
        return {
          reqId: new BN(reqId),
          accounts: accounts.map(([hash, body]: any) => ({ hash, body } as AccountData)),
          proof,
        }
      },
    },
    {
      name: 'GetStorageRanges',
      code: 0x02,
      response: 0x03,
      encode: ({ reqId, root, accounts, origin, limit, bytes }: GetStorageRangesOpts) => {
        return [
          (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
          root,
          accounts,
          origin,
          limit,
          bytes,
        ]
      },
      decode: ([reqId, root, accounts, origin, limit, bytes]: any) => {
        return {
          reqId: new BN(reqId),
          root,
          accounts,
          origin,
          limit,
          bytes: new BN(bytes),
        }
      },
    },
    {
      name: 'StorageRanges',
      code: 0x03,
      encode: ({ reqId, slots, proof }: { reqId: BN; slots: StorageData[]; proof: Buffer[] }) => {
        return [reqId.toArrayLike(Buffer), slots.map((slot) => [slot.hash, slot.body]), proof]
      },
      decode: ([reqId, slots, proof]: any) => {
        return {
          reqId: new BN(reqId),
          slots: slots.map(([hash, body]: any) => ({ hash, body } as StorageData)),
          proof,
        }
      },
    },
    {
      name: 'GetByteCodes',
      code: 0x04,
      response: 0x05,
      encode: ({ reqId, hashes, bytes }: GetByteCodesOpts) => {
        return [
          (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
          hashes,
          bytes,
        ]
      },
      decode: ([reqId, hashes, bytes]: any) => {
        return {
          reqId: new BN(reqId),
          hashes,
          bytes: new BN(bytes),
        }
      },
    },
    {
      name: 'ByteCodes',
      code: 0x05,
      encode: ({ reqId, codes }: { reqId: BN; codes: Buffer[] }) => {
        return [reqId.toArrayLike(Buffer), codes]
      },
      decode: ([reqId, codes]: any) => {
        return {
          reqId: new BN(reqId),
          codes,
        }
      },
    },
    {
      name: 'GetTrieNodes',
      code: 0x06,
      response: 0x07,
      encode: ({ reqId, root, paths, bytes }: GetTrieNodesOpts) => {
        return [
          (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
          root,
          paths,
          bytes,
        ]
      },
      decode: ([reqId, root, paths, bytes]: any) => {
        return {
          reqId: new BN(reqId),
          root,
          paths,
          bytes: new BN(bytes),
        }
      },
    },
    {
      name: 'TrieNodes',
      code: 0x07,
      encode: ({ reqId, nodes }: { reqId: BN; nodes: Buffer[] }) => {
        return [reqId.toArrayLike(Buffer), nodes]
      },
      decode: ([reqId, nodes]: any) => {
        return {
          reqId: new BN(reqId),
          nodes,
        }
      },
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
