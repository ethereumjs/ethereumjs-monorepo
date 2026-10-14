import { describe, expect, it } from 'vitest'

import {
  buildFilteredIndex,
  filterIndexCases,
  parseFixturesIndex,
  tarMembersForCases,
} from '../indexMeta.ts'

const SAMPLE_INDEX = {
  test_count: 3,
  forks: ['Paris', 'Bogota'],
  test_cases: [
    {
      id: 'a',
      fixture_hash: '0x01',
      fork: 'Paris',
      format: 'state_test',
      json_path: 'state_tests/for_paris/a.json',
    },
    {
      id: 'b',
      fixture_hash: '0x02',
      fork: 'Bogota',
      format: 'blockchain_test',
      json_path: 'blockchain_tests/for_bogota/b.json',
    },
    {
      id: 'c',
      fixture_hash: '0x03',
      fork: 'Bogota',
      format: 'transaction_test',
      json_path: 'transaction_tests/for_bogota/c.json',
    },
  ],
}

describe('fixtures index meta', () => {
  it('filters runnable cases by fork', () => {
    const index = parseFixturesIndex(JSON.stringify(SAMPLE_INDEX))
    const cases = filterIndexCases(index, new Set(['Bogota']))
    expect(cases).toHaveLength(1)
    expect(cases[0]?.id).toBe('b')
  })

  it('builds tar member list', () => {
    const index = parseFixturesIndex(JSON.stringify(SAMPLE_INDEX))
    const cases = filterIndexCases(index, new Set(['Bogota', 'Paris']))
    const members = tarMembersForCases(cases)
    expect(members).toContain('fixtures/state_tests/for_paris/a.json')
    expect(members).toContain('fixtures/blockchain_tests/for_bogota/b.json')
    expect(members).toContain('fixtures/.meta/index.json')
  })

  it('builds filtered index metadata', () => {
    const index = parseFixturesIndex(JSON.stringify(SAMPLE_INDEX))
    const cases = filterIndexCases(index, new Set(['Bogota']))
    const filtered = buildFilteredIndex(index, cases)
    expect(filtered.test_count).toBe(1)
    expect(filtered.forks).toEqual(['Bogota'])
  })
})
