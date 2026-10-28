import {
  type ChainConfig,
  Common,
  Hardfork,
  Holesky,
  Hoodi,
  Mainnet,
  Sepolia,
} from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, bytesToUnprefixedHex, utf8ToBytes } from '@ethereumjs/util'

import type { MessagePort } from 'node:worker_threads'
import { DiscoveryMetrics } from '../discovery/metrics.ts'
import { DPT } from '../dpt/dpt.ts'
import { resolveCapabilities } from '../lab/capabilities.ts'
import { emptyWireReply } from '../lab/emptyReply.ts'
import { ethMessageNameToCode, ethStatusFromFields } from '../lab/messages/eth.ts'
import type { EthStatusFields } from '../lab/messages/eth.ts'
import { snapMessageNameToCode } from '../lab/messages/snap.ts'
import { EthMessageCodes } from '../protocol/eth/codes.ts'
import { ETH, SNAP } from '../protocol/index.ts'
import { SnapMessageCodeNames, SnapMessageCodes } from '../protocol/snap.ts'
import { Peer } from '../rlpx/peer.ts'
import { RLPx } from '../rlpx/rlpx.ts'
import type { PeerInfo } from '../types.ts'
import { dptDnsOptionsFromCommon, resolveWorkerBootnodes } from './bootNodes.ts'
import type {
  ThreadedNetworkInitOptions,
  WorkerCommand,
  WorkerDiagnosticEntry,
  WorkerEvent,
  WorkerTelemetrySnapshot,
} from './protocol.ts'

const ETH_CODE_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(EthMessageCodes).map(([name, code]) => [code as number, name]),
)

function commonFromInit(options: ThreadedNetworkInitOptions): Common {
  const chains: Record<string, ChainConfig> = {
    mainnet: Mainnet,
    sepolia: Sepolia,
    hoodi: Hoodi,
    holesky: Holesky,
  }
  const chain = chains[options.chain]
  if (!chain) {
    throw new Error(`Unsupported worker chain: ${options.chain}`)
  }
  const hardfork = (options.hardfork ?? 'london') as Hardfork
  return new Common({ chain, hardfork })
}

function copyToTransferBuffer(bytes: Uint8Array): Uint8Array {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

/** Runs DPT + RLPx inside a worker thread or in-process MessagePort. */
export class Devp2pWorkerHost {
  private _port: MessagePort
  private _options: ThreadedNetworkInitOptions | null = null
  private _dpt: DPT | null = null
  private _rlpx: RLPx | null = null
  private _telemetryTimer: NodeJS.Timeout | null = null
  private _diagnostics: WorkerDiagnosticEntry[] = []
  private _peerRtt = new Map<string, number>()
  private _discoveryMetrics = new DiscoveryMetrics()
  private _blockRange: { earliest: Uint8Array; latest: Uint8Array; latestHash: Uint8Array } | null =
    null

  constructor(port: MessagePort) {
    this._port = port
    port.on('message', (value: WorkerCommand | { data: WorkerCommand }) => {
      const msg =
        value !== null && typeof value === 'object' && 'data' in value ? value.data : value
      void this._onCommand(msg as WorkerCommand)
    })
  }

  private _post(event: WorkerEvent, transfer?: ArrayBuffer[]): void {
    if (transfer !== undefined && transfer.length > 0) {
      this._port.postMessage(event, transfer)
    } else {
      this._port.postMessage(event)
    }
  }

  private _pushDiagnostic(
    severity: WorkerDiagnosticEntry['severity'],
    message: string,
    peerId?: string,
  ) {
    this._diagnostics.push({ timestamp: Date.now(), severity, message, peerId })
    if (this._diagnostics.length > 64) {
      this._diagnostics.shift()
    }
  }

  private async _onCommand(cmd: WorkerCommand): Promise<void> {
    try {
      switch (cmd.type) {
        case 'boot':
          this._options = cmd.options
          await this._start()
          break
        case 'init':
          this._options = cmd.options
          break
        case 'start':
          await this._start()
          break
        case 'stop':
          this._stop()
          break
        case 'connectPeer':
          await this._rlpx?.connect(cmd.peer)
          break
        case 'disconnectPeer':
          this._rlpx?.disconnect(cmd.peerId)
          break
        case 'sendEthMessage':
          this._sendEth(cmd.peerId, cmd.code, cmd.payload)
          break
        case 'sendSnapMessage':
          this._sendSnap(cmd.peerId, cmd.code, cmd.payload)
          break
        case 'setBlockRange':
          this._blockRange = {
            earliest: cmd.earliest,
            latest: cmd.latest,
            latestHash: cmd.latestHash,
          }
          this._broadcastBlockRange()
          break
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this._post({ type: 'error', message })
    }
  }

  private async _start(): Promise<void> {
    if (this._options === null) throw new Error('Worker init required before start')
    const opts = this._options
    const common = commonFromInit(opts)
    const caps = resolveCapabilities(opts.capabilities ?? ['eth68'])
    const endpoint = opts.endpoint ?? { address: '0.0.0.0', udpPort: 0, tcpPort: 0 }
    const listenPort = opts.listenPort ?? endpoint.tcpPort ?? 0

    const shouldFindNeighbours = opts.shouldFindNeighbours ?? false
    const dnsOpts = shouldFindNeighbours ? dptDnsOptionsFromCommon(common) : undefined

    this._dpt = new DPT(opts.privateKey, {
      common,
      endpoint,
      shouldFindNeighbours,
      shouldGetDnsPeers: dnsOpts?.shouldGetDnsPeers ?? false,
      dnsNetworks: dnsOpts?.dnsNetworks ?? [],
      maxInFlightPings: opts.maxInFlightPings,
      discoveryMetrics: this._discoveryMetrics,
    })
    this._dpt.events.on('error', (err) => {
      this._pushDiagnostic('warn', `DPT: ${err.message}`)
    })

    this._rlpx = new RLPx(opts.privateKey, {
      dpt: this._dpt,
      common,
      capabilities: caps,
      maxPeers: opts.maxPeers ?? 10,
      listenPort,
      clientId: opts.clientId ?? utf8ToBytes('ethereumjs-devp2p/threaded'),
      throttleDiscovery: opts.throttleDiscovery ?? true,
      discoveryLowWaterMark: opts.discoveryLowWaterMark,
      discoveryMetrics: this._discoveryMetrics,
    })

    await new Promise<void>((resolve) => {
      this._dpt!.events.once('listening', () => resolve())
      this._dpt!.bind(endpoint.udpPort ?? 0, endpoint.address ?? '0.0.0.0')
    })

    await new Promise<void>((resolve) => {
      this._rlpx!.events.once('listening', () => resolve())
      this._rlpx!.listen(listenPort, endpoint.address ?? '0.0.0.0')
    })

    const advertised = this._dpt.syncEndpointFromSocket(listenPort)
    this._discoveryMetrics.setBoundEndpoint(
      advertised.address ?? '',
      advertised.udpPort ?? 0,
      advertised.tcpPort ?? listenPort,
    )

    for (const boot of resolveWorkerBootnodes(opts, common)) {
      void this._dpt.bootstrap(boot).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        this._pushDiagnostic('warn', `Bootstrap ${boot.address}:${boot.udpPort} — ${msg}`)
      })
    }

    this._rlpx.events.on('peer:added', (peer) => this._wirePeer(peer))
    this._rlpx.events.on('peer:error', (_peer, err) => {
      this._pushDiagnostic('warn', err.message)
    })

    const snap = this._discoveryMetrics.snapshot()
    this._post({
      type: 'ready',
      udpPort: snap.boundUdpPort || listenPort,
      tcpPort: snap.boundTcpPort || listenPort,
    })

    const interval = opts.telemetryIntervalMs ?? 150
    this._telemetryTimer = setInterval(() => this._emitTelemetry(), interval)
    this._emitTelemetry()
  }

  private _wirePeer(peer: Peer): void {
    const peerKey = bytesToUnprefixedHex(peer.getId()!)
    peer.events.on('pong', (rttMs) => {
      if (rttMs !== undefined) this._peerRtt.set(peerKey, rttMs)
    })

    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name !== 'ETH') continue
      const eth = protocol as ETH
      eth.events.on('status', () => {
        this._discoveryMetrics.recordRlpxStatusOk()
        this._emitTelemetry()
      })
      if (this._options?.status !== undefined) {
        eth.sendStatus(
          ethStatusFromFields(this._options.status as EthStatusFields, eth.getVersion()),
        )
      }
    }

    peer.subprotocolDispatch = (protocolName, msgCode, payload) => {
      if (protocolName === 'ETH' && msgCode === EthMessageCodes.STATUS) {
        return 'default'
      }
      const goodCitizen = this._options?.goodCitizen ?? true
      if (goodCitizen) {
        const handled = this._tryGoodCitizen(peer, protocolName, msgCode, payload)
        if (handled) return 'handled'
      }
      const layer = protocolName === 'ETH' ? 'eth' : protocolName === 'SNAP' ? 'snap' : null
      if (layer === null) return 'default'
      const wire = copyToTransferBuffer(payload)
      this._post(
        {
          type: 'protocol',
          protocol: layer,
          peerId: peerKey,
          code: msgCode,
          payload: wire,
        },
        [wire.buffer as ArrayBuffer],
      )
      return 'handled'
    }

    this._emitTelemetry()
  }

  private _tryGoodCitizen(
    peer: Peer,
    protocolName: string,
    msgCode: number,
    payload: Uint8Array,
  ): boolean {
    const layer = protocolName === 'ETH' ? 'eth' : protocolName === 'SNAP' ? 'snap' : null
    if (layer === null) return false
    const name =
      layer === 'eth' ? ETH_CODE_NAMES[msgCode] : SnapMessageCodeNames[msgCode as SnapMessageCodes]
    if (name === undefined || !name.startsWith('GET_')) return false

    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name !== protocolName) continue
      const version = (protocol as ETH | SNAP).getVersion()
      const decoded = RLP.decode(payload)
      const reply = emptyWireReply(layer, version, name, decoded)
      if (!reply) return false
      try {
        if (layer === 'eth') {
          ;(protocol as ETH).sendMessage(ethMessageNameToCode(reply.name), reply.rlp)
        } else {
          ;(protocol as SNAP).sendMessage(snapMessageNameToCode(reply.name), reply.rlp)
        }
        return true
      } catch {
        return false
      }
    }
    return false
  }

  private _findEth(peerId: Uint8Array): ETH | undefined {
    const key = bytesToUnprefixedHex(peerId)
    for (const p of this._rlpx?.getPeers() ?? []) {
      if (bytesToUnprefixedHex(p.getId()!) !== key) continue
      for (const protocol of p.getProtocols()) {
        if (protocol.constructor.name === 'ETH') return protocol as ETH
      }
    }
    return undefined
  }

  private _findSnap(peerId: Uint8Array): SNAP | undefined {
    const key = bytesToUnprefixedHex(peerId)
    for (const p of this._rlpx?.getPeers() ?? []) {
      if (bytesToUnprefixedHex(p.getId()!) !== key) continue
      for (const protocol of p.getProtocols()) {
        if (protocol.constructor.name === 'SNAP') return protocol as SNAP
      }
    }
    return undefined
  }

  private _sendEth(peerId: Uint8Array, code: number, payload: Uint8Array): void {
    const eth = this._findEth(peerId)
    if (!eth) throw new Error('No ETH session for peer')
    eth.sendMessage(code as never, RLP.decode(payload))
  }

  private _sendSnap(peerId: Uint8Array, code: number, payload: Uint8Array): void {
    const snap = this._findSnap(peerId)
    if (!snap) throw new Error('No SNAP session for peer')
    snap.sendMessage(code as never, RLP.decode(payload))
  }

  private _broadcastBlockRange(): void {
    if (this._blockRange === null || this._rlpx === null) return
    const { earliest, latest, latestHash } = this._blockRange
    for (const peer of this._rlpx.getPeers()) {
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETH') continue
        const eth = protocol as ETH
        if (eth.getVersion() < 69) continue
        eth.sendMessage(EthMessageCodes.BLOCK_RANGE_UPDATE, [earliest, latest, latestHash])
      }
    }
  }

  private _emitTelemetry(): void {
    const peers: WorkerTelemetrySnapshot['peers'] = []
    for (const peer of this._rlpx?.getPeers() ?? []) {
      const id = bytesToUnprefixedHex(peer.getId()!)
      const hello = peer.getHelloMessage()
      let bestHash: string | undefined
      let latestBlock: string | undefined
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETH') continue
        const head = (protocol as ETH).peerStatusHead()
        if (head === null) continue
        bestHash = bytesToHex(head.bestHash)
        if (head.latestBlock !== undefined) {
          latestBlock = head.latestBlock.toString()
        }
        break
      }

      peers.push({
        id,
        clientId: hello?.clientId ?? '',
        caps:
          hello?.capabilities.map((c) => `${c.name}/${c.version}`) ??
          peer
            .getProtocols()
            .map(
              (p) =>
                `${p.constructor.name === 'ETH' ? 'eth' : 'snap'}/${(p as ETH | SNAP).getVersion()}`,
            ),
        rttMs: this._peerRtt.get(id),
        bestHash,
        latestBlock,
      })
    }
    if (this._dpt !== null) {
      this._discoveryMetrics.setTablePeers(this._dpt.getPeers().length)
    }
    const snapshot: WorkerTelemetrySnapshot = {
      peers,
      diagnostics: [...this._diagnostics],
      discovery: this._discoveryMetrics.snapshot(),
    }
    this._post({ type: 'telemetry', snapshot })
  }

  private _stop(): void {
    if (this._telemetryTimer !== null) {
      clearInterval(this._telemetryTimer)
      this._telemetryTimer = null
    }
    this._dpt?.setDiscoveryPaused(true)
    this._rlpx?.destroy()
    this._dpt?.destroy()
    this._rlpx = null
    this._dpt = null
    this._post({ type: 'stopped' })
  }
}
