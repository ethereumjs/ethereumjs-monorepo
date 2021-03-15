import { EventEmitter } from 'events'
import * as rlp from 'rlp'
import ms from 'ms'
import { debug as createDebugLogger } from 'debug'
import { int2buffer, buffer2int, assertEq, formatLogData } from '../util'
import { Peer, DISCONNECT_REASONS } from '../rlpx/peer'

const debug = createDebugLogger('devp2p:les')
const verbose = createDebugLogger('verbose').enabled

export const DEFAULT_ANNOUNCE_TYPE = 1

export class LES extends EventEmitter {
  _version: any
  _peer: Peer
  _send: any
  _status: LES.Status | null
  _peerStatus: LES.Status | null
  _statusTimeoutId: NodeJS.Timeout
  constructor(version: number, peer: Peer, send: any) {
    super()

    this._version = version
    this._peer = peer
    this._send = send

    this._status = null
    this._peerStatus = null
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))
  }

  static les2 = { name: 'les', version: 2, length: 21, constructor: LES }

  _handleMessage(code: LES.MESSAGE_CODES, data: any) {
    const payload = rlp.decode(data)
    if (code !== LES.MESSAGE_CODES.STATUS) {
      const debugMsg = `Received ${this.getMsgPrefix(code)} message from ${
        this._peer._socket.remoteAddress
      }:${this._peer._socket.remotePort}`
      const logData = formatLogData(data.toString('hex'), verbose)
      debug(`${debugMsg}: ${logData}`)
    }
    switch (code) {
      case LES.MESSAGE_CODES.STATUS: {
        assertEq(this._peerStatus, null, 'Uncontrolled status message', debug)
        const statusArray: any = {}
        payload.forEach(function (value: any) {
          statusArray[value[0].toString()] = value[1]
        })
        this._peerStatus = statusArray
        debug(
          `Received ${this.getMsgPrefix(code)} message from ${this._peer._socket.remoteAddress}:${
            this._peer._socket.remotePort
          }: : ${this._peerStatus ? this._getStatusString(this._peerStatus) : ''}`
        )
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

      default:
        return
    }

    this.emit('message', code, payload)
  }

  _handleStatus() {
    if (this._status === null || this._peerStatus === null) return
    clearTimeout(this._statusTimeoutId)
    assertEq(
      this._status['protocolVersion'],
      this._peerStatus['protocolVersion'],
      'Protocol version mismatch',
      debug
    )
    assertEq(this._status['networkId'], this._peerStatus['networkId'], 'NetworkId mismatch', debug)
    assertEq(
      this._status['genesisHash'],
      this._peerStatus['genesisHash'],
      'Genesis block mismatch',
      debug
    )

    this.emit('status', this._peerStatus)
  }

  getVersion() {
    return this._version
  }

  _getStatusString(status: LES.Status) {
    let sStr = `[V:${buffer2int(status['protocolVersion'])}, `
    sStr += `NID:${buffer2int(status['networkId'] as Buffer)}, HTD:${buffer2int(
      status['headTd']
    )}, `
    sStr += `HeadH:${status['headHash'].toString('hex')}, HeadN:${buffer2int(status['headNum'])}, `
    sStr += `GenH:${status['genesisHash'].toString('hex')}`
    if (status['serveHeaders']) sStr += `, serveHeaders active`
    if (status['serveChainSince']) sStr += `, ServeCS: ${buffer2int(status['serveChainSince'])}`
    if (status['serveStateSince']) sStr += `, ServeSS: ${buffer2int(status['serveStateSince'])}`
    if (status['txRelax']) sStr += `, txRelay active`
    if (status['flowControl/BL']) sStr += `, flowControl/BL set`
    if (status['flowControl/MRR']) sStr += `, flowControl/MRR set`
    if (status['flowControl/MRC']) sStr += `, flowControl/MRC set`
    sStr += `]`
    return sStr
  }

  sendStatus(status: LES.Status) {
    if (this._status !== null) return

    if (!status.announceType) {
      status['announceType'] = DEFAULT_ANNOUNCE_TYPE
    }
    status['announceType'] = int2buffer(status['announceType'] as number)
    status['protocolVersion'] = int2buffer(this._version)
    status['networkId'] = this._peer._common.chainIdBN().toArrayLike(Buffer)

    this._status = status

    const statusList: any[][] = []
    Object.keys(status).forEach((key) => {
      statusList.push([key, status[key]])
    })

    debug(
      `Send STATUS message to ${this._peer._socket.remoteAddress}:${
        this._peer._socket.remotePort
      } (les${this._version}): ${this._getStatusString(this._status)}`
    )
    this._send(LES.MESSAGE_CODES.STATUS, rlp.encode(statusList))
    this._handleStatus()
  }

  /**
   *
   * @param code Message code
   * @param payload Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)
   */
  sendMessage(code: LES.MESSAGE_CODES, payload: any) {
    const debugMsg = `Send ${this.getMsgPrefix(code)} message to ${
      this._peer._socket.remoteAddress
    }:${this._peer._socket.remotePort}`
    const logData = formatLogData(rlp.encode(payload).toString('hex'), verbose)
    debug(`${debugMsg}: ${logData}`)

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

      default:
        throw new Error(`Unknown code ${code}`)
    }

    this._send(code, rlp.encode(payload))
  }

  getMsgPrefix(msgCode: LES.MESSAGE_CODES) {
    return LES.MESSAGE_CODES[msgCode]
  }
}

export namespace LES {
  export interface Status {
    [key: string]: Buffer | number
    protocolVersion: Buffer
    headTd: Buffer
    headHash: Buffer
    headNum: Buffer
    genesisHash: Buffer
    serveHeaders: Buffer
    serveChainSince: Buffer
    serveStateSince: Buffer
    txRelax: Buffer
    'flowControl/BL': Buffer
    'flowControl/MRR': Buffer
    'flowControl/MRC': Buffer
    announceType: Buffer | number
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
  }
}
