import type { LabEventRecord } from './eventBus.ts'

const RECENT_EVENT_CAP = 128

export class WaitRegistry {
  private waiters: Array<{
    match: (ev: LabEventRecord) => boolean
    resolve: (ev: LabEventRecord) => void
    reject: (err: Error) => void
    timer: NodeJS.Timeout
  }> = []
  private eventSeq = 0
  private recent: { seq: number; ev: LabEventRecord }[] = []

  attach(bus: { onEvent: (fn: (ev: LabEventRecord) => void) => void }) {
    bus.onEvent((ev) => {
      const seq = ++this.eventSeq
      this.recent.push({ seq, ev })
      if (this.recent.length > RECENT_EVENT_CAP) {
        this.recent.splice(0, this.recent.length - RECENT_EVENT_CAP)
      }
      this.dispatch(ev)
    })
  }

  wait(match: (ev: LabEventRecord) => boolean, timeoutMs: number): Promise<LabEventRecord> {
    // Only events after this call count (avoids matching a dead session's peer:added).
    const registeredAfterSeq = this.eventSeq
    for (let i = this.recent.length - 1; i >= 0; i--) {
      const entry = this.recent[i]!
      if (entry.seq <= registeredAfterSeq) continue
      if (match(entry.ev)) return Promise.resolve(entry.ev)
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.remove(waiter)
        reject(new Error(`Wait timeout after ${timeoutMs}ms`))
      }, timeoutMs)
      const waiter = { match, resolve, reject, timer }
      this.waiters.push(waiter)
    })
  }

  private dispatch(ev: LabEventRecord) {
    for (const waiter of [...this.waiters]) {
      if (waiter.match(ev)) {
        clearTimeout(waiter.timer)
        this.remove(waiter)
        waiter.resolve(ev)
      }
    }
  }

  private remove(waiter: (typeof this.waiters)[0]) {
    const idx = this.waiters.indexOf(waiter)
    if (idx >= 0) this.waiters.splice(idx, 1)
  }

  clear() {
    for (const w of this.waiters) {
      clearTimeout(w.timer)
    }
    this.waiters = []
  }
}

/** Match wait CLI / REPL event strings against NDJSON records. */
export function matchWaitEvent(event: string, ev: LabEventRecord, sessionNode?: string): boolean {
  if (sessionNode !== undefined && ev.node !== undefined && ev.node !== sessionNode) {
    return false
  }
  if (event === 'peer.added') {
    return ev.layer === 'rlpx' && ev.name === 'peer:added'
  }
  if (event === 'peer.added.dpt') {
    return ev.layer === 'dpt' && ev.name === 'peer:added'
  }
  if (event === 'peer.removed') {
    return ev.layer === 'rlpx' && ev.name === 'peer:removed'
  }
  if (event === 'peer.error' || event === 'peer:error') {
    return ev.layer === 'rlpx' && ev.name === 'peer:error'
  }
  if (event === 'rlpx.PONG' || event === 'rlpx.pong') {
    return ev.layer === 'rlpx' && ev.name === 'PONG'
  }
  if (event === 'rlpx.PING' || event === 'rlpx.ping') {
    return ev.layer === 'rlpx' && ev.name === 'PING'
  }
  if (event.startsWith('eth.')) {
    const want = event.slice('eth.'.length)
    return ev.layer === 'eth' && ev.name === want
  }
  if (event.startsWith('snap.')) {
    const want = event.slice('snap.'.length)
    return ev.layer === 'snap' && ev.name === want
  }
  return ev.name === event
}
