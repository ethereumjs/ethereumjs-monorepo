const { EventEmitter } = require('events')
const rlp = require('rlp-encoding')
const ms = require('ms')
const { int2buffer, buffer2int, assertEq } = require('../util')
const Peer = require('../rlpx/peer')

const createDebugLogger = require('debug')
const debug = createDebugLogger('devp2p:les')

const MESSAGE_CODES = {
  // LES/1
  STATUS: 0x00,
  ANNOUNCE: 0x01,
  GET_BLOCK_HEADERS: 0x02,
  BLOCK_HEADERS: 0x03,
  GET_BLOCK_BODIES: 0x04,
  BLOCK_BODIES: 0x05,
  GET_RECEIPTS: 0x06,
  RECEIPTS: 0x07,
  GET_PROOFS: 0x08,
  PROOFS: 0x09,
  GET_CONTRACT_CODES: 0x0a,
  CONTRACT_CODES: 0x0b,
  GET_HEADER_PROOFS: 0x0d,
  HEADER_PROOFS: 0x0e,
  SEND_TX: 0x0c,

  // LES/2
  GET_PROOFS_V2: 0x0f,
  PROOFS_V2: 0x10,
  GET_HELPER_TRIE_PROOFS: 0x11,
  HELPER_TRIE_PROOFS: 0x12,
  SEND_TX_V2: 0x13,
  GET_TX_STATUS: 0x14,
  TX_STATUS: 0x15
}

const DEFAULT_ACCOUNCE_TYPE = 1

class LES extends EventEmitter {
  constructor (version, peer, send) {
    super()

    this._version = version
    this._peer = peer
    this._send = send

    this._status = null
    this._peerStatus = null
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(Peer.DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))
  }

  static les2 = { name: 'les', version: 2, length: 21, constructor: LES }

  static MESSAGE_CODES = MESSAGE_CODES

  _handleMessage (code, data) {
    const payload = rlp.decode(data)
    if (code !== MESSAGE_CODES.STATUS) {
      debug(`Received ${this.getMsgPrefix(code)} message from ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}: ${data.toString('hex')}`)
    }
    switch (code) {
      case MESSAGE_CODES.STATUS:
        assertEq(this._peerStatus, null, 'Uncontrolled status message')
        let statusArray = {}
        payload.forEach(function (value) {
          statusArray[value[0].toString()] = value[1]
        })
        this._peerStatus = statusArray
        debug(`Received ${this.getMsgPrefix(code)} message from ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}: : ${this._getStatusString(this._peerStatus)}`)
        this._handleStatus()
        break

      case MESSAGE_CODES.ANNOUNCE:
      case MESSAGE_CODES.GET_BLOCK_HEADERS:
      case MESSAGE_CODES.BLOCK_HEADERS:
      case MESSAGE_CODES.GET_BLOCK_BODIES:
      case MESSAGE_CODES.BLOCK_BODIES:
      case MESSAGE_CODES.GET_RECEIPTS:
      case MESSAGE_CODES.RECEIPTS:
      case MESSAGE_CODES.GET_PROOFS:
      case MESSAGE_CODES.PROOFS:
      case MESSAGE_CODES.GET_CONTRACT_CODES:
      case MESSAGE_CODES.CONTRACT_CODES:
      case MESSAGE_CODES.GET_HEADER_PROOFS:
      case MESSAGE_CODES.HEADER_PROOFS:
      case MESSAGE_CODES.SEND_TX:
      case MESSAGE_CODES.GET_PROOFS_V2:
      case MESSAGE_CODES.PROOFS_V2:
      case MESSAGE_CODES.GET_HELPER_TRIE_PROOFS:
      case MESSAGE_CODES.HELPER_TRIE_PROOFS:
      case MESSAGE_CODES.SEND_TX_V2:
      case MESSAGE_CODES.GET_TX_STATUS:
      case MESSAGE_CODES.TX_STATUS:
        if (this._version >= LES.les2.version) break
        return

      default:
        return
    }

    this.emit('message', code, payload)
  }

  _handleStatus () {
    if (this._status === null || this._peerStatus === null) return
    clearTimeout(this._statusTimeoutId)
    assertEq(this._status['protocolVersion'], this._peerStatus['protocolVersion'], 'Protocol version mismatch')
    assertEq(this._status['networkId'], this._peerStatus['networkId'], 'NetworkId mismatch')
    assertEq(this._status['genesisHash'], this._peerStatus['genesisHash'], 'Genesis block mismatch')

    this.emit('status', this._peerStatus)
  }

  getVersion () {
    return this._version
  }

  _getStatusString (status) {
    var sStr = `[V:${buffer2int(status['protocolVersion'])}, `
    sStr += `NID:${buffer2int(status['networkId'])}, HTD:${buffer2int(status['headTd'])}, `
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

  sendStatus (status) {
    if (this._status !== null) return

    if (!status.announceType) {
      status['announceType'] = DEFAULT_ACCOUNCE_TYPE
    }
    status['announceType'] = int2buffer(status['announceType'])
    status['protocolVersion'] = int2buffer(this._version)
    status['networkId'] = int2buffer(status['networkId'])

    this._status = status

    let statusList = []
    Object.keys(status).forEach((key) => {
      statusList.push([key, status[key]])
    })

    debug(`Send STATUS message to ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort} (les${this._version}): ${this._getStatusString(this._status)}`)
    this._send(MESSAGE_CODES.STATUS, rlp.encode(statusList))
    this._handleStatus()
  }

  sendMessage (code, reqId, payload) {
    debug(`Send ${this.getMsgPrefix(code)} message to ${this._peer._socket.remoteAddress}:${this._peer._socket.remotePort}: ${rlp.encode(payload).toString('hex')}`)
    switch (code) {
      case MESSAGE_CODES.STATUS:
        throw new Error('Please send status message through .sendStatus')

      case MESSAGE_CODES.ANNOUNCE: // LES/1
      case MESSAGE_CODES.GET_BLOCK_HEADERS:
      case MESSAGE_CODES.BLOCK_HEADERS:
      case MESSAGE_CODES.GET_BLOCK_BODIES:
      case MESSAGE_CODES.BLOCK_BODIES:
      case MESSAGE_CODES.GET_RECEIPTS:
      case MESSAGE_CODES.RECEIPTS:
      case MESSAGE_CODES.GET_PROOFS:
      case MESSAGE_CODES.PROOFS:
      case MESSAGE_CODES.GET_CONTRACT_CODES:
      case MESSAGE_CODES.CONTRACT_CODES:
      case MESSAGE_CODES.GET_HEADER_PROOFS:
      case MESSAGE_CODES.HEADER_PROOFS:
      case MESSAGE_CODES.SEND_TX:
      case MESSAGE_CODES.GET_PROOFS_V2: // LES/2
      case MESSAGE_CODES.PROOFS_V2:
      case MESSAGE_CODES.GET_HELPER_TRIE_PROOFS:
      case MESSAGE_CODES.HELPER_TRIE_PROOFS:
      case MESSAGE_CODES.SEND_TX_V2:
      case MESSAGE_CODES.GET_TX_STATUS:
      case MESSAGE_CODES.TX_STATUS:
        if (this._version >= LES.les2.version) break
        throw new Error(`Code ${code} not allowed with version ${this._version}`)

      default:
        throw new Error(`Unknown code ${code}`)
    }

    this._send(code, rlp.encode([reqId, payload]))
  }

  getMsgPrefix (msgCode) {
    return Object.keys(MESSAGE_CODES).find(key => MESSAGE_CODES[key] === msgCode)
  }
}

module.exports = LES
