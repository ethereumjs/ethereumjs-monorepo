/** Fork presets and name normalization for EST, legacy ethereum/tests, and Common. */

export const RECENT_FORKS = [
  'Prague',
  'Osaka',
  'BPO1',
  'BPO2',
  'BPO3',
  'BPO4',
  'BPO5',
  'OsakaToBPO1AtTime15k',
  'BPO4ToBPO5AtTime15k',
  'BPO5ToAmsterdamAtTime15k',
] as const

export const ALL_EST_FORKS = [
  'Frontier',
  'Homestead',
  'EIP150',
  'EIP158',
  'Byzantium',
  'Constantinople',
  'ConstantinopleFix',
  'Istanbul',
  'Berlin',
  'London',
  'Paris',
  'Shanghai',
  'Cancun',
  'Prague',
  'Osaka',
  'BPO1',
  'BPO2',
  'BPO3',
  'BPO4',
  'BPO5',
  'Amsterdam',
  'FrontierToHomesteadAt5',
  'HomesteadToDaoAt5',
  'HomesteadToEIP150At5',
  'EIP158ToByzantiumAt5',
  'ByzantiumToConstantinopleFixAt5',
  'BerlinToLondonAt5',
  'ShanghaiToCancunAtTime15k',
  'CancunToPragueAtTime15k',
  'PragueToOsakaAtTime15k',
  'OsakaToBPO1AtTime15k',
  'BPO1ToBPO2AtTime15k',
  'BPO2ToBPO3AtTime15k',
  'BPO3ToBPO4AtTime15k',
  'BPO4ToBPO5AtTime15k',
  'BPO5ToAmsterdamAtTime15k',
] as const

/** Map fixture / CLI fork names to `@ethereumjs/common` hardfork ids. */
export function estForkToCommonHardfork(fork: string): string {
  const lower = fork.toLowerCase()
  if (lower === 'frontier') return 'chainstart'
  if (lower === 'constantinoplefix') return 'petersburg'
  if (lower === 'bogota') return 'hegota'
  if (lower === 'eip150') return 'tangerineWhistle'
  if (lower === 'eip158') return 'spuriousDragon'
  if (lower === 'merge' || lower === 'paris') return 'paris'
  return lower
}

/** Legacy ethereum/tests network name for a CLI `--fork` value. */
export function cliForkToLegacyNetwork(fork: string): string {
  const indexOfPlus = fork.indexOf('+')
  const remainder = indexOfPlus !== -1 ? fork.substring(indexOfPlus) : ''
  if (/^chainstart$/i.test(fork)) return `Frontier${remainder}`
  if (/^tangerineWhistle$/i.test(fork)) return `EIP150${remainder}`
  if (/^spuriousDragon$/i.test(fork)) return `EIP158${remainder}`
  if (/^muirGlacier$/i.test(fork)) return `Istanbul${remainder}`
  if (/^petersburg$/i.test(fork)) return `ConstantinopleFix${remainder}`
  if (/^arrowGlacier$/i.test(fork)) return `London${remainder}`
  if (/^grayGlacier$/i.test(fork)) return `London${remainder}`
  return fork
}

export function forkMatchesFilter(fork: string, filter: Set<string> | undefined): boolean {
  if (filter === undefined || filter.size === 0) return true
  if (filter.has(fork)) return true
  const commonName = estForkToCommonHardfork(fork)
  for (const f of filter) {
    if (estForkToCommonHardfork(f) === commonName) return true
  }
  return false
}

export function parseForkPreset(
  value: string | undefined,
  explicitForks: string[],
): Set<string> | undefined {
  if (explicitForks.length > 0) {
    return new Set(
      explicitForks.flatMap((f) =>
        f
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    )
  }
  if (value === 'recent') return new Set([...RECENT_FORKS])
  if (value === 'all') return undefined
  return new Set([...RECENT_FORKS])
}

/** Directory segment for EST releases: `for_<fork>` (lowercase). */
export function estForkDirSegment(fork: string): string {
  return `for_${fork.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}`
}
