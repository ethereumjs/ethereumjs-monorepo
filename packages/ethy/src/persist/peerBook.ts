import * as fs from 'node:fs'
import * as path from 'node:path'

import type { PeerInfo, WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import { peerIdToBytes } from '../net/pivotHeader.ts'

/** One remembered RLPx peer for this chain (session quality, not UDP bonds). */
export type PeerBookRow = {
  id: string
  address: string
  udpPort: number
  tcpPort: number
  forkHash?: string
  clientFamily?: string
  lastStatusAt?: number
  lastSnapSuccessAt?: number
  snapResponsesOk: number
  snapTimeouts: number
  lastDisconnectReason?: string
  dialAfter: number
  resetStreak: number
  tooManyPeersStreak?: number
}

export function tooManyPeersHoldMs(vip: boolean, streak: number): number {
  if (streak <= 0) return 15_000
  if (streak === 1) return 30_000
  if (streak === 2) return 60_000
  return vip ? PEER_TOO_MANY_PEERS_VIP_CAP_MS : PEER_TOO_MANY_PEERS_HOLD_MAX_MS
}

export const PEER_BOOK_STARTUP_DIALS = 8
/** Backoff cap for peers with no successful snap responses (WP-04a). */
export const PEER_TOO_MANY_PEERS_HOLD_MAX_MS = 5 * 60 * 1000
export const PEER_TOO_MANY_PEERS_VIP_CAP_MS = 120 * 1000
export const PEER_STALE_SUCCESS_MS = 7 * 24 * 60 * 60 * 1000
export const PEER_RESET_REMOVE_STREAK = 3

export function networkPersistDir(dataDir: string, network: string): string {
  return path.join(dataDir, 'networks', network.toLowerCase())
}

export function discoveryNodeStorePath(dataDir: string, network: string): string {
  return path.join(networkPersistDir(dataDir, network), 'discovery-nodes.json')
}

export function peerBookFilePath(dataDir: string, network: string): string {
  return path.join(networkPersistDir(dataDir, network), 'peers.json')
}

export function clientFamilyFromClientId(clientId: string): string | undefined {
  const trimmed = clientId.trim()
  if (trimmed.length === 0) return undefined
  const slash = trimmed.indexOf('/')
  return slash > 0 ? trimmed.slice(0, slash) : trimmed.split(/\s+/)[0]
}

function lastSuccessAt(row: PeerBookRow): number | undefined {
  const a = row.lastStatusAt ?? 0
  const b = row.lastSnapSuccessAt ?? 0
  const m = Math.max(a, b)
  return m > 0 ? m : undefined
}

/** Order rows for startup redial: snap success, then STATUS-only; skip dial hold. */
export function rankPeerRows(rows: Iterable<PeerBookRow>, now: number): PeerBookRow[] {
  const tier = (r: PeerBookRow): number => {
    if (r.lastSnapSuccessAt !== undefined && r.lastSnapSuccessAt > 0) return 2
    if (r.lastStatusAt !== undefined && r.lastStatusAt > 0) return 1
    return 0
  }
  return [...rows]
    .filter(
      (r) =>
        r.dialAfter <= now &&
        r.address.length > 0 &&
        r.tcpPort > 0 &&
        tier(r) > 0 &&
        routableAddress(r.address),
    )
    .sort((a, b) => {
      const ta = tier(a)
      const tb = tier(b)
      if (ta !== tb) return tb - ta
      if (ta === 2 && a.snapResponsesOk !== b.snapResponsesOk) {
        return b.snapResponsesOk - a.snapResponsesOk
      }
      const aSnap = a.lastSnapSuccessAt ?? 0
      const bSnap = b.lastSnapSuccessAt ?? 0
      if (aSnap !== bSnap) return bSnap - aSnap
      return (b.lastStatusAt ?? 0) - (a.lastStatusAt ?? 0)
    })
}

function routableAddress(address: string): boolean {
  return address !== '' && address !== '0.0.0.0' && address !== '::'
}

export type PeerBookOpenOptions = {
  dataDir: string
  network: string
  expectedForkHash: string
  enabled: boolean
}

export class PeerBookStore {
  readonly expectedForkHash: string
  private readonly _path: string
  private readonly _enabled: boolean
  private readonly _rows = new Map<string, PeerBookRow>()
  private _dirty = false

  private constructor(opts: PeerBookOpenOptions, rows: Map<string, PeerBookRow>) {
    this.expectedForkHash = opts.expectedForkHash
    this._path = peerBookFilePath(opts.dataDir, opts.network)
    this._enabled = opts.enabled
    this._rows = rows
  }

  static open(opts: PeerBookOpenOptions): PeerBookStore {
    const rows = new Map<string, PeerBookRow>()
    if (opts.enabled) {
      try {
        const raw = fs.readFileSync(peerBookFilePath(opts.dataDir, opts.network), 'utf8')
        const obj = JSON.parse(raw) as Record<string, PeerBookRow>
        for (const [id, row] of Object.entries(obj)) {
          rows.set(id, normalizeRow(id, row))
        }
      } catch {
        // fresh book
      }
    }
    return new PeerBookStore(opts, rows)
  }

  discoveryNodeStorePath(dataDir: string, network: string): string {
    return discoveryNodeStorePath(dataDir, network)
  }

  /** Drop stale or fork-mismatched rows before redial. */
  pruneOnStart(now: number): void {
    if (!this._enabled) return
    for (const [id, row] of [...this._rows.entries()]) {
      if (row.forkHash !== undefined && row.forkHash !== this.expectedForkHash) {
        this._rows.delete(id)
        this._dirty = true
        continue
      }
      const success = lastSuccessAt(row)
      if (success === undefined || now - success > PEER_STALE_SUCCESS_MS) {
        this._rows.delete(id)
        this._dirty = true
      }
    }
    this.flush()
  }

  dialCandidates(now: number, limit = PEER_BOOK_STARTUP_DIALS): PeerInfo[] {
    const ranked = rankPeerRows(this._rows.values(), now).slice(0, limit)
    return ranked.map((row) => this._rowToPeerInfo(row))
  }

  /** VIP snap peers eligible for gentle redial (WP-04a). */
  vipDialCandidates(now: number, limit = PEER_BOOK_STARTUP_DIALS): PeerInfo[] {
    const ranked = rankPeerRows(this._rows.values(), now)
    const snapProven = ranked.filter((row) => row.snapResponsesOk > 0)
    const statusOnly = ranked.filter(
      (row) => row.snapResponsesOk <= 0 && (row.lastStatusAt ?? 0) > 0,
    )
    const ordered = [...snapProven, ...statusOnly]
    const families = new Set(
      ordered.map((row) => row.clientFamily ?? row.id).filter((f) => f.length > 0),
    )
    const capPerFamily = families.size > 1 ? 2 : limit
    const familyCount = new Map<string, number>()
    const picked: PeerBookRow[] = []
    for (const row of ordered) {
      if (picked.length >= limit) break
      const family = row.clientFamily ?? row.id
      const n = familyCount.get(family) ?? 0
      if (n >= capPerFamily) continue
      familyCount.set(family, n + 1)
      picked.push(row)
    }
    return picked.map((row) => this._rowToPeerInfo(row))
  }

  private _rowToPeerInfo(row: PeerBookRow): PeerInfo {
    return {
      id: peerIdToBytes(row.id),
      address: row.address,
      udpPort: row.udpPort,
      tcpPort: row.tcpPort,
    }
  }

  noteTelemetryPeer(peer: WorkerPeerSnapshot, now: number): void {
    if (!this._enabled || peer.bestHash === undefined) return
    if (peer.address === undefined || peer.tcpPort === undefined) return
    const id = peer.id.toLowerCase()
    const row = this._ensureRow(id, peer, now)
    if (row === undefined) return
    row.lastStatusAt = now
    row.tooManyPeersStreak = 0
    row.dialAfter = now
    row.clientFamily = clientFamilyFromClientId(peer.clientId) ?? row.clientFamily
    if (row.forkHash === undefined) {
      row.forkHash = this.expectedForkHash
    } else if (row.forkHash !== this.expectedForkHash) {
      this._rows.delete(id)
      this._dirty = true
      this.flush()
      return
    }
    this._dirty = true
    this.flush()
  }

  noteSnapSuccess(peerId: string, now: number): void {
    if (!this._enabled) return
    const id = peerId.toLowerCase()
    const row = this._rows.get(id)
    if (row === undefined) return
    row.lastSnapSuccessAt = now
    row.snapResponsesOk++
    this._dirty = true
    this.flush()
  }

  noteSnapTimeout(peerId: string): void {
    if (!this._enabled) return
    const id = peerId.toLowerCase()
    const row = this._rows.get(id)
    if (row === undefined) return
    row.snapTimeouts++
    this._dirty = true
    this.flush()
  }

  noteDisconnect(peerId: string | undefined, message: string, now: number): void {
    if (!this._enabled || peerId === undefined) return
    const id = peerId.toLowerCase()
    const row = this._rows.get(id)
    if (row === undefined) return
    const upper = message.toUpperCase()
    row.lastDisconnectReason = message

    if (upper.includes('TOO_MANY_PEERS')) {
      const streak = (row.tooManyPeersStreak ?? 0) + 1
      row.tooManyPeersStreak = streak
      const vip = row.snapResponsesOk > 0
      row.dialAfter = now + tooManyPeersHoldMs(vip, streak - 1)
      this._dirty = true
      this.flush()
      return
    }

    const resetLike =
      upper.includes('ECONNRESET') ||
      upper.includes('ECONNREFUSED') ||
      upper.includes(' CONNECTION RESET') ||
      upper.includes(' RESET ') ||
      message.includes('handshakeRejects.reset')

    if (resetLike) {
      row.resetStreak++
      if (row.resetStreak >= PEER_RESET_REMOVE_STREAK) {
        this._rows.delete(id)
      }
      this._dirty = true
      this.flush()
    }
  }

  flush(): void {
    if (!this._enabled || !this._dirty) return
    this._dirty = false
    fs.mkdirSync(path.dirname(this._path), { recursive: true })
    const obj: Record<string, PeerBookRow> = {}
    for (const [id, row] of this._rows) {
      obj[id] = row
    }
    fs.writeFileSync(this._path, JSON.stringify(obj))
  }

  /** Test and inspection hook. */
  getRow(id: string): PeerBookRow | undefined {
    return this._rows.get(id.toLowerCase())
  }

  /** Test hook: seed a row without telemetry. */
  putRow(row: PeerBookRow): void {
    if (!this._enabled) return
    this._rows.set(row.id.toLowerCase(), normalizeRow(row.id, row))
    this._dirty = true
    this.flush()
  }

  private _ensureRow(id: string, peer: WorkerPeerSnapshot, _now: number): PeerBookRow | undefined {
    if (peer.address === undefined || peer.tcpPort === undefined) return undefined
    const udpPort = peer.udpPort ?? peer.tcpPort
    let row = this._rows.get(id)
    if (row === undefined) {
      row = {
        id,
        address: peer.address,
        udpPort,
        tcpPort: peer.tcpPort,
        snapResponsesOk: 0,
        snapTimeouts: 0,
        dialAfter: 0,
        resetStreak: 0,
        tooManyPeersStreak: 0,
      }
      this._rows.set(id, row)
    } else {
      row.address = peer.address
      row.udpPort = udpPort
      row.tcpPort = peer.tcpPort
    }
    return row
  }
}

function normalizeRow(id: string, row: PeerBookRow): PeerBookRow {
  return {
    ...row,
    id: id.toLowerCase(),
    snapResponsesOk: row.snapResponsesOk ?? 0,
    snapTimeouts: row.snapTimeouts ?? 0,
    dialAfter: row.dialAfter ?? 0,
    resetStreak: row.resetStreak ?? 0,
    tooManyPeersStreak: row.tooManyPeersStreak ?? 0,
  }
}
