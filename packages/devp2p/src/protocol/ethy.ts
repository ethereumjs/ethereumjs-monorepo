import { RLP, utils } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, bigIntToUnpaddedBytes, bytesToHex } from '@ethereumjs/util'
import * as snappy from 'snappyjs'

import { DISCONNECT_REASON, ProtocolType } from '../types.ts'
import { formatLogData } from '../util.ts'
import { assertSameGenesis, assertSameNetworkId } from './statusAssert.ts'

import {
  type EthyLocalStatusFields,
  type EthyPeerStatus,
  encodeEthyStatus,
  parseEthyStatus,
} from './ethy/codec.ts'
import { EthyMessageCodeNames, EthyMessageCodes } from './ethy/codes.ts'
import { Protocol } from './protocol.ts'

import type { Input } from '@ethereumjs/rlp'
import type { Peer } from '../rlpx/peer.ts'
import type { SendMethod } from '../types.ts'

export { EthyMessageCodeNames, EthyMessageCodes } from './ethy/codes.ts'
export {
  encodeEthyStatus,
  parseEthyStatus,
  type EthyLocalStatusFields,
  type EthyPeerStatus,
  ethyMessageNameToCode,
  ethyStatusFromGenesisHex,
} from './ethy/codec.ts'

/** ETHY/0 self-proving flat-state swarm subprotocol over RLPx. */
export class ETHY extends Protocol {
  private DEBUG: boolean
  private _localFields: EthyLocalStatusFields | null = null
  private _peerStatus: EthyPeerStatus | null = null
  private _peerStatusSeen = false

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, ProtocolType.ETHY, version, EthyMessageCodes)
    this.DEBUG = globalThis.process?.env?.DEBUG?.includes('ethjs') ?? false
  }

  static ethy0 = { name: 'ethy', version: 0, length: 11, constructor: ETHY }

  peerStatus(): EthyPeerStatus | null {
    return this._peerStatus
  }

  setLocalStatusFields(fields: EthyLocalStatusFields): void {
    this._localFields = fields
  }

  sendStatus(fields?: EthyLocalStatusFields): void {
    const local = fields ?? this._localFields
    if (local === null) {
      throw EthereumJSErrorWithoutCode('ETHY sendStatus: local status fields not set')
    }
    const chainId = this._peer.common.chainId()
    const payload = encodeEthyStatus(chainId, local)
    if (fields !== undefined) {
      this._localFields = fields
    }
    if (this.DEBUG) {
      this.debug(
        'STATUS',
        `Send ETHY STATUS to ${this._peer['_socket'].remoteAddress}:${
          this._peer['_socket'].remotePort
        }`,
      )
    }
    let encoded = RLP.encode(payload)
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      encoded = snappy.compress(encoded)
    }
    this._send(EthyMessageCodes.STATUS, encoded)
  }

  _handleMessage(code: number, data: Uint8Array) {
    const payload = RLP.decode(data)

    if (this.DEBUG && code !== EthyMessageCodes.STATUS) {
      this.debug(
        this.getMsgPrefix(code as EthyMessageCodes),
        `Received ${this.getMsgPrefix(code as EthyMessageCodes)} from ${
          this._peer['_socket'].remoteAddress
        }:${this._peer['_socket'].remotePort}: ${formatLogData(bytesToHex(data), this._verbose)}`,
      )
    }

    switch (code) {
      case EthyMessageCodes.STATUS:
        this._handleStatus(payload)
        break
      default:
        this.events.emit('message', code as EthyMessageCodes, payload)
    }
  }

  private _handleStatus(payload: unknown): void {
    let remote: EthyPeerStatus
    try {
      remote = parseEthyStatus(payload)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this._peer.disconnect(DISCONNECT_REASON.SUBPROTOCOL_ERROR)
      throw EthereumJSErrorWithoutCode(message)
    }
    try {
      if (remote.protocolVersion !== 0) {
        throw EthereumJSErrorWithoutCode('ETHY STATUS: bad protocol version')
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

  sendMessage(code: EthyMessageCodes, payload: Input) {
    if (code === EthyMessageCodes.STATUS) {
      throw EthereumJSErrorWithoutCode('Please send ETHY STATUS through .sendStatus')
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
      case EthyMessageCodes.GET_BUCKET_MANIFEST:
      case EthyMessageCodes.BUCKET_MANIFEST:
      case EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK:
      case EthyMessageCodes.PROVEN_ACCOUNT_CHUNK:
      case EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE:
      case EthyMessageCodes.PROVEN_STORAGE_OR_CODE:
      case EthyMessageCodes.GET_BAL_RANGE:
      case EthyMessageCodes.BAL_RANGE:
      case EthyMessageCodes.GET_ETHY_PEERS:
      case EthyMessageCodes.ETHY_PEERS:
        break
      default:
        throw EthereumJSErrorWithoutCode(`Unknown ETHY code ${code}`)
    }
    let encoded = RLP.encode(payload)
    if (this._peer['_hello'] !== null && this._peer['_hello'].protocolVersion >= 5) {
      encoded = snappy.compress(encoded)
    }
    this._send(code, encoded)
  }

  getMsgPrefix(msgCode: EthyMessageCodes): string {
    return EthyMessageCodeNames[msgCode]
  }

  getVersion() {
    return this._version
  }
}
