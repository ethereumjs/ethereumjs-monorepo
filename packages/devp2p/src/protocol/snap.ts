import { RLP, utils } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, bytesToHex } from '@ethereumjs/util'
import * as snappy from 'snappyjs'

import { ProtocolType } from '../types.ts'
import { formatLogData } from '../util.ts'

import { Protocol } from './protocol.ts'

import type { Peer } from '../rlpx/peer.ts'
import type { SendMethod } from '../types.ts'

export const SnapMessageCodes = {
  // snap1
  GET_ACCOUNT_RANGE: 0x00,
  ACCOUNT_RANGE: 0x01,
  GET_STORAGE_RANGES: 0x02,
  STORAGE_RANGES: 0x03,
  GET_BYTE_CODES: 0x04,
  BYTE_CODES: 0x05,
  GET_TRIE_NODES: 0x06,
  TRIE_NODES: 0x07,
} as const

export type SnapMessageCodes = (typeof SnapMessageCodes)[keyof typeof SnapMessageCodes]

// Create a reverse mapping: from numeric value back to the key name
export const SnapMessageCodeNames: { [key in SnapMessageCodes]: string } = Object.entries(
  SnapMessageCodes,
).reduce(
  (acc, [key, value]) => {
    acc[value] = key
    return acc
  },
  {} as { [key in SnapMessageCodes]: string },
)

export class SNAP extends Protocol {
  private DEBUG: boolean

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, ProtocolType.SNAP, version, SnapMessageCodes)
    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false
  }

  static snap = { name: 'snap', version: 1, length: 8, constructor: SNAP }

  _handleMessage(code: SnapMessageCodes, data: Uint8Array) {
    const payload = RLP.decode(data)

    // Note, this needs optimization, see issue #1882
    if (this.DEBUG) {
      this.debug(
        this.getMsgPrefix(code),
        `Received ${this.getMsgPrefix(code)} message from ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        }: ${formatLogData(bytesToHex(data), this._verbose)}`,
      )
    }

    switch (code) {
      case SnapMessageCodes.GET_ACCOUNT_RANGE:
      case SnapMessageCodes.ACCOUNT_RANGE:
      case SnapMessageCodes.GET_STORAGE_RANGES:
      case SnapMessageCodes.STORAGE_RANGES:
      case SnapMessageCodes.GET_BYTE_CODES:
      case SnapMessageCodes.BYTE_CODES:
      case SnapMessageCodes.GET_TRIE_NODES:
      case SnapMessageCodes.TRIE_NODES:
        break
      default:
        return
    }

    this.events.emit('message', code, payload)
  }

  sendStatus() {
    throw Error('SNAP protocol does not support status handshake')
  }

  /**
   *
   * @param code Message code
   * @param payload Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)
   */
  sendMessage(code: SnapMessageCodes, payload: any) {
    if (this.DEBUG) {
      this.debug(
        this.getMsgPrefix(code),
        `Send ${this.getMsgPrefix(code)} message to ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        }: ${formatLogData(utils.bytesToHex(RLP.encode(payload)), this._verbose)}`,
      )
    }

    switch (code) {
      case SnapMessageCodes.GET_ACCOUNT_RANGE:
      case SnapMessageCodes.ACCOUNT_RANGE:
      case SnapMessageCodes.GET_STORAGE_RANGES:
      case SnapMessageCodes.STORAGE_RANGES:
      case SnapMessageCodes.GET_BYTE_CODES:
      case SnapMessageCodes.BYTE_CODES:
      case SnapMessageCodes.GET_TRIE_NODES:
      case SnapMessageCodes.TRIE_NODES:
        break
      default:
        throw EthereumJSErrorWithoutCode(`Unknown code ${code}`)
    }

    payload = RLP.encode(payload)

    // Use snappy compression if peer supports DevP2P >=v5
    const protocolVersion = this._peer['_hello']?.protocolVersion
    if (protocolVersion !== undefined && protocolVersion >= 5) {
      payload = snappy.compress(payload)
    }

    this._send(code, payload)
  }

  getMsgPrefix(msgCode: SnapMessageCodes): string {
    return SnapMessageCodeNames[msgCode]
  }

  getVersion() {
    return this._version
  }
}
