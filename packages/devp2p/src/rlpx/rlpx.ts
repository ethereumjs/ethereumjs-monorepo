import { bytesToInt } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import { EventEmitter } from 'events'
import ms = require('ms')
import * as net from 'net'
import * as os from 'os'

import { createDeferred, devp2pDebug, formatLogId, pk2id } from '../util'

import { DISCONNECT_REASONS, Peer } from './peer'

import type { DPT, PeerInfo } from '../dpt'
import type { Capabilities } from './peer'
import type { Common } from '@ethereumjs/common'
import type { Debugger } from 'debug'
import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

// note: relative path only valid in .js file in dist
const { version: pVersion } = require('../../package.json')

const DEBUG_BASE_NAME = 'rlpx'
const verbose = createDebugLogger('verbose').enabled

export interface RLPxOptions {
  clientId?: Uint8Array
  /* Timeout (default: 10s) */
  timeout?: number
  dpt?: DPT | null
  /* Max peers (default: 10) */
  maxPeers?: number
  remoteClientIdFilter?: string[]
  capabilities: Capabilities[]
  common: Common
  listenPort?: number | null
}

export class RLPx extends EventEmitter {
  _privateKey: Uint8Array
  _id: Uint8Array
  _debug: Debugger
  _timeout: number
  _maxPeers: number
  _clientId: Uint8Array
  _remoteClientIdFilter?: string[]
  _capabilities: Capabilities[]
  _common: Common
  _listenPort: number | null
  _dpt: DPT | null

  _peersLRU: LRUCache<string, boolean>
  _peersQueue: { peer: PeerInfo; ts: number }[]
  _server: net.Server | null
  _peers: Map<string, net.Socket | Peer>

  _refillIntervalId: NodeJS.Timeout
  _refillIntervalSelectionCounter: number = 0

  constructor(privateKey: Uint8Array, options: RLPxOptions) {
    super()

    this._privateKey = privateKey
    this._id = pk2id(secp256k1.getPublicKey(this._privateKey, false))

    // options
    this._timeout = options.timeout ?? ms('10s')
    this._maxPeers = options.maxPeers ?? 10

    this._clientId = options.clientId
      ? options.clientId
      : utf8ToBytes(`ethereumjs-devp2p/v${pVersion}/${os.platform()}-${os.arch()}/nodejs`)

    this._remoteClientIdFilter = options.remoteClientIdFilter
    this._capabilities = options.capabilities
    this._common = options.common
    this._listenPort = options.listenPort ?? null

    // DPT
    this._dpt = options.dpt ?? null
    if (this._dpt !== null) {
      this._dpt.on('peer:new', (peer: PeerInfo) => {
        if (peer.tcpPort === null || peer.tcpPort === undefined) {
          this._dpt!.banPeer(peer, ms('5m'))
          this._debug(`banning peer with missing tcp port: ${peer.address}`)
          return
        }
        const key = bytesToHex(peer.id!)
        if (this._peersLRU.has(key)) return
        this._peersLRU.set(key, true)

        if (this._getOpenSlots() > 0) {
          return this._connectToPeer(peer)
        } else if (this._getOpenQueueSlots() > 0) {
          this._peersQueue.push({ peer, ts: 0 }) // save to queue
        }
      })
      this._dpt.on('peer:removed', (peer: PeerInfo) => {
        // remove from queue
        this._peersQueue = this._peersQueue.filter(
          (item) => !equalsBytes(item.peer.id! as Uint8Array, peer.id as Uint8Array)
        )
      })
    }
    // internal
    this._server = net.createServer()
    this._server.once('listening', () => this.emit('listening'))
    this._server.once('close', () => this.emit('close'))
    this._server.on('error', (err) => this.emit('error', err))
    this._server.on('connection', (socket) => this._onConnect(socket, null))
    const serverAddress = this._server.address()
    this._debug =
      serverAddress !== null
        ? devp2pDebug.extend(DEBUG_BASE_NAME).extend(serverAddress as string)
        : devp2pDebug.extend(DEBUG_BASE_NAME)
    this._peers = new Map()
    this._peersQueue = []
    this._peersLRU = new LRU({ max: 25000 })
    const REFILL_INTERVALL = ms('10s')
    const refillIntervalSubdivided = Math.floor(REFILL_INTERVALL / 10)
    this._refillIntervalId = setInterval(() => this._refillConnections(), refillIntervalSubdivided)
  }

  listen(...args: any[]) {
    this._isAliveCheck()
    this._debug('call .listen')

    if (this._server) this._server.listen(...args)
  }

  destroy(...args: any[]) {
    this._isAliveCheck()
    this._debug('call .destroy')

    clearInterval(this._refillIntervalId)

    if (this._server) this._server.close(...args)
    this._server = null

    for (const peerKey of this._peers.keys()) this.disconnect(hexToBytes(peerKey))
  }

  async connect(peer: PeerInfo) {
    if (peer.tcpPort === undefined || peer.tcpPort === null || peer.address === undefined) return
    this._isAliveCheck()

    if (!(peer.id instanceof Uint8Array)) throw new TypeError('Expected peer.id as Uint8Array')
    const peerKey = bytesToHex(peer.id)

    if (this._peers.has(peerKey)) throw new Error('Already connected')
    if (this._getOpenSlots() === 0) throw new Error('Too many peers already connected')

    this._debug(`connect to ${peer.address}:${peer.tcpPort} (id: ${formatLogId(peerKey, verbose)})`)
    const deferred = createDeferred()

    const socket = new net.Socket()
    this._peers.set(peerKey, socket)
    socket.once('close', () => {
      this._peers.delete(peerKey)
      this._refillConnections()
    })

    socket.once('error', deferred.reject)
    socket.setTimeout(this._timeout, () => deferred.reject(new Error('Connection timeout')))
    socket.connect(peer.tcpPort, peer.address, deferred.resolve)

    await deferred.promise
    this._onConnect(socket, peer.id)
  }

  getPeers() {
    return Array.from(this._peers.values()).filter((item) => item instanceof Peer)
  }

  disconnect(id: Uint8Array) {
    const peer = this._peers.get(bytesToHex(id))
    if (peer instanceof Peer) peer.disconnect(DISCONNECT_REASONS.CLIENT_QUITTING)
  }

  _isAlive() {
    return this._server !== null
  }

  _isAliveCheck() {
    if (!this._isAlive()) throw new Error('Server already destroyed')
  }

  _getOpenSlots() {
    return Math.max(this._maxPeers - this._peers.size, 0)
  }

  _getOpenQueueSlots() {
    return this._maxPeers * 2 - this._peersQueue.length
  }

  _connectToPeer(peer: PeerInfo) {
    this.connect(peer).catch((err) => {
      if (this._dpt === null) return
      if (err.code === 'ECONNRESET' || (err.toString() as string).includes('Connection timeout')) {
        this._dpt.banPeer(peer, ms('5m'))
      }
    })
  }

  _onConnect(socket: net.Socket, peerId: Uint8Array | null) {
    this._debug(`connected to ${socket.remoteAddress}:${socket.remotePort}, handshake waiting..`)

    const peer: Peer = new Peer({
      socket,
      remoteId: peerId,
      privateKey: this._privateKey,
      id: this._id,
      timeout: this._timeout,
      clientId: this._clientId,
      remoteClientIdFilter: this._remoteClientIdFilter,
      capabilities: this._capabilities,
      common: this._common,
      port: this._listenPort,
    })
    peer.on('error', (err) => this.emit('peer:error', peer, err))

    // handle incoming connection
    if (peerId === null && this._getOpenSlots() === 0) {
      peer.once('connect', () => peer.disconnect(DISCONNECT_REASONS.TOO_MANY_PEERS))
      socket.once('error', () => {})
      return
    }

    peer.once('connect', () => {
      let msg = `handshake with ${socket.remoteAddress}:${socket.remotePort} was successful`
      if (peer._eciesSession._gotEIP8Auth === true) {
        msg += ` (peer eip8 auth)`
      }
      if (peer._eciesSession._gotEIP8Ack === true) {
        msg += ` (peer eip8 ack)`
      }
      this._debug(msg)
      const id = peer.getId()
      if (id && equalsBytes(id, this._id)) {
        return peer.disconnect(DISCONNECT_REASONS.SAME_IDENTITY)
      }

      const peerKey = bytesToHex(id!)
      const item = this._peers.get(peerKey)
      if (item && item instanceof Peer) {
        return peer.disconnect(DISCONNECT_REASONS.ALREADY_CONNECTED)
      }

      this._peers.set(peerKey, peer)
      this.emit('peer:added', peer)
    })

    peer.once('close', (reason, disconnectWe) => {
      if (disconnectWe === true) {
        this._debug(
          `disconnect from ${socket.remoteAddress}:${socket.remotePort}, reason: ${DISCONNECT_REASONS[reason]}`,
          `disconnect`
        )
      }

      if (disconnectWe !== true && reason === DISCONNECT_REASONS.TOO_MANY_PEERS) {
        // hack
        if (this._getOpenQueueSlots() > 0) {
          this._peersQueue.push({
            peer: {
              id: peer.getId()!,
              address: peer._socket.remoteAddress,
              tcpPort: peer._socket.remotePort,
            },
            ts: (Date.now() + ms('5m')) as number,
          })
        }
      }

      const id = peer.getId()
      if (id) {
        const peerKey = bytesToHex(id)
        this._peers.delete(peerKey)
        this.emit('peer:removed', peer, reason, disconnectWe)
      }
    })
  }

  _refillConnections() {
    if (!this._isAlive()) return
    if (this._refillIntervalSelectionCounter === 0) {
      this._debug(
        `Restart connection refill .. with selector ${
          this._refillIntervalSelectionCounter
        } peers: ${this._peers.size}, queue size: ${
          this._peersQueue.length
        }, open slots: ${this._getOpenSlots()}`
      )
    }
    // Rotating selection counter going in loop from 0..9
    this._refillIntervalSelectionCounter = (this._refillIntervalSelectionCounter + 1) % 10

    this._peersQueue = this._peersQueue.filter((item) => {
      if (this._getOpenSlots() === 0) return true
      if (item.ts > Date.now()) return true

      // Randomly distributed selector based on peer ID
      // to decide on subdivided execution
      const selector = bytesToInt((item.peer.id! as Uint8Array).subarray(0, 1)) % 10
      if (selector === this._refillIntervalSelectionCounter) {
        this._connectToPeer(item.peer)
        return false
      } else {
        // Still keep peer in queue
        return true
      }
    })
  }
}
