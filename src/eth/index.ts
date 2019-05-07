import { EventEmitter } from 'events'
import rlp from 'rlp-encoding'
import ms from 'ms'
import { int2buffer, buffer2int, assertEq } from '../util'
import { Peer, DISCONNECT_REASONS } from '../rlpx/peer'

const createDebugLogger = require('debug')
const debug = createDebugLogger('devp2p:eth')

export enum MESSAGE_CODES {
  // eth62
  STATUS = 0x00,
  NEW_BLOCK_HASHES = 0x01,
  TX = 0x02,
  GET_BLOCK_HEADERS = 0x03,
  BLOCK_HEADERS = 0x04,
  GET_BLOCK_BODIES = 0x05,
  BLOCK_BODIES = 0x06,
  NEW_BLOCK = 0x07,

  // eth63
  GET_NODE_DATA = 0x0d,
  NODE_DATA = 0x0e,
  GET_RECEIPTS = 0x0f,
  RECEIPTS = 0x10,
}

export type StatusMsg = {
  0: Buffer
  1: Buffer
  2: Buffer
  3: Buffer
  4: Buffer
  length: 5
}

export type Status = {
  version: number
  networkId: number
  td: Buffer
  bestHash: Buffer
  genesisHash: Buffer
}

export class ETH extends EventEmitter {
  _version: number
  _peer: Peer
  _send: (code: MESSAGE_CODES, data: Buffer) => any
  _status: StatusMsg | null
  _peerStatus: StatusMsg | null
  _statusTimeoutId: NodeJS.Timeout

  constructor(version: number, peer: Peer, send: (code: MESSAGE_CODES, data: Buffer) => any) {
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

  static eth62 = { name: 'eth', version: 62, length: 8, constructor: ETH }
  static eth63 = { name: 'eth', version: 63, length: 17, constructor: ETH }

  _handleMessage(code: MESSAGE_CODES, data: any) {
    const payload = rlp.decode(data)
    if (code !== MESSAGE_CODES.STATUS) {
      debug(
        `Received ${this.getMsgPrefix(code)} message from ${this._peer._socket.remoteAddress}:${
          this._peer._socket.remotePort
        }: ${data.toString('hex')}`,
      )
    }
    switch (code) {
      case MESSAGE_CODES.STATUS:
        assertEq(this._peerStatus, null, 'Uncontrolled status message')
        this._peerStatus = payload
        debug(
          `Received ${this.getMsgPrefix(code)} message from ${this._peer._socket.remoteAddress}:${
            this._peer._socket.remotePort
          }: : ${this._peerStatus ? this._getStatusString(this._peerStatus) : ''}`,
        )
        this._handleStatus()
        break

      case MESSAGE_CODES.NEW_BLOCK_HASHES:
      case MESSAGE_CODES.TX:
      case MESSAGE_CODES.GET_BLOCK_HEADERS:
      case MESSAGE_CODES.BLOCK_HEADERS:
      case MESSAGE_CODES.GET_BLOCK_BODIES:
      case MESSAGE_CODES.BLOCK_BODIES:
      case MESSAGE_CODES.NEW_BLOCK:
        if (this._version >= ETH.eth62.version) break
        return

      case MESSAGE_CODES.GET_NODE_DATA:
      case MESSAGE_CODES.NODE_DATA:
      case MESSAGE_CODES.GET_RECEIPTS:
      case MESSAGE_CODES.RECEIPTS:
        if (this._version >= ETH.eth63.version) break
        return

      default:
        return
    }

    this.emit('message', code, payload)
  }

  _handleStatus(): void {
    if (this._status === null || this._peerStatus === null) return
    clearTimeout(this._statusTimeoutId)

    assertEq(this._status[0], this._peerStatus[0], 'Protocol version mismatch')
    assertEq(this._status[1], this._peerStatus[1], 'NetworkId mismatch')
    assertEq(this._status[4], this._peerStatus[4], 'Genesis block mismatch')

    this.emit('status', {
      networkId: this._peerStatus[1],
      td: Buffer.from(this._peerStatus[2]),
      bestHash: Buffer.from(this._peerStatus[3]),
      genesisHash: Buffer.from(this._peerStatus[4]),
    })
  }

  getVersion() {
    return this._version
  }

  _getStatusString(status: StatusMsg) {
    var sStr = `[V:${buffer2int(status[0])}, NID:${buffer2int(status[1])}, TD:${buffer2int(
      status[2],
    )}`
    sStr += `, BestH:${status[3].toString('hex')}, GenH:${status[4].toString('hex')}]`
    return sStr
  }

  sendStatus(status: Status) {
    if (this._status !== null) return
    this._status = [
      int2buffer(this._version),
      int2buffer(status.networkId),
      status.td,
      status.bestHash,
      status.genesisHash,
    ]

    debug(
      `Send STATUS message to ${this._peer._socket.remoteAddress}:${
        this._peer._socket.remotePort
      } (eth${this._version}): ${this._getStatusString(this._status)}`,
    )
    this._send(MESSAGE_CODES.STATUS, rlp.encode(this._status))
    this._handleStatus()
  }

  sendMessage(code: MESSAGE_CODES, payload: any) {
    debug(
      `Send ${this.getMsgPrefix(code)} message to ${this._peer._socket.remoteAddress}:${
        this._peer._socket.remotePort
      }: ${rlp.encode(payload).toString('hex')}`,
    )
    switch (code) {
      case MESSAGE_CODES.STATUS:
        throw new Error('Please send status message through .sendStatus')

      case MESSAGE_CODES.NEW_BLOCK_HASHES:
      case MESSAGE_CODES.TX:
      case MESSAGE_CODES.GET_BLOCK_HEADERS:
      case MESSAGE_CODES.BLOCK_HEADERS:
      case MESSAGE_CODES.GET_BLOCK_BODIES:
      case MESSAGE_CODES.BLOCK_BODIES:
      case MESSAGE_CODES.NEW_BLOCK:
        if (this._version >= ETH.eth62.version) break
        throw new Error(`Code ${code} not allowed with version ${this._version}`)

      case MESSAGE_CODES.GET_NODE_DATA:
      case MESSAGE_CODES.NODE_DATA:
      case MESSAGE_CODES.GET_RECEIPTS:
      case MESSAGE_CODES.RECEIPTS:
        if (this._version >= ETH.eth63.version) break
        throw new Error(`Code ${code} not allowed with version ${this._version}`)

      default:
        throw new Error(`Unknown code ${code}`)
    }

    this._send(code, rlp.encode(payload))
  }

  getMsgPrefix(msgCode: MESSAGE_CODES): string {
    return MESSAGE_CODES[msgCode]
  }
}
