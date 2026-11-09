import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export interface IntentRequest {
  text: string
  spine: EthySpine
  lastQuerySlot?: number
}

export interface IntentResult {
  widget: WidgetSpec
  stateHeader: string
  querySlot: number
  /** Short title for NL interaction chrome (WP-07c). */
  viewTitle?: string
  /** Optional note for AI Overview after NL query. */
  overviewNote?: string
}

export interface IntentEngine {
  handle(req: IntentRequest): Promise<IntentResult>
  setDisconnectPeer?(fn: (peerId: string) => void): void
}
