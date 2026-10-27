import { DeterministicIntentEngine } from '../ai/deterministicEngine.ts'
import type { IntentEngine } from '../ai/intentEngine.ts'
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
  intentEngine: IntentEngine
  demo: boolean
  headless: boolean
}

export function createEthyNode(opts: CreateEthyNodeOptions): EthyNode {
  const spine = createSpine(opts.network, opts.chainId)
  const intentEngine = new DeterministicIntentEngine()
  return {
    spine,
    intentEngine,
    demo: opts.demo === true,
    headless: opts.headless === true,
  }
}
