import {
  EthereumJSErrorWithoutCode,
  bytesToInt,
  bytesToUnprefixedHex,
  randomBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { EventEmitter } from 'eventemitter3'

import { DNS } from '../dns/index.ts'
import { devp2pDebug, pk2id } from '../util.ts'

import { BanList } from './ban-list.ts'
import { KBucket } from './kbucket.ts'
import { JSONNodeStore, MemoryNodeStore } from './nodeStore.ts'
import { Server as DPTServer } from './server.ts'

import type { Debugger } from 'debug'
import type { DPTEvent, DPTOptions, PeerInfo } from '../types.ts'
import type { NodeStore } from './nodeStore.ts'

const DEBUG_BASE_NAME = 'dpt'

/** Distributed peer table (DPT) for Ethereum UDP node discovery and DNS ENR refresh. */
export class DPT {
  public events: EventEmitter<DPTEvent>
  protected _privateKey: Uint8Array
  protected _banlist: BanList
  protected _dns: DNS
  private _debug: Debugger

  public readonly id: Uint8Array | undefined
  protected _kbucket: KBucket
  protected _server: DPTServer
  protected _refreshIntervalId: NodeJS.Timeout
  protected _refreshIntervalSelectionCounter: number = 0
  protected _shouldFindNeighbours: boolean
  protected _shouldGetDnsPeers: boolean
  protected _dnsRefreshQuantity: number
  protected _dnsNetworks: string[]
  protected _dnsAddr: string

  protected _onlyConfirmed: boolean
  protected _confirmedPeers: Set<string>

  protected _keccakFunction: (msg: Uint8Array) => Uint8Array
  protected _nodeStore: NodeStore
  protected _revalidateCounter = 0
  protected _revalidatePeers: boolean
  protected _maxInFlightPings: number | undefined
  protected _discoveryPaused = false
  protected _peerBatchQueue: PeerInfo[] = []
  protected _inFlightPings = 0
  protected _discoveryMetrics: import('../discovery/metrics.ts').DiscoveryMetrics | undefined

  private DEBUG: boolean

  constructor(privateKey: Uint8Array, options: DPTOptions) {
    this.events = new EventEmitter<DPTEvent>()
    this._privateKey = privateKey
    this.id = pk2id(secp256k1.getPublicKey(this._privateKey, false))
    this._shouldFindNeighbours = options.shouldFindNeighbours ?? true
    this._shouldGetDnsPeers = options.shouldGetDnsPeers ?? false
    // By default, tries to connect to 12 new peers every 3s
    this._dnsRefreshQuantity = Math.floor((options.dnsRefreshQuantity ?? 25) / 2)
    this._dnsNetworks = options.dnsNetworks ?? []
    this._dnsAddr = options.dnsAddr ?? ''
    this._discoveryMetrics = options.discoveryMetrics
    this._discoveryMetrics?.setDnsResolver(
      options.dnsAddr !== undefined && options.dnsAddr.length > 0 ? options.dnsAddr : 'system',
    )

    this._dns = new DNS({
      common: options.common,
      ...(options.dnsAddr !== undefined && options.dnsAddr.length > 0
        ? { dnsServerAddress: options.dnsAddr }
        : {}),
    })
    this._banlist = new BanList()
    this._nodeStore =
      options.nodeStore ??
      (options.nodeStorePath !== undefined
        ? new JSONNodeStore(options.nodeStorePath)
        : new MemoryNodeStore())

    this._revalidatePeers = options.revalidatePeers ?? true
    this._onlyConfirmed = options.onlyConfirmed ?? false
    this._confirmedPeers = new Set()
    this._maxInFlightPings = options.maxInFlightPings

    this._keccakFunction = options.common?.customCrypto.keccak256 ?? keccak_256

    this._kbucket = new KBucket(this.id)
    this._kbucket.events.on('added', (peer: PeerInfo) => this.events.emit('peer:added', peer))
    this._kbucket.events.on('removed', (peer: PeerInfo) => this.events.emit('peer:removed', peer))
    this._kbucket.events.on('ping', this._onKBucketPing.bind(this))

    this._server = new DPTServer(this, this._privateKey, {
      timeout: options.timeout,
      endpoint: options.endpoint,
      createSocket: options.createSocket,
      common: options.common,
      discoveryMetrics: options.discoveryMetrics,
    })
    this._server.events.once('listening', () => this.events.emit('listening'))
    this._server.events.once('close', () => this.events.emit('close'))
    this._server.events.on('error', (err) => this.events.emit('error', err))
    this._debug = devp2pDebug.extend(DEBUG_BASE_NAME)
    // When not using peer neighbour discovery we don't add peers here
    // because it results in duplicate calls for the same targets
    this._server.events.on('peers', (peers) => {
      if (!this._shouldFindNeighbours) return
      this._addPeerBatch(peers)
    })

    // By default calls refresh every 3s
    const refreshIntervalSubdivided = Math.floor((options.refreshInterval ?? 60000) / 10) // 60 sec * 1000
    this._refreshIntervalId = setInterval(() => {
      void this.refresh().catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        if (this.DEBUG) {
          this._debug(`refresh failed: ${msg}`)
        }
      })
    }, refreshIntervalSubdivided)

    this.DEBUG = globalThis.process?.env?.DEBUG?.includes('ethjs') ?? false
  }

  bind(...args: any[]): void {
    this._server.bind(...args)
  }

  destroy(...args: any[]): void {
    clearInterval(this._refreshIntervalId)
    this._server.destroy(...args)
  }

  /** Pause or resume neighbour lookup and DNS-driven peer batches (refresh timer stays armed). */
  setDiscoveryPaused(paused: boolean): void {
    if (this._discoveryPaused === paused) return
    this._discoveryPaused = paused
    if (paused) {
      this._peerBatchQueue = []
    } else {
      void this.refresh()
      this._drainPeerBatchQueue()
    }
  }

  isDiscoveryPaused(): boolean {
    return this._discoveryPaused
  }

  _onKBucketPing(oldPeers: PeerInfo[], newPeer: PeerInfo): void {
    if (this._banlist.has(newPeer)) return

    let count = 0
    let err: Error | null = null
    for (const peer of oldPeers) {
      this._server
        .ping(peer)
        .then(() => {
          if (++count < oldPeers.length) return
          if (err === null)
            this._banlist.add(newPeer, 300000) // 5 min * 60 * 1000
          else this._kbucket.add(newPeer)
        })
        .catch((_err: Error) => {
          this._banlist.add(peer, 300000) // 5 min * 60 * 1000
          this._kbucket.remove(peer)
          err = err ?? _err
        })
    }
  }

  _addPeerBatch(peers: PeerInfo[]): void {
    if (this._discoveryPaused) return
    if (this._maxInFlightPings === undefined) {
      const DIFF_TIME_MS = 200
      let ms = 0
      for (const peer of peers) {
        setTimeout(() => {
          this.addPeer(peer).catch((error) => {
            this.events.emit('error', error)
          })
        }, ms)
        ms += DIFF_TIME_MS
      }
      return
    }
    this._peerBatchQueue.push(...peers)
    this._drainPeerBatchQueue()
  }

  _drainPeerBatchQueue(): void {
    if (this._discoveryPaused || this._maxInFlightPings === undefined) return
    while (this._inFlightPings < this._maxInFlightPings && this._peerBatchQueue.length > 0) {
      const peer = this._peerBatchQueue.shift()!
      this._inFlightPings++
      this.addPeer(peer)
        .catch((error) => {
          this.events.emit('error', error)
        })
        .finally(() => {
          this._inFlightPings--
          this._drainPeerBatchQueue()
        })
    }
  }

  async bootstrap(peer: PeerInfo): Promise<void> {
    this._discoveryMetrics?.recordBootstrapAttempt()
    try {
      peer = await this.addPeer(peer)
      if (peer.id !== undefined) {
        // Using deprecated bytesToUnprefixedHex for performance: used as Set keys for peer tracking.
        this._confirmedPeers.add(bytesToUnprefixedHex(peer.id))
      }
      this._discoveryMetrics?.recordBootstrapOk()
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error)
      this._discoveryMetrics?.recordBootstrapFail(msg)
      this.events.emit('error', error)
      return
    }
    if (!this.id) return
    if (this._shouldFindNeighbours) {
      this._server.findneighbours(peer, this.id)
    }
  }

  /**
   * Ping `peer`, answer its ENR request, and return the neighbours it sends back.
   * Mainnet bootnodes reply with a peer list only after the ENR exchange.
   */
  async lookupNeighbours(peer: PeerInfo, waitMs = 2000): Promise<PeerInfo[]> {
    const bonded = await this.addPeer(peer)
    const found: PeerInfo[] = []
    const onPeers = (peers: PeerInfo[]) => {
      found.push(...peers)
    }
    this._server.events.on('peers', onPeers)
    try {
      if (this.id !== undefined) {
        // First query prompts the bootnode to ping us and request our ENR.
        this._server.findneighbours(bonded, this.id)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this._server.findneighbours(bonded, this.id)
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    } finally {
      this._server.events.off('peers', onPeers)
    }
    return found
  }

  async addPeer(obj: PeerInfo): Promise<PeerInfo> {
    if (this._banlist.has(obj)) throw EthereumJSErrorWithoutCode('Peer is banned')
    if (this.DEBUG) {
      this._debug(`attempt adding peer ${obj.address}:${obj.udpPort}`)
    }

    // check k-bucket first
    const peer = this._kbucket.get(obj)
    if (peer !== null) return peer

    // check that peer is alive
    try {
      const peer = await this._server.ping(obj)
      this.events.emit('peer:new', peer)
      this._kbucket.add(peer)
      if (peer.id !== undefined) {
        this._nodeStore.put({
          id: bytesToUnprefixedHex(peer.id),
          address: peer.address!,
          udpPort: peer.udpPort!,
          tcpPort: peer.tcpPort,
          lastPong: Date.now(),
          failCount: 0,
        })
      }
      return peer
    } catch (err: any) {
      this._recordFail(obj)
      this._banlist.add(obj, 300000) // 5 min * 60 * 1000
      throw err
    }
  }

  updatePeerEndpoint(id: Uint8Array, endpoint: PeerInfo): void {
    const peer = this._kbucket.get(id)
    if (peer === null) return
    const updated = { ...peer, ...endpoint, id }
    this._kbucket.remove(id)
    this._kbucket.add(updated)
    this._nodeStore.put({
      id: bytesToUnprefixedHex(id),
      address: updated.address!,
      udpPort: updated.udpPort!,
      tcpPort: updated.tcpPort,
      lastPong: Date.now(),
      failCount: 0,
    })
  }

  _recordFail(obj: PeerInfo): void {
    if (obj.id === undefined) return
    const id = bytesToUnprefixedHex(obj.id)
    const prev = this._nodeStore.get(id)
    const failCount = (prev?.failCount ?? 0) + 1
    if (failCount >= 3) {
      this.banPeer(obj, 300000)
      return
    }
    this._nodeStore.put({
      id,
      address: obj.address ?? prev?.address ?? '',
      udpPort: obj.udpPort ?? prev?.udpPort ?? 0,
      tcpPort: obj.tcpPort ?? prev?.tcpPort,
      lastPong: prev?.lastPong,
      failCount,
    })
  }

  async _revalidateOnePeer(): Promise<void> {
    const peers = this.getPeers()
    if (peers.length === 0) return
    const stored = this._nodeStore
      .list()
      .filter((n) => peers.some((p) => p.id && bytesToUnprefixedHex(p.id) === n.id))
      .sort((a, b) => (a.lastPong ?? 0) - (b.lastPong ?? 0))
    const target = stored[0]
    if (!target) return
    const peer = peers.find((p) => p.id && bytesToUnprefixedHex(p.id) === target.id)
    if (!peer) return
    try {
      await this._server.ping(peer)
      this._nodeStore.put({ ...target, lastPong: Date.now(), failCount: 0 })
    } catch {
      this._recordFail(peer)
      this.removePeer(peer)
    }
  }

  /**
   * Add peer to a confirmed list of peers (peers meeting some
   * level of quality, e.g. being on the same network) to allow
   * for a more selective findNeighbours request and sending
   * (with activated `onlyConfirmed` setting)
   *
   * @param id Unprefixed hex id
   */
  confirmPeer(id: string) {
    if (this._confirmedPeers.size < 5000) {
      this._confirmedPeers.add(id)
    }
  }

  getPeer(obj: string | Uint8Array | PeerInfo) {
    return this._kbucket.get(obj)
  }

  getPeers() {
    return this._kbucket.getAll()
  }

  numPeers() {
    return this._kbucket.getAll().length
  }

  getClosestPeers(id: Uint8Array) {
    let peers = this._kbucket.closest(id)
    if (this._onlyConfirmed && this._confirmedPeers.size > 0) {
      // Using deprecated bytesToUnprefixedHex for performance: used as Set keys for peer filtering.
      peers = peers.filter((peer) =>
        this._confirmedPeers.has(bytesToUnprefixedHex(peer.id as Uint8Array)) ? true : false,
      )
    }
    return peers
  }

  removePeer(obj: string | PeerInfo | Uint8Array) {
    const peer = this._kbucket.get(obj)
    if (peer?.id !== undefined) {
      // Using deprecated bytesToUnprefixedHex for performance: used as Set keys for peer tracking.
      this._confirmedPeers.delete(bytesToUnprefixedHex(peer.id as Uint8Array))
    }
    this._kbucket.remove(obj)
  }

  banPeer(obj: string | PeerInfo | Uint8Array, maxAge?: number) {
    this._banlist.add(obj, maxAge)
    this._kbucket.remove(obj)
  }

  /** Refresh discv4 `from` endpoint from the bound UDP socket and TCP listen port. */
  syncEndpointFromSocket(tcpListenPort: number): PeerInfo {
    return this._server.syncEndpointFromSocket(tcpListenPort)
  }

  async getDnsPeers(): Promise<PeerInfo[]> {
    return this._dns.getPeers(this._dnsRefreshQuantity, this._dnsNetworks)
  }

  async refresh(): Promise<void> {
    if (this._discoveryPaused) {
      if (this._revalidatePeers) {
        this._revalidateCounter = (this._revalidateCounter + 1) % 10
        if (this._revalidateCounter === 0) {
          await this._revalidateOnePeer().catch(() => {})
        }
      }
      return
    }

    if (this._revalidatePeers) {
      this._revalidateCounter = (this._revalidateCounter + 1) % 10
      if (this._revalidateCounter === 0) {
        await this._revalidateOnePeer().catch(() => {})
      }
    }

    if (this._shouldFindNeighbours) {
      // Rotating selection counter going in loop from 0..9
      this._refreshIntervalSelectionCounter = (this._refreshIntervalSelectionCounter + 1) % 10

      const peers = this.getPeers()
      if (this.DEBUG) {
        this._debug(
          `call .refresh() (selector ${this._refreshIntervalSelectionCounter}) (${peers.length} peers in table)`,
        )
      }

      for (const peer of peers) {
        // Randomly distributed selector based on peer ID
        // to decide on subdivided execution
        const selector = bytesToInt((peer.id as Uint8Array).subarray(0, 1)) % 10
        let confirmed = true
        if (this._onlyConfirmed && this._confirmedPeers.size > 0) {
          // Using deprecated bytesToUnprefixedHex for performance: used as Set keys for peer filtering.
          const id = bytesToUnprefixedHex(peer.id as Uint8Array)
          if (!this._confirmedPeers.has(id)) {
            confirmed = false
          }
        }
        if (confirmed && selector === this._refreshIntervalSelectionCounter) {
          this._server.findneighbours(peer, randomBytes(64))
        }
      }
    }

    if (this._shouldGetDnsPeers) {
      let dnsPeers: PeerInfo[] = []
      this._discoveryMetrics?.recordDnsAttempt()
      try {
        dnsPeers = await this.getDnsPeers()
        this._discoveryMetrics?.recordDnsPeersAdded(dnsPeers.length)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        this._discoveryMetrics?.recordDnsError(msg)
        if (this.DEBUG) {
          this._debug(`DNS peer lookup failed: ${msg}`)
        }
      }

      if (this.DEBUG) {
        this._debug(
          `.refresh() Adding ${dnsPeers.length} from DNS tree, (${
            this.getPeers().length
          } current peers in table)`,
        )
      }

      this._addPeerBatch(dnsPeers)
    }
  }
}
