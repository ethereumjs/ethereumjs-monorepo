import { describe, expect, it } from 'vitest'

import {
  cliForkToLegacyNetwork,
  estForkToCommonHardfork,
  forkMatchesFilter,
  loadAllEstForks,
  pinnedTestsReleaseTag,
} from '../forks.ts'

describe('consensus forks', () => {
  it('lists runnable forks from fixtures.json for the pinned release', () => {
    expect(pinnedTestsReleaseTag()).toBe('tests@v21.0.1')
    const forks = loadAllEstForks()
    expect(forks).toHaveLength(24)
    expect(forks).toContain('TangerineWhistle')
    expect(forks).toContain('ParisToShanghaiAtTime15k')
    expect(forks).toContain('BPO2ToAmsterdamAtTime15k')
    expect(forks).not.toContain('BerlinToLondonAt5')
    expect(forks).not.toContain('EIP150')
  })

  it('maps EST names to Common hardforks', () => {
    expect(estForkToCommonHardfork('Frontier')).toBe('chainstart')
    expect(estForkToCommonHardfork('Bogota')).toBe('hegota')
    expect(estForkToCommonHardfork('ConstantinopleFix')).toBe('petersburg')
    expect(estForkToCommonHardfork('TangerineWhistle')).toBe('tangerineWhistle')
    expect(estForkToCommonHardfork('SpuriousDragon')).toBe('spuriousDragon')
  })

  it('maps CLI forks to legacy network names', () => {
    expect(cliForkToLegacyNetwork('Chainstart')).toBe('Frontier')
    expect(cliForkToLegacyNetwork('Prague')).toBe('Prague')
  })

  it('fork filter accepts alias matches', () => {
    const filter = new Set(['Prague'])
    expect(forkMatchesFilter('prague', filter)).toBe(true)
  })
})
