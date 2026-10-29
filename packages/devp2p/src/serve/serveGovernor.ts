const WINDOW_MS = 1000
export const SERVE_SOFT_RESPONSE_BYTES = 2 * 1024 * 1024
const GLOBAL_BYTES_PER_SEC = 8 * 1024 * 1024
const PEER_BYTES_PER_SEC = 2 * 1024 * 1024

type WindowEntry = { ts: number; bytes: number }

/**
 * Rate-limits outbound eth serving per peer and globally (sliding 1s window).
 */
export class ServeGovernor {
  private _global: WindowEntry[] = []
  private _perPeer = new Map<string, WindowEntry[]>()

  /** Bytes still allowed for this reply (before soft response cap). */
  bytesAllowed(peerIdHex: string, hasStoredHit: boolean): number {
    const now = Date.now()
    this._prune(now)
    const globalUsed = this._sum(this._global)
    const peerUsed = this._sum(this._perPeer.get(peerIdHex) ?? [])
    const globalLeft = Math.max(0, GLOBAL_BYTES_PER_SEC - globalUsed)
    const peerLeft = Math.max(0, PEER_BYTES_PER_SEC - peerUsed)
    let allowed = Math.min(SERVE_SOFT_RESPONSE_BYTES, globalLeft, peerLeft)
    if (hasStoredHit && allowed === 0) {
      allowed = Math.min(SERVE_SOFT_RESPONSE_BYTES, 64 * 1024)
    }
    return allowed
  }

  record(peerIdHex: string, bytes: number): void {
    const now = Date.now()
    this._global.push({ ts: now, bytes })
    const peer = this._perPeer.get(peerIdHex) ?? []
    peer.push({ ts: now, bytes })
    this._perPeer.set(peerIdHex, peer)
  }

  private _prune(now: number): void {
    const cutoff = now - WINDOW_MS
    this._global = this._global.filter((e) => e.ts >= cutoff)
    for (const [k, arr] of this._perPeer) {
      const next = arr.filter((e) => e.ts >= cutoff)
      if (next.length === 0) this._perPeer.delete(k)
      else this._perPeer.set(k, next)
    }
  }

  private _sum(arr: WindowEntry[]): number {
    return arr.reduce((a, e) => a + e.bytes, 0)
  }
}
