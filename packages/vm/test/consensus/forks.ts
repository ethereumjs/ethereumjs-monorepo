/** Fork presets and name normalization for EST, legacy ethereum/tests, and Common. */

import { getReleaseSource, loadManifest } from './manifest.ts'

/** Forks in the default PR gate (`--forks recent`). Full EST matrix uses `runnableForks` in fixtures.json. */
export const RECENT_FORKS = ['Prague', 'Osaka', 'Amsterdam'] as const

/** Runnable EST fork ids for the pinned `tests` release (see fixtures.json `runnableForks`). */
export function loadAllEstForks(): readonly string[] {
  const source = loadManifest().sources.tests
  if (source?.kind !== 'release') {
    throw new Error('fixtures.json: missing tests release source')
  }
  const forks = source.runnableForks
  if (forks === undefined || forks.length === 0) {
    throw new Error('fixtures.json: tests release missing runnableForks')
  }
  return forks
}

/** @deprecated Prefer `loadAllEstForks()` — kept for imports that expect a module-level list. */
export const ALL_EST_FORKS: readonly string[] = loadAllEstForks()

/** Map fixture / CLI fork names to `@ethereumjs/common` hardfork ids. */
export function estForkToCommonHardfork(fork: string): string {
  const lower = fork.toLowerCase()
  if (lower === 'frontier') return 'chainstart'
  if (lower === 'constantinoplefix') return 'petersburg'
  if (lower === 'bogota') return 'hegota'
  if (lower === 'eip150' || lower === 'tangerinewhistle') return 'tangerineWhistle'
  if (lower === 'eip158' || lower === 'spuriousdragon') return 'spuriousDragon'
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

/** Pin check: manifest tag matches a release source (for tests). */
export function pinnedTestsReleaseTag(): string {
  return getReleaseSource('tests').tag
}
