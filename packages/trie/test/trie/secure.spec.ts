import {
  MapDB,
  bytesToHex,
  bytesToUtf8,
  equalsBytes,
  hexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { sha256 } from 'ethereum-cryptography/sha256.js'
import { assert, describe, it } from 'vitest'

import { ROOT_DB_KEY, Trie, createProof, verifyTrieProof } from '../../src/index.js'
import secureTrieTests from '../fixtures/trietest_secureTrie.json'

describe('SecureTrie', () => {
  const trie = new Trie({ useKeyHashing: true, db: new MapDB() })
  const k = utf8ToBytes('foo')
  const v = utf8ToBytes('bar')

  it('put and get value', async () => {
    await trie.put(k, v)
    const res = await trie.get(k)
    assert.ok(equalsBytes(v, res!))
  })

  it('copy trie', async () => {
    const t = trie.shallowCopy()
    const res = await t.get(k)
    assert.ok(equalsBytes(v, res!))
    assert.isUndefined(t['_opts']['keyPrefix'])
  })

  it('copy trie (new key prefix / default 0 size cache)', async () => {
    const keyPrefix = hexToBytes('0x1234')
    const t = trie.shallowCopy(true, { keyPrefix })
    assert.ok(equalsBytes(t['_opts']['keyPrefix'] as Uint8Array, keyPrefix))
    assert.equal(t['_opts']['cacheSize'] as number, 0)
    assert.equal(trie['_opts']['cacheSize'] as number, 0)
  })

  it('copy trie (new cache size)', async () => {
    const cacheSize = 1000
    const t = trie.shallowCopy(true, { cacheSize })
    assert.equal(t['_opts']['cacheSize'] as number, cacheSize)
    assert.equal(trie['_opts']['cacheSize'] as number, 0)
  })
})

describe('SecureTrie proof', () => {
  it('create a merkle proof and verify it with a single short key', async () => {
    const trie = new Trie({ useKeyHashing: true, db: new MapDB() })
    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))

    const proof = await createProof(trie, utf8ToBytes('key1aa'))
    const val = await verifyTrieProof(utf8ToBytes('key1aa'), proof, {
      useKeyHashing: true,
    })
    assert.deepEqual(val, utf8ToBytes('01234'))
  })

  it('read back data written with hashed key', async () => {
    const trie = new Trie({ useKeyHashing: true, db: new MapDB() })
    // skip key transformation if the key is already hashed like data recieved in snapsync
    await trie.put(keccak256(utf8ToBytes('key1aa')), utf8ToBytes('01234'), true)

    const val = await trie.get(utf8ToBytes('key1aa'))
    assert.equal(bytesToUtf8(val!), '01234')

    // check roots match if written in normal fashion
    const trie2 = new Trie({ useKeyHashing: true, db: new MapDB() })
    await trie2.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))
    assert.equal(bytesToUtf8(trie.root()), bytesToUtf8(trie2.root()))
  })
})

describe('secure tests', () => {
  let trie = new Trie({ useKeyHashing: true, db: new MapDB() })

  it('empty values', async () => {
    for (const row of secureTrieTests.tests.emptyValues.in) {
      const val =
        row[1] !== undefined && row[1] !== null
          ? utf8ToBytes(row[1])
          : (null as unknown as Uint8Array)
      await trie.put(utf8ToBytes(row[0]!), val)
    }
    assert.equal(bytesToHex(trie.root()), secureTrieTests.tests.emptyValues.root)
  })

  it('branchingTests', async () => {
    trie = new Trie({ useKeyHashing: true, db: new MapDB() })
    for (const row of secureTrieTests.tests.branchingTests.in) {
      const val =
        row[1] !== undefined && row[1] !== null
          ? utf8ToBytes(row[1])
          : (null as unknown as Uint8Array)
      await trie.put(utf8ToBytes(row[0]!), val)
    }
    assert.equal(bytesToHex(trie.root()), secureTrieTests.tests.branchingTests.root)
  })

  /**
  TODO: Fix this test
  it('jeff', async () => {
    for (const row of secureTrieTests.tests.jeff.in) {
      let val = row[1]
      if (val !== undefined && val !== null) {
        val = hexToBytes(row[1].slice(2))
      }
      await trie.put(hexToBytes(row[0].slice(2)), val)
    }
    assert.equal(bytesToHex(trie.root()), secureTrieTests.tests.jeff.root)
  })*/

  it('put fails if the key is the ROOT_DB_KEY', async () => {
    const trie = new Trie({ useKeyHashing: true, db: new MapDB(), useRootPersistence: true })

    try {
      await trie.put(ROOT_DB_KEY, utf8ToBytes('bar'))

      assert.fail("Attempting to set '__root__' should fail but it did not.")
    } catch ({ message }: any) {
      assert.equal(message, "Attempted to set '__root__' key but it is not allowed.")
    }
  })
})

const trie = new Trie({ useKeyHashing: true, db: new MapDB() })
const a = hexToBytes(
  '0xf8448080a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
)
const ak = hexToBytes('0x095e7baea6a6c7c4c2dfeb977efac326af552d87')
const b = hexToBytes(
  '0xf844802ea056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0db94dc4aab9b6a1a11956906ea34f3252f394576aece12199b23b269bb2738ab',
)
const bk = hexToBytes('0x945304eb96065b2a98b57a48a06ae28d285a71b5')
const c = hexToBytes(
  '0xf84c80880de0b6b3a7640000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
)
const ck = hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
// checkpoint
// checkpoint
// commit
const d = hexToBytes(
  '0xf8488084535500b1a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
)
const dk = hexToBytes('0x095e7baea6a6c7c4c2dfeb977efac326af552d87')
const e = hexToBytes(
  '0xf8478083010851a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0db94dc4aab9b6a1a11956906ea34f3252f394576aece12199b23b269bb2738ab',
)
const ek = hexToBytes('0x945304eb96065b2a98b57a48a06ae28d285a71b5')
const f = hexToBytes(
  '0xf84c01880de0b6b3540df72ca056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
)
const fk = hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
// commit
const g = hexToBytes(
  '0xf8488084535500b1a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0a155280bc3c09fd31b0adebbdd4ef3d5128172c0d2008be964dc9e10e0f0fedf',
)
const gk = hexToBytes('0x095e7baea6a6c7c4c2dfeb977efac326af552d87')

describe('secure tests should not crash', () => {
  it('should work', async () => {
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
  })
})

describe('SecureTrie.copy', () => {
  it('created copy includes values added after checkpoint', async () => {
    const trie = new Trie({ useKeyHashing: true, db: new MapDB() })

    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    trie.checkpoint()
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('value2'))
    const trieCopy = trie.shallowCopy()
    const value = await trieCopy.get(utf8ToBytes('key2'))
    assert.equal(bytesToUtf8(value!), 'value2')
  })

  it('created copy includes values added before checkpoint', async () => {
    const trie = new Trie({ useKeyHashing: true, db: new MapDB() })

    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    trie.checkpoint()
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('value2'))
    const trieCopy = trie.shallowCopy()
    const value = await trieCopy.get(utf8ToBytes('key1'))
    assert.equal(bytesToUtf8(value!), 'value1')
  })

  it('created copy uses the correct hash function', async () => {
    const trie = new Trie({
      db: new MapDB(),
      useKeyHashing: true,
      useKeyHashingFunction: sha256,
    })

    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    trie.checkpoint()
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('value2'))
    const trieCopy = trie.shallowCopy()
    const value = await trieCopy.get(utf8ToBytes('key1'))
    assert.equal(bytesToUtf8(value!), 'value1')
  })
})
