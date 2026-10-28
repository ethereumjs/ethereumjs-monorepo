import { createEthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { startPeerCoordinator } from '../net/peerCoordinator.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import { runEthySession } from '../tui/session.ts'
import { parseEthyArgs, printEthyUsage } from './args.ts'
import { resolveNetwork } from './chain.ts'

async function main(): Promise<void> {
  let cli
  try {
    cli = parseEthyArgs(process.argv)
  } catch (e: unknown) {
    const msg = (e as Error).message
    if (msg === 'HELP') {
      process.stderr.write(printEthyUsage())
      process.exit(0)
    }
    process.stderr.write(`${msg}\n\n${printEthyUsage()}`)
    process.exit(1)
  }

  let network: string
  let chainId: bigint
  try {
    ;({ network, chainId } = resolveNetwork(cli.network))
  } catch (e: unknown) {
    process.stderr.write(`${(e as Error).message}\n`)
    process.exit(1)
  }

  const node = createEthyNode({
    network,
    chainId,
    demo: cli.demo,
    headless: cli.headless,
  })

  let coordinatorStop: (() => void) | undefined
  if (!cli.demo) {
    try {
      const handle = await startPeerCoordinator({
        spine: node.spine,
        network,
        notices: node.notices,
      })
      coordinatorStop = handle.stop
    } catch (e: unknown) {
      const message = (e as Error).message
      recordDiagnostic(node.spine, {
        subsystem: 'devp2p',
        severity: 'error',
        message,
      })
      node.notices.post(
        {
          key: 'p2p-start',
          level: 'alert',
          text: `Network did not start. ${message}`,
        },
        Date.now(),
      )
    }
  }

  const shutdown = () => {
    coordinatorStop?.()
  }

  if (cli.headless) {
    if (cli.demo) {
      advanceDemo(node.spine, 5000)
    } else if (coordinatorStop !== undefined) {
      const soakMs = 45_000
      const soakTimer = setTimeout(() => {
        const line = {
          type: 'ethy_discovery_soak',
          network,
          peers: node.spine.peers.size,
          discovery: node.spine.discovery ?? null,
        }
        process.stdout.write(`${JSON.stringify(line)}\n`)
      }, soakMs)
      soakTimer.unref()
    }
    await new Promise<void>((resolve) => {
      const onSignal = () => {
        shutdown()
        resolve()
      }
      process.once('SIGINT', onSignal)
      process.once('SIGTERM', onSignal)
    })
    return
  }

  try {
    await runEthySession(node)
  } finally {
    shutdown()
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`)
  process.exit(1)
})
