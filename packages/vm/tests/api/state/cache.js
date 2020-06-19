const tape = require('tape')
const Trie = require('merkle-patricia-tree').SecureTrie
const Account = require('@ethereumjs/account').default
const Cache = require('../../../dist/state/cache').default
const utils = require('../utils')

tape('cache initialization', (t) => {
  t.test('should initialize', async (st) => {
    const trie = new Trie()
    const cache = new Cache(trie)
    st.ok(trie.root.equals(cache._trie.root), 'initializes given trie')
    st.end()
  })
})

tape('cache put and get account', (t) => {
  const trie = new Trie()
  const cache = new Cache(trie)

  const addr = Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex')
  const acc = utils.createAccount('0x00', '0xff11')

  t.test('should fail to get non-existent account', async (st) => {
    const res = cache.get(addr)
    st.notOk(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should put account', async (st) => {
    cache.put(addr, acc)
    const res = cache.get(addr)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should not have flushed to trie', async (st) => {
    const res = await trie.get(addr)
    st.notOk(res)
    st.end()
  })

  t.test('should flush to trie', async (st) => {
    await cache.flush()
    st.end()
  })

  t.test('trie should contain flushed account', async (st) => {
    const raw = await trie.get(addr)
    const res = new Account(raw)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should delete account from cache', async (st) => {
    cache.del(addr)

    const res = cache.get(addr)
    st.notOk(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should warm cache and load account from trie', async (st) => {
    await cache.warm([addr])

    const res = cache.get(addr)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should update loaded account and flush it', async (st) => {
    const updatedAcc = utils.createAccount('0x00', '0xff00')
    cache.put(addr, updatedAcc)
    await cache.flush()

    const raw = await trie.get(addr)
    const res = new Account(raw)
    st.ok(res.balance.equals(updatedAcc.balance))
    st.end()
  })
})

tape('cache checkpointing', (t) => {
  const trie = new Trie()
  const cache = new Cache(trie)

  const addr = Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex')
  const acc = utils.createAccount('0x00', '0xff11')
  const updatedAcc = utils.createAccount('0x00', '0xff00')

  t.test('should revert to correct state', async (st) => {
    cache.put(addr, acc)
    cache.checkpoint()
    cache.put(addr, updatedAcc)

    let res = cache.get(addr)
    st.ok(res.balance.equals(updatedAcc.balance))

    cache.revert()

    res = cache.get(addr)
    st.ok(res.balance.equals(acc.balance))

    st.end()
  })
})
