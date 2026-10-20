import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { loadEstFixtures } from '../fixtureLoader.ts'

const sampleRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../sample/fixtures')

describe('consensus sample fixtures', () => {
  it('loads smoke state tests from checked-in sample tree', () => {
    const cases = loadEstFixtures(sampleRoot, 'state_tests')
    expect(cases.length).toBeGreaterThan(0)
    expect(cases[0]?.fork).toBe('Osaka')
  })
})
