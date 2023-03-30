import { Trie } from '@ethereumjs/trie'
import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { Cache, CacheType } from '../src/cache'

import { createAccount } from './util'

import type { getCb, putCb } from '../src/cache'

tape('cache initialization', (t) => {
  t.test('should initialize', async (st) => {
    const trie = new Trie({ useKeyHashing: true })
    const getCb: getCb = async (address) => {
      const innerTrie = trie
      const res = await innerTrie.get(address.buf)
      if (res !== null) {
        return res
      }
    }
    const putCb: putCb = async (keyBuf, accountRlp) => {
      const innerTrie = trie
      await innerTrie.put(keyBuf, accountRlp)
    }
    const deleteCb = async (keyBuf: Buffer) => {
      const innerTrie = trie
      await innerTrie.del(keyBuf)
    }
    const cache = new Cache({ size: 100, type: CacheType.LRU, getCb, putCb, deleteCb })

    st.equal(cache._checkpoints, 0, 'initializes given trie')
    st.end()
  })
})

tape('cache put and get account', (t) => {
  const trie = new Trie({ useKeyHashing: true })
  const getCb: getCb = async (address) => {
    const innerTrie = trie
    const res = await innerTrie.get(address.buf)
    if (res !== null) {
      return res
    }
  }
  const putCb: putCb = async (keyBuf, accountRlp) => {
    const innerTrie = trie
    await innerTrie.put(keyBuf, accountRlp)
  }
  const deleteCb = async (keyBuf: Buffer) => {
    const innerTrie = trie
    await innerTrie.del(keyBuf)
  }
  const cache = new Cache({ size: 100, type: CacheType.LRU, getCb, putCb, deleteCb })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const acc: Account = createAccount(BigInt(1), BigInt(0xff11))
  const accRLP = acc.serialize()

  t.test(
    'should return undefined for CacheElement if account not present in the cache',
    async (st) => {
      const elem = cache.get(addr)
      st.ok(elem === undefined)
      st.end()
    }
  )

  t.test('should cache a non-trie account as undefined', async (st) => {
    await cache.getOrLoad(addr)
    const elem = cache.get(addr)

    st.ok(elem && elem.accountRLP === undefined)
    st.end()
  })

  t.test('should put account', async (st) => {
    cache.put(addr, acc)
    const elem = cache.get(addr)
    st.ok(elem && elem.accountRLP && elem.accountRLP.equals(accRLP))
    st.end()
  })

  t.test('should not have flushed to trie', async (st) => {
    const res = await trie.get(addr.buf)
    st.notOk(res)
    st.end()
  })

  t.test('should flush to trie', async (st) => {
    await cache.flush()
    st.end()
  })

  t.test('trie should contain flushed account', async (st) => {
    const raw = await trie.get(addr.buf)
    const res = Account.fromRlpSerializedAccount(raw!)
    st.equal(res.balance, acc.balance)
    st.end()
  })

  t.test('should delete account from cache', async (st) => {
    cache.del(addr)

    const elem = cache.get(addr)
    st.ok(elem && elem.accountRLP === undefined)
    st.end()
  })

  t.test('should update loaded account and flush it', async (st) => {
    const updatedAcc = createAccount(BigInt(0), BigInt(0xff00))
    cache.put(addr, updatedAcc)
    await cache.flush()

    const raw = await trie.get(addr.buf)
    const res = Account.fromRlpSerializedAccount(raw!)
    st.equal(res.balance, updatedAcc.balance)
    st.end()
  })
})

tape('cache checkpointing', (t) => {
  const trie = new Trie({ useKeyHashing: true })
  const getCb: getCb = async (address) => {
    const innerTrie = trie
    const res = await innerTrie.get(address.buf)
    if (res !== null) {
      return res
    }
  }
  const putCb: putCb = async (keyBuf, accountRlp) => {
    const innerTrie = trie
    await innerTrie.put(keyBuf, accountRlp)
  }
  const deleteCb = async (keyBuf: Buffer) => {
    const innerTrie = trie
    await innerTrie.del(keyBuf)
  }
  const cache = new Cache({ size: 100, type: CacheType.LRU, getCb, putCb, deleteCb })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const acc = createAccount(BigInt(1), BigInt(0xff11))
  const accRLP = acc.serialize()

  const updatedAcc = createAccount(BigInt(0x00), BigInt(0xff00))
  const updatedAccRLP = updatedAcc.serialize()

  t.test('should revert to correct state', async (st) => {
    cache.put(addr, acc)
    cache.checkpoint()
    cache.put(addr, updatedAcc)

    let elem = cache.get(addr)
    st.ok(elem && elem.accountRLP && elem.accountRLP.equals(updatedAccRLP))

    cache.revert()

    elem = cache.get(addr)
    st.ok(elem && elem.accountRLP && elem.accountRLP.equals(accRLP))

    st.end()
  })

  t.test('cache clearing', async (st) => {
    const cache = new Cache({ size: 100, type: CacheType.LRU, getCb, putCb, deleteCb })
    cache.put(addr, acc)
    cache.clear()
    st.equal(cache.size(), 0, 'should delete cache objects with clear=true')

    st.end()
  })
})
