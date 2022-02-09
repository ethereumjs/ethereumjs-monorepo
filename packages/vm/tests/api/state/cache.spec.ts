import tape from 'tape'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { Account, Address, BN } from 'ethereumjs-util'
import Cache, { getCb, putCb } from '../../../src/state/cache'
import { createAccount } from '../utils'

tape('cache initialization', (t) => {
  t.test('should initialize', async (st) => {
    const trie = new Trie()
    const getCb: getCb = async (address) => {
      const innerTrie = trie
      const rlp = await innerTrie.get(address.buf)
      return rlp ? Account.fromRlpSerializedAccount(rlp) : undefined
    }
    const putCb: putCb = async (keyBuf, accountRlp) => {
      const innerTrie = trie
      await innerTrie.put(keyBuf, accountRlp)
    }
    const deleteCb = async (keyBuf: Buffer) => {
      const innerTrie = trie
      await innerTrie.del(keyBuf)
    }
    const cache = new Cache({ getCb, putCb, deleteCb })

    st.ok(cache._checkpoints.length === 0, 'initializes given trie')
    st.end()
  })
})

tape('cache put and get account', (t) => {
  const trie = new Trie()
  const getCb: getCb = async (address) => {
    const innerTrie = trie
    const rlp = await innerTrie.get(address.buf)
    return rlp ? Account.fromRlpSerializedAccount(rlp) : undefined
  }
  const putCb: putCb = async (keyBuf, accountRlp) => {
    const innerTrie = trie
    await innerTrie.put(keyBuf, accountRlp)
  }
  const deleteCb = async (keyBuf: Buffer) => {
    const innerTrie = trie
    await innerTrie.del(keyBuf)
  }
  const cache = new Cache({ getCb, putCb, deleteCb })

  const addr = new Address(Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex'))
  const acc = createAccount(new BN(0), new BN(0xff11))

  t.test('should fail to get non-existent account', async (st) => {
    const res = cache.get(addr)
    st.notOk(res.balance.eq(acc.balance))
    st.end()
  })

  t.test('should put account', async (st) => {
    cache.put(addr, acc)
    const res = cache.get(addr)
    st.ok(res.balance.eq(acc.balance))
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
    st.ok(res.balance.eq(acc.balance))
    st.end()
  })

  t.test('should delete account from cache', async (st) => {
    cache.del(addr)

    const res = cache.get(addr)
    st.notOk(res.balance.eq(acc.balance))
    st.end()
  })

  t.test('should update loaded account and flush it', async (st) => {
    const updatedAcc = createAccount(new BN(0), new BN(0xff00))
    cache.put(addr, updatedAcc)
    await cache.flush()

    const raw = await trie.get(addr.buf)
    const res = Account.fromRlpSerializedAccount(raw!)
    st.ok(res.balance.eq(updatedAcc.balance))
    st.end()
  })
})

tape('cache checkpointing', (t) => {
  const trie = new Trie()
  const getCb: getCb = async (address) => {
    const innerTrie = trie
    const rlp = await innerTrie.get(address.buf)
    return rlp ? Account.fromRlpSerializedAccount(rlp) : undefined
  }
  const putCb: putCb = async (keyBuf, accountRlp) => {
    const innerTrie = trie
    await innerTrie.put(keyBuf, accountRlp)
  }
  const deleteCb = async (keyBuf: Buffer) => {
    const innerTrie = trie
    await innerTrie.del(keyBuf)
  }
  const cache = new Cache({ getCb, putCb, deleteCb })

  const addr = new Address(Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex'))
  const acc = createAccount(new BN(0), new BN(0xff11))
  const updatedAcc = createAccount(new BN(0x00), new BN(0xff00))

  t.test('should revert to correct state', async (st) => {
    cache.put(addr, acc)
    cache.checkpoint()
    cache.put(addr, updatedAcc)

    let res = cache.get(addr)
    st.ok(res.balance.eq(updatedAcc.balance))

    cache.revert()

    res = cache.get(addr)
    st.ok(res.balance.eq(acc.balance))

    st.end()
  })
})
