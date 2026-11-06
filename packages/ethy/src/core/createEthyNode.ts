import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'

import type { FlatStateManager } from '@ethereumjs/statemanager'
import { ethyKeccak256 } from '../crypto/keccak.ts'

import { DeterministicIntentEngine } from '../ai/deterministicEngine.ts'
import type { IntentEngine } from '../ai/intentEngine.ts'
import { activeHardfork, advertisedForkHash, chainConfigForNetwork } from '../net/chainHardfork.ts'
import { networkGenesisHash } from '../net/genesisStatus.ts'
import { NoticeBoard } from '../notify/board.ts'
import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import { EthyFlightRecorder } from '../persist/flightRecorder.ts'
import { PeerBookStore } from '../persist/peerBook.ts'
import { SnapPivotStore } from '../persist/snapStore.ts'
import { createSpine } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'

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
}

export interface EthyNode {
  spine: EthySpine
  stateManager: FlatStateManager
  /** Network, fork, and runtime events for the lower-right notice box. */
  notices: NoticeBoard
  intentEngine: IntentEngine
  demo: boolean
  headless: boolean
  disconnectPeer?: (peerId: string) => void
  snapStore?: SnapPivotStore
  peerBook?: PeerBookStore
  flightRecorder?: EthyFlightRecorder
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
  // Disk restore and resume policy run in `startPeerCoordinator` once a peer head is known.
  const node: EthyNode = {
    spine,
    stateManager,
    notices: new NoticeBoard(),
    intentEngine: new DeterministicIntentEngine({ stateManager }),
    demo,
    headless: opts.headless === true,
    snapStore,
    peerBook,
    flightRecorder,
  }
  return node
}
