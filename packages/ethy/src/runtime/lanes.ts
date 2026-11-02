/**
 * Two clocks, one thread.
 *
 * Node cannot pause a running function to paint the TUI. Sync, discovery, and
 * disk durability therefore must not occupy the main thread for long stretches.
 *
 * - Presentation: keypress and the frame timer. They only read spine state.
 * - Protocol: this queue. Each drain stops after {@link PROTOCOL_SLICE_MS} so
 *   the next event-loop turn can read stdin and redraw. Callers still have to
 *   keep a single task short (no synchronous multi-megabyte reads or fsync).
 */

/** Wall time one protocol drain may use before yielding to the presentation clock. */
export const PROTOCOL_SLICE_MS = 4

type ProtocolTask = () => void | Promise<void>

const queue: ProtocolTask[] = []
let pumping = false

export function enqueueProtocol(task: ProtocolTask): void {
  queue.push(task)
  if (pumping) return
  pumping = true
  setImmediate(pump)
}

async function pump(): Promise<void> {
  const start = Date.now()
  while (queue.length > 0 && Date.now() - start < PROTOCOL_SLICE_MS) {
    const task = queue.shift()
    if (task === undefined) continue
    try {
      await task()
    } catch {
      // Keep draining; a failed protocol task must not wedge the TUI queue.
    }
  }
  if (queue.length > 0) {
    setImmediate(pump)
    return
  }
  pumping = false
}

/** Test hook. */
export function protocolQueueLength(): number {
  return queue.length
}
