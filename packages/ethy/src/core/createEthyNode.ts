import { createFlatStateManager } from '@ethereumjs/statemanager'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { DeterministicIntentEngine } from '../ai/deterministicEngine.ts'
import type { IntentEngine } from '../ai/intentEngine.ts'
import { NoticeBoard } from '../notify/board.ts'
import { createSpine } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'

export interface CreateEthyNodeOptions {
  network: string
  chainId: bigint
  demo?: boolean
  headless?: boolean
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
}

export function createEthyNode(opts: CreateEthyNodeOptions): EthyNode {
  const spine = createSpine(opts.network, opts.chainId)
  const stateManager = createFlatStateManager()
  const node: EthyNode = {
    spine,
    stateManager,
    notices: new NoticeBoard(),
    intentEngine: new DeterministicIntentEngine({ stateManager }),
    demo: opts.demo === true,
    headless: opts.headless === true,
  }
  return node
}
