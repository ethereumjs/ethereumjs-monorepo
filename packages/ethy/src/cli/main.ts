import { createEthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { startPeerCoordinator } from '../net/peerCoordinator.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import { runEthySession } from '../tui/session.ts'
import { parseEthyArgs, printEthyUsage } from './args.ts'
import { resolveNetwork } from './chain.ts'
import { runHeadlessUntilSignal } from './headlessSoak.ts'

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
    dataDir: cli.dataDir,
  })

  let coordinatorStop: (() => void) | undefined
  let p2pError: string | undefined
  if (!cli.demo) {
    try {
      const handle = await startPeerCoordinator({
        spine: node.spine,
        stateManager: node.stateManager,
        network,
        notices: node.notices,
        snapStore: node.snapStore,
      })
      node.disconnectPeer = handle.disconnectPeer
      ;(
        node.intentEngine as import('../ai/deterministicEngine.ts').DeterministicIntentEngine
      ).setDisconnectPeer(handle.disconnectPeer)
      coordinatorStop = handle.stop
    } catch (e: unknown) {
      const message = (e as Error).message
      p2pError = message
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
    }
    await runHeadlessUntilSignal({
      network,
      node,
      p2pStarted: cli.demo || coordinatorStop !== undefined,
      p2pError,
      onShutdown: shutdown,
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
