const promisify = require('util.promisify')
const tape = require('tape')
const Trie = require('merkle-patricia-tree/secure.js')
const Account = require('ethereumjs-account').default
const Cache = require('../../../dist/state/cache').default
const utils = require('../utils')

tape('cache initialization', (t) => {
  t.test('should initialize', async (st) => {
    const trie = new Trie()
    const c = new Cache(trie)
    st.ok(trie.root.equals(c._trie.root), 'initializes given trie')
    st.end()
  })
})

tape('cache put and get account', (t) => {
  const trie = new Trie()
  const c = new Cache(trie)
  const flushP = promisify(c.flush.bind(c))
  const trieGetP = promisify(trie.get.bind(trie))

  const addr = Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex')
  const acc = utils.createAccount('0x00', '0xff11')

  t.test('should fail to get non-existent account', async (st) => {
    const res = c.get(addr)
    st.notOk(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should put account', async (st) => {
    c.put(addr, acc)
    const res = c.get(addr)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should not have flushed to trie', async (st) => {
    const res = await trieGetP(addr)
    st.notOk(res)
    st.end()
  })

  t.test('should flush to trie', async (st) => {
    await flushP()
    st.end()
  })

  t.test('trie should contain flushed account', async (st) => {
    const raw = await trieGetP(addr)
    const res = new Account(raw)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should delete account from cache', async (st) => {
    c.del(addr)

    const res = c.get(addr)
    st.notOk(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should warm cache and load account from trie', async (st) => {
    await promisify(c.warm.bind(c))([addr])

    const res = c.get(addr)
    st.ok(res.balance.equals(acc.balance))
    st.end()
  })

  t.test('should update loaded account and flush it', async (st) => {
    const updatedAcc = utils.createAccount('0x00', '0xff00')
    c.put(addr, updatedAcc)
    await flushP()

    const raw = await trieGetP(addr)
    const res = new Account(raw)
    st.ok(res.balance.equals(updatedAcc.balance))
    st.end()
  })
})

tape('cache checkpointing', (t) => {
  const trie = new Trie()
  const c = new Cache(trie)

  const addr = Buffer.from('cd2a3d9f938e13cd947ec05abc7fe734df8dd826', 'hex')
  const acc = utils.createAccount('0x00', '0xff11')
  const updatedAcc = utils.createAccount('0x00', '0xff00')

  t.test('should revert to correct state', async (st) => {
    c.put(addr, acc)
    c.checkpoint()
    c.put(addr, updatedAcc)

    let res = c.get(addr)
    st.ok(res.balance.equals(updatedAcc.balance))

    c.revert()

    res = c.get(addr)
    st.ok(res.balance.equals(acc.balance))

    st.end()
  })
})
