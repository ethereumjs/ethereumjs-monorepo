import { RLP, utils } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, bigIntToUnpaddedBytes, bytesToHex } from '@ethereumjs/util'
import * as snappy from 'snappyjs'

import { DISCONNECT_REASON, ProtocolType } from '../types.ts'
import { formatLogData } from '../util.ts'
import { assertSameGenesis, assertSameNetworkId } from './statusAssert.ts'

import { Protocol } from './protocol.ts'
import {
  MAX_STATY_MESSAGE_BYTES,
  MAX_STATY_PROOF_NODES,
  type StatyLocalStatusFields,
  type StatyPeerStatus,
  countProofNodesInStatyMessage,
  encodeStatyStatus,
  parseStatyStatus,
} from './staty/codec.ts'
import { StatyMessageCodeNames, StatyMessageCodes } from './staty/codes.ts'

import type { Input, NestedUint8Array } from '@ethereumjs/rlp'
import type { Peer } from '../rlpx/peer.ts'
import type { SendMethod } from '../types.ts'

export { StatyMessageCodeNames, StatyMessageCodes } from './staty/codes.ts'
export {
  MAX_STATY_MESSAGE_BYTES,
  MAX_STATY_PROOF_NODES,
  encodeStatyStatus,
  parseStatyStatus,
  type StatyLocalStatusFields,
  type StatyPeerStatus,
  statyMessageNameToCode,
  statyStatusFromGenesisHex,
} from './staty/codec.ts'

/** STATY/0 hot-epoch and witness swarm subprotocol over RLPx. */
export class STATY extends Protocol {
  private DEBUG: boolean
  private _localFields: StatyLocalStatusFields | null = null
  private _peerStatus: StatyPeerStatus | null = null
  private _peerStatusSeen = false

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, ProtocolType.STATY, version, StatyMessageCodes)
    this.DEBUG = globalThis.process?.env?.DEBUG?.includes('ethjs') ?? false
  }

  static staty0 = { name: 'staty', version: 0, length: 11, constructor: STATY }

  peerStatus(): StatyPeerStatus | null {
    return this._peerStatus
  }

  setLocalStatusFields(fields: StatyLocalStatusFields): void {
    this._localFields = fields
  }

  sendStatus(fields?: StatyLocalStatusFields): void {
    const local = fields ?? this._localFields
    if (local === null) {
      throw EthereumJSErrorWithoutCode('STATY sendStatus: local status fields not set')
    }
    const chainId = this._peer.common.chainId()
    const payload = encodeStatyStatus(chainId, local)
    if (fields !== undefined) {
      this._localFields = fields
    }
    if (this.DEBUG) {
      this.debug(
        'STATUS',
        `Send STATY STATUS to ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        }`,
      )
    }
    let encoded = RLP.encode(payload)
    if (encoded.byteLength > MAX_STATY_MESSAGE_BYTES) {
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      throw EthereumJSErrorWithoutCode('STATY STATUS: payload exceeds max size')
    }
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      encoded = snappy.compress(encoded)
    }
    this._send(StatyMessageCodes.STATUS, encoded)
  }

  _handleMessage(code: number, data: Uint8Array) {
    if (data.byteLength > MAX_STATY_MESSAGE_BYTES) {
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      return
    }
    let payload: NestedUint8Array | Uint8Array
    try {
      payload = RLP.decode(data)
    } catch {
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      return
    }
    if (countProofNodesInStatyMessage(code as StatyMessageCodes, payload) > MAX_STATY_PROOF_NODES) {
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      return
    }

    if (this.DEBUG && code !== StatyMessageCodes.STATUS) {
      this.debug(
        this.getMsgPrefix(code as StatyMessageCodes),
        `Received ${this.getMsgPrefix(code as StatyMessageCodes)} from ${
          this._peer['_socket'].remoteAddress
        }:${this._peer['_socket'].remotePort}: ${formatLogData(bytesToHex(data), this._verbose)}`,
      )
    }

    switch (code) {
      case StatyMessageCodes.STATUS:
        this._handleStatus(payload)
        break
      default:
        this.events.emit('message', code as StatyMessageCodes, payload)
    }
  }

  private _handleStatus(payload: unknown): void {
    let remote: StatyPeerStatus
    try {
      remote = parseStatyStatus(payload)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      throw EthereumJSErrorWithoutCode(message)
    }
    try {
      if (remote.protocolVersion !== 0) {
        throw EthereumJSErrorWithoutCode('STATY STATUS: bad protocol version')
      }
      assertSameNetworkId(
        bigIntToUnpaddedBytes(this._peer.common.chainId()),
        bigIntToUnpaddedBytes(remote.chainId),
      )
      const genesis = this._localFields?.genesisHash
      if (genesis !== undefined) {
        assertSameGenesis(genesis, remote.genesisHash)
      }
    } catch {
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      return
    }

    const first = !this._peerStatusSeen
    this._peerStatus = remote
    this._peerStatusSeen = true
    if (this._statusTimeoutId !== undefined) {
      clearTimeout(this._statusTimeoutId)
      this._statusTimeoutId = undefined
    }
    if (first) {
      this.events.emit('status', remote)
    } else {
      this.events.emit('statusUpdated', remote)
    }
  }

  sendMessage(code: StatyMessageCodes, payload: Input) {
    if (code === StatyMessageCodes.STATUS) {
      throw EthereumJSErrorWithoutCode('Please send STATY STATUS through .sendStatus')
    }
    if (this.DEBUG) {
      this.debug(
        this.getMsgPrefix(code),
        `Send ${this.getMsgPrefix(code)} to ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        }: ${formatLogData(utils.bytesToHex(RLP.encode(payload)), this._verbose)}`,
      )
    }
    switch (code) {
      case StatyMessageCodes.GET_EPOCH_MANIFEST:
      case StatyMessageCodes.EPOCH_MANIFEST:
      case StatyMessageCodes.GET_EPOCH_PART:
      case StatyMessageCodes.EPOCH_PART:
      case StatyMessageCodes.GET_WITNESSES:
      case StatyMessageCodes.WITNESSES:
      case StatyMessageCodes.GET_BYTECODES:
      case StatyMessageCodes.BYTECODES:
      case StatyMessageCodes.GET_STATY_PEERS:
      case StatyMessageCodes.STATY_PEERS:
        break
      default:
        throw EthereumJSErrorWithoutCode(`Unknown STATY code ${code}`)
    }
    let encoded = RLP.encode(payload)
    if (encoded.byteLength > MAX_STATY_MESSAGE_BYTES) {
      throw EthereumJSErrorWithoutCode('STATY message exceeds max size')
    }
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      encoded = snappy.compress(encoded)
    }
    this._send(code, encoded)
  }

  getMsgPrefix(msgCode: StatyMessageCodes): string {
    return StatyMessageCodeNames[msgCode]
  }

  getVersion() {
    return this._version
  }
}
