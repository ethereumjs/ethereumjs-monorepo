import type { DiagnosticEvent, EthySpine } from './types.ts'

export const DIAGNOSTIC_RING_CAPACITY = 100

export function recordDiagnostic(
  spine: EthySpine,
  event: Omit<DiagnosticEvent, 'timestamp'> & { timestamp?: number },
): void {
  const entry: DiagnosticEvent = {
    timestamp: event.timestamp ?? Date.now(),
    subsystem: event.subsystem,
    severity: event.severity,
    peerId: event.peerId,
    bucketIndex: event.bucketIndex,
    message: event.message,
    rawPayloadHex: event.rawPayloadHex,
  }
  spine.diagnosticRingBuffer.push(entry)
  while (spine.diagnosticRingBuffer.length > DIAGNOSTIC_RING_CAPACITY) {
    spine.diagnosticRingBuffer.shift()
  }
}
