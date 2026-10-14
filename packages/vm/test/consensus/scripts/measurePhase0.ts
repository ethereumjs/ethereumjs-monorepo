#!/usr/bin/env node
/**
 * Prints cache status and optional per-fork list counts when fixtures are present.
 */
import fs from 'node:fs'
import path from 'node:path'

import { loadManifest, extractedFixturesRoot, defaultCacheRoot } from '../manifest.ts'
import { parseRunnerArgv } from '../cli.ts'
import { selectTestCases } from '../select.ts'
import { printListCounts } from '../report.ts'

async function main() {
  const manifest = loadManifest()
  for (const [name, source] of Object.entries(manifest.sources)) {
    if (source.kind !== 'release') continue
    const root = extractedFixturesRoot(name, source.tag, defaultCacheRoot())
    const complete = fs.existsSync(path.join(root, 'state_tests'))
    process.stdout.write(`${name} @ ${source.tag}: ${complete ? 'cached' : 'missing'} → ${root}\n`)
  }

  const opts = parseRunnerArgv(['--source', 'tests', '--forks', 'recent', '--list', '--skip-fetch'])
  try {
    const { cases } = await selectTestCases(opts)
    printListCounts(cases)
  } catch (e) {
    process.stderr.write(`List skipped: ${(e as Error).message}\n`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
