import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { ScenarioRunError, runScenarioPath } from '../../src/lab/scenarioRunner.ts'

const scenariosDir = join(import.meta.dirname, '../../scenarios')

function collectScenarioFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...collectScenarioFiles(full))
    } else if (entry.name.endsWith('.json')) {
      out.push(full)
    }
  }
  return out.sort()
}

const scenarioFiles = collectScenarioFiles(scenariosDir)

describe.sequential('[Devp2p/CLI]: scenarios', () => {
  it.each(scenarioFiles)(
    '%s',
    async (file) => {
      try {
        const result = await runScenarioPath(file)
        expect(result.ok).toBe(true)
      } catch (e) {
        if (e instanceof ScenarioRunError) {
          throw new Error(`${e.message}\n${e.transcript.join('\n')}`)
        }
        throw e
      }
    },
    60000,
  )
})
