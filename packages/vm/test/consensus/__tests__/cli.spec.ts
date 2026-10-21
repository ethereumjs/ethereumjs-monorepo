import { describe, expect, it, vi } from 'vitest'

import { parseRunnerArgv, warnUnknownRunnerFlags } from '../cli.ts'

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

  it('maps --grep to --test', () => {
    const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    const opts = parseRunnerArgv(['--source', 'tests', '--grep', 'authorization_oog'])
    expect(opts.test).toBe('authorization_oog')
    expect(stderr).toHaveBeenCalledWith('consensus runner: --grep is an alias for --test\n')
    stderr.mockRestore()
  })

  it('warns on unknown long flags', () => {
    const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    warnUnknownRunnerFlags(['--fork', 'Amsterdam', '--typo-flag'])
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining('unknown option(s): --typo-flag'))
    stderr.mockRestore()
  })

  it('rejects unknown options under strict parsing', () => {
    expect(() => parseRunnerArgv(['--source', 'tests', '--typo-flag'])).toThrow(
      /consensus runner flags.*--test/,
    )
  })
})
