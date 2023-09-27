import { Trie } from '@ethereumjs/trie'
import { Address, KECCAK256_RLP, bigIntToBytes, setLengthLeft, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CacheType, DefaultStateManager } from '../src/index.js'

describe('StateManager -> General', () => {
  it(`should instantiate`, async () => {
    const sm = new DefaultStateManager()

    assert.deepEqual(sm['_trie'].root(), KECCAK256_RLP, 'it has default root')
    const res = await sm.getStateRoot()
    assert.deepEqual(res, KECCAK256_RLP, 'it has default root')
  })

  it(`should clear contract storage`, async () => {
    const sm = new DefaultStateManager()

    const contractAddress = Address.fromString('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
    const contractCode = Uint8Array.from([0, 1, 2, 3])
    const storageKey = setLengthLeft(bigIntToBytes(2n), 32)
    const storedData = utf8ToBytes('abcd')

    await sm.putContractCode(contractAddress, contractCode)
    await sm.putContractStorage(contractAddress, storageKey, storedData)

    let storage = await sm.getContractStorage(contractAddress, storageKey)
    assert.equal(JSON.stringify(storage), JSON.stringify(storedData), 'contract storage updated')

    await sm.clearContractStorage(contractAddress)
    storage = await sm.getContractStorage(contractAddress, storageKey)
    assert.equal(
      JSON.stringify(storage),
      JSON.stringify(new Uint8Array()),
      'clears contract storage'
    )
  })

  it(`copy()`, async () => {
    const trie = new Trie({ cacheSize: 1000 })
    let sm = new DefaultStateManager({
      trie,
      prefixCodeHashes: false,
    })

    let smCopy = sm.shallowCopy()
    assert.equal(
      smCopy['_prefixCodeHashes'],
      sm['_prefixCodeHashes'],
      'should retain non-default values'
    )

    sm = new DefaultStateManager({
      trie,
      accountCacheOpts: {
        type: CacheType.LRU,
      },
      storageCacheOpts: {
        type: CacheType.LRU,
      },
    })

    smCopy = sm.shallowCopy()
    assert.equal(
      smCopy['_accountCacheSettings'].type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP account cache on copy()'
    )
    assert.equal(
      smCopy['_storageCacheSettings'].type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP storage cache on copy()'
    )
    assert.equal(smCopy['_trie']['_opts'].cacheSize, 0, 'should set trie cache size to 0')

    smCopy = sm.shallowCopy(false)
    assert.equal(
      smCopy['_accountCacheSettings'].type,
      CacheType.LRU,
      'should retain account cache type when deactivate cache downleveling'
    )
    assert.equal(
      smCopy['_storageCacheSettings'].type,
      CacheType.LRU,
      'should retain storage cache type when deactivate cache downleveling'
    )
    assert.equal(
      smCopy['_trie']['_opts'].cacheSize,
      1000,
      'should retain trie cache size when deactivate cache downleveling'
    )
  })
})
