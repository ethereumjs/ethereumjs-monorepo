export type SkipCategory = 'broken' | 'permanent' | 'slow' | 'unsupported'

export type SkipRule = {
  pattern: string
  category: SkipCategory
  reason?: string
}

const RULES: SkipRule[] = [
  { pattern: 'ForkStressTest', category: 'broken' },
  { pattern: 'ChainAtoChainB', category: 'broken' },
  {
    pattern: 'blockChainFrontierWithLargerTDvsHomesteadBlockchain2_FrontierToHomesteadAt5',
    category: 'broken',
  },
  {
    pattern: 'blockChainFrontierWithLargerTDvsHomesteadBlockchain_FrontierToHomesteadAt5',
    category: 'broken',
  },
  { pattern: 'HomesteadOverrideFrontier_FrontierToHomesteadAt5', category: 'broken' },
  { pattern: 'filling_unexpectedException', category: 'broken' },
  { pattern: 'SuicidesMixingCoinbase', category: 'permanent' },
  { pattern: 'static_SuicidesMixingCoinbase', category: 'permanent' },
  { pattern: 'ForkUncle', category: 'permanent' },
  { pattern: 'UncleFromSideChain', category: 'permanent' },
  { pattern: 'Call50000_sha256', category: 'slow' },
  { pattern: 'CALLBlake2f_MaxRounds', category: 'slow' },
  { pattern: 'Return50000', category: 'slow' },
  { pattern: 'Return50000_2', category: 'slow' },
  { pattern: 'static_Call50000_sha256', category: 'slow' },
  { pattern: 'loopMul', category: 'slow' },
  { pattern: 'loopExp', category: 'slow' },
  { pattern: 'BPO1ToBPO2AtTime15k', category: 'unsupported', reason: 'transition BPO not wired' },
  { pattern: 'BPO2ToBPO3AtTime15k', category: 'unsupported', reason: 'transition BPO not wired' },
  { pattern: 'BPO3ToBPO4AtTime15k', category: 'unsupported', reason: 'transition BPO not wired' },
  {
    pattern: 'test_system_contract_errors',
    category: 'unsupported',
    reason: 'EIP-7251 consolidation system-call block rejection not wired in VM yet',
  },
]

function matchesPattern(id: string, pattern: string): boolean {
  if (pattern.includes('*')) {
    const re = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`)
    return re.test(id)
  }
  return id.includes(pattern)
}

export function shouldSkipTest(
  id: string,
  fork: string,
  options: {
    skipCategories: Set<SkipCategory>
    runOnlyCategories: Set<SkipCategory>
  },
): boolean {
  for (const rule of RULES) {
    if (!matchesPattern(id, rule.pattern) && !matchesPattern(fork, rule.pattern)) continue
    if (options.runOnlyCategories.size > 0) {
      return !options.runOnlyCategories.has(rule.category)
    }
    if (options.skipCategories.has(rule.category)) return true
  }
  return false
}

export function parseSkipCategories(raw: string | undefined): Set<SkipCategory> {
  const set = new Set<SkipCategory>()
  if (raw === undefined || raw.length === 0) return set
  for (const part of raw.split(',')) {
    const p = part.trim().toLowerCase()
    if (p === 'none') continue
    if (p === 'all') {
      set.add('broken')
      set.add('permanent')
      set.add('slow')
      set.add('unsupported')
      continue
    }
    if (p === 'broken' || p === 'permanent' || p === 'slow' || p === 'unsupported') {
      set.add(p)
    }
  }
  return set
}

export function defaultSkipCategories(): Set<SkipCategory> {
  return new Set(['broken', 'permanent', 'slow', 'unsupported'])
}
