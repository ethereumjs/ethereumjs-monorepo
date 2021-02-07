import * as net from 'net'
import * as os from 'os'
import ms from 'ms'
import { publicKeyCreate } from 'secp256k1'
import { EventEmitter } from 'events'
import { debug as createDebugLogger } from 'debug'
import LRUCache from 'lru-cache'
import Common from '@ethereumjs/common'
// note: relative path only valid in .js file in dist
const { version: pVersion } = require('../../package.json')
import { pk2id, createDeferred, formatLogId, buffer2int } from '../util'
import { Peer, DISCONNECT_REASONS, Capabilities } from './peer'
import { DPT, PeerInfo } from '../dpt'

const debug = createDebugLogger('devp2p:rlpx')
const verbose = createDebugLogger('verbose').enabled

export interface RLPxOptions {
  clientId?: Buffer
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
  _privateKey: Buffer
  _id: Buffer

  _timeout: number
  _maxPeers: number
  _clientId: Buffer
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

  constructor(privateKey: Buffer, options: RLPxOptions) {
    super()

    this._privateKey = Buffer.from(privateKey)
    this._id = pk2id(Buffer.from(publicKeyCreate(this._privateKey, false)))

    // options
    this._timeout = options.timeout ?? ms('10s')
    this._maxPeers = options.maxPeers ?? 10

    this._clientId = options.clientId
      ? Buffer.from(options.clientId)
      : Buffer.from(`ethereumjs-devp2p/v${pVersion}/${os.platform()}-${os.arch()}/nodejs`)

    this._remoteClientIdFilter = options.remoteClientIdFilter
    this._capabilities = options.capabilities
    this._common = options.common
    this._listenPort = options.listenPort ?? null

    // DPT
    this._dpt = options.dpt ?? null
    if (this._dpt !== null) {
      this._dpt.on('peer:new', (peer: PeerInfo) => {
        if (!peer.tcpPort) {
          this._dpt!.banPeer(peer, ms('5m'))
          debug(`banning peer with missing tcp port: ${peer.address}`)
          return
        }

        if (this._peersLRU.has(peer.id!.toString('hex'))) return
        this._peersLRU.set(peer.id!.toString('hex'), true)

        if (this._getOpenSlots() > 0) return this._connectToPeer(peer)
        this._peersQueue.push({ peer: peer, ts: 0 }) // save to queue
      })
      this._dpt.on('peer:removed', (peer: PeerInfo) => {
        // remove from queue
        this._peersQueue = this._peersQueue.filter(
          (item) => !(item.peer.id! as Buffer).equals(peer.id as Buffer)
        )
      })
    }

    // internal
    this._server = net.createServer()
    this._server.once('listening', () => this.emit('listening'))
    this._server.once('close', () => this.emit('close'))
    this._server.on('error', (err) => this.emit('error', err))
    this._server.on('connection', (socket) => this._onConnect(socket, null))

    this._peers = new Map()
    this._peersQueue = []
    this._peersLRU = new LRUCache({ max: 25000 })
    const REFILL_INTERVALL = ms('10s')
    const refillIntervalSubdivided = Math.floor(REFILL_INTERVALL / 10)
    this._refillIntervalId = setInterval(() => this._refillConnections(), refillIntervalSubdivided)
  }

  listen(...args: any[]) {
    this._isAliveCheck()
    debug('call .listen')

    if (this._server) this._server.listen(...args)
  }

  destroy(...args: any[]) {
    this._isAliveCheck()
    debug('call .destroy')

    clearInterval(this._refillIntervalId)

    if (this._server) this._server.close(...args)
    this._server = null

    for (const peerKey of this._peers.keys()) this.disconnect(Buffer.from(peerKey, 'hex'))
  }

  async connect(peer: PeerInfo) {
    if (!peer.tcpPort || !peer.address) return
    this._isAliveCheck()

    if (!Buffer.isBuffer(peer.id)) throw new TypeError('Expected peer.id as Buffer')
    const peerKey = peer.id.toString('hex')

    if (this._peers.has(peerKey)) throw new Error('Already connected')
    if (this._getOpenSlots() === 0) throw new Error('Too many peers already connected')

    debug(`connect to ${peer.address}:${peer.tcpPort} (id: ${formatLogId(peerKey, verbose)})`)
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

  disconnect(id: Buffer) {
    const peer = this._peers.get(id.toString('hex'))
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

  _connectToPeer(peer: PeerInfo) {
    this.connect(peer).catch((err) => {
      if (this._dpt === null) return
      if (err.code === 'ECONNRESET' || err.toString().includes('Connection timeout')) {
        this._dpt.banPeer(peer, ms('5m'))
      }
    })
  }

  _onConnect(socket: net.Socket, peerId: Buffer | null) {
    debug(`connected to ${socket.remoteAddress}:${socket.remotePort}, handshake waiting..`)

    const peer: Peer = new Peer({
      socket: socket,
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
      debug(msg)
      const id = peer.getId()
      if (id && id.equals(this._id)) {
        return peer.disconnect(DISCONNECT_REASONS.SAME_IDENTITY)
      }

      const peerKey = id!.toString('hex')
      const item = this._peers.get(peerKey)
      if (item && item instanceof Peer) {
        return peer.disconnect(DISCONNECT_REASONS.ALREADY_CONNECTED)
      }

      this._peers.set(peerKey, peer)
      this.emit('peer:added', peer)
    })

    peer.once('close', (reason, disconnectWe) => {
      if (disconnectWe) {
        debug(
          `disconnect from ${socket.remoteAddress}:${socket.remotePort}, reason: ${DISCONNECT_REASONS[reason]}`
        )
      } else {
        debug(
          `${socket.remoteAddress}:${socket.remotePort} disconnect, reason: ${DISCONNECT_REASONS[reason]}`
        )
      }

      if (!disconnectWe && reason === DISCONNECT_REASONS.TOO_MANY_PEERS) {
        // hack
        this._peersQueue.push({
          peer: {
            id: peer.getId()!,
            address: peer._socket.remoteAddress,
            tcpPort: peer._socket.remotePort,
          },
          ts: (Date.now() + ms('5m')) as number,
        })
      }

      const id = peer.getId()
      if (id) {
        const peerKey = id.toString('hex')
        this._peers.delete(peerKey)
        this.emit('peer:removed', peer, reason, disconnectWe)
      }
    })
  }

  _refillConnections() {
    if (!this._isAlive()) return
    if (this._refillIntervalSelectionCounter === 0) {
      debug(
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
      const selector = buffer2int((item.peer.id! as Buffer).slice(0, 1)) % 10
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
