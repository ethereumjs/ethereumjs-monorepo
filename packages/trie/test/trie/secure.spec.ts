import { createHash } from 'crypto'
import { isTruthy } from '@ethereumjs/util'
import * as tape from 'tape'

import { LevelDB, ROOT_DB_KEY, SecureTrie } from '../../src'

tape('SecureTrie', function (t) {
  const trie = new SecureTrie({ db: new LevelDB() })
  const k = Buffer.from('foo')
  const v = Buffer.from('bar')

  t.test('put and get value', async function (st) {
    await trie.put(k, v)
    const res = await trie.get(k)
    st.ok(v.equals(res!))
    st.end()
  })

  t.test('copy trie', async function (st) {
    const t = trie.copy()
    const res = await t.get(k)
    st.ok(v.equals(res!))
    st.end()
  })

  tape('SecureTrie proof', function (t) {
    t.test('create a merkle proof and verify it with a single short key', async function (st) {
      const trie = new SecureTrie({ db: new LevelDB() })
      await trie.put(Buffer.from('key1aa'), Buffer.from('01234'))

      const proof = await trie.createProof(Buffer.from('key1aa'))
      const val = await trie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
      st.equal(val!.toString('utf8'), '01234')
      st.end()
    })
  })

  tape('secure tests', function (it) {
    let trie = new SecureTrie({ db: new LevelDB() })
    const jsonTests = require('../fixtures/trietest_secureTrie.json').tests

    it.test('empty values', async function (t) {
      for (const row of jsonTests.emptyValues.in) {
        const val = isTruthy(row[1]) ? Buffer.from(row[1]) : (null as unknown as Buffer)
        await trie.put(Buffer.from(row[0]), val)
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.emptyValues.root)
      t.end()
    })

    it.test('branchingTests', async function (t) {
      trie = new SecureTrie({ db: new LevelDB() })
      for (const row of jsonTests.branchingTests.in) {
        const val = isTruthy(row[1]) ? Buffer.from(row[1]) : (null as unknown as Buffer)
        await trie.put(Buffer.from(row[0]), val)
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.branchingTests.root)
      t.end()
    })

    it.test('jeff', async function (t) {
      for (const row of jsonTests.jeff.in) {
        let val = row[1]
        if (isTruthy(val)) {
          val = Buffer.from(row[1].slice(2), 'hex')
        }
        await trie.put(Buffer.from(row[0].slice(2), 'hex'), val)
      }
      t.equal('0x' + trie.root.toString('hex'), jsonTests.jeff.root.toString('hex'))
      t.end()
    })

    it.test('put fails if the key is the ROOT_DB_KEY', async function (st) {
      const trie = new SecureTrie({ db: new LevelDB() , persistRoot: true })

      try {
        await trie.put(ROOT_DB_KEY, Buffer.from('bar'))

        st.fail("Attempting to set '__root__' should fail but it did not.")
      } catch ({ message }) {
        st.equal(message, "Attempted to set '__root__' key but it is not allowed.")
      }
    })
  })
})

const trie = new SecureTrie({ db: new LevelDB() })
const a = Buffer.from(
  'f8448080a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
  'hex'
)
const ak = Buffer.from('095e7baea6a6c7c4c2dfeb977efac326af552d87', 'hex')
const b = Buffer.from(
  'f844802ea056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0db94dc4aab9b6a1a11956906ea34f3252f394576aece12199b23b269bb2738ab',
  'hex'
)
const bk = Buffer.from('945304eb96065b2a98b57a48a06ae28d285a71b5', 'hex')
const c = Buffer.from(
  'f84c80880de0b6b3a7640000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  'hex'
)
const ck = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
// checkpoint
// checkpoint
// commit
const d = Buffer.from(
  'f8488084535500b1a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
  'hex'
)
const dk = Buffer.from('095e7baea6a6c7c4c2dfeb977efac326af552d87', 'hex')
const e = Buffer.from(
  'f8478083010851a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0db94dc4aab9b6a1a11956906ea34f3252f394576aece12199b23b269bb2738ab',
  'hex'
)
const ek = Buffer.from('945304eb96065b2a98b57a48a06ae28d285a71b5', 'hex')
const f = Buffer.from(
  'f84c01880de0b6b3540df72ca056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  'hex'
)
const fk = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
// commit
const g = Buffer.from(
  'f8488084535500b1a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
  'hex'
)
const gk = Buffer.from('095e7baea6a6c7c4c2dfeb977efac326af552d87', 'hex')

tape('secure tests should not crash', async function (t) {
  await trie.put(ak, a)
  await trie.put(bk, b)
  await trie.put(ck, c)
  trie.checkpoint()
  trie.checkpoint()
  await trie.commit()
  await trie.put(dk, d)
  await trie.put(ek, e)
  await trie.put(fk, f)
  await trie.commit()
  await trie.put(gk, g)
  t.end()
})

tape('SecureTrie.copy', function (it) {
  it.test('created copy includes values added after checkpoint', async function (t) {
    const trie = new SecureTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('key1'), Buffer.from('value1'))
    trie.checkpoint()
    await trie.put(Buffer.from('key2'), Buffer.from('value2'))
    const trieCopy = trie.copy()
    const value = await trieCopy.get(Buffer.from('key2'))
    t.equal(value!.toString(), 'value2')
    t.end()
  })

  it.test('created copy includes values added before checkpoint', async function (t) {
    const trie = new SecureTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('key1'), Buffer.from('value1'))
    trie.checkpoint()
    await trie.put(Buffer.from('key2'), Buffer.from('value2'))
    const trieCopy = trie.copy()
    const value = await trieCopy.get(Buffer.from('key1'))
    t.equal(value!.toString(), 'value1')
    t.end()
  })

  it.test('created copy uses the correct hash function', async function (t) {
    const trie = new SecureTrie({
      db: new LevelDB(),
      hash: (value) => createHash('sha256').update(value).digest(),
    })

    await trie.put(Buffer.from('key1'), Buffer.from('value1'))
    trie.checkpoint()
    await trie.put(Buffer.from('key2'), Buffer.from('value2'))
    const trieCopy = trie.copy()
    const value = await trieCopy.get(Buffer.from('key1'))
    t.equal(value!.toString(), 'value1')
    t.end()
  })
})
