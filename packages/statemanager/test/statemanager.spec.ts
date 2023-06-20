import { KECCAK256_RLP } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CacheType, DefaultStateManager } from '../src/index.js'

describe('StateManager -> General', () => {
  it(`should instantiate`, async () => {
    const sm = new DefaultStateManager()

    assert.deepEqual(sm._trie.root(), KECCAK256_RLP, 'it has default root')
    const res = await sm.getStateRoot()
    assert.deepEqual(res, KECCAK256_RLP, 'it has default root')
  })

  it(`copy()`, async () => {
    let sm = new DefaultStateManager({
      prefixCodeHashes: false,
    })

    let smCopy = sm.copy()
    assert.equal(
      (smCopy as any)._prefixCodeHashes,
      (sm as any)._prefixCodeHashes,
      'should retain non-default values'
    )

    sm = new DefaultStateManager({
      accountCacheOpts: {
        type: CacheType.LRU,
      },
      storageCacheOpts: {
        type: CacheType.LRU,
      },
    })

    smCopy = sm.copy()
    assert.equal(
      (smCopy as any)._accountCacheSettings.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP account cache on copy()'
    )
    assert.equal(
      (smCopy as any)._storageCacheSettings.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP storage cache on copy()'
    )
  })
})
