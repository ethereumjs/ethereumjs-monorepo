import { NDJSON_VERSION } from './constants.ts'
import { rlpInputToStructured } from './payloadCodec.ts'

import type { Input } from '@ethereumjs/rlp'

export type LabEventRecord = {
  v: number
  t: 'event' | 'log'
  node?: string
  dir?: 'in' | 'out'
  layer?: 'dpt' | 'rlpx' | 'eth' | 'snap'
  name?: string
  peer?: string
  payload?: unknown
  message?: string
}

export class EventBus {
  private listeners: Array<(ev: LabEventRecord) => void> = []
  private ndjsonEnabled = false

  setNdjson(enabled: boolean) {
    this.ndjsonEnabled = enabled
  }

  onEvent(listener: (ev: LabEventRecord) => void) {
    this.listeners.push(listener)
  }

  emit(partial: Omit<LabEventRecord, 'v' | 't'> & { t?: LabEventRecord['t'] }) {
    const ev: LabEventRecord = {
      v: NDJSON_VERSION,
      t: partial.t ?? 'event',
      ...partial,
    }
    for (const listener of this.listeners) {
      listener(ev)
    }
    if (this.ndjsonEnabled && ev.t === 'event') {
      process.stdout.write(`${JSON.stringify(ev)}\n`)
    }
  }

  log(message: string, node?: string) {
    const ev: LabEventRecord = { v: NDJSON_VERSION, t: 'log', message, node }
    for (const listener of this.listeners) {
      listener(ev)
    }
    if (this.ndjsonEnabled) {
      process.stderr.write(`${message}\n`)
    }
  }

  static payloadFromRlp(payload: Input): unknown {
    try {
      return rlpInputToStructured(payload)
    } catch {
      return undefined
    }
  }
}
