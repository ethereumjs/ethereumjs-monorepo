import {
  accountBodyFromSlim,
  accountBodyToSlim,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  setLengthLeft,
} from '@ethereumjs/util'

import { Protocol } from './protocol'

import type { Chain } from '../../blockchain'
import type { Message, ProtocolOptions } from './protocol'
import type { AccountBodyBytes } from '@ethereumjs/util'

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
  hash: Uint8Array
  body: AccountBodyBytes
}

type GetAccountRangeOpts = {
  /* Request id (default: next internal id) */
  reqId?: bigint
  root: Uint8Array
  origin: Uint8Array
  limit: Uint8Array
  bytes: bigint
}

type GetStorageRangesOpts = {
  reqId?: bigint
  root: Uint8Array

  // If multiple accounts' storage is requested, serving nodes
  // should reply with the entire storage ranges (thus no Merkle
  // proofs needed), up to the first contract which exceeds the
  // packet limit. If the last included storage range does not
  // fit entirely, a Merkle proof must be attached to that and
  // only that.
  // If a single account's storage is requested, serving nodes
  // should only return slots starting with the requested
  // starting hash, up to the last one or until the packet fills
  // up. It the entire storage range is not being returned, a
  // Merkle proof must be attached.
  accounts: Uint8Array[]
  origin: Uint8Array
  limit: Uint8Array
  bytes: bigint
}

export type StorageData = {
  hash: Uint8Array
  body: Uint8Array
}

type GetByteCodesOpts = {
  reqId?: bigint
  hashes: Uint8Array[]
  bytes: bigint
}

type GetTrieNodesOpts = {
  reqId?: bigint
  root: Uint8Array
  paths: Uint8Array[][]
  bytes: bigint
}
/*
 * Messages with responses that are added as
 * methods in camelCase to BoundProtocol.
 */
export interface SnapProtocolMethods {
  getAccountRange: (
    opts: GetAccountRangeOpts
  ) => Promise<{ reqId: bigint; accounts: AccountData[]; proof: Uint8Array[] }>
  getStorageRanges: (opts: GetStorageRangesOpts) => Promise<{
    reqId: bigint
    slots: StorageData[][]
    proof: Uint8Array[]
  }>
  getByteCodes: (opts: GetByteCodesOpts) => Promise<{ reqId: bigint; codes: Uint8Array[] }>
  getTrieNodes: (opts: GetTrieNodesOpts) => Promise<{ reqId: bigint; nodes: Uint8Array[] }>
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
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          setLengthLeft(origin, 32),
          setLengthLeft(limit, 32),
          bigIntToUnpaddedBytes(bytes),
        ]
      },
      decode: ([reqId, root, origin, limit, bytes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
          root,
          origin,
          limit,
          bytes: bytesToBigInt(bytes),
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
        proof: Uint8Array[]
      }) => {
        return [
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          accounts.map((account) => [
            setLengthLeft(account.hash, 32),
            accountBodyToSlim(account.body),
          ]),
          proof,
        ]
      },
      decode: ([reqId, accounts, proof]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
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
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          accounts.map((acc) => setLengthLeft(acc, 32)),
          origin,
          limit,
          bigIntToUnpaddedBytes(bytes),
        ]
      },
      decode: ([reqId, root, accounts, origin, limit, bytes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
          root,
          accounts,
          origin,
          limit,
          bytes: bytesToBigInt(bytes),
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
        proof: Uint8Array[]
      }) => {
        return [
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          slots.map((accSlots) =>
            accSlots.map((slotData) => [setLengthLeft(slotData.hash, 32), slotData.body])
          ),
          proof,
        ]
      },
      decode: ([reqId, slots, proof]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
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
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          hashes.map((hash) => setLengthLeft(hash, 32)),
          bigIntToUnpaddedBytes(bytes),
        ]
      },
      decode: ([reqId, hashes, bytes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
          hashes,
          bytes: bytesToBigInt(bytes),
        }
      },
    },
    {
      name: 'ByteCodes',
      code: 0x05,
      // [reqID: P, codes: [code1: B, code2: B, ...]]
      encode: ({ reqId, codes }: { reqId: bigint; codes: Uint8Array[] }) => {
        return [bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId), codes]
      },
      decode: ([reqId, codes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
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
          bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId),
          setLengthLeft(root, 32),
          paths,
          bigIntToUnpaddedBytes(bytes),
        ]
      },
      decode: ([reqId, root, paths, bytes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
          root,
          paths,
          bytes: bytesToBigInt(bytes),
        }
      },
    },
    {
      name: 'TrieNodes',
      code: 0x07,
      // [reqID: P, nodes: [node1: B, node2: B, ...]]
      encode: ({ reqId, nodes }: { reqId: bigint; nodes: Uint8Array[] }) => {
        return [bigIntToUnpaddedBytes(reqId ?? ++this.nextReqId), nodes]
      },
      decode: ([reqId, nodes]: any) => {
        return {
          reqId: bytesToBigInt(reqId),
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
