import * as net from 'net'
import * as os from 'os'
import {
  EthereumJSErrorWithoutCode,
  bytesToInt,
  bytesToUnprefixedHex,
  equalsBytes,
  unprefixedHexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'
import debugDefault from 'debug'
import { EventEmitter } from 'eventemitter3'
import { LRUCache } from 'lru-cache'

import { isChainDirectoryPeer } from '../discovery/directoryPeer.ts'
import { DISCONNECT_REASON, DisconnectReasonNames } from '../types.ts'
import { devp2pDebug, formatLogId, pk2id } from '../util.ts'

import { Peer } from './peer.ts'

import type { Common } from '@ethereumjs/common'
import type { Debugger } from 'debug'
import type { DPT } from '../dpt/index.ts'
import type { Capabilities, PeerInfo, RLPxEvent, RLPxOptions } from '../types.ts'

// note: relative path only valid in .js file in dist

const DEBUG_BASE_NAME = 'rlpx'
const verbose = debugDefault('verbose').enabled

/** Bonded nodes waiting for a free outbound slot. */
const MAX_DIAL_QUEUE = 512
/**
 * Bonded nodes held when the dial queue is already full.
 * A Sepolia DNS refresh can return more live nodes than the in-flight dial cap.
 */
const MAX_DIAL_LATER = 2048
/** Outbound TCP connect timeout (RLPx handshake uses {@link RLPxOptions.timeout}). */
const DIAL_TCP_TIMEOUT_MS = 5_000
/** Maximum simultaneous outbound TCP dials in flight so we don't trigger firewall storms or flood maxPeers. */
const MAX_CONCURRENT_PENDING_DIALS = 6
/** After remote TOO_MANY_PEERS, skip this id until hold expires (not a process-lifetime LRU pin). */
export const TOO_MANY_PEERS_DIAL_HOLD_MS = 60_000

/** RLPx transport: encrypted TCP sessions, HELLO/capability negotiation, and sub-protocol multiplexing. */
export class RLPx {
  public events: EventEmitter<RLPxEvent>
  protected _privateKey: Uint8Array
  public readonly id: Uint8Array
  private _debug: Debugger
  protected _timeout: number
  protected _pingTimeout: number
  protected _maxPeers: number
  protected _maxInboundPeers: number | undefined
  protected _throttleDiscovery: boolean
  protected _discoveryLowWaterMark: number
  public readonly clientId: Uint8Array
  protected _remoteClientIdFilter?: string[]
  protected _capabilities: Capabilities[]
  protected _common: Common
  protected _listenPort: number | null
  protected _dpt: DPT | null

  protected _peersLRU: LRUCache<string, boolean>
  /** Short post-TOO_MANY_PEERS dial skip; cleared from LRU so DNS can retry later. */
  protected _peerDialHoldUntil = new Map<string, number>()
  protected _peersQueue: { peer: PeerInfo; ts: number }[]
  /** Bonded peers we have not dialed yet. Kept off the LRU so a full queue does not drop them. */
  protected _peersDeferred: PeerInfo[]
  protected _server: net.Server | null
  protected _peers: Map<string, net.Socket | Peer>
  /** Outbound TCP dials before the peer is promoted into {@link _peers}. */
  protected _pendingDials: Map<string, net.Socket>

  protected _refillIntervalId: NodeJS.Timeout
  protected _refillIntervalSelectionCounter: number = 0
  /** Ethy sync hold: do not auto-resume discovery when connected drops below low water. */
  protected _syncDiscoveryHold = false

  protected _keccakFunction: (msg: Uint8Array) => Uint8Array
  protected _discoveryMetrics: import('../discovery/metrics.ts').DiscoveryMetrics | undefined

  private DEBUG: boolean

  constructor(privateKey: Uint8Array, options: RLPxOptions) {
    this.events = new EventEmitter<RLPxEvent>()
    this._privateKey = privateKey
    this.id = pk2id(secp256k1.getPublicKey(this._privateKey, false))

    // options
    this._timeout = options.timeout ?? 10000 // 10 sec * 1000
    // Dial stays short. An established peer may spend longer than that building a snap proof.
    this._pingTimeout = options.pingTimeout ?? this._timeout
    this._maxPeers = options.maxPeers ?? 10
    this._maxInboundPeers = options.maxInboundPeers
    this._throttleDiscovery = options.throttleDiscovery ?? false
    const lowWater = options.discoveryLowWaterMark ?? Math.floor(this._maxPeers * 0.8)
    if (lowWater >= this._maxPeers) {
      throw EthereumJSErrorWithoutCode('discoveryLowWaterMark must be less than maxPeers')
    }
    this._discoveryLowWaterMark = lowWater

    this.clientId =
      options.clientId ?? utf8ToBytes(`ethereumjs-devp2p/${os.platform()}-${os.arch()}/nodejs`)

    this._remoteClientIdFilter = options.remoteClientIdFilter
    this._capabilities = options.capabilities
    this._common = options.common
    this._listenPort = options.listenPort ?? null

    // DPT
    this._dpt = options.dpt ?? null
    this._discoveryMetrics = options.discoveryMetrics
    if (this._dpt !== null) {
      this._dpt.events.on('peer:new', (peer: PeerInfo) => {
        this._onDiscoveredPeer(peer)
      })
      this._dpt.events.on('peer:removed', (peer: PeerInfo) => {
        // remove from queue
        this._peersQueue = this._peersQueue.filter(
          (item) => !equalsBytes(item.peer.id! as Uint8Array, peer.id as Uint8Array),
        )
      })
    }
    // internal
    this._server = net.createServer()
    this._server.once('listening', () => this.events.emit('listening'))
    this._server.once('close', () => this.events.emit('close'))
    this._server.on('error', (err) => this.events.emit('error', err))
    this._server.on('connection', (socket) => this._onConnect(socket, null))
    const serverAddress = this._server.address()
    this._debug =
      serverAddress !== null
        ? devp2pDebug.extend(DEBUG_BASE_NAME).extend(serverAddress as string)
        : devp2pDebug.extend(DEBUG_BASE_NAME)
    this._peers = new Map()
    this._pendingDials = new Map()
    this._peersQueue = []
    this._peersDeferred = []
    this._peersLRU = new LRUCache({ max: 25000 })
    const REFILL_INTERVAL = 10000 // 10 sec * 1000
    const refillIntervalSubdivided = Math.floor(REFILL_INTERVAL / 10)
    this._refillIntervalId = setInterval(() => this._refillConnections(), refillIntervalSubdivided)

    this._keccakFunction = options.common?.customCrypto.keccak256 ?? keccak_256

    this.DEBUG = globalThis.process?.env?.DEBUG?.includes('ethjs') ?? false
  }

  listen(...args: any[]) {
    this._isAliveCheck()
    if (this.DEBUG) {
      this._debug('call .listen')
    }

    if (this._server) this._server.listen(...args)
  }

  /** Actual OS-assigned TCP listen port (useful when `listen(0)` is used). */
  boundTcpPort(): number | null {
    const addr = this._server?.address()
    if (addr !== null && addr !== undefined && typeof addr === 'object') {
      return addr.port
    }
    return this._listenPort
  }

  /** Update the TCP listen port advertised in outbound RLPx HELLO messages. */
  setListenPort(port: number | null): void {
    this._listenPort = port
  }

  destroy(...args: any[]) {
    this._isAliveCheck()
    if (this.DEBUG) {
      this._debug('call .destroy')
    }

    clearInterval(this._refillIntervalId)

    if (this._server) this._server.close(...args)
    this._server = null

    for (const peerKey of this._peers.keys()) this.disconnect(unprefixedHexToBytes(peerKey))
  }

  async connect(peer: PeerInfo, opts?: { priority?: boolean }) {
    if (peer.tcpPort === undefined || peer.tcpPort === null || peer.address === undefined) return
    this._isAliveCheck()
    this._discoveryMetrics?.recordRlpxDial()

    if (!(peer.id instanceof Uint8Array)) throw new TypeError('Expected peer.id as Uint8Array')
    // Using deprecated bytesToUnprefixedHex for performance: used as Map keys for peer lookups.
    const peerKey = bytesToUnprefixedHex(peer.id)
    if (opts?.priority === true) {
      this._peerDialHoldUntil.delete(peerKey)
      this._peersLRU.delete(peerKey)
    }

    const existing = this._peers.get(peerKey)
    if (existing instanceof Peer) throw EthereumJSErrorWithoutCode('Already connected')
    if (this._pendingDials.has(peerKey)) return

    if (opts?.priority !== true && !this._canStartOutboundDial()) {
      if (this._getOpenQueueSlots() > 0) {
        this._peersQueue.unshift({ peer, ts: 0 })
        return
      }
      throw EthereumJSErrorWithoutCode('Too many peers already connected')
    }

    if (this.DEBUG) {
      this._debug(
        `connect to ${peer.address}:${peer.tcpPort} (id: ${formatLogId(peerKey, verbose)})`,
      )
    }
    const socket = new net.Socket()
    this._pendingDials.set(peerKey, socket)
    const clearPending = () => {
      if (this._pendingDials.get(peerKey) === socket) {
        this._pendingDials.delete(peerKey)
      }
      this._refillConnections()
    }
    socket.once('close', clearPending)

    await new Promise<void>((resolve, reject) => {
      let settled = false
      const finish = (err?: Error) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        if (err !== undefined) reject(err)
        else resolve()
      }
      const timer = setTimeout(() => {
        socket.destroy()
        finish(EthereumJSErrorWithoutCode('Connection timeout'))
      }, DIAL_TCP_TIMEOUT_MS)
      socket.once('error', (err: Error) => finish(err))
      socket.connect(peer.tcpPort!, peer.address!, () => finish())
    })
    if (!this._pendingDials.has(peerKey)) return
    this._pendingDials.delete(peerKey)
    socket.setTimeout(this._timeout)
    this._onConnect(socket, peer.id)
  }

  getPeers() {
    return Array.from(this._peers.values()).filter((item) => item instanceof Peer)
  }

  disconnect(id: Uint8Array) {
    // Using deprecated bytesToUnprefixedHex for performance: used as Map keys for peer lookups.
    const peerKey = bytesToUnprefixedHex(id)
    const pending = this._pendingDials.get(peerKey)
    if (pending !== undefined) {
      pending.destroy()
      this._pendingDials.delete(peerKey)
      return
    }
    const peer = this._peers.get(peerKey)
    if (peer instanceof Peer) {
      peer.disconnect(DISCONNECT_REASON.CLIENT_QUITTING)
    }
  }

  _isAlive() {
    return this._server !== null
  }

  _isAliveCheck() {
    if (!this._isAlive()) throw EthereumJSErrorWithoutCode('Server already destroyed')
  }

  _getOpenSlots() {
    return Math.max(this._maxPeers - this._connectedPeerCount(), 0)
  }

  _canStartOutboundDial(): boolean {
    if (this._connectedPeerCount() >= this._maxPeers) return false
    const maxPending = Math.min(this._maxPeers, MAX_CONCURRENT_PENDING_DIALS)
    if (this._pendingDials.size >= maxPending) return false
    if (this._connectedPeerCount() + this._pendingDials.size >= this._maxPeers + 2) return false
    return true
  }

  _getOpenQueueSlots() {
    return MAX_DIAL_QUEUE - this._peersQueue.length
  }

  _onDiscoveredPeer(peer: PeerInfo): void {
    if (peer.tcpPort === null || peer.tcpPort === undefined) {
      this._dpt?.banPeer(peer, 300000) // 5 min * 60 * 1000
      this._debug(`banning peer with missing tcp port: ${peer.address}`)
      return
    }
    if (peer.id === undefined) return
    // Using deprecated bytesToUnprefixedHex for performance: used as LRU cache keys for peer tracking.
    const key = bytesToUnprefixedHex(peer.id)
    if (this._peersLRU.has(key)) return
    const holdUntil = this._peerDialHoldUntil.get(key)
    if (holdUntil !== undefined) {
      if (holdUntil > Date.now()) return
      this._peerDialHoldUntil.delete(key)
    }

    const directory = isChainDirectoryPeer(peer)
    const holdForDirectory = !directory && this._hasReadyDirectoryPeer()
    if (this._canStartOutboundDial() && !holdForDirectory) {
      this._peersLRU.set(key, true)
      this._connectToPeer(peer)
      return
    }
    if (directory && this._getOpenQueueSlots() <= 0) this._evictOneNeighbor()
    if (this._getOpenQueueSlots() > 0) {
      this._peersLRU.set(key, true)
      const entry = { peer, ts: 0 }
      if (directory) this._peersQueue.unshift(entry)
      else this._peersQueue.push(entry)
      if (directory || holdForDirectory) this._dialQueuedDirectoryPeers()
      return
    }
    if (holdForDirectory) this._dialQueuedDirectoryPeers()
    // Queue is full. Remember the node without marking it tried.
    this._deferDiscoveredPeer(peer, key)
  }

  _hasReadyDirectoryPeer(): boolean {
    const now = Date.now()
    return this._peersQueue.some((item) => isChainDirectoryPeer(item.peer) && item.ts <= now)
  }

  /** Free a queue slot occupied by a discv4 neighbor so a directory peer can wait. */
  _evictOneNeighbor(): boolean {
    const idx = this._peersQueue.findIndex((item) => !isChainDirectoryPeer(item.peer))
    if (idx < 0) return false
    const [item] = this._peersQueue.splice(idx, 1)
    if (item?.peer.id === undefined) return true
    const key = bytesToUnprefixedHex(item.peer.id)
    this._peersLRU.delete(key)
    this._deferDiscoveredPeer(item.peer, key)
    return true
  }

  _dialQueuedDirectoryPeers(): void {
    this._peersQueue = this._peersQueue.filter((item) => {
      if (!isChainDirectoryPeer(item.peer)) return true
      if (!this._canStartOutboundDial()) return true
      if (item.ts > Date.now()) return true
      this._connectToPeer(item.peer)
      return false
    })
  }

  _deferDiscoveredPeer(peer: PeerInfo, key: string): void {
    const alreadyHeld = this._peersDeferred.some(
      (item) => item.id !== undefined && bytesToUnprefixedHex(item.id) === key,
    )
    if (alreadyHeld) return
    if (this._peersDeferred.length >= MAX_DIAL_LATER) this._peersDeferred.shift()
    this._peersDeferred.push(peer)
  }

  _promoteDeferredDials(): void {
    const directory = this._peersDeferred.filter((peer) => isChainDirectoryPeer(peer))
    const neighbors = this._peersDeferred.filter((peer) => !isChainDirectoryPeer(peer))
    this._peersDeferred = [...directory, ...neighbors]
    const pending = this._peersDeferred.length
    for (let n = 0; n < pending; n++) {
      const peer = this._peersDeferred.shift()
      if (peer?.id === undefined) continue
      const key = bytesToUnprefixedHex(peer.id)
      if (this._peersLRU.has(key)) continue
      if (this._canStartOutboundDial()) {
        this._peersLRU.set(key, true)
        this._connectToPeer(peer)
        continue
      }
      if (this._getOpenQueueSlots() > 0) {
        this._peersLRU.set(key, true)
        this._peersQueue.push({ peer, ts: 0 })
        continue
      }
      this._peersDeferred.unshift(peer)
      return
    }
  }

  _connectToPeer(peer: PeerInfo) {
    this.connect(peer).catch((err: unknown) => {
      const code = typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : ''
      const message = err instanceof Error ? err.message : String(err)
      const dialFailed =
        code === 'ECONNRESET' ||
        code === 'ECONNREFUSED' ||
        code === 'EHOSTUNREACH' ||
        code === 'ENETUNREACH' ||
        code === 'ETIMEDOUT' ||
        message.includes('Connection timeout')
      // A later bond must be allowed to dial again. Do not ban or evict the node
      // from the UDP DPT k-bucket on a TCP failure — bootnodes and full peers still
      // route UDP findneighbours even when their TCP RLPx port resets or times out!
      if (dialFailed && peer.id !== undefined) {
        const key = bytesToUnprefixedHex(peer.id)
        this._peersLRU.delete(key)
        this._peerDialHoldUntil.set(key, Date.now() + TOO_MANY_PEERS_DIAL_HOLD_MS)
      }
    })
  }

  _countInboundPeers(): number {
    let n = 0
    for (const item of this._peers.values()) {
      if (item instanceof Peer && item.inbound) n++
    }
    return n
  }

  _onConnect(socket: net.Socket, peerId: Uint8Array | null) {
    if (this.DEBUG) {
      this._debug(`connected to ${socket.remoteAddress}:${socket.remotePort}, handshake waiting..`)
    }

    const inbound = peerId === null
    const remoteAddr = socket.remoteAddress ?? ''
    const isLoopback =
      remoteAddr === '127.0.0.1' || remoteAddr === '::1' || remoteAddr === '::ffff:127.0.0.1'
    if (inbound && !isLoopback && this._maxInboundPeers !== undefined) {
      if (this._countInboundPeers() >= this._maxInboundPeers) {
        socket.destroy()
        return
      }
    }

    const peer: Peer = new Peer({
      socket,
      remoteId: peerId!,
      privateKey: this._privateKey,
      id: this.id,
      timeout: this._timeout,
      pingTimeout: this._pingTimeout,
      clientId: this.clientId,
      remoteClientIdFilter: this._remoteClientIdFilter,
      capabilities: this._capabilities,
      common: this._common,
      port: this._listenPort!,
      inbound,
    })
    peer.events.on('error', (err) => this.events.emit('peer:error', peer, err))

    // handle incoming connection
    if (inbound && !isLoopback && this._getOpenSlots() === 0) {
      peer.events.once('connect', () => peer.disconnect(DISCONNECT_REASON.TOO_MANY_PEERS))
      socket.once('error', () => {})
      return
    }

    peer.events.once('connect', () => {
      let msg = `handshake with ${socket.remoteAddress}:${socket.remotePort} was successful`

      if (peer['_eciesSession']['_gotEIP8Auth'] === true) {
        msg += ` (peer eip8 auth)`
      }

      if (peer['_eciesSession']['_gotEIP8Ack'] === true) {
        msg += ` (peer eip8 ack)`
      }
      if (this.DEBUG) {
        this._debug(msg)
      }
      const id = peer.getId()
      if (id && equalsBytes(id, this.id)) {
        return peer.disconnect(DISCONNECT_REASON.SAME_IDENTITY)
      }

      // Using deprecated bytesToUnprefixedHex for performance: used as Map keys for peer lookups.
      const peerKey = bytesToUnprefixedHex(id!)
      const item = this._peers.get(peerKey)
      if (item && item instanceof Peer) {
        return peer.disconnect(DISCONNECT_REASON.ALREADY_CONNECTED)
      }

      this._peers.set(peerKey, peer)
      this._discoveryMetrics?.recordRlpxConnected()
      this.events.emit('peer:added', peer)
      this._syncDiscoveryThrottle()
    })

    peer.events.once('close', (reason, disconnectWe) => {
      if (typeof reason === 'number' && (disconnectWe === true || disconnectWe === false)) {
        this._discoveryMetrics?.recordRlpxDisconnect(
          reason as DISCONNECT_REASON,
          disconnectWe === true ? 'local' : 'remote',
        )
      }
      if (disconnectWe === true) {
        if (this.DEBUG) {
          this._debug(
            `disconnect from ${socket.remoteAddress}:${socket.remotePort}, reason: ${DisconnectReasonNames[reason as DISCONNECT_REASON]}`,
            `disconnect`,
          )
        }
      }

      // A remote slot reject stays in the LRU. Requeueing it on a short timer
      // fills the outbound dial slots with the same full nodes. Explicit
      // connects (peer book) still retry after their own dial hold.

      const id = peer.getId()
      if (id) {
        this._handlePeerDisconnect(peer, reason as DISCONNECT_REASON | undefined, disconnectWe)
      }
    })
  }

  _handlePeerDisconnect(
    peer: Peer,
    reason: DISCONNECT_REASON | undefined,
    disconnectWe: boolean | null,
  ): void {
    const id = peer.getId()
    if (!id) return
    // Using deprecated bytesToUnprefixedHex for performance: used as Map keys for peer lookups.
    const peerKey = bytesToUnprefixedHex(id)
    this._peers.delete(peerKey)
    const helloClientId = peer.getHelloMessage()?.clientId
    const clientStr =
      helloClientId !== undefined
        ? typeof helloClientId === 'string'
          ? helloClientId.toLowerCase()
          : new TextDecoder().decode(helloClientId).toLowerCase()
        : ''
    const nonSnapClient =
      clientStr.includes('eri' + 'gon') || clientStr.includes('scout') || clientStr.includes('reth')
    if (nonSnapClient) {
      this._peersLRU.set(peerKey, true)
    } else if (reason === DISCONNECT_REASON.TOO_MANY_PEERS) {
      const getProtocols = peer.getProtocols
      const protocols = typeof getProtocols === 'function' ? getProtocols.call(peer) : undefined
      const negotiatedSnap =
        protocols !== undefined && protocols.some((p) => p.constructor.name === 'SNAP')
      if (protocols !== undefined && !negotiatedSnap) {
        this._peersLRU.set(peerKey, true)
      } else {
        this._peersLRU.delete(peerKey)
        this._peerDialHoldUntil.set(peerKey, Date.now() + TOO_MANY_PEERS_DIAL_HOLD_MS)
      }
    } else if (
      reason === DISCONNECT_REASON.TIMEOUT ||
      reason === DISCONNECT_REASON.NETWORK_ERROR ||
      reason === DISCONNECT_REASON.CLIENT_QUITTING
    ) {
      this._peersLRU.delete(peerKey)
    }
    this.events.emit('peer:removed', peer, reason!, disconnectWe)
    this._syncDiscoveryThrottle()
  }

  _connectedPeerCount(): number {
    let count = 0
    for (const item of this._peers.values()) {
      if (item instanceof Peer) count++
    }
    return count
  }

  /** Pause discovery for active snap sync; cleared by the worker client when peers drop. */
  setSyncDiscoveryHold(held: boolean): void {
    this._syncDiscoveryHold = held
    if (this._dpt !== null) {
      this._dpt.setDiscoveryPaused(held)
    }
  }

  isSyncDiscoveryHold(): boolean {
    return this._syncDiscoveryHold
  }

  _syncDiscoveryThrottle(): void {
    if (!this._throttleDiscovery || this._dpt === null) return
    if (this._syncDiscoveryHold) {
      this._dpt.setDiscoveryPaused(true)
      return
    }
    const connected = this._connectedPeerCount()
    if (connected >= this._maxPeers) {
      this._dpt.setDiscoveryPaused(true)
    } else if (connected <= this._discoveryLowWaterMark) {
      this._dpt.setDiscoveryPaused(false)
    }
  }

  _refillConnections() {
    if (!this._isAlive()) return
    if (this._refillIntervalSelectionCounter === 0) {
      if (this.DEBUG) {
        this._debug(
          `Restart connection refill .. with selector ${
            this._refillIntervalSelectionCounter
          } peers: ${this._peers.size}, queue size: ${
            this._peersQueue.length
          }, open slots: ${this._getOpenSlots()}`,
        )
      }
    }
    // Rotating selection counter going in loop from 0..9
    this._refillIntervalSelectionCounter = (this._refillIntervalSelectionCounter + 1) % 10
    this._dialQueuedDirectoryPeers()
    this._promoteDeferredDials()
    if (this._hasReadyDirectoryPeer()) return

    this._peersQueue = this._peersQueue.filter((item) => {
      if (!this._canStartOutboundDial()) return true
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
