import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { mergeFailureReports, readFailuresFromReportFile } from '../mergeReports.ts'

describe('mergeFailureReports', () => {
  const tmpDirs: string[] = []

  afterEach(() => {
    for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true })
  })

  function writeFixtureFile(name: string, body: unknown): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'est-merge-'))
    tmpDirs.push(dir)
    const file = path.join(dir, name)
    fs.writeFileSync(file, JSON.stringify(body))
    return file
  }

  it('merges failures and dedupes by fork/id/filePath', () => {
    const a = writeFixtureFile('a.json', {
      failures: [
        {
          fork: 'Osaka',
          id: 't1',
          filePath: '/x/a.json',
          format: 'state_tests',
          pass: false,
          relPath: 'a.json',
          durationMs: 1,
        },
      ],
    })
    const b = writeFixtureFile('b.json', {
      rootLabel: 'x',
      failed: 1,
      failures: [
        {
          fork: 'Osaka',
          id: 't1',
          filePath: '/x/a.json',
          format: 'state_tests',
          pass: false,
          relPath: 'a.json',
          durationMs: 1,
        },
        {
          fork: 'Amsterdam',
          id: 't2',
          filePath: '/x/b.json',
          format: 'blockchain_tests',
          pass: false,
          relPath: 'b.json',
          durationMs: 2,
        },
      ],
    })

    const merged = mergeFailureReports([a, b])
    expect(merged.failures).toHaveLength(2)
    expect(readFailuresFromReportFile(b)).toHaveLength(2)
  })
})
