import ms from 'ms'
import { EventEmitter } from 'events'
import { publicKeyCreate } from 'secp256k1'
import { randomBytes } from 'crypto'
import { debug as createDebugLogger } from 'debug'
import { pk2id } from '../util'
import { KBucket } from './kbucket'
import { BanList } from './ban-list'
import { Server as DPTServer } from './server'

const debug = createDebugLogger('devp2p:dpt')

export class DPT extends EventEmitter {
  privateKey: Buffer
  banlist: BanList

  private _id: Buffer | undefined
  private _kbucket: KBucket
  private _server: DPTServer
  private _refreshIntervalId: NodeJS.Timeout

  constructor(privateKey: Buffer, options: any) {
    super()

    this.privateKey = Buffer.from(privateKey)
    this._id = pk2id(Buffer.from(publicKeyCreate(this.privateKey, false)))

    this.banlist = new BanList()

    this._kbucket = new KBucket(this._id)
    this._kbucket.on('added', peer => this.emit('peer:added', peer))
    this._kbucket.on('removed', peer => this.emit('peer:removed', peer))
    this._kbucket.on('ping', this._onKBucketPing)

    this._server = new DPTServer(this, this.privateKey, {
      createSocket: options.createSocket,
      timeout: options.timeout,
      endpoint: options.endpoint
    })
    this._server.once('listening', () => this.emit('listening'))
    this._server.once('close', () => this.emit('close'))
    this._server.on('peers', peers => this._onServerPeers(peers))
    this._server.on('error', err => this.emit('error', err))

    const refreshInterval = options.refreshInterval || ms('60s')
    this._refreshIntervalId = setInterval(() => this.refresh(), refreshInterval)
  }

  bind(...args: any[]): void {
    this._server.bind(...args)
  }

  destroy(...args: any[]): void {
    clearInterval(this._refreshIntervalId)
    this._server.destroy(...args)
  }

  _onKBucketPing(oldPeers: any[], newPeer: any): void {
    if (this.banlist.has(newPeer)) return

    let count = 0
    let err: Error | null = null
    for (const peer of oldPeers) {
      this._server
        .ping(peer)
        .catch((_err: Error) => {
          this.banlist.add(peer, ms('5m'))
          this._kbucket.remove(peer)
          err = err || _err
        })
        .then(() => {
          if (++count < oldPeers.length) return

          if (err === null) this.banlist.add(newPeer, ms('5m'))
          else this._kbucket.add(newPeer)
        })
    }
  }

  _onServerPeers(peers: any[]): void {
    for (const peer of peers) this.addPeer(peer).catch(() => {})
  }

  async bootstrap(peer: any): Promise<void> {
    debug(`bootstrap with peer ${peer.address}:${peer.udpPort}`)

    peer = await this.addPeer(peer)
    if (!this._id) return
    this._server.findneighbours(peer, this._id)
  }

  async addPeer(obj: any): Promise<any> {
    if (this.banlist.has(obj)) throw new Error('Peer is banned')
    debug(`attempt adding peer ${obj.address}:${obj.udpPort}`)

    // check k-bucket first
    const peer = this._kbucket.get(obj)
    if (peer !== null) return peer

    // check that peer is alive
    try {
      const peer = await this._server.ping(obj)
      this.emit('peer:new', peer)
      this._kbucket.add(peer)
      return peer
    } catch (err) {
      this.banlist.add(obj, ms('5m'))
      throw err
    }
  }

  getPeer(obj: any): any {
    return this._kbucket.get(obj)
  }

  getPeers(): any[] {
    return this._kbucket.getAll()
  }

  getClosestPeers(id: string): any {
    return this._kbucket.closest(id)
  }

  removePeer(obj: any) {
    this._kbucket.remove(obj)
  }

  banPeer(obj: any, maxAge?: number) {
    this.banlist.add(obj, maxAge)
    this._kbucket.remove(obj)
  }

  refresh(): void {
    const peers = this.getPeers()
    debug(`call .refresh (${peers.length} peers in table)`)

    for (const peer of peers) this._server.findneighbours(peer, randomBytes(64))
  }
}
