/** Shapes from execution-specs release `fixtures/.meta/index.json`. */

export type IndexTestCase = {
  id: string
  fixture_hash: string
  fork: string
  format: string
  json_path: string
  pre_hash?: string | null
}

export type FixturesIndex = {
  root_hash?: string
  created_at?: string
  test_count?: number
  forks?: string[]
  fixture_formats?: string[]
  test_cases: IndexTestCase[]
}

/** Formats the VM consensus runner executes (maps to on-disk `state_tests` / `blockchain_tests`). */
export const RUNNABLE_INDEX_FORMATS = new Set(['state_test', 'blockchain_test'])

export function parseFixturesIndex(raw: string): FixturesIndex {
  const parsed = JSON.parse(raw) as FixturesIndex
  if (!Array.isArray(parsed.test_cases)) {
    throw new Error('Invalid fixtures index: missing test_cases array')
  }
  return parsed
}

export function filterIndexCases(index: FixturesIndex, forks: Set<string>): IndexTestCase[] {
  return index.test_cases.filter(
    (row) => forks.has(row.fork) && RUNNABLE_INDEX_FORMATS.has(row.format),
  )
}

export function tarMembersForCases(cases: IndexTestCase[]): string[] {
  const members = new Set<string>()
  for (const row of cases) {
    members.add(`fixtures/${row.json_path}`)
  }
  members.add('fixtures/.meta/index.json')
  return [...members].sort()
}

export function buildFilteredIndex(index: FixturesIndex, cases: IndexTestCase[]): FixturesIndex {
  const forks = [...new Set(cases.map((c) => c.fork))].sort()
  return {
    ...index,
    test_count: cases.length,
    forks,
    test_cases: cases,
  }
}
