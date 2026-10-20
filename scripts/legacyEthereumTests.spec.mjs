import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it } from 'node:test'

import {
  defaultLegacyTestsCacheRoot,
  legacyTestsTreeRoot,
  loadLegacyTestsManifest,
  sliceCompleteMarker,
} from './legacyEthereumTests.mjs'

describe('legacyEthereumTests manifest', () => {
  it('pins afed83bf and defines transaction + blockchain slices', () => {
    const manifest = loadLegacyTestsManifest()
    assert.equal(manifest.commit, 'afed83bf2a097cba688a60246429f3a051fe03f6')
    assert.ok(manifest.slices.transaction?.sparsePaths.includes('TransactionTests'))
    assert.ok(manifest.slices.blockchain?.sparsePaths.includes('BlockchainTests'))
  })

  it('places trees under LEGACY_ETHEREUM_TESTS_CACHE', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-tests-'))
    const root = legacyTestsTreeRoot(tmp)
    assert.equal(root, path.join(tmp, 'afed83bf2a097cba688a60246429f3a051fe03f6'))
    assert.equal(
      sliceCompleteMarker(root, 'transaction'),
      path.join(root, '.complete-transaction'),
    )
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('default cache root lives under ethereumjs', () => {
    assert.match(defaultLegacyTestsCacheRoot(), /legacy-ethereum-tests/)
  })
})
