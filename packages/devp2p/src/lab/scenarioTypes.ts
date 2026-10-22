import type { EthStatusFields } from './messages/eth.ts'
import type { ChainSpec } from './nodeFactory.ts'

export type ScenarioNode = {
  id: string
  basePort: number
  maxPeers?: number
  capabilities?: string[]
  common?: ChainSpec | ChainSpec[]
  dptOnly?: boolean
}

export type ScenarioStep =
  | { connect: { from: string; to: string } }
  | { wait: { node: string; event: string; timeoutMs?: number; eth?: string; from?: string } }
  | { expect: Record<string, unknown> }
  | {
      eth: {
        node: string
        peerIndex?: number
        send: string
        status?: EthStatusFields
        json?: Record<string, unknown>
        rlp?: unknown
      }
    }
  | { snap: { node: string; peerIndex?: number; send: string; rlp: unknown } }
  | { action: Record<string, unknown> }
  | { delay: { ms: number } }

export type ScenarioFile = {
  schema: number
  name: string
  nodes: ScenarioNode[]
  steps: ScenarioStep[]
}
