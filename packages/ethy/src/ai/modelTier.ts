export type ModelTier = 'compact' | 'rich'

const RICH_PATTERN =
  /(?:^|[\s:/_-])(7b|8b|9b|12b|14b|20b|24b|27b|32b|70b|72b|llama-?3\.1-?70|llama-?3\.1-?8|mixtral|qwen2\.5-?72|qwen2\.5-?14)(?:$|[\s:/_-])/i

/** Infer prose depth from managed runner or Ollama model name. */
export function inferModelTier(modelName?: string): ModelTier {
  if (modelName === undefined || modelName.length === 0) return 'compact'
  if (RICH_PATTERN.test(modelName)) return 'rich'
  const lower = modelName.toLowerCase()
  if (
    lower.includes('2b') ||
    lower.includes('1.2b') ||
    lower.includes('0.8b') ||
    lower.includes('4b')
  ) {
    return 'compact'
  }
  return 'compact'
}

export function maxStoryTokens(tier: ModelTier): number {
  return tier === 'rich' ? 950 : 750
}

export function maxLoreCards(tier: ModelTier): number {
  return tier === 'rich' ? 2 : 1
}
