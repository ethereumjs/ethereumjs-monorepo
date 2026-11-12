import {
  type ChainConfig,
  Common,
  Hardfork,
  Holesky,
  Hoodi,
  Mainnet,
  Sepolia,
} from '@ethereumjs/common'
import { type Input, RLP } from '@ethereumjs/rlp'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  bytesToInt,
  bytesToUnprefixedHex,
  hexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'

import type { MessagePort } from 'node:worker_threads'
import { markChainDirectoryPeer } from '../discovery/directoryPeer.ts'
import { classifyHandshakeReject } from '../discovery/handshakeReject.ts'
import { DiscoveryMetrics, peerFateLabel } from '../discovery/metrics.ts'
import { DPT } from '../dpt/dpt.ts'
import { resolveCapabilities } from '../lab/capabilities.ts'
import { emptyWireReply } from '../lab/emptyReply.ts'
import { privateKeyToEnode } from '../lab/enode.ts'
import { ethMessageNameToCode, ethStatusFromFields } from '../lab/messages/eth.ts'
import type { EthStatusFields } from '../lab/messages/eth.ts'
import { snapMessageNameToCode } from '../lab/messages/snap.ts'
import { EthMessageCodes } from '../protocol/eth/codes.ts'
import { EthyMessageCodeNames, EthyMessageCodes } from '../protocol/ethy/codes.ts'
import {
  ETH,
  ETHY,
  type EthyLocalStatusFields,
  type EthyPeerStatus,
  SNAP,
} from '../protocol/index.ts'
import { SnapMessageCodeNames, SnapMessageCodes } from '../protocol/snap.ts'
import { Peer } from '../rlpx/peer.ts'
import { RLPx } from '../rlpx/rlpx.ts'
import { tryServeEthGet } from '../serve/ethServer.ts'
import { EthyChunkStore } from '../serve/ethyChunkStore.ts'
import { tryServeEthyGet } from '../serve/ethyServer.ts'
import { RollingBlockStore } from '../serve/rollingBlockStore.ts'
import { ServeGovernor } from '../serve/serveGovernor.ts'
import { DISCONNECT_REASON, DisconnectReasonNames } from '../types.ts'
import type { PeerInfo } from '../types.ts'
import { pk2id } from '../util.ts'
import { dptDnsOptionsFromCommon, resolveWorkerBootnodes } from './bootNodes.ts'
import { EthyKnownPeerBook } from './ethyPex.ts'
import type {
  ThreadedNetworkInitOptions,
  WorkerCommand,
  WorkerDiagnosticEntry,
  WorkerEthyLocalStatus,
  WorkerEthyPeerStatus,
  WorkerEvent,
  WorkerServingSnapshot,
  WorkerTelemetrySnapshot,
} from './protocol.ts'

function emptyServingSnapshot(): WorkerServingSnapshot {
  return {
    blocksStored: 0,
    headersServed: 0,
    bodiesServed: 0,
    receiptsServed: 0,
    accessListsServed: 0,
    totalRequestsServed: 0,
    totalBytesServed: 0,
    ethyChunksServed: 0,
    ethyBalBlocksServed: 0,
    ethyBytesServed: 0,
  }
}

function negotiatedEthVersion(peer: Peer): number | undefined {
  for (const protocol of peer.getProtocols()) {
    if (protocol.constructor.name === 'ETH') return (protocol as ETH).getVersion()
  }
  return undefined
}

function notePeerFate(
  metrics: DiscoveryMetrics,
  peer: Peer,
  fate: 'remote' | 'we' | 'reset',
): void {
  metrics.recordPeerFate(
    peerFateLabel(peer.getHelloMessage()?.clientId, negotiatedEthVersion(peer)),
    fate,
  )
}

function isSocketReset(message: string): boolean {
  return message.includes('ECONNRESET') || message.includes('EPIPE')
}

/** Node reports ICMP port-unreachable on a UDP socket as `read ECONNRESET`. */
function clarifySocketError(message: string): string {
  if (isSocketReset(message)) {
    return 'peer unreachable (ICMP or TCP reset, surfaced as ECONNRESET)'
  }
  if (message.startsWith('expected Uint8Array')) {
    return `handshake field was not bytes (${message})`
  }
  return message
}

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
  /** When false, outbound ETH STATUS stays on boot fields until head following (WP-04f). */
  private _advertiseBlockRangeInStatus = false
  private _rollingStore = new RollingBlockStore()
  private readonly _pooledTx = new Map<string, Uint8Array>()
  private readonly _pooledOrder: string[] = []
  private _serveGovernor = new ServeGovernor()
  private _serving = emptyServingSnapshot()
  private _lastBroadcastEarliest: bigint | null = null
  private _lastBroadcastLatest: bigint | null = null
  private _ethyChunks = new EthyChunkStore()
  private _ethyKnown = new EthyKnownPeerBook()
  private _ethyLocal: WorkerEthyLocalStatus = {}
  private _ethyPexSent = new Set<string>()
  private _privateKey: Uint8Array | null = null
  private _localNodeId: Uint8Array | null = null

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
        case 'connectPeer': {
          const id = cmd.peer.id
          const idBytes = id instanceof Uint8Array ? id : undefined
          if (idBytes === undefined) {
            throw new TypeError('connectPeer id is not Uint8Array')
          }
          const peerId = bytesToUnprefixedHex(idBytes)
          try {
            await this._rlpx?.connect({ ...cmd.peer, id: idBytes }, { priority: true })
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            if (message !== 'Already connected') {
              this._pushDiagnostic('warn', message, peerId)
            }
          }
          break
        }
        case 'setAdvertiseBlockRange':
          this._advertiseBlockRangeInStatus = cmd.enabled
          if (cmd.enabled === true) {
            this._syncBlockRangeFromStore(true)
          }
          break
        case 'notePooledTx': {
          const key = cmd.hashHex.replace(/^0x/i, '').toLowerCase()
          if (!this._pooledTx.has(key)) {
            this._pooledOrder.push(key)
            while (this._pooledOrder.length > 256) {
              const old = this._pooledOrder.shift()
              if (old !== undefined) this._pooledTx.delete(old)
            }
          }
          this._pooledTx.set(key, cmd.raw)
          break
        }
        case 'dropPooledTx': {
          const key = cmd.hashHex.replace(/^0x/i, '').toLowerCase()
          this._pooledTx.delete(key)
          const idx = this._pooledOrder.indexOf(key)
          if (idx >= 0) this._pooledOrder.splice(idx, 1)
          break
        }
        case 'disconnectPeer':
          this._rlpx?.disconnect(cmd.peerId)
          break
        case 'sendEthMessage':
          this._sendEth(cmd.peerId, cmd.code, cmd.payload)
          break
        case 'sendSnapMessage':
          this._sendSnap(cmd.peerId, cmd.code, cmd.payload)
          break
        case 'sendEthyMessage':
          this._sendEthy(cmd.peerId, cmd.code, cmd.payload)
          break
        case 'setEthyStatus':
          this._ethyLocal = cmd.status
          this._broadcastEthyStatus()
          break
        case 'setEthyPivotAccountsDir':
          this._ethyChunks.setPivotAccountsDir(cmd.dir)
          break
        case 'putEthyAccountChunk': {
          const c = cmd.chunk
          this._ethyChunks.put({
            bucketIndex: c.bucketIndex,
            originHash: c.originHash,
            lastHash: c.lastHash,
            hasRight: c.hasRight,
            chunkStateRoot: c.chunkStateRoot,
            chunkBlockNumber: BigInt(c.chunkBlockNumber),
            binaryAccountsSlab: c.binaryAccountsSlab,
            proofNodes: c.proofNodes,
          })
          break
        }
        case 'setBlockRange':
          this._blockRange = {
            earliest: cmd.earliest,
            latest: cmd.latest,
            latestHash: cmd.latestHash,
          }
          this._broadcastBlockRange()
          break
        case 'putServableBlock': {
          const n = BigInt(cmd.block.number)
          this._rollingStore.put({
            number: n,
            hash: cmd.block.hash,
            headerRlp: cmd.block.headerRlp,
            bodyRlp: cmd.block.bodyRlp,
            receiptsEth69Rlp: cmd.block.receiptsEth69Rlp,
            balRlp: cmd.block.balRlp,
          })
          this._serving.blocksStored = this._rollingStore.size
          this._syncBlockRangeFromStore(true)
          break
        }
        case 'setDiscoveryPaused':
          this._rlpx?.setSyncDiscoveryHold(cmd.paused)
          this._discoveryMetrics.setDiscoveryPaused(cmd.paused)
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
    const nextFork = common.nextHardforkBlockOrTimestamp()
    this._discoveryMetrics.setAdvertisedFork(
      common.hardfork(),
      common.forkHash(),
      nextFork === null ? '0' : nextFork.toString(),
    )
    const caps = resolveCapabilities(opts.capabilities ?? ['eth68'])
    const ethyEnabled = caps.some((c) => c.name === 'ethy')
    if (opts.ethyPivotDir !== undefined) {
      this._ethyChunks.setPivotAccountsDir(opts.ethyPivotDir)
    }
    this._privateKey = opts.privateKey
    this._localNodeId = pk2id(secp256k1.getPublicKey(opts.privateKey, false))
    const endpoint = opts.endpoint ?? { address: '0.0.0.0', udpPort: 0, tcpPort: 0 }
    const listenPort = opts.listenPort ?? endpoint.tcpPort ?? 0

    const shouldFindNeighbours = opts.shouldFindNeighbours ?? false
    const directoryDiscovery = opts.chainDirectoryDiscovery === true || shouldFindNeighbours
    const dnsOpts = directoryDiscovery ? dptDnsOptionsFromCommon(common) : undefined

    this._dpt = new DPT(opts.privateKey, {
      common,
      endpoint,
      shouldFindNeighbours,
      shouldGetDnsPeers: dnsOpts?.shouldGetDnsPeers ?? false,
      dnsNetworks: dnsOpts?.dnsNetworks ?? [],
      maxInFlightPings: opts.maxInFlightPings,
      discoveryMetrics: this._discoveryMetrics,
      nodeStorePath: opts.nodeStorePath,
      ethyDiscoveryTag: ethyEnabled,
    })
    this._dpt.events.on('error', (err) => {
      const message = err instanceof Error ? err.message : String(err)
      // Already-banned remotes are counted on `discovery.dpt.banSkips`.
      if (message.startsWith('Skipped remote ')) return
      // Dead ENRs time out constantly. The ban counter on the diag footer covers them.
      if (message.includes('Timeout error: ping')) return
      this._pushDiagnostic('warn', `DPT: ${clarifySocketError(message)}`)
    })

    this._rlpx = new RLPx(opts.privateKey, {
      dpt: this._dpt,
      common,
      capabilities: caps,
      maxPeers: opts.maxPeers ?? 10,
      maxInboundPeers: opts.maxInboundPeers,
      listenPort,
      clientId: opts.clientId ?? utf8ToBytes('ethereumjs-devp2p/threaded'),
      throttleDiscovery: opts.throttleDiscovery ?? true,
      discoveryLowWaterMark: opts.discoveryLowWaterMark,
      discoveryMetrics: this._discoveryMetrics,
      // Geth's RLPx read deadline is 30s. A 10s pong timer drops a peer that is busy serving snap.
      pingTimeout: 30_000,
    })

    await new Promise<void>((resolve) => {
      this._dpt!.events.once('listening', () => resolve())
      this._dpt!.bind(endpoint.udpPort ?? 0, endpoint.address ?? '0.0.0.0')
    })

    await new Promise<void>((resolve) => {
      this._rlpx!.events.once('listening', () => resolve())
      this._rlpx!.listen(listenPort, endpoint.address ?? '0.0.0.0')
    })
    const actualTcpPort = this._rlpx.boundTcpPort() ?? listenPort
    if (actualTcpPort > 0) {
      this._rlpx.setListenPort(actualTcpPort)
    }

    const advertised = this._dpt.syncEndpointFromSocket(actualTcpPort)
    void this._dpt.refresh()
    this._discoveryMetrics.setBoundEndpoint(
      advertised.address ?? '',
      advertised.udpPort ?? 0,
      advertised.tcpPort ?? actualTcpPort,
    )
    const enodeHost =
      advertised.address !== undefined &&
      advertised.address !== '' &&
      advertised.address !== '0.0.0.0'
        ? advertised.address
        : '127.0.0.1'
    const tcpForEnode = advertised.tcpPort ?? actualTcpPort
    this._discoveryMetrics.setLocalEnode(
      privateKeyToEnode(
        opts.privateKey,
        enodeHost,
        tcpForEnode,
        advertised.udpPort ?? actualTcpPort,
      ),
    )

    for (const boot of resolveWorkerBootnodes(opts, common)) {
      markChainDirectoryPeer(boot)
      void this._dpt.bootstrap(boot).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        this._pushDiagnostic('warn', `Bootstrap ${boot.address}:${boot.udpPort} — ${msg}`)
      })
    }

    this._rlpx.events.on('peer:added', (peer) => this._wirePeer(peer))
    this._rlpx.events.on('peer:removed', (peer, reason, disconnectWe) => {
      if (typeof reason !== 'number') return
      const rawId = peer.getId()
      const peerId = rawId instanceof Uint8Array ? bytesToUnprefixedHex(rawId) : undefined
      if (reason === DISCONNECT_REASON.TOO_MANY_PEERS) {
        const who = disconnectWe === true ? 'we dropped remote' : 'remote dropped us'
        this._pushDiagnostic('warn', `TOO_MANY_PEERS (${who})`, peerId)
        return
      }
      if (
        reason !== DISCONNECT_REASON.SUBPROTOCOL_ERROR &&
        reason !== DISCONNECT_REASON.PROTOCOL_ERROR &&
        reason !== DISCONNECT_REASON.USELESS_PEER &&
        reason !== DISCONNECT_REASON.NETWORK_ERROR &&
        reason !== DISCONNECT_REASON.INCOMPATIBLE_VERSION &&
        reason !== DISCONNECT_REASON.TIMEOUT
      ) {
        return
      }
      const who = disconnectWe === true ? 'we dropped remote' : 'remote dropped us'
      const name = DisconnectReasonNames[reason as DISCONNECT_REASON] ?? String(reason)
      if (
        reason === DISCONNECT_REASON.SUBPROTOCOL_ERROR ||
        reason === DISCONNECT_REASON.PROTOCOL_ERROR
      ) {
        notePeerFate(this._discoveryMetrics, peer, disconnectWe === true ? 'we' : 'remote')
      }
      const client = peerFateLabel(peer.getHelloMessage()?.clientId, negotiatedEthVersion(peer))
      this._pushDiagnostic(
        'warn',
        `Remote ${peer.remoteTcpLabel()} ${client}: ${name} (${who})`,
        peerId,
      )
    })
    this._rlpx.events.on('peer:error', (peer, err) => {
      const remote = peer.remoteTcpLabel()
      const message = err instanceof Error ? err.message : String(err)
      const reject = classifyHandshakeReject(message)
      if (reject !== undefined) this._discoveryMetrics.recordHandshakeReject(reject)
      const rawId = peer.getId()
      const peerId = rawId instanceof Uint8Array ? bytesToUnprefixedHex(rawId) : undefined
      if (reject === 'reset' && peer.getHelloMessage() !== null) {
        this._discoveryMetrics.recordResetAfterHello()
        notePeerFate(this._discoveryMetrics, peer, 'reset')
      }
      if (reject === 'reset') {
        this._pushDiagnostic('warn', `Remote ${remote}: ${clarifySocketError(message)}`, peerId)
        return
      }
      this._pushDiagnostic('warn', `Remote ${remote}: ${clarifySocketError(message)}`, peerId)
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
    const rawId = peer.getId()
    if (!(rawId instanceof Uint8Array)) return
    const peerKey = bytesToUnprefixedHex(rawId)
    peer.events.on('pong', (rttMs) => {
      if (rttMs !== undefined) this._peerRtt.set(peerKey, rttMs)
    })
    peer.events.on('error', (err: Error) => {
      if (isSocketReset(err.message)) return
      this._discoveryMetrics.recordRlpxSubprotocolError(
        `Remote ${peer.remoteTcpLabel()}: ${err.message}`,
      )
    })

    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name !== 'ETH') continue
      const eth = protocol as ETH
      eth.events.on('status', () => {
        this._discoveryMetrics.recordRlpxStatusOk()
        this._sendBlockRangeUpdateToPeer(eth)
        this._emitTelemetry()
      })
      eth.events.on('blockRangeUpdate', () => {
        this._emitTelemetry()
      })
      if (this._options?.status !== undefined) {
        try {
          const statusFields = this._ethStatusFieldsForSend()
          eth.sendStatus(ethStatusFromFields(statusFields, eth.getVersion()))
          this._discoveryMetrics.recordStatusSent()
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          this._pushDiagnostic('warn', `ETH STATUS send failed: ${message}`)
          this._discoveryMetrics.recordRlpxSubprotocolError(`ETH STATUS send failed: ${message}`)
        }
      }
    }

    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name !== 'ETHY') continue
      const ethy = protocol as ETHY
      const fields = this._ethyStatusFieldsForSend()
      ethy.setLocalStatusFields(fields)
      try {
        ethy.sendStatus(fields)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        this._pushDiagnostic('warn', `ETHY STATUS send failed: ${message}`)
      }
      ethy.events.on('status', (remote: unknown) => {
        this._onRemoteEthyStatus(peer, remote as EthyPeerStatus)
        this._emitTelemetry()
      })
      ethy.events.on('statusUpdated', (remote: unknown) => {
        this._onRemoteEthyStatus(peer, remote as EthyPeerStatus)
        this._emitTelemetry()
      })
      ethy.events.on('message', (code: number, payload: unknown) => {
        if (code === EthyMessageCodes.ETHY_PEERS) {
          this._consumeEthyPeers(payload)
        }
      })
    }

    peer.subprotocolDispatch = (protocolName, msgCode, payload) => {
      if (
        protocolName === 'ETH' &&
        (msgCode === EthMessageCodes.STATUS || msgCode === EthMessageCodes.BLOCK_RANGE_UPDATE)
      ) {
        return 'default'
      }
      if (
        protocolName === 'SNAP' &&
        this._options?.answerEmptySnap === false &&
        (SnapMessageCodeNames[msgCode as SnapMessageCodes] ?? '').startsWith('GET_')
      ) {
        return 'handled'
      }
      if (protocolName === 'ETHY' && msgCode === EthyMessageCodes.STATUS) {
        return 'default'
      }
      const goodCitizen = this._options?.goodCitizen ?? true
      if (goodCitizen) {
        const handled = this._tryGoodCitizen(peer, protocolName, msgCode, payload)
        if (handled) return 'handled'
      }
      const layer =
        protocolName === 'ETH'
          ? 'eth'
          : protocolName === 'SNAP'
            ? 'snap'
            : protocolName === 'ETHY'
              ? 'ethy'
              : null
      if (layer === null) return 'default'
      if (protocolName === 'ETHY' && msgCode === EthyMessageCodes.ETHY_PEERS) {
        try {
          this._consumeEthyPeers(RLP.decode(payload))
        } catch {
          /* ignore malformed PEX */
        }
      }
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
    if (protocolName === 'ETHY') {
      return this._tryServeEthyGet(peer, msgCode, payload)
    }
    const layer = protocolName === 'ETH' ? 'eth' : protocolName === 'SNAP' ? 'snap' : null
    if (layer === null) return false
    const name =
      layer === 'eth' ? ETH_CODE_NAMES[msgCode] : SnapMessageCodeNames[msgCode as SnapMessageCodes]
    if (name === undefined || !name.startsWith('GET_')) return false

    if (layer === 'eth' && name === 'GET_POOLED_TRANSACTIONS') {
      const version = negotiatedEthVersion(peer) ?? 68
      const decoded = RLP.decode(payload)
      const hashes =
        version >= 66 && Array.isArray(decoded) && decoded.length >= 2
          ? (decoded[1] as Uint8Array[])
          : Array.isArray(decoded)
            ? (decoded as Uint8Array[])
            : []
      const txs: Input[] = []
      for (const h of hashes) {
        if (!(h instanceof Uint8Array)) continue
        const key = bytesToUnprefixedHex(h)
        const raw = this._pooledTx.get(key)
        if (raw !== undefined) {
          txs.push(raw.length > 0 && raw[0]! <= 0x7f ? raw : RLP.decode(raw))
        }
      }
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETH') continue
        try {
          const reqId =
            version >= 66 && Array.isArray(decoded) && decoded.length > 0
              ? decoded[0]
              : new Uint8Array()
          const rlp = version >= 66 ? [reqId, txs] : txs
          ;(protocol as ETH).sendMessage(EthMessageCodes.POOLED_TRANSACTIONS as never, rlp)
          return true
        } catch {
          return false
        }
      }
      return false
    }

    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name !== protocolName) continue
      const version = (protocol as ETH | SNAP).getVersion()
      const decoded = RLP.decode(payload)
      if (layer === 'eth') {
        const rawId = peer.getId()
        if (!(rawId instanceof Uint8Array)) return false
        const peerKey = bytesToUnprefixedHex(rawId)
        const budget = this._serveGovernor.bytesAllowed(peerKey, true)
        const served = tryServeEthGet(this._rollingStore, version, name, decoded, budget)
        if (served !== undefined) {
          try {
            ;(protocol as ETH).sendMessage(served.code as never, served.rlp)
            this._serveGovernor.record(peerKey, served.bytesEstimate)
            this._serving.totalRequestsServed++
            this._serving.totalBytesServed += served.bytesEstimate
            if (served.metric === 'headers') this._serving.headersServed++
            else if (served.metric === 'bodies') this._serving.bodiesServed++
            else if (served.metric === 'receipts') this._serving.receiptsServed++
            else this._serving.accessListsServed++
            return true
          } catch {
            return false
          }
        }
      }
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

  /** Honest rolling-window STATUS on new handshakes after `putServableBlock` (WP-04a). */
  private _ethStatusFieldsForSend(): EthStatusFields {
    const base = this._options?.status as EthStatusFields | undefined
    if (!this._advertiseBlockRangeInStatus || this._blockRange === null || base === undefined) {
      return base as EthStatusFields
    }
    const earliestQty = bytesToBigInt(this._blockRange.earliest)
    const latestQty = bytesToBigInt(this._blockRange.latest)
    return {
      td: base.td ?? '0x01',
      bestHash: bytesToHex(this._blockRange.latestHash),
      genesisHash: base.genesisHash,
      earliestBlock: `0x${earliestQty.toString(16)}`,
      latestBlock: `0x${latestQty.toString(16)}`,
    }
  }

  private _syncBlockRangeFromStore(force: boolean): void {
    const range = this._rollingStore.contiguousRange()
    if (range === null) return
    this._blockRange = {
      earliest: bigIntToUnpaddedBytes(range.earliestBlock),
      latest: bigIntToUnpaddedBytes(range.latestBlock),
      latestHash: range.latestBlockHash,
    }
    if (!this._advertiseBlockRangeInStatus) {
      return
    }
    if (!force) {
      if (
        this._lastBroadcastEarliest !== null &&
        range.earliestBlock > this._lastBroadcastEarliest
      ) {
        // pruned lower bound — broadcast immediately
      } else if (
        this._lastBroadcastLatest !== null &&
        range.latestBlock - this._lastBroadcastLatest < 32n
      ) {
        return
      }
    }
    this._lastBroadcastEarliest = range.earliestBlock
    this._lastBroadcastLatest = range.latestBlock
    this._broadcastBlockRange()
  }

  private _buildServingTelemetry(): WorkerServingSnapshot {
    const range = this._rollingStore.contiguousRange()
    return {
      ...this._serving,
      blocksStored: this._rollingStore.size,
      earliestBlock: range?.earliestBlock.toString(),
      latestBlock: range?.latestBlock.toString(),
    }
  }

  private _findEth(peerId: Uint8Array): ETH | undefined {
    const key = bytesToUnprefixedHex(peerId)
    for (const p of this._rlpx?.getPeers() ?? []) {
      const rawId = p.getId()
      if (!(rawId instanceof Uint8Array) || bytesToUnprefixedHex(rawId) !== key) continue
      for (const protocol of p.getProtocols()) {
        if (protocol.constructor.name === 'ETH') return protocol as ETH
      }
    }
    return undefined
  }

  private _ethyStatusFieldsForSend(): EthyLocalStatusFields {
    const genesisHex = this._options?.status?.genesisHash
    const genesisHash =
      genesisHex !== undefined
        ? hexToBytes(
            (genesisHex.startsWith('0x') ? genesisHex : `0x${genesisHex}`) as `0x${string}`,
          )
        : new Uint8Array(32)
    const parseNum = (s: string | undefined): bigint | undefined =>
      s !== undefined && s.length > 0 ? BigInt(s) : undefined
    const parseMask = (s: string | undefined): number | undefined => {
      if (s === undefined || s.length === 0) return undefined
      if (s.startsWith('0x')) return Number.parseInt(s, 16)
      return Number.parseInt(s, 10)
    }
    const rootHex = this._ethyLocal.basePivotStateRoot
    return {
      genesisHash,
      basePivotBlock: parseNum(this._ethyLocal.basePivotBlock),
      basePivotStateRoot:
        rootHex !== undefined
          ? hexToBytes((rootHex.startsWith('0x') ? rootHex : `0x${rootHex}`) as `0x${string}`)
          : undefined,
      bucketsBitmask: parseMask(this._ethyLocal.bucketsBitmask),
      balEarliestBlock: parseNum(this._ethyLocal.balEarliestBlock),
      balLatestBlock: parseNum(this._ethyLocal.balLatestBlock),
      latestBlockHash:
        this._ethyLocal.latestBlockHash !== undefined
          ? hexToBytes(
              (this._ethyLocal.latestBlockHash.startsWith('0x')
                ? this._ethyLocal.latestBlockHash
                : `0x${this._ethyLocal.latestBlockHash}`) as `0x${string}`,
            )
          : undefined,
    }
  }

  private _workerEthyStatusFromRemote(remote: EthyPeerStatus): WorkerEthyPeerStatus {
    return {
      basePivotBlock: remote.basePivotBlock.toString(),
      basePivotStateRoot: bytesToHex(remote.basePivotStateRoot),
      bucketsBitmask: remote.bucketsBitmask.toString(),
      balEarliestBlock: remote.balEarliestBlock.toString(),
      balLatestBlock: remote.balLatestBlock.toString(),
      latestBlockHash: bytesToHex(remote.latestBlockHash),
    }
  }

  private _onRemoteEthyStatus(peer: Peer, remote: EthyPeerStatus): void {
    const peerId = peer.getId()
    if (peerId === null || this._localNodeId === null) return
    const tcp = peer.advertisedTcpEndpoint()
    const address = tcp?.address ?? '127.0.0.1'
    const tcpPort = tcp?.tcpPort ?? 0
    const udpPort = tcpPort
    this._ethyKnown.upsertFromStatus(peerId, address, tcpPort, udpPort, remote)
    const peerKey = bytesToUnprefixedHex(peerId)
    if (!this._ethyPexSent.has(peerKey)) {
      this._ethyPexSent.add(peerKey)
      const ethy = this._findEthy(peerId)
      if (ethy !== undefined) {
        ethy.sendMessage(EthyMessageCodes.GET_ETHY_PEERS, [
          bigIntToUnpaddedBytes(1n),
          bigIntToUnpaddedBytes(16n),
        ])
      }
    }
  }

  private _consumeEthyPeers(payload: unknown): void {
    if (!Array.isArray(payload) || payload.length < 2) return
    const peers = payload[1]
    if (!Array.isArray(peers) || this._localNodeId === null || this._rlpx === null) return
    for (const row of peers) {
      if (!Array.isArray(row) || row.length < 4) continue
      const peerId = row[0]
      const addressBytes = row[1]
      if (!(peerId instanceof Uint8Array) || !(addressBytes instanceof Uint8Array)) continue
      const address = new TextDecoder().decode(addressBytes)
      const tcpPort = bytesToInt(row[2] as Uint8Array)
      const udpPort = bytesToInt(row[3] as Uint8Array)
      if (tcpPort < 1) continue
      if (bytesToUnprefixedHex(peerId) === bytesToUnprefixedHex(this._localNodeId)) continue
      this._ethyKnown.noteDialFromPex(peerId, address, tcpPort, udpPort)
      void this._rlpx.connect({ id: peerId, address, tcpPort, udpPort }).catch(() => {})
    }
  }

  private _broadcastEthyStatus(): void {
    const fields = this._ethyStatusFieldsForSend()
    for (const peer of this._rlpx?.getPeers() ?? []) {
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETHY') continue
        const ethy = protocol as ETHY
        ethy.setLocalStatusFields(fields)
        try {
          ethy.sendStatus(fields)
        } catch {
          /* ignore */
        }
      }
    }
  }

  private _tryServeEthyGet(peer: Peer, msgCode: number, payload: Uint8Array): boolean {
    const name = EthyMessageCodeNames[msgCode as EthyMessageCodes]
    if (name === undefined || !name.startsWith('GET_')) return false
    const ethy = this._findEthyOnPeer(peer)
    if (ethy === undefined || this._localNodeId === null) return false
    const decoded = RLP.decode(payload)
    const excludeId = peer.getId() ?? undefined
    const served = tryServeEthyGet(
      this._ethyChunks,
      this._rollingStore,
      this._ethyKnown.list(),
      this._localNodeId,
      excludeId,
      name,
      decoded,
    )
    if (served === undefined) return false
    try {
      ethy.sendMessage(served.code, served.rlp as import('@ethereumjs/rlp').Input)
      this._serving.totalRequestsServed++
      this._serving.totalBytesServed += served.bytesEstimate
      this._serving.ethyBytesServed += served.bytesEstimate
      if (served.metric === 'chunk') this._serving.ethyChunksServed++
      if (served.metric === 'bal') this._serving.ethyBalBlocksServed++
      return true
    } catch {
      return false
    }
  }

  private _findEthyOnPeer(peer: Peer): ETHY | undefined {
    for (const protocol of peer.getProtocols()) {
      if (protocol.constructor.name === 'ETHY') return protocol as ETHY
    }
    return undefined
  }

  private _findEthy(peerId: Uint8Array): ETHY | undefined {
    const key = bytesToUnprefixedHex(peerId)
    for (const p of this._rlpx?.getPeers() ?? []) {
      const rawId = p.getId()
      if (!(rawId instanceof Uint8Array) || bytesToUnprefixedHex(rawId) !== key) continue
      return this._findEthyOnPeer(p)
    }
    return undefined
  }

  private _sendEthy(peerId: Uint8Array, code: number, payload: Uint8Array): void {
    const ethy = this._findEthy(peerId)
    if (!ethy) throw new Error('No ETHY session for peer')
    ethy.sendMessage(code as EthyMessageCodes, RLP.decode(payload))
  }

  private _findSnap(peerId: Uint8Array): SNAP | undefined {
    const key = bytesToUnprefixedHex(peerId)
    for (const p of this._rlpx?.getPeers() ?? []) {
      const rawId = p.getId()
      if (!(rawId instanceof Uint8Array) || bytesToUnprefixedHex(rawId) !== key) continue
      for (const protocol of p.getProtocols()) {
        if (protocol.constructor.name === 'SNAP') return protocol as SNAP
      }
    }
    return undefined
  }

  private _sendEth(peerId: Uint8Array, code: number, payload: Uint8Array): void {
    const eth = this._findEth(peerId)
    if (!eth) {
      this._pushDiagnostic(
        'warn',
        `No ETH session for peer ${bytesToUnprefixedHex(peerId).slice(0, 8)}`,
      )
      return
    }
    eth.sendMessage(code as never, RLP.decode(payload))
  }

  private _sendSnap(peerId: Uint8Array, code: number, payload: Uint8Array): void {
    const snap = this._findSnap(peerId)
    if (!snap) {
      this._pushDiagnostic(
        'warn',
        `No SNAP session for peer ${bytesToUnprefixedHex(peerId).slice(0, 8)}`,
      )
      return
    }
    snap.sendMessage(code as never, RLP.decode(payload))
  }

  private _sendBlockRangeUpdateToPeer(eth: ETH): void {
    if (!this._advertiseBlockRangeInStatus || this._blockRange === null) return
    if (eth.getVersion() < 69) return
    const { earliest, latest, latestHash } = this._blockRange
    eth.sendMessage(EthMessageCodes.BLOCK_RANGE_UPDATE, [earliest, latest, latestHash])
  }

  private _broadcastBlockRange(): void {
    if (!this._advertiseBlockRangeInStatus || this._blockRange === null || this._rlpx === null) {
      return
    }
    for (const peer of this._rlpx.getPeers()) {
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETH') continue
        this._sendBlockRangeUpdateToPeer(protocol as ETH)
      }
    }
  }

  private _emitTelemetry(): void {
    const peers: WorkerTelemetrySnapshot['peers'] = []
    for (const peer of this._rlpx?.getPeers() ?? []) {
      const rawId = peer.getId()
      if (!(rawId instanceof Uint8Array)) continue
      const id = bytesToUnprefixedHex(rawId)
      const hello = peer.getHelloMessage()
      let bestHash: string | undefined
      let latestBlock: string | undefined
      for (const protocol of peer.getProtocols()) {
        if (protocol.constructor.name !== 'ETH') continue
        const head = (protocol as ETH).peerStatusHead()
        if (head?.bestHash === undefined || head.bestHash.length !== 32) continue
        bestHash = bytesToHex(head.bestHash)
        if (head.latestBlock !== undefined) {
          latestBlock = head.latestBlock.toString()
        }
        break
      }

      const protocols = peer.getProtocols()
      const tcpEnd = peer.endpointTcp()
      const dptPeer = this._dpt?.getPeer(id)
      const address = tcpEnd?.address ?? dptPeer?.address
      const tcpPort = tcpEnd?.tcpPort ?? dptPeer?.tcpPort ?? undefined
      const udpPort = dptPeer?.udpPort ?? tcpPort
      let ethyStatus: WorkerEthyPeerStatus | undefined
      for (const protocol of protocols) {
        if (protocol.constructor.name !== 'ETHY') continue
        const remote = (protocol as ETHY).peerStatus()
        if (remote !== null) ethyStatus = this._workerEthyStatusFromRemote(remote)
        break
      }
      peers.push({
        id,
        clientId: hello?.clientId ?? '',
        snapSession: protocols.some((p) => p.constructor.name === 'SNAP'),
        ethySession: protocols.some((p) => p.constructor.name === 'ETHY'),
        ...(ethyStatus !== undefined ? { ethyStatus } : {}),
        caps:
          protocols.length > 0
            ? protocols.map((p) => {
                if (p.constructor.name === 'ETH') return `eth/${(p as ETH).getVersion()}`
                if (p.constructor.name === 'ETHY') return `ethy/${(p as ETHY).getVersion()}`
                return `snap/${(p as SNAP).getVersion()}`
              })
            : (hello?.capabilities.map((c) => `${c.name}/${c.version}`) ?? []),
        rttMs: this._peerRtt.get(id),
        bestHash,
        latestBlock,
        address,
        udpPort,
        tcpPort,
      })
    }
    if (this._dpt !== null) {
      this._discoveryMetrics.setTablePeers(this._dpt.getPeers().length)
    }
    const snapshot: WorkerTelemetrySnapshot = {
      peers,
      diagnostics: [...this._diagnostics],
      discovery: this._discoveryMetrics.snapshot(),
      serving: this._buildServingTelemetry(),
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
