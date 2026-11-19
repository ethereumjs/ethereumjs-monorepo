/**
 * Managed default model catalog (WP-10d).
 */

const DEFAULT_URL =
  'https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf'

export type ManagedModelSpec = {
  id: string
  displayName: string
  filename: string
  downloadUrl: string
  expectedBytes: number
  minValidBytes: number
  sha256?: string
  downloadHint: string
  /** Substrings to match installed Ollama model names for interim bridge. */
  ollamaFamilyHints: string[]
}

export function resolveDefaultModelDownloadUrl(): string {
  const fromEnv = process.env.ETHY_DEFAULT_MODEL_URL
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv
  return DEFAULT_URL
}

export function resolveModelDownloadUrl(spec: ManagedModelSpec): string {
  const fromEnv = process.env.ETHY_DEFAULT_MODEL_URL
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv
  return spec.downloadUrl
}

export const DEFAULT_MANAGED_MODEL_SPEC: ManagedModelSpec = {
  id: 'qwen3.5-2b-q4_k_m',
  displayName: 'Qwen3.5-2B (~1.28 GB)',
  filename: 'Qwen3.5-2B-Q4_K_M.gguf',
  downloadUrl: DEFAULT_URL,
  expectedBytes: 1_280_835_840,
  minValidBytes: 100 * 1024 * 1024,
  downloadHint: 'Install llama.cpp (e.g. brew install llama.cpp) or run ollama pull qwen3.5:2b',
  ollamaFamilyHints: ['qwen3.5:2b', 'qwen3.5', 'qwen3:4b', 'qwen3'],
}

export function findOllamaBridgeModel(
  modelNames: string[],
  hints = DEFAULT_MANAGED_MODEL_SPEC.ollamaFamilyHints,
): string | undefined {
  const lower = modelNames.map((n) => n.toLowerCase())
  for (const hint of hints) {
    const hit = lower.find((n) => n.includes(hint.toLowerCase()))
    if (hit !== undefined) return modelNames[lower.indexOf(hit)]
  }
  return undefined
}
