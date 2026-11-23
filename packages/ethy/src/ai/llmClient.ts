import type { LocalLlmProviderKind } from '../persist/userConfig.ts'
import type { ModelTier } from './modelTier.ts'
import { inferModelTier, maxStoryTokens } from './modelTier.ts'

export type LlmCompletionKind = 'pulse' | 'intent' | 'story'

export type LlmResponseMode = 'json' | 'text'

const PULSE_TIMEOUT_MS = 18_000
const INTENT_TIMEOUT_MS = 18_000
const STORY_TIMEOUT_MS = 28_000
const HEALTH_TIMEOUT_MS = 1_500

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1'])

export function defaultResponseMode(kind: LlmCompletionKind): LlmResponseMode {
  return kind === 'story' ? 'text' : 'json'
}

export function defaultMaxTokens(kind: LlmCompletionKind, tier: ModelTier = 'compact'): number {
  if (kind === 'pulse') return 256
  if (kind === 'intent') return 600
  return maxStoryTokens(tier)
}

export function defaultTemperature(kind: LlmCompletionKind): number {
  if (kind === 'pulse') return 0.15
  if (kind === 'intent') return 0.12
  return 0.72
}

export function defaultTimeoutMs(kind: LlmCompletionKind): number {
  if (kind === 'story') return STORY_TIMEOUT_MS
  if (kind === 'intent') return INTENT_TIMEOUT_MS
  return PULSE_TIMEOUT_MS
}

export type LlmRequestOverrides = {
  responseMode?: LlmResponseMode
  maxTokens?: number
  temperature?: number
  timeoutMs?: number
  modelTier?: ModelTier
}

export function resolveLlmRequest(
  kind: LlmCompletionKind,
  overrides?: LlmRequestOverrides,
): Required<Pick<LlmRequestOverrides, 'responseMode' | 'maxTokens' | 'temperature' | 'timeoutMs'>> {
  const tier = overrides?.modelTier ?? 'compact'
  return {
    responseMode: overrides?.responseMode ?? defaultResponseMode(kind),
    maxTokens: overrides?.maxTokens ?? defaultMaxTokens(kind, tier),
    temperature: overrides?.temperature ?? defaultTemperature(kind),
    timeoutMs: overrides?.timeoutMs ?? defaultTimeoutMs(kind),
  }
}

export type OllamaChatBody = Record<string, unknown>

/** Build Ollama `/api/chat` JSON body (unit-tested wire shape). */
export function buildOllamaChatBody(
  kind: LlmCompletionKind,
  messages: ChatMessage[],
  model: string,
  overrides?: LlmRequestOverrides,
): OllamaChatBody {
  const resolved = resolveLlmRequest(kind, overrides)
  const body: OllamaChatBody = {
    model,
    messages,
    stream: false,
    think: false,
    options: {
      num_predict: resolved.maxTokens,
      temperature: resolved.temperature,
    },
  }
  if (resolved.responseMode === 'json') {
    body.format = 'json'
  }
  return body
}

export type OpenAiChatBody = Record<string, unknown>

/** Build OpenAI-compatible chat body (unit-tested wire shape). */
export function buildOpenAiChatBody(
  kind: LlmCompletionKind,
  messages: ChatMessage[],
  model: string | undefined,
  overrides?: LlmRequestOverrides,
): OpenAiChatBody {
  const resolved = resolveLlmRequest(kind, overrides)
  const body: OpenAiChatBody = {
    messages,
    temperature: resolved.temperature,
    max_tokens: resolved.maxTokens,
  }
  if (model !== undefined) body.model = model
  if (resolved.responseMode === 'json') {
    body.response_format = { type: 'json_object' }
  }
  return body
}

export function assertLlmBaseUrl(baseUrl: string, allowRemote: boolean): URL {
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    throw new Error(`Invalid --llm-url: ${baseUrl}`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('--llm-url must be http or https')
  }
  if (!allowRemote && !LOOPBACK_HOSTS.has(url.hostname)) {
    throw new Error(
      `Refusing non-loopback LLM host ${url.hostname}. Pass --llm-allow-remote to override.`,
    )
  }
  return url
}

export function normalizeLlmBase(url: URL): string {
  const path = url.pathname.replace(/\/+$/, '').replace(/\/v1$/i, '')
  return `${url.origin}${path}`.replace(/\/$/, '')
}

export function isOllamaBase(base: string): boolean {
  try {
    const u = new URL(base)
    return u.port === '11434'
  } catch {
    return base.includes(':11434')
  }
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}

export async function probeLlmHealth(
  base: string,
  provider?: LocalLlmProviderKind,
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    if (provider === 'ollama' || (provider === undefined && isOllamaBase(base))) {
      const res = await fetchWithTimeout(
        `${base}/api/tags`,
        { method: 'GET' },
        HEALTH_TIMEOUT_MS,
        signal,
      )
      return res.ok
    }
    const res = await fetchWithTimeout(
      `${base}/v1/models`,
      { method: 'GET' },
      HEALTH_TIMEOUT_MS,
      signal,
    )
    return res.ok
  } catch {
    return false
  }
}

export type ChatMessage = { role: 'system' | 'user'; content: string }

export type PostChatOpts = {
  model?: string
  provider?: LocalLlmProviderKind
  overrides?: LlmRequestOverrides
}

async function postOllamaChat(
  base: string,
  kind: LlmCompletionKind,
  messages: ChatMessage[],
  model: string,
  signal?: AbortSignal,
  overrides?: LlmRequestOverrides,
): Promise<string> {
  const resolved = resolveLlmRequest(kind, overrides)
  const body = buildOllamaChatBody(kind, messages, model, overrides)
  const res = await fetchWithTimeout(
    `${base}/api/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    resolved.timeoutMs,
    signal,
  )
  if (!res.ok) {
    throw new Error(`LLM HTTP ${res.status}`)
  }
  const json = (await res.json()) as { message?: { content?: string } }
  const text = json.message?.content
  if (text === undefined || text.length === 0) {
    throw new Error('LLM returned empty content')
  }
  return text
}

export async function postChatCompletion(
  base: string,
  kind: LlmCompletionKind,
  messages: ChatMessage[],
  signal?: AbortSignal,
  opts?: PostChatOpts,
): Promise<string> {
  const provider = opts?.provider
  const model = opts?.model
  const overrides = opts?.overrides
  if (
    provider === 'ollama' ||
    (provider === undefined && isOllamaBase(base) && model !== undefined)
  ) {
    if (model === undefined) {
      throw new Error('Ollama requires a model name')
    }
    return postOllamaChat(base, kind, messages, model, signal, overrides)
  }

  const resolved = resolveLlmRequest(kind, overrides)
  const body = buildOpenAiChatBody(kind, messages, model, overrides)

  const res = await fetchWithTimeout(
    `${base}/v1/chat/completions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    resolved.timeoutMs,
    signal,
  )
  if (!res.ok) {
    throw new Error(`LLM HTTP ${res.status}`)
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = json.choices?.[0]?.message?.content
  if (text === undefined || text.length === 0) {
    throw new Error('LLM returned empty content')
  }
  return text
}

/** Remove optional reasoning blocks before JSON extraction. */
export function stripThinkingBlocks(raw: string): string {
  let text = raw.trim()
  const open = String.fromCharCode(60) + 'think' + String.fromCharCode(62)
  const close = String.fromCharCode(60) + '/' + 'think' + String.fromCharCode(62)
  if (text.toLowerCase().startsWith(open)) {
    const closeIdx = text.toLowerCase().indexOf(close)
    if (closeIdx >= 0) {
      text = text.slice(closeIdx + close.length).trim()
    } else {
      text = ''
    }
  }
  return text
}

/** Strip optional markdown fences and parse JSON object from model output. */
export function parseLlmJSONObject(raw: string): Record<string, unknown> {
  let text = stripThinkingBlocks(raw)
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(text)
  if (fence !== null) {
    text = fence[1]!.trim()
  } else {
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1)
    }
  }
  const parsed = JSON.parse(text) as unknown
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('LLM JSON must be an object')
  }
  return parsed as Record<string, unknown>
}
