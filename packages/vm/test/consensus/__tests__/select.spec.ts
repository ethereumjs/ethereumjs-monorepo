import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { parseRunnerArgv } from '../cli.ts'
import { estFixturesCacheHint, resolveEstRoot } from '../select.ts'

describe('consensus select', () => {
  it('estFixturesCacheHint names fetch command', () => {
    expect(estFixturesCacheHint('tests')).toContain('fixtures:fetch')
    expect(estFixturesCacheHint('tests')).toContain('EST_FIXTURES_CACHE')
  })

  it('resolveEstRoot fails fast without cache when auto-fetch is off', async () => {
    const cacheRoot = path.join(os.tmpdir(), `est-fixtures-test-${process.pid}`)
    const prev = process.env.EST_FIXTURES_CACHE
    process.env.EST_FIXTURES_CACHE = cacheRoot
    try {
      if (fs.existsSync(cacheRoot)) fs.rmSync(cacheRoot, { recursive: true, force: true })
      const opts = parseRunnerArgv(['--source', 'tests', '--skip-fetch'])
      await expect(resolveEstRoot('tests', opts)).rejects.toThrow(/not cached/)
    } finally {
      if (prev === undefined) delete process.env.EST_FIXTURES_CACHE
      else process.env.EST_FIXTURES_CACHE = prev
      if (fs.existsSync(cacheRoot)) fs.rmSync(cacheRoot, { recursive: true, force: true })
    }
  })

  it('resolveEstRoot uses fixture-root without cache', async () => {
    const opts = parseRunnerArgv([
      '--fixture-root',
      'test/consensus/sample/fixtures',
      '--skip-fetch',
    ])
    const root = await resolveEstRoot('tests', opts)
    expect(root).toContain('sample/fixtures')
    expect(fs.existsSync(path.join(root, 'state_tests'))).toBe(true)
  })
})
