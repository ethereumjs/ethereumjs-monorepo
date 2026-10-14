import { describe, expect, it } from 'vitest'

import { cliForkToLegacyNetwork, estForkToCommonHardfork, forkMatchesFilter } from '../forks.ts'

describe('consensus forks', () => {
  it('maps EST names to Common hardforks', () => {
    expect(estForkToCommonHardfork('Frontier')).toBe('chainstart')
    expect(estForkToCommonHardfork('Bogota')).toBe('hegota')
    expect(estForkToCommonHardfork('ConstantinopleFix')).toBe('petersburg')
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
