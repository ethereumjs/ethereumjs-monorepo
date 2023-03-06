import {
  accountBodyFromSlim,
  accountBodyToSlim,
  bigIntToUnpaddedBuffer,
  bufferToBigInt,
  setLengthLeft,
} from '@ethereumjs/util'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { Message, ProtocolOptions } from './protocol'
import type { AccountBodyBuffer } from '@ethereumjs/util'

interface SnapProtocolOptions extends ProtocolOptions {
  /* Blockchain */
  chain: Chain
  /**
   * If to convert slim body received of an account to normal while decoding.
   * Encoding is always converted to slim
   */
  convertSlimBody?: boolean
}

export type AccountData = {
  hash: Buffer
  body: AccountBodyBuffer
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
  ) => Promise<{ reqId: bigint; accounts: AccountData[]; proof: Buffer[] }>
  getStorageRanges: (opts: GetStorageRangesOpts) => Promise<{
    reqId: bigint
    slots: StorageData[][]
    proof: Buffer[]
  }>
  getByteCodes: (opts: GetByteCodesOpts) => Promise<{ reqId: bigint; codes: Buffer[] }>
}

/**
 * Implements snap/1 protocol
 * @memberof module:net/protocol
 */
export class SnapProtocol extends Protocol {
  private chain: Chain
  /** If to convert slim body received of an account to normal */
  private convertSlimBody?: boolean
  private nextReqId = BigInt(0)

  /* eslint-disable no-invalid-this */
  private protocolMessages: Message[] = [
    {
      name: 'GetAccountRange',
      code: 0x00,
      response: 0x01,
      // [reqID: P, rootHash: B_32, startingHash: B_32, limitHash: B_32, responseBytes: P]
      encode: ({ reqId, root, origin, limit, bytes }: GetAccountRangeOpts) => {
        return [
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          setLengthLeft(origin, 32),
          setLengthLeft(limit, 32),
          bigIntToUnpaddedBuffer(bytes),
        ]
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
      // [reqID: P, accounts: [[accHash: B_32, accBody: B], ...], proof: [node_1: B, node_2, ...]]
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
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          accounts.map((account) => [
            setLengthLeft(account.hash, 32),
            accountBodyToSlim(account.body),
          ]),
          proof,
        ]
      },
      decode: ([reqId, accounts, proof]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          accounts: accounts.map(
            ([hash, body]: any) =>
              ({
                hash,
                body: this.convertSlimBody === true ? accountBodyFromSlim(body) : body,
              } as AccountData)
          ),
          proof,
        }
      },
    },
    {
      name: 'GetStorageRanges',
      code: 0x02,
      response: 0x03,
      // [reqID: P, rootHash: B_32, accountHashes: [B_32], startingHash: B, limitHash: B, responseBytes: P]
      encode: ({ reqId, root, accounts, origin, limit, bytes }: GetStorageRangesOpts) => {
        return [
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          accounts.map((acc) => setLengthLeft(acc, 32)),
          origin,
          limit,
          bigIntToUnpaddedBuffer(bytes),
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
      // [reqID: P, slots: [[[slotHash: B_32, slotData: B], ...], ...], proof: [node_1: B, node_2, ...]]
      encode: ({
        reqId,
        slots,
        proof,
      }: {
        reqId: bigint
        slots: StorageData[][]
        proof: Buffer[]
      }) => {
        return [
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          slots.map((accSlots) =>
            accSlots.map((slotData) => [setLengthLeft(slotData.hash, 32), slotData.body])
          ),
          proof,
        ]
      },
      decode: ([reqId, slots, proof]: any) => {
        return {
          reqId: bufferToBigInt(reqId),
          slots: slots.map((accSlots: any) =>
            accSlots.map(([hash, body]: any) => ({ hash, body } as StorageData))
          ),
          proof,
        }
      },
    },
    {
      name: 'GetByteCodes',
      code: 0x04,
      response: 0x05,
      // [reqID: P, hashes: [hash1: B_32, hash2: B_32, ...], bytes: P]
      encode: ({ reqId, hashes, bytes }: GetByteCodesOpts) => {
        return [
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          hashes.map((hash) => setLengthLeft(hash, 32)),
          bigIntToUnpaddedBuffer(bytes),
        ]
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
      // [reqID: P, codes: [code1: B, code2: B, ...]]
      encode: ({ reqId, codes }: { reqId: bigint; codes: Buffer[] }) => {
        return [bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId), codes]
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
      // [reqID: P, rootHash: B_32, paths: [[accPath: B, slotPath1: B, slotPath2: B, ...]...], bytes: P]
      encode: ({ reqId, root, paths, bytes }: GetTrieNodesOpts) => {
        return [
          bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          paths,
          bigIntToUnpaddedBuffer(bytes),
        ]
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
      // [reqID: P, nodes: [node1: B, node2: B, ...]]
      encode: ({ reqId, nodes }: { reqId: bigint; nodes: Buffer[] }) => {
        return [bigIntToUnpaddedBuffer(reqId ?? ++this.nextReqId), nodes]
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
    this.convertSlimBody = options.convertSlimBody
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
