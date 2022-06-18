import { arrToBufArr, bigIntToBuffer, bufArrToArr } from '@ethereumjs/util'
import RLP from 'rlp'
import ms = require('ms')
import * as snappy from 'snappyjs'
import { int2buffer, buffer2int, assertEq, formatLogData } from '../util'
import { Peer, DISCONNECT_REASONS } from '../rlpx/peer'
import { EthProtocol, Protocol, SendMethod } from './protocol'

export const DEFAULT_ANNOUNCE_TYPE = 1

export class LES extends Protocol {
  _status: LES.Status | null = null
  _peerStatus: LES.Status | null = null

  constructor(version: number, peer: Peer, send: SendMethod) {
    super(peer, send, EthProtocol.LES, version, LES.MESSAGE_CODES)

    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))
  }

  static les2 = { name: 'les', version: 2, length: 21, constructor: LES }
  static les3 = { name: 'les', version: 3, length: 23, constructor: LES }
  static les4 = { name: 'les', version: 4, length: 23, constructor: LES }

  _handleMessage(code: LES.MESSAGE_CODES, data: any) {
    const payload = arrToBufArr(RLP.decode(bufArrToArr(data)))
    const messageName = this.getMsgPrefix(code)
    const debugMsg = `Received ${messageName} message from ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}`

    if (code !== LES.MESSAGE_CODES.STATUS) {
      const logData = formatLogData(data.toString('hex'), this._verbose)
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
        payload.forEach(function (value: any) {
          statusArray[value[0].toString()] = value[1]
        })
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
    clearTimeout(this._statusTimeoutId)
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
    let sStr = `[V:${buffer2int(status['protocolVersion'])}, `
    sStr += `NID:${buffer2int(status['networkId'] as Buffer)}, HTD:${buffer2int(
      status['headTd']
    )}, `
    sStr += `HeadH:${status['headHash'].toString('hex')}, HeadN:${buffer2int(status['headNum'])}, `
    sStr += `GenH:${status['genesisHash'].toString('hex')}`
    if (status['serveHeaders']) sStr += `, serveHeaders active`
    if (status['serveChainSince']) sStr += `, ServeCS: ${buffer2int(status['serveChainSince'])}`
    if (status['serveStateSince']) sStr += `, ServeSS: ${buffer2int(status['serveStateSince'])}`
    if (status['txRelay']) sStr += `, txRelay active`
    if (status['flowControl/BL']) sStr += `, flowControl/BL set`
    if (status['flowControl/MRR']) sStr += `, flowControl/MRR set`
    if (status['flowControl/MRC']) sStr += `, flowControl/MRC set`
    if (status['forkID'])
      sStr += `, forkID: [crc32: ${status['forkID'][0].toString('hex')}, nextFork: ${buffer2int(
        status['forkID'][1]
      )}]`
    if (status['recentTxLookup'])
      sStr += `, recentTxLookup: ${buffer2int(status['recentTxLookup'])}`
    sStr += `]`
    return sStr
  }

  sendStatus(status: LES.Status) {
    if (this._status !== null) return

    if (!status.announceType) {
      status['announceType'] = int2buffer(DEFAULT_ANNOUNCE_TYPE)
    }
    status['protocolVersion'] = int2buffer(this._version)
    status['networkId'] = bigIntToBuffer(this._peer._common.chainId())

    this._status = status

    const statusList: any[][] = []
    Object.keys(status).forEach((key) => {
      statusList.push([Buffer.from(key), status[key]])
    })

    this.debug(
      'STATUS',
      `Send STATUS message to ${this._peer._socket.remoteAddress}:${
        this._peer._socket.remotePort
      } (les${this._version}): ${this._getStatusString(this._status)}`
    )

    let payload = Buffer.from(RLP.encode(bufArrToArr(statusList)))

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer._hello?.protocolVersion && this._peer._hello?.protocolVersion >= 5) {
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
    const logData = formatLogData(
      Buffer.from(RLP.encode(bufArrToArr(payload))).toString('hex'),
      this._verbose
    )
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

    payload = Buffer.from(RLP.encode(payload))

    // Use snappy compression if peer supports DevP2P >=v5
    if (this._peer._hello?.protocolVersion && this._peer._hello?.protocolVersion >= 5) {
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
    protocolVersion: Buffer
    networkId: Buffer
    headTd: Buffer
    headHash: Buffer
    headNum: Buffer
    genesisHash: Buffer
    serveHeaders: Buffer
    serveChainSince: Buffer
    serveStateSince: Buffer
    txRelay: Buffer
    'flowControl/BL': Buffer
    'flowControl/MRR': Buffer
    'flowControl/MRC': Buffer
    announceType: Buffer
    forkID: [Buffer, Buffer]
    recentTxLookup: Buffer
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
