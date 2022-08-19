import { bigIntToBuffer, bufferToBigInt } from '@ethereumjs/util'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { Message, ProtocolOptions } from './protocol'
import type { AccountData as AccountDataBody } from '@ethereumjs/util'

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
  reqId?: bigint
  root: Buffer
  origin: Buffer
  limit: Buffer
  bytes: bigint
}

type GetStorageRangesOpts = {
  reqId?: bigint
  root: Buffer
  accounts: Buffer[]
  origin: Buffer
  limit: Buffer
  bytes: bigint
}

type StorageData = {
  hash: Buffer
  body: Buffer
}

type GetByteCodesOpts = {
  reqId?: bigint
  hashes: Buffer[]
  bytes: bigint
}

type GetTrieNodesOpts = {
  reqId?: bigint
  root: Buffer
  paths: Buffer[][]
  bytes: bigint
}
/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface SnapProtocolMethods {
  getAccountRange: (
    opts: GetAccountRangeOpts
  ) => Promise<{ reqId: bigint; accounts: AccountData[]; proof: Buffer[][] }>
}

/**
 * Implements snap/1 protocol
 * @memberof module:net/protocol
 */
export class SnapProtocol extends Protocol {
  private chain: Chain
  private nextReqId = BigInt(0)

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'GetAccountRange',
      code: 0x00,
      response: 0x01,
      encode: ({ reqId, root, origin, limit, bytes }: GetAccountRangeOpts) => {
        return [bigIntToBuffer(reqId ?? ++this.nextReqId), root, origin, limit, bytes]
      },
      decode: ([reqId, root, origin, limit, bytes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          root,
          origin,
          limit,
          bytes: bufferToBigInt(bytes),
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
        reqId: bigint
        accounts: AccountData[]
        proof: Buffer[]
      }) => {
        return [
          bigIntToBuffer(reqId ?? ++this.nextReqId),
          accounts.map((account) => [account.hash, account.body]),
          proof,
        ]
      },
      decode: ([reqId, accounts, proof]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
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
          bigIntToBuffer(reqId ?? ++this.nextReqId),
          root,
          accounts,
          origin,
          limit,
          bigIntToBuffer(bytes),
        ]
      },
      decode: ([reqId, root, accounts, origin, limit, bytes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          root,
          accounts,
          origin,
          limit,
          bytes: bufferToBigInt(bytes),
        }
      },
    },
    {
      name: 'StorageRanges',
      code: 0x03,
      encode: ({
        reqId,
        slots,
        proof,
      }: {
        reqId: bigint
        slots: StorageData[]
        proof: Buffer[]
      }) => {
        return [
          bigIntToBuffer(reqId ?? ++this.nextReqId),
          slots.map((slot) => [slot.hash, slot.body]),
          proof,
        ]
      },
      decode: ([reqId, slots, proof]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
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
        return [bigIntToBuffer(reqId ?? ++this.nextReqId), hashes, bigIntToBuffer(bytes)]
      },
      decode: ([reqId, hashes, bytes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          hashes,
          bytes: bufferToBigInt(bytes),
        }
      },
    },
    {
      name: 'ByteCodes',
      code: 0x05,
      encode: ({ reqId, codes }: { reqId: bigint; codes: Buffer[] }) => {
        return [bigIntToBuffer(reqId ?? ++this.nextReqId), codes]
      },
      decode: ([reqId, codes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          codes,
        }
      },
    },
    {
      name: 'GetTrieNodes',
      code: 0x06,
      response: 0x07,
      encode: ({ reqId, root, paths, bytes }: GetTrieNodesOpts) => {
        return [bigIntToBuffer(reqId ?? ++this.nextReqId), root, paths, bigIntToBuffer(bytes)]
      },
      decode: ([reqId, root, paths, bytes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          root,
          paths,
          bytes: bufferToBigInt(bytes),
        }
      },
    },
    {
      name: 'TrieNodes',
      code: 0x07,
      encode: ({ reqId, nodes }: { reqId: bigint; nodes: Buffer[] }) => {
        return [bigIntToBuffer(reqId ?? ++this.nextReqId), nodes]
      },
      decode: ([reqId, nodes]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
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
