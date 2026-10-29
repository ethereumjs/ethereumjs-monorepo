import { DISCONNECT_REASON, DisconnectReasonNames } from '../types.ts'
import { type HandshakeRejectKey } from './handshakeReject.ts'

/** `Geth/v1.16.1-stable-…/linux` → `Geth/v1.16.1 eth/72`. */
export function peerFateLabel(
  clientId: string | undefined,
  ethVersion: number | undefined,
): string {
  const eth = ethVersion === undefined ? 'eth/—' : `eth/${ethVersion}`
  if (clientId === undefined || clientId.length === 0) return `unknown ${eth}`
  const [name, rest] = clientId.split('/')
  const ver = rest?.split('-')[0]
  const client = ver !== undefined && ver.length > 0 ? `${name}/${ver}` : name
  return `${client.slice(0, 32)} ${eth}`
}

export interface WorkerDiscoverySnapshot {
  boundAddress: string
  boundUdpPort: number
  boundTcpPort: number
  tablePeers: number
  /** Hardfork, EIP-2124 hash, and next fork this node puts in ETH STATUS. */
  advertisedFork?: { hardfork: string; hash: string; next?: string }
  bootstrap: {
    attempts: number
    ok: number
    fail: number
    lastError?: string
  }
  dns: {
    attempts: number
    peersAdded: number
    forkRejected?: number
    lastError?: string
    resolver?: string
  }
  rlpx: {
    dials: number
    connected: number
    statusOk: number
    /** ETH STATUS messages this node wrote after HELLO. */
    statusSent?: number
    /** TCP resets that happened after HELLO, included in `handshakeRejects.reset`. */
    resetAfterHello?: number
    /** Keys are `REASON (we dropped remote)` or `REASON (remote dropped us)`. */
    disconnects: Record<string, number>
    /** Counts of why sessions died before a validated ETH STATUS. */
    handshakeRejects?: Partial<Record<HandshakeRejectKey, number>>
    /**
     * Drops after HELLO, keyed by `Client/version eth/N`.
     * `remote` — they sent SUBPROTOCOL or PROTOCOL error.
     * `we` — we sent that error. `reset` — TCP reset after HELLO.
     */
    peerFates?: Record<string, { remote?: number; we?: number; reset?: number }>
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
  advertisedHardfork?: string
  advertisedForkHash?: string
  advertisedForkNext?: string

  bootstrapAttempts = 0
  bootstrapOk = 0
  bootstrapFail = 0
  bootstrapLastError?: string

  dnsAttempts = 0
  dnsPeersAdded = 0
  dnsForkRejected = 0
  dnsLastError?: string
  dnsResolver?: string

  rlpxDials = 0
  rlpxConnected = 0
  rlpxStatusOk = 0
  rlpxStatusSent = 0
  rlpxResetAfterHello = 0
  rlpxLastSubprotocolError?: string
  private readonly rlpxDisconnects = new Map<string, number>()
  private readonly handshakeRejects = new Map<HandshakeRejectKey, number>()
  private readonly peerFates = new Map<string, { remote: number; we: number; reset: number }>()

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

  setAdvertisedFork(hardfork: string, hash: string, next = '0'): void {
    this.advertisedHardfork = hardfork
    this.advertisedForkHash = hash
    this.advertisedForkNext = next
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

  recordDnsForkRejected(): void {
    this.dnsForkRejected++
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

  recordStatusSent(): void {
    this.rlpxStatusSent++
  }

  recordResetAfterHello(): void {
    this.rlpxResetAfterHello++
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
    if (reason === DISCONNECT_REASON.TOO_MANY_PEERS) this.recordHandshakeReject('slots')
    if (reason === DISCONNECT_REASON.TIMEOUT) this.recordHandshakeReject('timeout')
  }

  recordHandshakeReject(key: HandshakeRejectKey): void {
    this.handshakeRejects.set(key, (this.handshakeRejects.get(key) ?? 0) + 1)
  }

  /** Group a post-HELLO failure by remote client and negotiated eth version. */
  recordPeerFate(label: string, fate: 'remote' | 'we' | 'reset'): void {
    const row = this.peerFates.get(label) ?? { remote: 0, we: 0, reset: 0 }
    row[fate]++
    this.peerFates.set(label, row)
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
    const handshakeRejects: Partial<Record<HandshakeRejectKey, number>> = {}
    for (const [k, v] of this.handshakeRejects) handshakeRejects[k] = v
    const peerFates: Record<string, { remote?: number; we?: number; reset?: number }> = {}
    for (const [label, row] of this.peerFates) {
      peerFates[label] = {
        ...(row.remote > 0 ? { remote: row.remote } : {}),
        ...(row.we > 0 ? { we: row.we } : {}),
        ...(row.reset > 0 ? { reset: row.reset } : {}),
      }
    }
    return {
      boundAddress: this.boundAddress,
      boundUdpPort: this.boundUdpPort,
      boundTcpPort: this.boundTcpPort,
      tablePeers: this.tablePeers,
      ...(this.advertisedHardfork !== undefined && this.advertisedForkHash !== undefined
        ? {
            advertisedFork: {
              hardfork: this.advertisedHardfork,
              hash: this.advertisedForkHash,
              ...(this.advertisedForkNext !== undefined ? { next: this.advertisedForkNext } : {}),
            },
          }
        : {}),
      bootstrap: {
        attempts: this.bootstrapAttempts,
        ok: this.bootstrapOk,
        fail: this.bootstrapFail,
        lastError: this.bootstrapLastError,
      },
      dns: {
        attempts: this.dnsAttempts,
        peersAdded: this.dnsPeersAdded,
        ...(this.dnsForkRejected > 0 ? { forkRejected: this.dnsForkRejected } : {}),
        lastError: this.dnsLastError,
        resolver: this.dnsResolver,
      },
      rlpx: {
        dials: this.rlpxDials,
        connected: this.rlpxConnected,
        statusOk: this.rlpxStatusOk,
        ...(this.rlpxStatusSent > 0 ? { statusSent: this.rlpxStatusSent } : {}),
        ...(this.rlpxResetAfterHello > 0 ? { resetAfterHello: this.rlpxResetAfterHello } : {}),
        disconnects,
        ...(Object.keys(handshakeRejects).length > 0 ? { handshakeRejects } : {}),
        ...(Object.keys(peerFates).length > 0 ? { peerFates } : {}),
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
