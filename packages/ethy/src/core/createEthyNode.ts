import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'

import type { FlatStateManager } from '@ethereumjs/statemanager'
import { ethyKeccak256 } from '../crypto/keccak.ts'

import * as fs from 'node:fs'
import { FetchLlmTransport, type LlmTransport, RecordingTransport } from '../ai/fixtureEngine.ts'
import type { AiMemoryMode, HybridIntentEngine } from '../ai/hybridEngine.ts'
import { HybridIntentEngine as HybridIntentEngineClass } from '../ai/hybridEngine.ts'
import type { IntentEngine, IntentResult } from '../ai/intentEngine.ts'
import { assertLlmBaseUrl, normalizeLlmBase } from '../ai/llmClient.ts'
import { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { createEthySandbox } from '../evm/sandbox.ts'
import { activeHardfork, advertisedForkHash, chainConfigForNetwork } from '../net/chainHardfork.ts'
import { networkGenesisHash } from '../net/genesisStatus.ts'
import { NoticeBoard } from '../notify/board.ts'
import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import { EthyFlightRecorder } from '../persist/flightRecorder.ts'
import { PeerBookStore } from '../persist/peerBook.ts'
import { SnapPivotStore } from '../persist/snapStore.ts'
import { RpcBlockWindowStore } from '../rpc/blockWindowStore.ts'
import { dispatchRpcMethod } from '../rpc/methods.ts'
import type { JsonRpcError } from '../rpc/types.ts'
import { createSpine } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import { type EthyTxPool, createEthyTxPool } from '../txpool/pool.ts'

export interface CreateEthyNodeOptions {
  network: string
  chainId: bigint
  demo?: boolean
  headless?: boolean
  /** Wipe pivot journals; peer book is kept (WP-04a). */
  fresh?: boolean
  dataDir?: string
  /** Enable on-disk flight recorder logs in `networks/<net>/logs/` (default: `!demo && dataDir !== undefined`). */
  enableFlightRecorder?: boolean
  llmUrl?: string
  llmAllowRemote?: boolean
  aiMemory?: AiMemoryMode
  recordFixturePath?: string
}

export interface EthyNode {
  spine: EthySpine
  stateManager: FlatStateManager
  /** Network, fork, and runtime events for the lower-right notice box. */
  notices: NoticeBoard
  intentEngine: IntentEngine
  /** Present when `--llm-url` is configured (WP-07c). */
  hybridEngine?: HybridIntentEngine
  llm?: { base: string; transport: LlmTransport }
  demo: boolean
  headless: boolean
  disconnectPeer?: (peerId: string) => void
  snapStore?: SnapPivotStore
  peerBook?: PeerBookStore
  flightRecorder?: EthyFlightRecorder
  economy: ETHEconomyDataManager
  blockWindow: RpcBlockWindowStore
  createSandboxOverlay: () => FlatStateManager
  executeTool: (line: string) => Promise<IntentResult>
  rpc: {
    dispatch: (
      method: string,
      params: unknown[],
    ) => Promise<{ result?: unknown; error?: JsonRpcError }>
  }
  /** Wired when P2P coordinator or demo pool is attached (`main.ts`). */
  txPool?: EthyTxPool
  submitRawTransaction?: (hex: string) => Promise<{ result: string } | { error: JsonRpcError }>
}

export function createEthyNode(opts: CreateEthyNodeOptions): EthyNode {
  const spine = createSpine(opts.network, opts.chainId)
  const demo = opts.demo === true
  if (demo) spine.demoClock = true
  const dataDir = opts.dataDir ?? resolveEthyDataDir()
  const chain = chainConfigForNetwork(opts.network)
  const hardfork = activeHardfork(chain)
  const snapStore = SnapPivotStore.open({
    dataDir,
    network: opts.network,
    chainId: opts.chainId,
    genesisHash: networkGenesisHash(opts.network),
    enabled: !demo,
  })
  const common = new Common({
    chain,
    hardfork,
    customCrypto: { keccak256: ethyKeccak256 },
  })
  const stateManager = createFlatStateManager(
    demo
      ? { common }
      : {
          common,
          maxResidentAccounts: 500_000,
          coldAccountLookup: (accountHash) => snapStore.lookupBinaryAccountByHash(accountHash),
          coldCodeLookup: (codeHash) => snapStore.lookupCodeByHash(codeHash),
          coldStorageLookup: (accountHash, slotHash) =>
            snapStore.lookupStorageByHash(accountHash, slotHash),
        },
  )
  const peerBook = PeerBookStore.open({
    dataDir,
    network: opts.network,
    expectedForkHash: advertisedForkHash(chain, hardfork),
    enabled: !demo,
  })
  if (opts.fresh === true && !demo) {
    snapStore.discardPivots()
  }
  const recorderEnabled = opts.enableFlightRecorder ?? (!demo && opts.dataDir !== undefined)
  const flightRecorder = new EthyFlightRecorder({
    dataDir,
    network: opts.network,
    spine,
    enabled: recorderEnabled,
  })
  if (recorderEnabled) {
    spine.logsDirPath = flightRecorder.paths.logsDir
    spine.onDiagnosticRecorded = (entry) => flightRecorder.recordDiagnostic(entry)
    flightRecorder.start()
  }
  const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager })
  const blockWindow = new RpcBlockWindowStore(chain, hardfork)
  const sandbox = createEthySandbox({
    spine,
    stateManager,
    chain,
    hardfork,
    blockWindow,
  })

  let llm: EthyNode['llm']
  let hybridEngine: HybridIntentEngine | undefined
  let intentEngine: IntentEngine

  if (opts.llmUrl !== undefined && opts.llmUrl.length > 0) {
    const parsed = assertLlmBaseUrl(opts.llmUrl, opts.llmAllowRemote === true)
    const base = normalizeLlmBase(parsed)
    let transport: LlmTransport = new FetchLlmTransport(base)
    const fixturePath = opts.recordFixturePath
    if (fixturePath !== undefined) {
      transport = new RecordingTransport(transport, (line) => {
        fs.appendFileSync(fixturePath, `${line}\n`)
      })
    }
    llm = { base, transport }
    hybridEngine = new HybridIntentEngineClass({
      stateManager,
      snapStore,
      transport,
      llmBase: base,
      memoryMode: opts.aiMemory ?? 'ephemeral',
      economy,
      chain,
      sandbox,
    })
    intentEngine = hybridEngine
  } else {
    hybridEngine = new HybridIntentEngineClass({
      stateManager,
      snapStore,
      memoryMode: opts.aiMemory ?? 'ephemeral',
      economy,
      chain,
      sandbox,
    })
    intentEngine = hybridEngine
  }

  // Disk restore and resume policy run in `startPeerCoordinator` once a peer head is known.
  let submitRawTransaction: EthyNode['submitRawTransaction']
  let txPool: EthyTxPool | undefined
  if (demo) {
    txPool = createEthyTxPool({
      stateManager,
      chain,
      hardfork,
      chainId: opts.chainId,
      getEthPeerIds: () => [],
      sendEth: () => {},
    })
    submitRawTransaction = (hex) => txPool!.submitRawTransactionHex(hex)
    hybridEngine?.setSubmitRawTransaction((hex) =>
      txPool!
        .submitRawTransactionHex(hex)
        .then((out) => ('error' in out ? { error: { message: out.error.message } } : out)),
    )
  }

  const node: EthyNode = {
    spine,
    stateManager,
    notices: new NoticeBoard(),
    intentEngine,
    hybridEngine,
    llm,
    demo,
    headless: opts.headless === true,
    snapStore,
    peerBook,
    flightRecorder,
    economy,
    blockWindow,
    txPool,
    submitRawTransaction,
    createSandboxOverlay: () => stateManager.shallowCopy() as FlatStateManager,
    executeTool: (line) =>
      intentEngine.handle({
        text: line,
        spine,
        lastQuerySlot: spine.currentSlot,
      }),
    rpc: {
      dispatch: (method, params) =>
        dispatchRpcMethod(
          {
            spine,
            stateManager,
            chain,
            hardfork,
            demo,
            blockWindow,
            economy,
            sandbox,
            submitRawTransaction: (hex) =>
              node.submitRawTransaction !== undefined
                ? node.submitRawTransaction(hex)
                : Promise.resolve({
                    error: { code: -32000, message: 'Transaction pool unavailable' },
                  }),
          },
          method,
          params,
        ),
    },
  }
  return node
}
