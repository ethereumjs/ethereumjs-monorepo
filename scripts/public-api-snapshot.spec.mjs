import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  PUBLIC_API_PACKAGES,
  collectPackageExportNames,
  readSnapshot,
} from './public-api-snapshot.mjs'

describe('public API export snapshots', () => {
  for (const packageDir of PUBLIC_API_PACKAGES) {
    it(`${packageDir} barrel matches config/public-api-snapshots/${packageDir}.json`, async () => {
      const expected = readSnapshot(packageDir)
      const actual = await collectPackageExportNames(packageDir)
      assert.deepEqual(
        actual,
        expected,
        `Public exports changed for @ethereumjs/${packageDir}. If intentional, regenerate with: node --import tsx/esm scripts/regenerate-public-api-snapshots.mjs`,
      )
    })
  }
})
