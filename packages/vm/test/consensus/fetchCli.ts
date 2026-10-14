#!/usr/bin/env node
import { parseArgs } from 'node:util'

import { fetchAllReleaseSources, updateManifestEntry } from './fetchFixtures.ts'

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      update: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  })

  if (values.update === true) {
    const name = positionals[0]
    const tag = positionals[1]
    if (name === undefined || tag === undefined) {
      throw new Error('Usage: fetchCli.ts --update <sourceName> <tag>')
    }
    await updateManifestEntry(name, tag)
    return
  }

  const names = positionals.length > 0 ? positionals : undefined
  await fetchAllReleaseSources({ force: values.force === true, names })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
