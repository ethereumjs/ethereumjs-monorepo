/** Serialize sandbox EVM work so concurrent RPC calls do not overlap on one node. */
let tail: Promise<void> = Promise.resolve()

export function enqueueSandbox<T>(work: () => Promise<T>): Promise<T> {
  const run = tail.then(work)
  tail = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
