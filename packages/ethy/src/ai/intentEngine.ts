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
}

export interface IntentEngine {
  handle(req: IntentRequest): IntentResult
}
