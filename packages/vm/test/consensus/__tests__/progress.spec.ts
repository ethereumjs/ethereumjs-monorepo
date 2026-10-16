import { describe, expect, it } from 'vitest'

import { parseRunnerArgv } from '../cli.ts'
import { summarizeCaseCounts } from '../progress.ts'
import type { ConsensusTestCase } from '../types.ts'

describe('consensus progress', () => {
  it('summarizeCaseCounts groups by fork and format', () => {
    const cases: ConsensusTestCase[] = [
      {
        id: 'a',
        fork: 'Osaka',
        format: 'state_tests',
        filePath: '/f/a.json',
        data: {} as ConsensusTestCase['data'],
      },
      {
        id: 'b',
        fork: 'Osaka',
        format: 'blockchain_tests',
        filePath: '/f/b.json',
        data: {} as ConsensusTestCase['data'],
      },
    ]
    const s = summarizeCaseCounts(cases)
    expect(s.total).toBe(2)
    expect(s.fileCount).toBe(2)
    expect(s.byFork.Osaka).toBe(2)
    expect(s.byFormat.state_tests).toBe(1)
  })

  it('parseRunnerArgv exposes shard for banner', () => {
    const opts = parseRunnerArgv(['--source', 'tests', '--forks', 'recent', '--shard', '1/4'])
    expect(opts.shard).toBe('1/4')
    expect(opts.forkPreset).toBe('recent')
  })
})
