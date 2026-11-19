/**
 * Managed default model seam (WP-10d ships weights; WP-10a defines the contract only).
 */
export type ManagedModelSpec = {
  id: string
  displayName: string
  downloadHint: string
  /** Substrings to match installed Ollama model names for interim bridge. */
  ollamaFamilyHints: string[]
}

export const DEFAULT_MANAGED_MODEL_SPEC: ManagedModelSpec = {
  id: 'ethy-default-v1',
  displayName: 'Ethy default (local)',
  downloadHint: 'Embedded runner ships in WP-10d (~400 MB–1 GB)',
  ollamaFamilyHints: ['qwen3', 'gemma3', 'gemma-3'],
}

export interface ManagedModelProvider {
  readonly spec: ManagedModelSpec
  /** `ready` when a local runner can serve chat; until WP-10d this stays false without a bridge. */
  status(): 'unavailable' | 'warming' | 'ready'
}

export class PlaceholderManagedModelProvider implements ManagedModelProvider {
  readonly spec = DEFAULT_MANAGED_MODEL_SPEC

  status(): 'unavailable' | 'warming' | 'ready' {
    return 'unavailable'
  }
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
