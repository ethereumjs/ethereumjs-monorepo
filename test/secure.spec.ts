import * as tape from 'tape'
import { SecureTrie } from '../dist'

tape('SecureTrie', function (t) {
  const trie = new SecureTrie()
  const k = Buffer.from('foo')
  const v = Buffer.from('bar')

  t.test('put and get value', async function (st) {
    await trie.put(k, v)
    const res = await trie.get(k)
    st.equal(v, res)
    st.end()
  })

  t.test('copy trie', async function (st) {
    const t = trie.copy()
    const res = await t.get(k)
    st.equal(v, res)
    st.end()
  })

  tape('SecureTrie proof', function (t) {
    t.test('create a merkle proof and verify it with a single short key', async function (st) {
      const trie = new SecureTrie()
      await trie.put(Buffer.from('key1aa'), Buffer.from('01234'))

      const proof = await SecureTrie.prove(trie, Buffer.from('key1aa'))
      const val = await SecureTrie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
      st.equal(val!.toString('utf8'), '01234')
      st.end()
    })
  })

  tape('secure tests', function (it) {
    let trie = new SecureTrie()
    const jsonTests = require('./fixtures/trietest_secureTrie.json').tests

    it.test('empty values', async function (t) {
      for (const row in jsonTests.emptyValues.in) {
        const val = row[1] ? Buffer.from(row[1]) : ((null as unknown) as Buffer)
        await trie.put(Buffer.from(row[0]), val)
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.emptyValues.root)
      t.end()
    })

    it.test('branchingTests', async function (t) {
      trie = new SecureTrie()
      for (const row in jsonTests.branchingTests.in) {
        const val = row[1] ? Buffer.from(row[1]) : ((null as unknown) as Buffer)
        await trie.put(Buffer.from(row[0]), val)
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.branchingTests.root)
      t.end()
    })

    it.test('jeff', async function (t) {
      for (const row in jsonTests.jeff.in) {
        let val
        if (row[1]) {
          val = Buffer.from(row[1].slice(2), 'hex')
          await trie.put(Buffer.from(row[0].slice(2), 'hex'), val)
        }
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.jeff.root.toString('hex'))
      t.end()
    })
  })
})
