import type { StateResolutionPolicy } from '@ethereumjs/statemanager'

/** Scheduler lane: `rpc` > `identity` > `ai_probe`. */
export type SandboxLane = 'rpc' | 'identity' | 'ai_probe'

export const SANDBOX_LANE_DEFAULTS: Record<
  SandboxLane,
  { resolutionPolicy: StateResolutionPolicy; timeoutMs: number }
> = {
  rpc: { resolutionPolicy: 'full', timeoutMs: 5_000 },
  identity: { resolutionPolicy: 'swarm-only', timeoutMs: 1_500 },
  ai_probe: { resolutionPolicy: 'swarm-only', timeoutMs: 600 },
}

export type EnqueueSandboxOpts = {
  lane?: SandboxLane
  resolutionPolicy?: StateResolutionPolicy
  timeoutMs?: number
}

/** Resolved opts for sandbox overlays (defaults to `rpc` / `full` / 5s). */
export function resolveSandboxOpts(opts?: EnqueueSandboxOpts): Required<EnqueueSandboxOpts> {
  const lane = opts?.lane ?? 'rpc'
  const defs = SANDBOX_LANE_DEFAULTS[lane]
  return {
    lane,
    resolutionPolicy: opts?.resolutionPolicy ?? defs.resolutionPolicy,
    timeoutMs: opts?.timeoutMs ?? defs.timeoutMs,
  }
}

const MAX_CONCURRENT = 4

type PendingJob<T> = {
  lane: SandboxLane
  work: () => Promise<T>
  resolve: (value: T) => void
  reject: (reason: unknown) => void
  timeoutMs: number
  settled: boolean
}

const laneQueues: Record<SandboxLane, PendingJob<unknown>[]> = {
  rpc: [],
  identity: [],
  ai_probe: [],
}

let activeCount = 0

const LANE_DRAIN_ORDER: SandboxLane[] = ['rpc', 'identity', 'ai_probe']

function dequeueOne(): PendingJob<unknown> | undefined {
  for (const lane of LANE_DRAIN_ORDER) {
    const q = laneQueues[lane]
    if (q.length > 0) return q.shift()
  }
  return undefined
}

function tryPump(): void {
  while (activeCount < MAX_CONCURRENT) {
    const job = dequeueOne()
    if (job === undefined) return
    activeCount++
    void runJob(job).finally(() => {
      activeCount--
      tryPump()
    })
  }
}

async function runJob(job: PendingJob<unknown>): Promise<void> {
  const workPromise = job.work()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('EVM sandbox timed out'))
    }, job.timeoutMs)
  })

  try {
    const result = await Promise.race([workPromise, timeout])
    if (!job.settled) {
      job.settled = true
      job.resolve(result)
    }
  } catch (e) {
    if (!job.settled) {
      job.settled = true
      job.reject(e)
    }
  } finally {
    if (timer !== undefined) clearTimeout(timer)
    await workPromise.catch(() => undefined)
  }
}

export function enqueueSandbox<T>(work: () => Promise<T>, opts?: EnqueueSandboxOpts): Promise<T> {
  const resolved = resolveSandboxOpts(opts)
  return new Promise<T>((resolve, reject) => {
    const job: PendingJob<T> = {
      lane: resolved.lane,
      work,
      resolve,
      reject,
      timeoutMs: resolved.timeoutMs,
      settled: false,
    }
    laneQueues[resolved.lane].push(job as PendingJob<unknown>)
    tryPump()
  })
}

/** Test hook: wait until the scheduler is idle. */
export function awaitSandboxIdle(): Promise<void> {
  if (activeCount === 0 && LANE_DRAIN_ORDER.every((l) => laneQueues[l].length === 0)) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const tick = (): void => {
      if (activeCount === 0 && LANE_DRAIN_ORDER.every((l) => laneQueues[l].length === 0)) {
        resolve()
        return
      }
      setImmediate(tick)
    }
    setImmediate(tick)
  })
}
