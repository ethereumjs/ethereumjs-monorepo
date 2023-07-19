import { bytesToHex, bytesToUnprefixedHex } from '@ethereumjs/util'
import debugDefault from 'debug'
import * as dgram from 'dgram'
import { EventEmitter } from 'events'

import { createDeferred, devp2pDebug, formatLogId, pk2id } from '../util.js'

import { decode, encode } from './message.js'

import type { DPTServerOptions, PeerInfo } from '../types.js'
import type { DPT } from './dpt.js'
import type { Debugger } from 'debug'
import type { Socket as DgramSocket, RemoteInfo } from 'dgram'
import type LRUCache from 'lru-cache'
const { debug: createDebugLogger } = debugDefault

const LRU = require('lru-cache')

const DEBUG_BASE_NAME = 'dpt:server'
const verbose = createDebugLogger('verbose').enabled

const VERSION = 0x04

export class Server {
  public events: EventEmitter
  protected _dpt: DPT
  protected _privateKey: Uint8Array
  protected _timeout: number
  protected _endpoint: PeerInfo
  protected _requests: Map<string, any>
  protected _requestsCache: LRUCache<string, Promise<any>>
  protected _socket: DgramSocket | null
  private _debug: Debugger

  constructor(dpt: DPT, privateKey: Uint8Array, options: DPTServerOptions) {
    this.events = new EventEmitter()
    this._dpt = dpt
    this._privateKey = privateKey

    this._timeout = options.timeout ?? 2000 // 2 * 1000
    this._endpoint = options.endpoint ?? { address: '0.0.0.0', udpPort: null, tcpPort: null }
    this._requests = new Map()
    this._requestsCache = new LRU({ max: 1000, ttl: 1000, stale: false }) // 1 sec * 1000

    const createSocket = options.createSocket ?? dgram.createSocket.bind(null, { type: 'udp4' })
    this._socket = createSocket()
    this._debug = devp2pDebug.extend(DEBUG_BASE_NAME)
    if (this._socket) {
      this._socket.once('listening', () => this.events.emit('listening'))
      this._socket.once('close', () => this.events.emit('close'))
      this._socket.on('error', (err) => this.events.emit('error', err))
      this._socket.on('message', (msg: Uint8Array, rinfo: RemoteInfo) => {
        try {
          this._handler(msg, rinfo)
        } catch (err: any) {
          this.events.emit('error', err)
        }
      })
    }
  }

  bind(...args: any[]) {
    this._isAliveCheck()
    this._debug('call .bind')

    if (this._socket) this._socket.bind(...args)
  }

  destroy(...args: any[]) {
    this._isAliveCheck()
    this._debug('call .destroy')

    if (this._socket) {
      this._socket.close(...args)
      this._socket = null
    }
  }

  async ping(peer: PeerInfo): Promise<any> {
    this._isAliveCheck()

    const rckey = `${peer.address}:${peer.udpPort}`
    const promise = this._requestsCache.get(rckey)
    if (promise !== undefined) return promise

    const hash = this._send(peer, 'ping', {
      version: VERSION,
      from: this._endpoint,
      to: peer,
    })

    const deferred = createDeferred()
    const rkey = bytesToUnprefixedHex(hash)
    this._requests.set(rkey, {
      peer,
      deferred,
      timeoutId: setTimeout(() => {
        if (this._requests.get(rkey) !== undefined) {
          this._debug(
            `ping timeout: ${peer.address}:${peer.udpPort} ${
              peer.id ? formatLogId(bytesToHex(peer.id), verbose) : '-'
            }`
          )
          this._requests.delete(rkey)
          deferred.reject(new Error(`Timeout error: ping ${peer.address}:${peer.udpPort}`))
        } else {
          return deferred.promise
        }
      }, this._timeout),
    })
    this._requestsCache.set(rckey, deferred.promise)
    return deferred.promise
  }

  findneighbours(peer: PeerInfo, id: Uint8Array) {
    this._isAliveCheck()
    this._send(peer, 'findneighbours', { id })
  }

  _isAliveCheck() {
    if (this._socket === null) throw new Error('Server already destroyed')
  }

  _send(peer: PeerInfo, typename: string, data: any) {
    this.debug(
      typename,
      `send ${typename} to ${peer.address}:${peer.udpPort} (peerId: ${
        peer.id ? formatLogId(bytesToHex(peer.id), verbose) : '-'
      })`
    )

    const msg = encode(typename, data, this._privateKey)

    if (this._socket && typeof peer.udpPort === 'number')
      this._socket.send(msg, 0, msg.length, peer.udpPort, peer.address)
    return msg.subarray(0, 32) // message id
  }

  _handler(msg: Uint8Array, rinfo: RemoteInfo) {
    const info = decode(msg) // Dgram serializes everything to `Uint8Array`
    const peerId = pk2id(info.publicKey)
    this.debug(
      info.typename.toString(),
      `received ${info.typename} from ${rinfo.address}:${rinfo.port} (peerId: ${formatLogId(
        bytesToHex(peerId),
        verbose
      )})`
    )

    // add peer if not in our table
    const peer = this._dpt.getPeer(peerId)
    if (peer === null && info.typename === 'ping' && info.data.from.udpPort !== null) {
      setTimeout(() => this.events.emit('peers', [info.data.from]), 100) // 100 ms
    }

    switch (info.typename) {
      case 'ping': {
        const remote: PeerInfo = {
          id: peerId,
          udpPort: rinfo.port,
          address: rinfo.address,
        }
        this._send(remote, 'pong', {
          to: {
            address: rinfo.address,
            udpPort: rinfo.port,
            tcpPort: info.data.from.tcpPort,
          },
          hash: msg.subarray(0, 32),
        })
        break
      }

      case 'pong': {
        const rkey = bytesToUnprefixedHex(info.data.hash)
        const request = this._requests.get(rkey)
        if (request !== undefined) {
          this._requests.delete(rkey)
          request.deferred.resolve({
            id: peerId,
            address: request.peer.address,
            udpPort: request.peer.udpPort,
            tcpPort: request.peer.tcpPort,
          })
        }
        break
      }
      case 'findneighbours': {
        const remote: PeerInfo = {
          id: peerId,
          udpPort: rinfo.port,
          address: rinfo.address,
        }
        this._send(remote, 'neighbours', {
          peers: this._dpt.getClosestPeers(info.data.id),
        })
        break
      }

      case 'neighbours': {
        this.events.emit(
          'peers',
          info.data.peers.map((peer: any) => peer.endpoint)
        )
        break
      }
    }
  }

  /**
   * Debug message both on the generic as well as the
   * per-message debug logger
   * @param messageName Lower capital message name (e.g. `findneighbours`)
   * @param msg Message text to debug
   */
  private debug(messageName: string, msg: string) {
    this._debug.extend(messageName)(msg)
  }
}
