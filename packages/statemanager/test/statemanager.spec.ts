import { KECCAK256_RLP } from '@ethereumjs/util'
import * as tape from 'tape'

import { CacheType, DefaultStateManager } from '../src'

tape('StateManager -> General', (t) => {
  t.test('should instantiate', async (st) => {
    const sm = new DefaultStateManager()

    st.deepEqual(sm._trie.root(), KECCAK256_RLP, 'it has default root')
    const res = await sm.getStateRoot()
    st.deepEqual(res, KECCAK256_RLP, 'it has default root')
    st.end()
  })

  t.test('copy()', async (st) => {
    let sm = new DefaultStateManager({
      prefixCodeHashes: false,
    })

    let smCopy = sm.copy()
    st.equal(
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
    st.equal(
      (smCopy as any)._accountCacheSettings.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP account cache on copy()'
    )
    st.equal(
      (smCopy as any)._storageCacheSettings.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP storage cache on copy()'
    )
    st.end()
  })
})
