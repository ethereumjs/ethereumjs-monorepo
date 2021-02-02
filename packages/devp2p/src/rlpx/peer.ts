import { EventEmitter } from 'events'
import * as rlp from 'rlp'
import * as util from '../util'
import BufferList = require('bl')
import ms from 'ms'
import { debug as createDebugLogger } from 'debug'
import Common from '@ethereumjs/common'
import { ECIES } from './ecies'
import { ETH, LES } from '../'
import { int2buffer, buffer2int, formatLogData } from '../util'
import { Socket } from 'net'

const debug = createDebugLogger('devp2p:rlpx:peer')
const verbose = createDebugLogger('verbose').enabled

export const BASE_PROTOCOL_VERSION = 4
export const BASE_PROTOCOL_LENGTH = 16

export const PING_INTERVAL = ms('15s')

export enum PREFIXES {
  HELLO = 0x00,
  DISCONNECT = 0x01,
  PING = 0x02,
  PONG = 0x03,
}

export enum DISCONNECT_REASONS {
  DISCONNECT_REQUESTED = 0x00,
  NETWORK_ERROR = 0x01,
  PROTOCOL_ERROR = 0x02,
  USELESS_PEER = 0x03,
  TOO_MANY_PEERS = 0x04,
  ALREADY_CONNECTED = 0x05,
  INCOMPATIBLE_VERSION = 0x06,
  INVALID_IDENTITY = 0x07,
  CLIENT_QUITTING = 0x08,
  UNEXPECTED_IDENTITY = 0x09,
  SAME_IDENTITY = 0x0a,
  TIMEOUT = 0x0b,
  SUBPROTOCOL_ERROR = 0x10,
}

export type HelloMsg = {
  0: Buffer
  1: Buffer
  2: Buffer[][]
  3: Buffer
  4: Buffer
  length: 5
}

export interface ProtocolDescriptor {
  protocol?: any
  offset: number
  length?: number
}

export interface ProtocolConstructor {
  new (...args: any[]): any
}

export interface Capabilities {
  name: string
  version: number
  length: number
  constructor: ProtocolConstructor
}

export interface Hello {
  protocolVersion: number
  clientId: string
  capabilities: Capabilities[]
  port: number
  id: Buffer
}

export class Peer extends EventEmitter {
  _clientId: Buffer
  _capabilities?: Capabilities[]
  _common: Common
  _port: number
  _id: Buffer
  _remoteClientIdFilter: any
  _remoteId: Buffer
  _EIP8: Buffer
  _eciesSession: ECIES
  _state: string
  _weHello: HelloMsg | null
  _hello: Hello | null
  _nextPacketSize: number
  _socket: Socket
  _socketData: BufferList
  _pingIntervalId: NodeJS.Timeout | null
  _pingTimeoutId: NodeJS.Timeout | null
  _closed: boolean
  _connected: boolean
  _disconnectReason?: DISCONNECT_REASONS
  _disconnectWe: any
  _pingTimeout: number
  _protocols: ProtocolDescriptor[]

  constructor(options: any) {
    super()

    // hello data
    this._clientId = options.clientId
    this._capabilities = options.capabilities
    this._common = options.common
    this._port = options.port
    this._id = options.id
    this._remoteClientIdFilter = options.remoteClientIdFilter

    // ECIES session
    this._remoteId = options.remoteId
    this._EIP8 = options.EIP8 !== undefined ? options.EIP8 : true
    this._eciesSession = new ECIES(options.privateKey, this._id, this._remoteId)

    // Auth, Ack, Header, Body
    this._state = 'Auth'
    this._weHello = null
    this._hello = null
    this._nextPacketSize = 307

    // socket
    this._socket = options.socket
    this._socketData = new BufferList()
    this._socket.on('data', this._onSocketData.bind(this))
    this._socket.on('error', (err: Error) => this.emit('error', err))
    this._socket.once('close', this._onSocketClose.bind(this))

    this._connected = false
    this._closed = false
    this._disconnectWe = null
    this._pingIntervalId = null
    this._pingTimeout = options.timeout
    this._pingTimeoutId = null

    // sub-protocols
    this._protocols = []

    // send AUTH if outgoing connection
    if (this._remoteId !== null) {
      this._sendAuth()
    }
  }

  /**
   * Send AUTH message
   */
  _sendAuth() {
    if (this._closed) return
    debug(
      `Send auth (EIP8: ${this._EIP8}) to ${this._socket.remoteAddress}:${this._socket.remotePort}`
    )
    if (this._EIP8) {
      const authEIP8 = this._eciesSession.createAuthEIP8()
      if (!authEIP8) return
      this._socket.write(authEIP8)
    } else {
      const authNonEIP8 = this._eciesSession.createAuthNonEIP8()
      if (!authNonEIP8) return
      this._socket.write(authNonEIP8)
    }
    this._state = 'Ack'
    this._nextPacketSize = 210
  }

  /**
   * Send ACK message
   */
  _sendAck() {
    if (this._closed) return
    debug(
      `Send ack (EIP8: ${this._eciesSession._gotEIP8Auth}) to ${this._socket.remoteAddress}:${this._socket.remotePort}`
    )
    if (this._eciesSession._gotEIP8Auth) {
      const ackEIP8 = this._eciesSession.createAckEIP8()
      if (!ackEIP8) return
      this._socket.write(ackEIP8)
    } else {
      const ackOld = this._eciesSession.createAckOld()
      if (!ackOld) return
      this._socket.write(ackOld)
    }
    this._state = 'Header'
    this._nextPacketSize = 32
    this._sendHello()
  }

  /**
   * Create message HEADER and BODY and send to socket
   * Also called from SubProtocol context
   * @param code
   * @param data
   */
  _sendMessage(code: number, data: Buffer) {
    if (this._closed) return false
    const msg = Buffer.concat([rlp.encode(code), data])
    const header = this._eciesSession.createHeader(msg.length)
    if (!header || this._socket.destroyed) return
    this._socket.write(header)

    const body = this._eciesSession.createBody(msg)
    // this._socket.destroyed added here and above to safeguard against
    // occasional "Cannot call write after a stream was destroyed" errors.
    // Eventually this can be caught earlier down the line.
    if (!body || this._socket.destroyed) return
    this._socket.write(body)
    return true
  }

  /**
   * Send HELLO message
   */
  _sendHello() {
    debug(`Send HELLO to ${this._socket.remoteAddress}:${this._socket.remotePort}`)
    const payload: HelloMsg = [
      int2buffer(BASE_PROTOCOL_VERSION),
      this._clientId,
      this._capabilities!.map((obj: any) => [Buffer.from(obj.name), int2buffer(obj.version)]),
      this._port === null ? Buffer.allocUnsafe(0) : int2buffer(this._port),
      this._id,
    ]

    if (!this._closed) {
      if (this._sendMessage(PREFIXES.HELLO, rlp.encode(payload as any))) {
        this._weHello = payload
      }
      if (this._hello) {
        this.emit('connect')
      }
    }
  }

  /**
   * Send DISCONNECT message
   * @param reason
   */
  _sendDisconnect(reason: DISCONNECT_REASONS) {
    debug(
      `Send DISCONNECT to ${this._socket.remoteAddress}:${
        this._socket.remotePort
      } (reason: ${this.getDisconnectPrefix(reason)})`
    )
    const data = rlp.encode(reason)
    if (!this._sendMessage(PREFIXES.DISCONNECT, data)) return

    this._disconnectReason = reason
    this._disconnectWe = true
    this._closed = true
    setTimeout(() => this._socket.end(), ms('2s'))
  }

  /**
   * Send PING message
   */
  _sendPing() {
    debug(`Send PING to ${this._socket.remoteAddress}:${this._socket.remotePort}`)
    const data = rlp.encode([])
    if (!this._sendMessage(PREFIXES.PING, data)) return

    clearTimeout(this._pingTimeoutId!)
    this._pingTimeoutId = setTimeout(() => {
      this.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, this._pingTimeout)
  }

  /**
   * Send PONG message
   */
  _sendPong() {
    debug(`Send PONG to ${this._socket.remoteAddress}:${this._socket.remotePort}`)
    const data = rlp.encode([])
    this._sendMessage(PREFIXES.PONG, data)
  }

  /**
   * AUTH message received
   */
  _handleAuth() {
    const bytesCount = this._nextPacketSize
    const parseData = this._socketData.slice(0, bytesCount)
    if (!this._eciesSession._gotEIP8Auth) {
      if (parseData.slice(0, 1) === Buffer.from('04', 'hex')) {
        this._eciesSession.parseAuthPlain(parseData)
      } else {
        this._eciesSession._gotEIP8Auth = true
        this._nextPacketSize = util.buffer2int(this._socketData.slice(0, 2)) + 2
        return
      }
    } else {
      this._eciesSession.parseAuthEIP8(parseData)
    }
    this._state = 'Header'
    this._nextPacketSize = 32
    process.nextTick(() => this._sendAck())
    this._socketData.consume(bytesCount)
  }

  /**
   * ACK message received
   */
  _handleAck() {
    const bytesCount = this._nextPacketSize
    const parseData = this._socketData.slice(0, bytesCount)
    if (!this._eciesSession._gotEIP8Ack) {
      if (parseData.slice(0, 1) === Buffer.from('04', 'hex')) {
        this._eciesSession.parseAckPlain(parseData)
        debug(
          `Received ack (old format) from ${this._socket.remoteAddress}:${this._socket.remotePort}`
        )
      } else {
        this._eciesSession._gotEIP8Ack = true
        this._nextPacketSize = util.buffer2int(this._socketData.slice(0, 2)) + 2
        return
      }
    } else {
      this._eciesSession.parseAckEIP8(parseData)
      debug(`Received ack (EIP8) from ${this._socket.remoteAddress}:${this._socket.remotePort}`)
    }
    this._state = 'Header'
    this._nextPacketSize = 32
    process.nextTick(() => this._sendHello())
    this._socketData.consume(bytesCount)
  }

  /**
   * HELLO message received
   */
  _handleHello(payload: any) {
    this._hello = {
      protocolVersion: buffer2int(payload[0]),
      clientId: payload[1].toString(),
      capabilities: payload[2].map((item: any) => {
        return { name: item[0].toString(), version: buffer2int(item[1]) }
      }),
      port: buffer2int(payload[3]),
      id: payload[4],
    }

    if (this._remoteId === null) {
      this._remoteId = Buffer.from(this._hello.id)
    } else if (!this._remoteId.equals(this._hello.id)) {
      return this.disconnect(DISCONNECT_REASONS.INVALID_IDENTITY)
    }

    if (this._remoteClientIdFilter) {
      for (const filterStr of this._remoteClientIdFilter) {
        if (this._hello.clientId.toLowerCase().includes(filterStr.toLowerCase())) {
          return this.disconnect(DISCONNECT_REASONS.USELESS_PEER)
        }
      }
    }

    const shared: any = {}
    for (const item of this._hello.capabilities) {
      for (const obj of this._capabilities!) {
        if (obj.name !== item.name || obj.version !== item.version) continue
        if (shared[obj.name] && shared[obj.name].version > obj.version) continue
        shared[obj.name] = obj
      }
    }

    let offset = BASE_PROTOCOL_LENGTH
    this._protocols = Object.keys(shared)
      .map((key) => shared[key])
      .sort((obj1, obj2) => (obj1.name < obj2.name ? -1 : 1))
      .map((obj) => {
        const _offset = offset
        offset += obj.length

        const SubProtocol = obj.constructor
        const protocol = new SubProtocol(obj.version, this, (code: number, data: Buffer) => {
          if (code > obj.length) throw new Error('Code out of range')
          this._sendMessage(_offset + code, data)
        })

        return { protocol, offset: _offset, length: obj.length }
      })

    if (this._protocols.length === 0) {
      return this.disconnect(DISCONNECT_REASONS.USELESS_PEER)
    }

    this._connected = true
    this._pingIntervalId = setInterval(() => this._sendPing(), PING_INTERVAL)
    if (this._weHello) {
      this.emit('connect')
    }
  }

  /**
   * DISCONNECT message received
   * @param payload
   */
  _handleDisconnect(payload: any) {
    this._closed = true
    this._disconnectReason = payload[0].length === 0 ? 0 : payload[0][0]
    debug(
      `DISCONNECT reason: ${DISCONNECT_REASONS[this._disconnectReason as number]} ${
        this._socket.remoteAddress
      }:${this._socket.remotePort}`
    )
    this._disconnectWe = false
    this._socket.end()
  }

  /**
   * PING message received
   */
  _handlePing() {
    this._sendPong()
  }

  /**
   * PONG message received
   */
  _handlePong() {
    clearTimeout(this._pingTimeoutId!)
  }

  /**
   * Message handling, called from a SubProtocol context
   * @param code
   * @param msg
   */
  _handleMessage(code: PREFIXES, msg: Buffer) {
    const payload = rlp.decode(msg)
    switch (code) {
      case PREFIXES.HELLO:
        this._handleHello(payload)
        break
      case PREFIXES.DISCONNECT:
        this._handleDisconnect(payload)
        break
      case PREFIXES.PING:
        this._handlePing()
        break
      case PREFIXES.PONG:
        this._handlePong()
        break
    }
  }

  /**
   * Handle message header
   */
  _handleHeader() {
    const bytesCount = this._nextPacketSize
    const parseData = this._socketData.slice(0, bytesCount)
    debug(`Received header ${this._socket.remoteAddress}:${this._socket.remotePort}`)
    const size = this._eciesSession.parseHeader(parseData)
    if (!size) {
      debug('invalid header size!')
      return
    }

    this._state = 'Body'
    this._nextPacketSize = size + 16
    if (size % 16 > 0) this._nextPacketSize += 16 - (size % 16)
    this._socketData.consume(bytesCount)
  }

  /**
   * Handle message body
   */
  _handleBody() {
    const bytesCount = this._nextPacketSize
    const parseData = this._socketData.slice(0, bytesCount)
    const body = this._eciesSession.parseBody(parseData)
    if (!body) {
      debug('empty body!')
      return
    }
    debug(
      `Received body ${this._socket.remoteAddress}:${this._socket.remotePort} ${formatLogData(
        body.toString('hex'),
        verbose
      )}`
    )
    this._state = 'Header'
    this._nextPacketSize = 32

    // RLP hack
    let code = body[0]
    if (code === 0x80) code = 0

    if (code !== PREFIXES.HELLO && code !== PREFIXES.DISCONNECT && this._hello === null) {
      return this.disconnect(DISCONNECT_REASONS.PROTOCOL_ERROR)
    }
    const obj = this._getProtocol(code)
    if (obj === undefined) return this.disconnect(DISCONNECT_REASONS.PROTOCOL_ERROR)

    const msgCode = code - obj.offset
    const prefix = this.getMsgPrefix(msgCode)
    debug(
      `Received ${prefix} (message code: ${code} - ${obj.offset} = ${msgCode}) ${this._socket.remoteAddress}:${this._socket.remotePort}`
    )

    try {
      obj.protocol._handleMessage(msgCode, body.slice(1))
    } catch (err) {
      this.disconnect(DISCONNECT_REASONS.SUBPROTOCOL_ERROR)
      debug(`Error on peer subprotocol message handling: ${err}`)
      this.emit('error', err)
    }
    this._socketData.consume(bytesCount)
  }

  /**
   * Process socket data
   * @param data
   */
  _onSocketData(data: Buffer) {
    if (this._closed) return
    this._socketData.append(data)
    try {
      while (this._socketData.length >= this._nextPacketSize) {
        switch (this._state) {
          case 'Auth':
            this._handleAuth()
            break
          case 'Ack':
            this._handleAck()
            break
          case 'Header':
            this._handleHeader()
            break
          case 'Body':
            this._handleBody()
            break
        }
      }
    } catch (err) {
      this.disconnect(DISCONNECT_REASONS.SUBPROTOCOL_ERROR)
      debug(`Error on peer socket data handling: ${err}`)
      this.emit('error', err)
    }
  }

  /**
   * React to socket being closed
   */
  _onSocketClose() {
    clearInterval(this._pingIntervalId!)
    clearTimeout(this._pingTimeoutId!)

    this._closed = true
    if (this._connected) this.emit('close', this._disconnectReason, this._disconnectWe)
  }

  _getProtocol(code: number): ProtocolDescriptor | undefined {
    if (code < BASE_PROTOCOL_LENGTH) return { protocol: this, offset: 0 }
    for (const obj of this._protocols) {
      if (code >= obj.offset && code < obj.offset + obj.length!) return obj
    }
  }

  getId() {
    if (this._remoteId === null) return null
    return Buffer.from(this._remoteId)
  }

  getHelloMessage() {
    return this._hello
  }

  getProtocols<T extends ETH | LES>(): T[] {
    return this._protocols.map((obj) => obj.protocol)
  }

  getMsgPrefix(code: PREFIXES): string {
    return PREFIXES[code]
  }

  getDisconnectPrefix(code: DISCONNECT_REASONS): string {
    return DISCONNECT_REASONS[code]
  }

  disconnect(reason: DISCONNECT_REASONS = DISCONNECT_REASONS.DISCONNECT_REQUESTED) {
    this._sendDisconnect(reason)
  }
}
