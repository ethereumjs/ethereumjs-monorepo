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
  /** Slash history should store this instead of re-running `/simulate` or `/send`. */
  frozenSlashWidget?: WidgetSpec
}

export interface IntentEngine {
  handle(req: IntentRequest): Promise<IntentResult>
  setDisconnectPeer?(fn: (peerId: string) => void): void
  setSubmitRawTransaction?(
    fn: (hex: string) => Promise<{ result: string } | { error: { message: string } }>,
  ): void
}
