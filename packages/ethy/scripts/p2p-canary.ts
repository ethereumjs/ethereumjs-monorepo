/**
 * Live Sepolia P2P health canary (~15s). Not part of CI.
 *
 * Usage (from repo root or packages/ethy):
 *   npm run p2p:canary --prefix packages/ethy
 */
import { createEthyNode } from '../src/core/createEthyNode.ts'
import { startPeerCoordinator } from '../src/net/peerCoordinator.ts'
import { resolveNetwork } from '../src/cli/chain.ts'

const RUN_MS = 15_000

type CanaryReport = {
  timeToFirstStatusMs: number | null
  sustainedPeersAt15s: number
  unexpectedDisconnects: number
  pivotAnchoredBlock: string | null
  snapRangesSucceeded: number
  accountsIngested: number
  verdict: 'PASS' | 'FAIL'
}

function isUnexpectedDisconnect(message: string): boolean {
  const upper = message.toUpperCase()
  if (upper.includes('TOO_MANY_PEERS')) return false
  return upper.includes('DISCONNECT') || upper.includes('RESET') || upper.includes('SUBPROTOCOL')
}

async function main(): Promise<void> {
  const { network, chainId } = resolveNetwork('sepolia')
  const node = createEthyNode({ network, chainId, headless: true })
  const startedAt = Date.now()
  let timeToFirstStatusMs: number | null = null
  let unexpectedDisconnects = 0
  let snapRangesSucceeded = 0
  let lastAccounts = 0

  const handle = await startPeerCoordinator({
    spine: node.spine,
    stateManager: node.stateManager,
    network,
    snapStore: node.snapStore,
    peerBook: node.peerBook,
  })

  const onDiag = () => {
    const statusOk = node.spine.discovery?.rlpx.statusOk ?? 0
    if (timeToFirstStatusMs === null && statusOk > 0) {
      timeToFirstStatusMs = Date.now() - startedAt
    }
    for (const p of node.spine.peers.values()) {
      snapRangesSucceeded = Math.max(snapRangesSucceeded, p.snapResponsesOk)
    }
    lastAccounts = node.stateManager.accountCount()
  }

  const diagTimer = setInterval(onDiag, 250)
  node.spine.diagnosticRingBuffer.length = 0

  const countUnexpectedDisconnects = () => {
    for (const d of node.spine.diagnosticRingBuffer) {
      if (d.subsystem === 'devp2p' && isUnexpectedDisconnect(d.message)) {
        unexpectedDisconnects++
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, RUN_MS))
  clearInterval(diagTimer)
  onDiag()
  countUnexpectedDisconnects()

  handle.stop()

  const report: CanaryReport = {
    timeToFirstStatusMs,
    sustainedPeersAt15s: node.spine.peers.size,
    unexpectedDisconnects,
    pivotAnchoredBlock: node.spine.pivotBlockNumber?.toString() ?? null,
    snapRangesSucceeded,
    accountsIngested: lastAccounts,
    verdict:
      timeToFirstStatusMs !== null && node.spine.peers.size >= 1 && unexpectedDisconnects === 0
        ? 'PASS'
        : 'FAIL',
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  process.exit(report.verdict === 'PASS' ? 0 : 1)
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`)
  process.exit(1)
})
