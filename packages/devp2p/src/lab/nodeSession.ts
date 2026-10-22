import { join } from 'node:path'

import { DPT, RLPx } from '../index.ts'

import { resolveCapabilities } from './capabilities.ts'
import { LOCALHOST } from './constants.ts'
import { EventBus } from './eventBus.ts'
import { buildEthRlpPayload, ethMessageNameToCode, ethStatusFromFields } from './messages/eth.ts'
import { buildSnapRlpPayload, snapMessageNameToCode } from './messages/snap.ts'
import { jsonToRlpInput } from './payloadCodec.ts'

import type { ETH, Peer } from '../index.ts'

import type { Common } from '@ethereumjs/common'
import type { SNAP } from '../protocol/snap.ts'
import type { LabNodeConfig } from './labDir.ts'
import type { EthStatusFields } from './messages/eth.ts'

export class NodeSession {
  readonly name: string
  readonly eventBus: EventBus
  readonly dpt: DPT
  readonly rlpx: RLPx
  readonly nodeDir: string
  private waiters: Array<{
    match: (
      ev: ReturnType<EventBus['emit']> extends never
        ? never
        : Parameters<EventBus['onEvent']>[0] extends (e: infer E) => void
          ? E
          : never,
    ) => boolean
    resolve: (ev: unknown) => void
    timer: NodeJS.Timeout
  }> = []

  constructor(opts: {
    name: string
    nodeDir: string
    privateKey: Uint8Array
    nodeConfig: LabNodeConfig
    common: Common
    eventBus?: EventBus
  }) {
    this.name = opts.name
    this.nodeDir = opts.nodeDir
    this.eventBus = opts.eventBus ?? new EventBus()
    const caps = resolveCapabilities(opts.nodeConfig.capabilities)
    this.dpt = new DPT(opts.privateKey, {
      endpoint: {
        address: opts.nodeConfig.listenAddress,
        udpPort: opts.nodeConfig.udpPort,
        tcpPort: opts.nodeConfig.tcpPort,
      },
      timeout: 5000,
      shouldFindNeighbours: false,
      shouldGetDnsPeers: false,
    })
    this.dpt.bind(opts.nodeConfig.udpPort)
    this.rlpx = new RLPx(opts.privateKey, {
      dpt: this.dpt,
      maxPeers: 25,
      capabilities: caps,
      common: opts.common,
      listenPort: opts.nodeConfig.tcpPort,
    })
    this.rlpx.listen(opts.nodeConfig.tcpPort)
    this.wireEvents()
  }

  private wireEvents() {
    this.dpt.events.on('peer:new', (peer) => {
      this.eventBus.emit({
        node: this.name,
        dir: 'in',
        layer: 'dpt',
        name: 'peer:new',
        peer: `${peer.address}:${peer.udpPort}`,
      })
    })
    this.dpt.events.on('peer:added', (peer) => {
      this.eventBus.emit({
        node: this.name,
        dir: 'in',
        layer: 'dpt',
        name: 'peer:added',
        peer: `${peer.address}:${peer.udpPort}`,
      })
    })
    this.dpt.events.on('peer:removed', (peer) => {
      this.eventBus.emit({
        node: this.name,
        dir: 'in',
        layer: 'dpt',
        name: 'peer:removed',
        peer: `${peer.address}:${peer.udpPort}`,
      })
    })

    this.rlpx.events.on('peer:added', (peer: Peer) => {
      this.eventBus.emit({
        node: this.name,
        dir: 'in',
        layer: 'rlpx',
        name: 'peer:added',
        peer: this.peerLabel(peer),
      })
      peer.events.on('ping', () => {
        this.eventBus.emit({
          node: this.name,
          dir: 'in',
          layer: 'rlpx',
          name: 'PING',
          peer: this.peerLabel(peer),
        })
      })
      peer.events.on('pong', () => {
        this.eventBus.emit({
          node: this.name,
          dir: 'in',
          layer: 'rlpx',
          name: 'PONG',
          peer: this.peerLabel(peer),
        })
      })
      for (const protocol of peer.getProtocols()) {
        protocol.events.on('message', (code: number, payload: unknown) => {
          const layer = protocol.constructor.name === 'SNAP' ? 'snap' : 'eth'
          const name =
            typeof (protocol as ETH).getMsgPrefix === 'function'
              ? (protocol as ETH).getMsgPrefix(code as never)
              : String(code)
          this.eventBus.emit({
            node: this.name,
            dir: 'in',
            layer: layer as 'eth' | 'snap',
            name,
            peer: this.peerLabel(peer),
            payload: EventBus.payloadFromRlp(payload as never),
          })
          this.flushWaiters()
        })
      }
      peer.events.on('error', (err: Error) => {
        this.eventBus.emit({
          node: this.name,
          layer: 'rlpx',
          name: 'peer:error',
          peer: this.peerLabel(peer),
          message: err.message,
        })
        this.flushWaiters()
      })
    })

    this.rlpx.events.on('peer:removed', (peer, reason) => {
      this.eventBus.emit({
        node: this.name,
        dir: 'in',
        layer: 'rlpx',
        name: 'peer:removed',
        peer: this.peerLabel(peer),
        message: String(reason),
      })
    })
  }

  private peerLabel(peer: Peer): string {
    const sock = peer['_socket'] as { remoteAddress?: string; remotePort?: number }
    return `${sock.remoteAddress ?? '?'}:${sock.remotePort ?? '?'}`
  }

  getPeer(index: number): Peer {
    const peers = this.rlpx.getPeers()
    const peer = peers[index]
    if (!peer) {
      throw new Error(`No RLPx peer at index ${index} (have ${peers.length})`)
    }
    return peer
  }

  getEth(index: number): ETH {
    return this.getProtocol(index, 'eth') as ETH
  }

  getSnap(index: number): SNAP {
    return this.getProtocol(index, 'snap') as SNAP
  }

  getProtocol(peerIndex: number, kind: 'eth' | 'snap'): ETH | SNAP {
    const peer = this.getPeer(peerIndex)
    for (const protocol of peer.getProtocols()) {
      const name = protocol.constructor.name
      if (kind === 'eth' && name === 'ETH') return protocol as ETH
      if (kind === 'snap' && name === 'SNAP') return protocol as SNAP
    }
    throw new Error(`Peer ${peerIndex} has no ${kind.toUpperCase()} subprotocol`)
  }

  async addPeer(host: string, udpPort: number, tcpPort?: number) {
    await this.dpt.addPeer({ address: host, udpPort, tcpPort: tcpPort ?? udpPort })
  }

  async dptPing(host: string, udpPort: number) {
    await this.dpt.addPeer({ address: host, udpPort })
    this.eventBus.emit({
      node: this.name,
      dir: 'out',
      layer: 'dpt',
      name: 'ping',
      peer: `${host}:${udpPort}`,
    })
  }

  sendRlpxPing(peerIndex: number) {
    const peer = this.getPeer(peerIndex)
    peer.ping()
    this.eventBus.emit({
      node: this.name,
      dir: 'out',
      layer: 'rlpx',
      name: 'PING',
      peer: this.peerLabel(peer),
    })
  }

  listPeers() {
    return this.rlpx.getPeers().map((p, i) => ({ index: i, addr: this.peerLabel(p) }))
  }

  sendEthStatus(peerIndex: number, status: EthStatusFields) {
    const eth = this.getEth(peerIndex)
    eth.sendStatus(ethStatusFromFields(status))
    this.eventBus.emit({
      node: this.name,
      dir: 'out',
      layer: 'eth',
      name: 'STATUS',
      peer: this.peerLabel(this.getPeer(peerIndex)),
      payload: status,
    })
  }

  sendEthMessage(peerIndex: number, name: string, json?: Record<string, unknown>, rlp?: unknown) {
    const eth = this.getEth(peerIndex)
    const code = ethMessageNameToCode(name)
    const payload = rlp !== undefined ? jsonToRlpInput(rlp) : buildEthRlpPayload(name, json ?? {})
    eth.sendMessage(code, payload)
    this.eventBus.emit({
      node: this.name,
      dir: 'out',
      layer: 'eth',
      name,
      peer: this.peerLabel(this.getPeer(peerIndex)),
      payload: json ?? rlp,
    })
  }

  sendSnapMessage(peerIndex: number, name: string, json?: Record<string, unknown>, rlp?: unknown) {
    const snap = this.getSnap(peerIndex)
    const code = snapMessageNameToCode(name)
    const payload = rlp !== undefined ? jsonToRlpInput(rlp) : buildSnapRlpPayload(name, json ?? {})
    snap.sendMessage(code as never, payload)
    this.eventBus.emit({
      node: this.name,
      dir: 'out',
      layer: 'snap',
      name,
      peer: this.peerLabel(this.getPeer(peerIndex)),
      payload: json ?? rlp,
    })
  }

  waitForEvent(
    predicate: (ev: { layer?: string; name?: string; node?: string; message?: string }) => boolean,
    timeoutMs: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const handler = (
        ev: Parameters<EventBus['onEvent']>[0] extends (e: infer E) => void ? E : never,
      ) => {
        if (predicate(ev)) {
          clearTimeout(timer)
          this.eventBus.onEvent(() => {})
          resolve()
        }
      }
      const timer = setTimeout(() => {
        reject(new Error(`waitForEvent timeout after ${timeoutMs}ms`))
      }, timeoutMs)
      this.eventBus.onEvent(handler as never)
    })
  }

  private flushWaiters() {
    // waiters use eventBus.onEvent - simplified: use external WaitRegistry in dispatcher
  }

  controlSocketPath() {
    return join(this.nodeDir, 'control.sock')
  }

  pidPath() {
    return join(this.nodeDir, 'node.pid')
  }

  destroy() {
    this.dpt.destroy()
    this.rlpx.destroy()
  }
}
