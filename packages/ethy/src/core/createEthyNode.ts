import { createFlatStateManager } from '@ethereumjs/statemanager'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { DeterministicIntentEngine } from '../ai/deterministicEngine.ts'
import type { IntentEngine } from '../ai/intentEngine.ts'
import { networkGenesisHash } from '../net/genesisStatus.ts'
import { NoticeBoard } from '../notify/board.ts'
import { resolveEthyDataDir } from '../persist/datadir.ts'
import { SnapPivotStore } from '../persist/snapStore.ts'
import { createSpine, setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'

export interface CreateEthyNodeOptions {
  network: string
  chainId: bigint
  demo?: boolean
  headless?: boolean
  dataDir?: string
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
}

export function createEthyNode(opts: CreateEthyNodeOptions): EthyNode {
  const spine = createSpine(opts.network, opts.chainId)
  const stateManager = createFlatStateManager()
  const demo = opts.demo === true
  const snapStore = SnapPivotStore.open({
    dataDir: opts.dataDir ?? resolveEthyDataDir(),
    network: opts.network,
    chainId: opts.chainId,
    genesisHash: networkGenesisHash(opts.network),
    enabled: !demo,
  })
  const restored = snapStore.loadInto(spine, stateManager)
  if (restored > 0) {
    setPhase(spine, 'SNAP_SYNCING')
    recordDiagnostic(spine, {
      subsystem: 'snap',
      severity: 'info',
      message: `Restored ${restored.toLocaleString('en-US')} accounts from disk`,
    })
  }
  const node: EthyNode = {
    spine,
    stateManager,
    notices: new NoticeBoard(),
    intentEngine: new DeterministicIntentEngine({ stateManager }),
    demo,
    headless: opts.headless === true,
    snapStore,
  }
  return node
}
