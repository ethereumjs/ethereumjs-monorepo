import { DisconnectReasonNames } from '../types.ts'

import type { DISCONNECT_REASON } from '../types.ts'

export interface WorkerDiscoverySnapshot {
  boundAddress: string
  boundUdpPort: number
  boundTcpPort: number
  tablePeers: number
  bootstrap: {
    attempts: number
    ok: number
    fail: number
    lastError?: string
  }
  dns: {
    attempts: number
    peersAdded: number
    lastError?: string
    resolver?: string
  }
  rlpx: {
    dials: number
    connected: number
    statusOk: number
    /** Keys are `REASON (we dropped remote)` or `REASON (remote dropped us)`. */
    disconnects: Record<string, number>
    lastSubprotocolError?: string
  }
  dpt: {
    /** `addPeer` skipped because the remote node is already on our ban list. */
    banSkips: number
    /** New bans we applied to a remote discovery endpoint. */
    bansIssued: number
    lastRemote?: string
    lastCause?: string
  }
}

/** Mutable counters for worker discovery telemetry (stable JSON field names). */
export class DiscoveryMetrics {
  boundAddress = ''
  boundUdpPort = 0
  boundTcpPort = 0
  tablePeers = 0

  bootstrapAttempts = 0
  bootstrapOk = 0
  bootstrapFail = 0
  bootstrapLastError?: string

  dnsAttempts = 0
  dnsPeersAdded = 0
  dnsLastError?: string
  dnsResolver?: string

  rlpxDials = 0
  rlpxConnected = 0
  rlpxStatusOk = 0
  rlpxLastSubprotocolError?: string
  private readonly rlpxDisconnects = new Map<string, number>()

  dptBanSkips = 0
  dptBansIssued = 0
  dptLastRemote?: string
  dptLastCause?: string

  setBoundEndpoint(address: string, udpPort: number, tcpPort: number): void {
    this.boundAddress = address
    this.boundUdpPort = udpPort
    this.boundTcpPort = tcpPort
  }

  setTablePeers(count: number): void {
    this.tablePeers = count
  }

  setDnsResolver(resolver: string | undefined): void {
    this.dnsResolver = resolver
  }

  recordBootstrapAttempt(): void {
    this.bootstrapAttempts++
  }

  recordBootstrapOk(): void {
    this.bootstrapOk++
  }

  recordBootstrapFail(message: string): void {
    this.bootstrapFail++
    this.bootstrapLastError = message.slice(0, 200)
  }

  recordDnsAttempt(): void {
    this.dnsAttempts++
  }

  recordDnsPeersAdded(count: number): void {
    this.dnsPeersAdded += count
  }

  recordDnsError(message: string): void {
    this.dnsLastError = message.slice(0, 200)
  }

  recordRlpxDial(): void {
    this.rlpxDials++
  }

  recordRlpxConnected(): void {
    this.rlpxConnected++
  }

  recordRlpxStatusOk(): void {
    this.rlpxStatusOk++
  }

  /**
   * `local` — this node sent DISCONNECT to the remote.
   * `remote` — the remote node sent DISCONNECT to us.
   */
  recordRlpxDisconnect(reason: DISCONNECT_REASON, initiatedBy: 'local' | 'remote'): void {
    const name = DisconnectReasonNames[reason] ?? `UNKNOWN_${String(reason)}`
    const who = initiatedBy === 'local' ? 'we dropped remote' : 'remote dropped us'
    const key = `${name} (${who})`
    this.rlpxDisconnects.set(key, (this.rlpxDisconnects.get(key) ?? 0) + 1)
  }

  recordDptBanSkip(remoteLabel: string): void {
    this.dptBanSkips++
    this.dptLastRemote = remoteLabel
    this.dptLastCause = 'already on our ban list'
  }

  recordDptBan(remoteLabel: string, cause: string): void {
    this.dptBansIssued++
    this.dptLastRemote = remoteLabel
    this.dptLastCause = cause.slice(0, 160)
  }

  recordRlpxSubprotocolError(message: string): void {
    this.rlpxLastSubprotocolError = message.slice(0, 200)
  }

  snapshot(): WorkerDiscoverySnapshot {
    const disconnects: Record<string, number> = {}
    for (const [k, v] of this.rlpxDisconnects) disconnects[k] = v
    return {
      boundAddress: this.boundAddress,
      boundUdpPort: this.boundUdpPort,
      boundTcpPort: this.boundTcpPort,
      tablePeers: this.tablePeers,
      bootstrap: {
        attempts: this.bootstrapAttempts,
        ok: this.bootstrapOk,
        fail: this.bootstrapFail,
        lastError: this.bootstrapLastError,
      },
      dns: {
        attempts: this.dnsAttempts,
        peersAdded: this.dnsPeersAdded,
        lastError: this.dnsLastError,
        resolver: this.dnsResolver,
      },
      rlpx: {
        dials: this.rlpxDials,
        connected: this.rlpxConnected,
        statusOk: this.rlpxStatusOk,
        disconnects,
        ...(this.rlpxLastSubprotocolError !== undefined
          ? { lastSubprotocolError: this.rlpxLastSubprotocolError }
          : {}),
      },
      dpt: {
        banSkips: this.dptBanSkips,
        bansIssued: this.dptBansIssued,
        ...(this.dptLastRemote !== undefined ? { lastRemote: this.dptLastRemote } : {}),
        ...(this.dptLastCause !== undefined ? { lastCause: this.dptLastCause } : {}),
      },
    }
  }
}
