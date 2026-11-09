export type LlmCompletionKind = 'pulse' | 'intent'

const PULSE_TIMEOUT_MS = 8_000
const INTENT_TIMEOUT_MS = 12_000
const HEALTH_TIMEOUT_MS = 1_500

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]'])

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

export async function probeLlmHealth(base: string, signal?: AbortSignal): Promise<boolean> {
  try {
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

export async function postChatCompletion(
  base: string,
  kind: LlmCompletionKind,
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  const timeout = kind === 'pulse' ? PULSE_TIMEOUT_MS : INTENT_TIMEOUT_MS
  const res = await fetchWithTimeout(
    `${base}/v1/chat/completions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: kind === 'pulse' ? 0.35 : 0.1,
        max_tokens: kind === 'pulse' ? 120 : 600,
        response_format: { type: 'json_object' },
      }),
    },
    timeout,
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

/** Strip optional markdown fences and parse JSON object from model output. */
export function parseLlmJSONObject(raw: string): Record<string, unknown> {
  let text = raw.trim()
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
