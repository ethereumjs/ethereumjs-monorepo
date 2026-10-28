import { bytesToHex } from '@ethereumjs/util'

import type { createEthyNode } from '../core/createEthyNode.ts'

export type HeadlessSoakOpts = {
  network: string
  node: ReturnType<typeof createEthyNode>
  p2pStarted: boolean
  p2pError?: string
  onShutdown: () => void
}

function writeSoakLine(opts: HeadlessSoakOpts): void {
  const { spine, stateManager } = opts.node
  const line = {
    type: 'ethy_discovery_soak',
    network: opts.network,
    phase: spine.phase,
    p2pStarted: opts.p2pStarted,
    p2pError: opts.p2pError,
    peers: spine.peers.size,
    pivotBlockNumber: spine.pivotBlockNumber?.toString(),
    pivotStateRoot:
      spine.pivotStateRoot !== undefined ? bytesToHex(spine.pivotStateRoot) : undefined,
    accountsLoaded: stateManager.accountCount(),
    discovery: spine.discovery ?? null,
  }
  process.stdout.write(`${JSON.stringify(line)}\n`)
}

/** Headless CLI: periodic JSON discovery lines until SIGINT/SIGTERM. */
export function runHeadlessUntilSignal(opts: HeadlessSoakOpts): Promise<void> {
  writeSoakLine(opts)
  const interval = setInterval(() => writeSoakLine(opts), 10_000)

  return new Promise<void>((resolve) => {
    const onSignal = () => {
      clearInterval(interval)
      opts.onShutdown()
      resolve()
    }
    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)
  })
}
