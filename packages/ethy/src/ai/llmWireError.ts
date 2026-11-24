export type LlmErrorKind =
  | 'timeout'
  | 'http_error'
  | 'empty_content'
  | 'reasoning_only'
  | 'json_parse'
  | 'prose_parse'
  | 'aborted'
  | 'network'

export class LlmWireError extends Error {
  readonly errorKind: LlmErrorKind
  readonly httpStatus?: number
  readonly durationMs?: number

  constructor(
    errorKind: LlmErrorKind,
    message: string,
    opts?: { httpStatus?: number; durationMs?: number },
  ) {
    super(message)
    this.name = 'LlmWireError'
    this.errorKind = errorKind
    this.httpStatus = opts?.httpStatus
    this.durationMs = opts?.durationMs
  }
}

export function llmErrorKindFromUnknown(err: unknown, aborted: boolean): LlmErrorKind {
  if (aborted) return 'aborted'
  if (err instanceof LlmWireError) return err.errorKind
  if (err instanceof Error && err.name === 'AbortError') return 'timeout'
  if (err instanceof Error && err.message.includes('HTTP')) return 'http_error'
  if (err instanceof Error && err.message.includes('empty')) return 'empty_content'
  return 'network'
}
