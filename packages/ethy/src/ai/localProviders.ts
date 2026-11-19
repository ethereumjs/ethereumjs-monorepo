export type DiscoveredLocalModel = {
  provider: 'ollama' | 'openai-compatible'
  baseUrl: string
  modelId: string
  label: string
}

const EMBED_SUBSTRINGS = ['nomic-embed', 'mxbai-embed', 'bge-', 'all-minilm']

const LOOPBACK_OLLAMA = 'http://127.0.0.1:11434'
const LOOPBACK_LM_STUDIO = 'http://127.0.0.1:1234'
const LOOPBACK_LLAMA_SERVER = 'http://127.0.0.1:8080'

const DISCOVERY_TIMEOUT_MS = 1_200

function isEmbeddingModel(name: string): boolean {
  const n = name.toLowerCase()
  return EMBED_SUBSTRINGS.some((s) => n.includes(s))
}

async function fetchWithTimeout(
  fetchFn: FetchFn,
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetchFn(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

type FetchFn = typeof fetch

export async function discoverOllamaModels(
  fetchFn: FetchFn = fetch,
  baseUrl = LOOPBACK_OLLAMA,
): Promise<DiscoveredLocalModel[]> {
  try {
    const res = await fetchWithTimeout(
      fetchFn,
      `${baseUrl}/api/tags`,
      { method: 'GET' },
      DISCOVERY_TIMEOUT_MS,
    )
    if (!res.ok) return []
    const json = (await res.json()) as {
      models?: Array<{ name?: string }>
    }
    const models = json.models ?? []
    const out: DiscoveredLocalModel[] = []
    for (const row of models) {
      const name = row.name
      if (name === undefined || name.length === 0) continue
      if (isEmbeddingModel(name)) continue
      out.push({
        provider: 'ollama',
        baseUrl,
        modelId: name,
        label: `ollama · ${name}`,
      })
    }
    return out
  } catch {
    return []
  }
}

export async function discoverOpenAiCompatibleModels(
  fetchFn: FetchFn = fetch,
  baseUrl: string,
  labelPrefix: string,
): Promise<DiscoveredLocalModel[]> {
  try {
    const res = await fetchWithTimeout(
      fetchFn,
      `${baseUrl}/v1/models`,
      { method: 'GET' },
      DISCOVERY_TIMEOUT_MS,
    )
    if (!res.ok) return []
    const json = (await res.json()) as { data?: Array<{ id?: string }> }
    const data = json.data ?? []
    const out: DiscoveredLocalModel[] = []
    for (const row of data) {
      const id = row.id
      if (id === undefined || id.length === 0) continue
      out.push({
        provider: 'openai-compatible',
        baseUrl,
        modelId: id,
        label: `${labelPrefix} · ${id}`,
      })
    }
    return out
  } catch {
    return []
  }
}

export async function discoverAllLocalModels(
  fetchFn: FetchFn = fetch,
): Promise<DiscoveredLocalModel[]> {
  const [ollama, lm, llama] = await Promise.all([
    discoverOllamaModels(fetchFn),
    discoverOpenAiCompatibleModels(fetchFn, LOOPBACK_LM_STUDIO, 'lm-studio'),
    discoverOpenAiCompatibleModels(fetchFn, LOOPBACK_LLAMA_SERVER, 'llama-server'),
  ])
  return [...ollama, ...lm, ...llama]
}

export function matchDiscoveredModel(
  models: DiscoveredLocalModel[],
  query: string,
): DiscoveredLocalModel | undefined {
  const q = query.toLowerCase()
  return models.find(
    (m) =>
      m.modelId.toLowerCase().includes(q) ||
      m.label.toLowerCase().includes(q) ||
      m.baseUrl.toLowerCase().includes(q),
  )
}

export const DEFAULT_OLLAMA_BASE = LOOPBACK_OLLAMA
