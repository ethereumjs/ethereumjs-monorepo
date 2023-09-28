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
    let sm = new DefaultStateManager({
      prefixCodeHashes: false,
    })

    let smCopy = sm.shallowCopy()
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

    smCopy = sm.shallowCopy()
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
