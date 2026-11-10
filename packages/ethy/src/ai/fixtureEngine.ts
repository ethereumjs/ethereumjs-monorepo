import type { ChatMessage, LlmCompletionKind } from './llmClient.ts'
import { postChatCompletion } from './llmClient.ts'

export type LlmTransportRequest = {
  kind: LlmCompletionKind
  messages: ChatMessage[]
}

export interface LlmTransport {
  complete(req: LlmTransportRequest, signal?: AbortSignal): Promise<string>
}

export class FetchLlmTransport implements LlmTransport {
  private readonly base: string

  constructor(base: string) {
    this.base = base
  }

  async complete(req: LlmTransportRequest, signal?: AbortSignal): Promise<string> {
    return postChatCompletion(this.base, req.kind, req.messages, signal)
  }
}

export class FixtureReplayTransport implements LlmTransport {
  private index = 0
  private readonly canned: string[]

  constructor(canned: string[]) {
    this.canned = canned
  }

  async complete(_req: LlmTransportRequest, _signal?: AbortSignal): Promise<string> {
    const line = this.canned[this.index]
    if (line === undefined) {
      throw new Error('FixtureReplayTransport exhausted')
    }
    this.index += 1
    return line
  }
}

export class RecordingTransport implements LlmTransport {
  readonly lines: string[] = []
  private readonly inner: LlmTransport
  private readonly append?: (line: string) => void

  constructor(inner: LlmTransport, append?: (line: string) => void) {
    this.inner = inner
    this.append = append
  }

  async complete(req: LlmTransportRequest, signal?: AbortSignal): Promise<string> {
    const text = await innerComplete(this.inner, req, signal)
    const record = JSON.stringify({ kind: req.kind, messages: req.messages, response: text })
    this.lines.push(record)
    this.append?.(record)
    return text
  }
}

async function innerComplete(
  inner: LlmTransport,
  req: LlmTransportRequest,
  signal?: AbortSignal,
): Promise<string> {
  return inner.complete(req, signal)
}
