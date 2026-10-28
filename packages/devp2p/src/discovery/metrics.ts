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
    disconnects: Record<string, number>
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
  private readonly rlpxDisconnects = new Map<string, number>()

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

  recordRlpxDisconnect(reason: DISCONNECT_REASON): void {
    const name = DisconnectReasonNames[reason] ?? `UNKNOWN_${String(reason)}`
    this.rlpxDisconnects.set(name, (this.rlpxDisconnects.get(name) ?? 0) + 1)
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
      },
    }
  }
}
