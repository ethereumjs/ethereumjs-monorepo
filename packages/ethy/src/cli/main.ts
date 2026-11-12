import { startConsensusTracker } from '../cl/consensusTracker.ts'
import { createEthyNode } from '../core/createEthyNode.ts'
import { initEthyKeccak } from '../crypto/keccak.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { activeHardfork, chainConfigForNetwork } from '../net/chainHardfork.ts'
import { startPeerCoordinator } from '../net/peerCoordinator.ts'
import { initRpcTelemetry } from '../rpc/methods.ts'
import { type JsonRpcHandle, startJsonRpcServer } from '../rpc/server.ts'
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

  await initEthyKeccak()

  const node = createEthyNode({
    network,
    chainId,
    demo: cli.demo,
    headless: cli.headless,
    fresh: cli.fresh,
    dataDir: cli.dataDir,
    enableFlightRecorder: !cli.demo,
    llmUrl: cli.llmUrl,
    llmAllowRemote: cli.llmAllowRemote,
    aiMemory: cli.aiMemory,
    recordFixturePath: cli.recordFixturePath,
  })

  let coordinatorStop: (() => void) | undefined
  let consensusStop: (() => void) | undefined
  let rpcHandle: JsonRpcHandle | undefined
  let witnessExecutionHeader: ((blockNumber: bigint, blockHash: Uint8Array) => void) | undefined
  let noteChainHead: ((blockNumber: bigint) => void) | undefined
  let p2pError: string | undefined
  const bindPeerCoordinator = (handle: Awaited<ReturnType<typeof startPeerCoordinator>>) => {
    node.disconnectPeer = handle.disconnectPeer
    node.intentEngine.setDisconnectPeer?.(handle.disconnectPeer)
    coordinatorStop = handle.stop
  }
  const reportP2pStartError = (e: unknown) => {
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
  const chain = chainConfigForNetwork(network)
  const hardfork = activeHardfork(chain)
  if (cli.rpcEnabled) {
    initRpcTelemetry(node.spine, true)
    rpcHandle = await startJsonRpcServer({
      spine: node.spine,
      stateManager: node.stateManager,
      chain,
      hardfork,
      demo: cli.demo,
      host: cli.rpcHost,
      port: cli.rpcPort,
      portExplicit: cli.rpcPortExplicit,
      economy: node.economy,
      blockWindow: node.blockWindow,
      submitRawTransaction: (hex) => {
        if (node.submitRawTransaction !== undefined) {
          return node.submitRawTransaction(hex)
        }
        return Promise.resolve({ error: { code: -32000, message: 'Transaction pool unavailable' } })
      },
    })
  } else {
    node.spine.rpc = {
      enabled: false,
      listening: false,
      host: cli.rpcHost,
      port: 0,
      url: '',
      totalRequests: 0,
      totalErrors: 0,
      methodStats: {},
      recentCalls: [],
    }
  }

  let coordinatorReady: Promise<void> = Promise.resolve()
  if (!cli.demo) {
    const consensus = startConsensusTracker({
      spine: node.spine,
      network,
      dataDir: cli.dataDir,
      notices: node.notices,
      onOptimisticHead: (blockNumber) => {
        noteChainHead?.(blockNumber)
      },
    })
    consensusStop = consensus.stop
    witnessExecutionHeader = consensus.notePeerHeader
    coordinatorReady = startPeerCoordinator({
      spine: node.spine,
      stateManager: node.stateManager,
      network,
      dataDir: cli.dataDir,
      notices: node.notices,
      snapStore: node.snapStore,
      peerBook: node.peerBook,
      fresh: cli.fresh,
      listenPort: cli.listenPort,
      connectEnodeUrls: cli.connectEnodeUrls.length > 0 ? cli.connectEnodeUrls : undefined,
      syncMode: cli.syncMode,
      witnessExecutionHeader,
      economy: node.economy,
      onRpcBundle: (note) => rpcHandle?.noteBundle(note),
    })
      .then((handle) => {
        bindPeerCoordinator(handle)
        noteChainHead = handle.noteChainHead
        node.submitRawTransaction = handle.submitRawTransaction
        node.hybridEngine?.setSubmitRawTransaction((hex) =>
          handle
            .submitRawTransaction(hex)
            .then((out) => ('error' in out ? { error: { message: out.error.message } } : out)),
        )
      })
      .catch((e: unknown) => {
        reportP2pStartError(e)
      })
  }

  const shutdown = () => {
    void rpcHandle?.stop()
    coordinatorStop?.()
    consensusStop?.()
    node.flightRecorder?.stop()
  }

  if (cli.headless) {
    if (cli.demo) {
      advanceDemo(node.spine, 5000)
    } else {
      await coordinatorReady
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
