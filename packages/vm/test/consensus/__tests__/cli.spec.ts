import { describe, expect, it } from 'vitest'

import { parseRunnerArgv } from '../cli.ts'

describe('consensus cli', () => {
  it('parses source and fork preset', () => {
    const opts = parseRunnerArgv(['--source', 'tests', '--forks', 'recent', '--format', 'state'])
    expect(opts.source).toBe('tests')
    expect(opts.format).toBe('state_tests')
    expect(opts.forkPreset).toBe('recent')
  })

  it('parses shard and jobs', () => {
    const opts = parseRunnerArgv(['--shard', '1/4', '--jobs', '2'])
    expect(opts.shard).toBe('1/4')
    expect(opts.jobs).toBe(2)
  })

  it('does not enable auto-fetch by default', () => {
    const opts = parseRunnerArgv(['--source', 'tests'])
    expect(opts.autoFetch).toBe(false)
    expect(opts.skipFetch).toBe(false)
  })
})
