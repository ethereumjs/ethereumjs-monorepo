import { describe, expect, it } from 'vitest'

import { parseRunnerArgv } from '../cli.ts'
import { formatRunBanner, summarizeCaseCounts } from '../progress.ts'
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

  it('banner rows share one width, including a long fork line', () => {
    const opts = parseRunnerArgv([
      '--source',
      'tests',
      '--fork',
      'Amsterdam',
      '--jobs',
      '4',
      '--shard',
      '1/4',
      '--rerun-failed',
      '/tmp/a-very-long-consensus-failure-report-path-that-must-not-push-the-border.json',
    ])
    const cases: ConsensusTestCase[] = [
      {
        id: 'a',
        fork: 'AmsterdamToBogotaAtTime15k',
        format: 'state_tests',
        filePath: '/f/a.json',
        data: {} as ConsensusTestCase['data'],
      },
    ]
    const banner = formatRunBanner(opts, summarizeCaseCounts(cases), '/cache/forks/Amsterdam')
    const boxLines = banner.split('\n').filter((line) => /^[╔║╠╟╚]/.test(line))
    expect(boxLines.length).toBeGreaterThan(6)
    expect(new Set(boxLines.map((line) => line.length)).size).toBe(1)
    for (const line of boxLines) {
      expect(
        line.endsWith('║') ||
          line.endsWith('╗') ||
          line.endsWith('╣') ||
          line.endsWith('╢') ||
          line.endsWith('╝'),
      ).toBe(true)
    }
  })

  it('parseRunnerArgv exposes shard for banner', () => {
    const opts = parseRunnerArgv(['--source', 'tests', '--forks', 'recent', '--shard', '1/4'])
    expect(opts.shard).toBe('1/4')
    expect(opts.forkPreset).toBe('recent')
  })
})
