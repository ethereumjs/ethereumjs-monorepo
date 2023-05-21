import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToBytes,
  bytesToHex,
  bytesToInt,
  bytesToUtf8,
  intToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import * as snappy from 'snappyjs'

import { DISCONNECT_REASONS } from '../rlpx/peer'
import { assertEq, formatLogData } from '../util'

import { EthProtocol, Protocol } from './protocol'

import type { Peer } from '../rlpx/peer'
import type { SendMethod } from './protocol'

export const DEFAULT_ANNOUNCE_TYPE = 1

export class LES extends Protocol {
  _status: LES.Status | null = null
  _peerStatus: LES.Status | null = null

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, EthProtocol.LES, version, LES.MESSAGE_CODES)

    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, 5000) // 5 sec * 1000
  }

  static les2 = { name: 'les', version: 2, length: 21, constructor: LES }
  static les3 = { name: 'les', version: 3, length: 23, constructor: LES }
  static les4 = { name: 'les', version: 4, length: 23, constructor: LES }

  _handleMessage(code: LES.MESSAGE_CODES, data: any) {
    const payload = RLP.decode(data)
    const messageName = this.getMsgPrefix(code)
    const debugMsg = `Received ${messageName} message from ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}`
    if (code !== LES.MESSAGE_CODES.STATUS) {
      const logData = formatLogData(bytesToHex(data), this._verbose)
      this.debug(messageName, `${debugMsg}: ${logData}`)
    }
    switch (code) {
      case LES.MESSAGE_CODES.STATUS: {
        assertEq(
          this._peerStatus,
          null,
          'Uncontrolled status message',
          this.debug.bind(this),
          'STATUS'
        )
        const statusArray: any = {}
        for (const value of payload as any) {
          statusArray[bytesToUtf8(value[0])] = value[1]
        }
        this._peerStatus = statusArray
        const peerStatusMsg = `${this._peerStatus ? this._getStatusString(this._peerStatus) : ''}`
        this.debug(messageName, `${debugMsg}: ${peerStatusMsg}`)
        this._handleStatus()
        break
      }

      case LES.MESSAGE_CODES.ANNOUNCE:
      case LES.MESSAGE_CODES.GET_BLOCK_HEADERS:
      case LES.MESSAGE_CODES.BLOCK_HEADERS:
      case LES.MESSAGE_CODES.GET_BLOCK_BODIES:
      case LES.MESSAGE_CODES.BLOCK_BODIES:
      case LES.MESSAGE_CODES.GET_RECEIPTS:
      case LES.MESSAGE_CODES.RECEIPTS:
      case LES.MESSAGE_CODES.GET_PROOFS:
      case LES.MESSAGE_CODES.PROOFS:
      case LES.MESSAGE_CODES.GET_CONTRACT_CODES:
      case LES.MESSAGE_CODES.CONTRACT_CODES:
      case LES.MESSAGE_CODES.GET_HEADER_PROOFS:
      case LES.MESSAGE_CODES.HEADER_PROOFS:
      case LES.MESSAGE_CODES.SEND_TX:
      case LES.MESSAGE_CODES.GET_PROOFS_V2:
      case LES.MESSAGE_CODES.PROOFS_V2:
      case LES.MESSAGE_CODES.GET_HELPER_TRIE_PROOFS:
      case LES.MESSAGE_CODES.HELPER_TRIE_PROOFS:
      case LES.MESSAGE_CODES.SEND_TX_V2:
      case LES.MESSAGE_CODES.GET_TX_STATUS:
      case LES.MESSAGE_CODES.TX_STATUS:
        if (this._version >= LES.les2.version) break
        return

      case LES.MESSAGE_CODES.STOP_MSG:
      case LES.MESSAGE_CODES.RESUME_MSG:
        if (this._version >= LES.les3.version) break
        return

      default:
        return
    }

    this.emit('message', code, payload)
  }

  _handleStatus() {
    if (this._status === null || this._peerStatus === null) return
    clearTimeout(this._statusTimeoutId!)
    assertEq(
      this._status['protocolVersion'],
      this._peerStatus['protocolVersion'],
      'Protocol version mismatch',
      this.debug.bind(this),
      'STATUS'
    )
    assertEq(
      this._status['networkId'],
      this._peerStatus['networkId'],
      'NetworkId mismatch',
      this.debug.bind(this),
      'STATUS'
    )
    assertEq(
      this._status['genesisHash'],
      this._peerStatus['genesisHash'],
      'Genesis block mismatch',
      this.debug.bind(this),
      'STATUS'
    )

    this.emit('status', this._peerStatus)
    if (this._firstPeer === '') {
      this._addFirstPeerDebugger()
    }
  }

  getVersion() {
    return this._version
  }

  _getStatusString(status: LES.Status) {
    let sStr = `[V:${bytesToInt(status['protocolVersion'])}, `
    sStr += `NID:${bytesToInt(status['networkId'] as Uint8Array)}, HTD:${bytesToInt(
      status['headTd']
    )}, `
    sStr += `HeadH:${bytesToHex(status['headHash'])}, HeadN:${bytesToInt(status['headNum'])}, `
    sStr += `GenH:${bytesToHex(status['genesisHash'])}`
    if (status['serveHeaders'] !== undefined) sStr += `, serveHeaders active`
    if (status['serveChainSince'] !== undefined)
      sStr += `, ServeCS: ${bytesToInt(status['serveChainSince'])}`
    if (status['serveStateSince'] !== undefined)
      sStr += `, ServeSS: ${bytesToInt(status['serveStateSince'])}`
    if (status['txRelay'] !== undefined) sStr += `, txRelay active`
    if (status['flowControl/BL)'] !== undefined) sStr += `, flowControl/BL set`
    if (status['flowControl/MRR)'] !== undefined) sStr += `, flowControl/MRR set`
    if (status['flowControl/MRC)'] !== undefined) sStr += `, flowControl/MRC set`
    if (status['forkID'] !== undefined)
      sStr += `, forkID: [crc32: ${bytesToHex(status['forkID'][0])}, nextFork: ${bytesToInt(
        status['forkID'][1]
      )}]`
    if (status['recentTxLookup'] !== undefined)
      sStr += `, recentTxLookup: ${bytesToInt(status['recentTxLookup'])}`
    sStr += `]`
    return sStr
  }

  sendStatus(status: LES.Status) {
    if (this._status !== null) return

    if (status.announceType === undefined) {
      status['announceType'] = intToBytes(DEFAULT_ANNOUNCE_TYPE)
    }
    status['protocolVersion'] = intToBytes(this._version)
    status['networkId'] = bigIntToBytes(this._peer._common.chainId())

    this._status = status

    const statusList: any[][] = []
    for (const key of Object.keys(status)) {
      statusList.push([utf8ToBytes(key), status[key]])
    }

    this.debug(
      'STATUS',
      `Send STATUS message to ${this._peer._socket.remoteAddress}:${
        this._peer._socket.remotePort
      } (les${this._version}): ${this._getStatusString(this._status)}`
    )

    let payload = RLP.encode(statusList)

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer._hello !== null && this._peer._hello.protocolVersion >= 5) {
      payload = snappy.compress(payload)
    }

    this._send(LES.MESSAGE_CODES.STATUS, payload)
    this._handleStatus()
  }

  /**
   *
   * @param code Message code
   * @param payload Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)
   */
  sendMessage(code: LES.MESSAGE_CODES, payload: any) {
    const messageName = this.getMsgPrefix(code)
    const logData = formatLogData(bytesToHex(RLP.encode(payload)), this._verbose)
    const debugMsg = `Send ${messageName} message to ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}: ${logData}`

    this.debug(messageName, debugMsg)

    switch (code) {
      case LES.MESSAGE_CODES.STATUS:
        throw new Error('Please send status message through .sendStatus')

      case LES.MESSAGE_CODES.ANNOUNCE: // LES/1
      case LES.MESSAGE_CODES.GET_BLOCK_HEADERS:
      case LES.MESSAGE_CODES.BLOCK_HEADERS:
      case LES.MESSAGE_CODES.GET_BLOCK_BODIES:
      case LES.MESSAGE_CODES.BLOCK_BODIES:
      case LES.MESSAGE_CODES.GET_RECEIPTS:
      case LES.MESSAGE_CODES.RECEIPTS:
      case LES.MESSAGE_CODES.GET_PROOFS:
      case LES.MESSAGE_CODES.PROOFS:
      case LES.MESSAGE_CODES.GET_CONTRACT_CODES:
      case LES.MESSAGE_CODES.CONTRACT_CODES:
      case LES.MESSAGE_CODES.GET_HEADER_PROOFS:
      case LES.MESSAGE_CODES.HEADER_PROOFS:
      case LES.MESSAGE_CODES.SEND_TX:
      case LES.MESSAGE_CODES.GET_PROOFS_V2: // LES/2
      case LES.MESSAGE_CODES.PROOFS_V2:
      case LES.MESSAGE_CODES.GET_HELPER_TRIE_PROOFS:
      case LES.MESSAGE_CODES.HELPER_TRIE_PROOFS:
      case LES.MESSAGE_CODES.SEND_TX_V2:
      case LES.MESSAGE_CODES.GET_TX_STATUS:
      case LES.MESSAGE_CODES.TX_STATUS:
        if (this._version >= LES.les2.version) break
        throw new Error(`Code ${code} not allowed with version ${this._version}`)

      case LES.MESSAGE_CODES.STOP_MSG:
      case LES.MESSAGE_CODES.RESUME_MSG:
        if (this._version >= LES.les3.version) break
        throw new Error(`Code ${code} not allowed with version ${this._version}`)

      default:
        throw new Error(`Unknown code ${code}`)
    }

    payload = RLP.encode(payload)

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer._hello !== null && this._peer._hello.protocolVersion >= 5) {
      payload = snappy.compress(payload)
    }

    this._send(code, payload)
  }

  getMsgPrefix(msgCode: LES.MESSAGE_CODES) {
    return LES.MESSAGE_CODES[msgCode]
  }
}

export namespace LES {
  export interface Status {
    [key: string]: any
    protocolVersion: Uint8Array
    networkId: Uint8Array
    headTd: Uint8Array
    headHash: Uint8Array
    headNum: Uint8Array
    genesisHash: Uint8Array
    serveHeaders: Uint8Array
    serveChainSince: Uint8Array
    serveStateSince: Uint8Array
    txRelay: Uint8Array
    'flowControl/BL': Uint8Array
    'flowControl/MRR': Uint8Array
    'flowControl/MRC': Uint8Array
    announceType: Uint8Array
    forkID: [Uint8Array, Uint8Array]
    recentTxLookup: Uint8Array
  }

  export enum MESSAGE_CODES {
    // LES/1
    STATUS = 0x00,
    ANNOUNCE = 0x01,
    GET_BLOCK_HEADERS = 0x02,
    BLOCK_HEADERS = 0x03,
    GET_BLOCK_BODIES = 0x04,
    BLOCK_BODIES = 0x05,
    GET_RECEIPTS = 0x06,
    RECEIPTS = 0x07,
    GET_PROOFS = 0x08,
    PROOFS = 0x09,
    GET_CONTRACT_CODES = 0x0a,
    CONTRACT_CODES = 0x0b,
    GET_HEADER_PROOFS = 0x0d,
    HEADER_PROOFS = 0x0e,
    SEND_TX = 0x0c,

    // LES/2
    GET_PROOFS_V2 = 0x0f,
    PROOFS_V2 = 0x10,
    GET_HELPER_TRIE_PROOFS = 0x11,
    HELPER_TRIE_PROOFS = 0x12,
    SEND_TX_V2 = 0x13,
    GET_TX_STATUS = 0x14,
    TX_STATUS = 0x15,

    // LES/3
    STOP_MSG = 0x16,
    RESUME_MSG = 0x17,
  }
}
