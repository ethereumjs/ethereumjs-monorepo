import { describe, expect, it } from 'vitest'

import { ensNameHash } from '../src/contracts/identityResolver.ts'
import { knownContractName } from '../src/contracts/knownContracts.ts'

describe('knownContracts', () => {
  it('resolves ENS registry on mainnet', () => {
    expect(knownContractName(1n, '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')).toBe('ENS Registry')
  })
})

describe('identityResolver ensNameHash', () => {
  it('empty name is zero node', () => {
    const z = ensNameHash('')
    expect([...z].every((b) => b === 0)).toBe(true)
  })
})
