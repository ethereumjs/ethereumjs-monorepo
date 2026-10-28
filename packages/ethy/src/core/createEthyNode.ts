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
  /** Network, fork, and runtime events for the lower-right notice box. */
  notices: NoticeBoard
  intentEngine: IntentEngine
  demo: boolean
  headless: boolean
}

export function createEthyNode(opts: CreateEthyNodeOptions): EthyNode {
  const spine = createSpine(opts.network, opts.chainId)
  const intentEngine = new DeterministicIntentEngine()
  return {
    spine,
    notices: new NoticeBoard(),
    intentEngine,
    demo: opts.demo === true,
    headless: opts.headless === true,
  }
}
