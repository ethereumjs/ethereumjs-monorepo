import {
  BIGINT_0,
  BIGINT_1,
  BIGINT_2,
  KECCAK256_RLP,
  MapDB,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  equalsBytes,
  hexToBytes,
  randomBytes,
  unprefixedHexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { ROOT_DB_KEY as BASE_DB_KEY, MerklePatriciaTrie, createMPT } from '../../src/index.js'

for (const { constructor, defaults, title } of [
  {
    constructor: MerklePatriciaTrie,
    title: 'Trie',
  },
  {
    constructor: MerklePatriciaTrie,
    title: 'SecureTrie',
    defaults: {
      useKeyHashing: true,
    },
  },
]) {
  const IS_SECURE_TRIE = title === 'SecureTrie'

  let ROOT_DB_KEY: Uint8Array
  if (IS_SECURE_TRIE) {
    ROOT_DB_KEY = keccak256(BASE_DB_KEY)
  } else {
    ROOT_DB_KEY = BASE_DB_KEY
  }

  let EXPECTED_ROOTS: string
  if (IS_SECURE_TRIE) {
    EXPECTED_ROOTS = '0x8204723ce0fb452b130a282ecc727e07295c18cbd2c2eef33ba9eb9c7a9ded9b'
  } else {
    EXPECTED_ROOTS = '0x99650c730bbb99f6f58ce8b09bca2a8d90b36ac662e71bf81ec401ed23d199fb'
  }

  describe(`${title} (Persistence)`, () => {
    it('creates an instance via createMPT and defaults to `false` with a database', async () => {
      assert.isFalse(
        (await createMPT({ ...defaults, db: new MapDB() }))['_opts'].useRootPersistence,
      )
    })

    it('creates an instance via createMPT and defaults to `false` without a database', async () => {
      assert.isFalse((await createMPT({ ...defaults }))['_opts'].useRootPersistence)
    })

    it('creates an instance via createMPT and respects the `useRootPersistence` option with a database', async () => {
      assert.isFalse(
        (
          await createMPT({
            ...defaults,
            db: new MapDB(),
            useRootPersistence: false,
          })
        )['_opts'].useRootPersistence,
      )
    })

    it('persist the root if the `useRootPersistence` option is `true`', async () => {
      const trie = await createMPT({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: true,
      })

      assert.equal(await trie['_db'].get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      assert.equal(bytesToHex((await trie['_db'].get(ROOT_DB_KEY))!), EXPECTED_ROOTS)
    })

    it('persist the root if the `root` option is given', async () => {
      const trie = await createMPT({
        ...defaults,
        db: new MapDB(),
        root: KECCAK256_RLP,
        useRootPersistence: true,
      })

      assert.ok(equalsBytes((await trie['_db'].get(ROOT_DB_KEY))!, KECCAK256_RLP))

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      assert.isFalse(equalsBytes((await trie['_db'].get(ROOT_DB_KEY))!, KECCAK256_RLP))
    })

    it('does not persist the root if the `useRootPersistence` option is `false`', async () => {
      const trie = await createMPT({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: false,
      })

      assert.equal(await trie['_db'].get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('do_not_persist_with_db'), utf8ToBytes('bar'))

      assert.equal(await trie['_db'].get(ROOT_DB_KEY), undefined)
    })

    it('persists the root if the `db` option is not provided', async () => {
      const trie = await createMPT({ ...defaults, useRootPersistence: true })

      assert.equal(await trie['_db'].get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('do_not_persist_without_db'), utf8ToBytes('bar'))

      assert.notEqual(await trie['_db'].get(ROOT_DB_KEY), undefined)
    })

    it('persist and restore the root', async () => {
      const db = new MapDB<string, string>()

      const trie = await createMPT({ ...defaults, db, useRootPersistence: true })
      assert.equal(await trie['_db'].get(ROOT_DB_KEY), undefined)
      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))
      assert.equal(bytesToHex((await trie['_db'].get(ROOT_DB_KEY))!), EXPECTED_ROOTS)

      // Using the same database as `trie` so we should have restored the root
      const copy = await createMPT({ ...defaults, db, useRootPersistence: true })
      assert.equal(bytesToHex((await copy['_db'].get(ROOT_DB_KEY))!), EXPECTED_ROOTS)

      // New trie with a new database so we shouldn't find a root to restore
      const empty = await createMPT({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: true,
      })
      assert.equal(await empty['_db'].get(ROOT_DB_KEY), undefined)
    })

    it('put fails if the key is the ROOT_DB_KEY', async () => {
      const trie = new constructor({ ...defaults, db: new MapDB(), useRootPersistence: true })

      try {
        await trie.put(BASE_DB_KEY, utf8ToBytes('bar'))
        assert.fail("Attempting to set '__root__' should fail but it did not.")
      } catch ({ message }: any) {
        assert.equal(message, "Attempted to set '__root__' key but it is not allowed.")
      }
    })
  })

  describe(`${title} (Check Root)`, async () => {
    const keyvals = Array.from({ length: 100 }, () => {
      const key = randomBytes(20)
      const value = randomBytes(10)
      return { key, value }
    })
    const trie = await createMPT({
      ...defaults,
      db: new MapDB(),
    })
    for await (const { key, value } of keyvals) {
      await trie.put(key, value)
    }
    const roots = [...(<any>trie.database().db)._database.keys()]
    it('should return true for all nodes in the trie', async () => {
      assert.isTrue(await trie.checkRoot(trie.root()), 'Should return true for root node')
      for (const root of roots) {
        assert.isTrue(
          await trie.checkRoot(unprefixedHexToBytes(root)),
          'Should return true for all nodes in trie',
        )
      }
    })
    it('should return false for nodes not in the trie', async () => {
      for (let i = 0; i < 10; i++) {
        const key = unprefixedHexToBytes(`${i}`.repeat(64))
        assert.isFalse(await trie.checkRoot(key), 'Should return false for nodes not in trie')
      }
    })
    it('should return false for all keys if trie is empty', async () => {
      const emptyTrie = await createMPT({
        ...defaults,
        db: new MapDB(),
      })
      assert.deepEqual(emptyTrie.EMPTY_TRIE_ROOT, emptyTrie.root(), 'Should return empty trie root')
      assert.isTrue(
        await emptyTrie.checkRoot(emptyTrie.EMPTY_TRIE_ROOT),
        'Should return true for empty root',
      )
      assert.isFalse(
        await emptyTrie.checkRoot(emptyTrie['appliedKey'](ROOT_DB_KEY)),
        'Should return false for persistence key',
      )
      for (const root of roots) {
        assert.isFalse(
          await emptyTrie.checkRoot(unprefixedHexToBytes(root)),
          'Should always return false',
        )
      }
    })
    it('Should throw on unrelated errors', async () => {
      const emptyTrie = await createMPT({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: true,
      })
      await emptyTrie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))
      await emptyTrie.persistRoot()
      try {
        await emptyTrie.checkRoot(ROOT_DB_KEY)
        assert.fail('Should throw')
      } catch (e: any) {
        assert.notEqual(
          'Missing node in DB',
          e.message,
          'Should throw when error is unrelated to checkroot',
        )
      }
    })
  })
}

describe('keyHashingFunction', async () => {
  it('uses correct hash function', async () => {
    const keyHashingFunction = (msg: Uint8Array) => {
      return concatBytes(msg, Uint8Array.from([1]))
    }
    const c = {
      customCrypto: {
        keccak256: (msg: Uint8Array) => msg,
      },
    }

    const trieWithHashFunction = await createMPT({ useKeyHashingFunction: keyHashingFunction })
    const trieWithCommon = await createMPT({ common: c })

    assert.equal(
      bytesToHex(trieWithHashFunction.root()),
      '0x8001',
      'used hash function from customKeyHashingFunction',
    )
    assert.equal(bytesToHex(trieWithCommon.root()), '0x80', 'used hash function from common')
  })

  it('shallow copy uses correct hash function', async () => {
    const keyHashingFunction = (msg: Uint8Array) => {
      return concatBytes(msg, Uint8Array.from([1]))
    }
    const c = {
      customCrypto: {
        keccak256: (msg: Uint8Array) => msg,
      },
    }

    const trieWithHashFunction = await createMPT({ useKeyHashingFunction: keyHashingFunction })
    const trieWithHashFunctionCopy = trieWithHashFunction.shallowCopy()
    const trieWithCommon = await createMPT({ common: c })
    const trieWithCommonCopy = trieWithCommon.shallowCopy()

    assert.equal(
      bytesToHex(trieWithHashFunctionCopy.root()),
      '0x8001',
      'used hash function from customKeyHashingFunction',
    )
    assert.equal(bytesToHex(trieWithCommonCopy.root()), '0x80', 'used hash function from common')
  })
})

describe('getValueMap', async () => {
  const trie = await createMPT({})
  const entries: [Uint8Array, string][] = [
    [bigIntToBytes(0x01n), '0x' + '0a'.repeat(32)],
    [bigIntToBytes(0x02n), '0x' + '0b'.repeat(32)],
    [bigIntToBytes(0x03n), '0x' + '0c'.repeat(32)],
  ]
  for (const entry of entries) {
    await trie.put(entry[0], hexToBytes(entry[1]))
  }
  const dump = await trie.getValueMap()

  it('should return a map with the correct number of entries', async () => {
    assert.equal(Object.entries(dump.values).length, entries.length)
  })

  it('should return a map of all hashed keys and values', async () => {
    // Check if the reported values are the expected values
    for (const entry of entries) {
      const key = bytesToHex(entry[0])
      const value = entry[1]
      assert.equal(dump.values[key], value)
    }

    assert.equal(dump.nextKey, null)
  })

  it('should enforce the startKey / limit rules', async () => {
    const tests: {
      startKey?: bigint
      limit?: number
      reportedValues: number
      nextKey: string | null
    }[] = [
      {
        startKey: BIGINT_0,
        limit: 3,
        reportedValues: 3,
        nextKey: null,
      },
      {
        startKey: BIGINT_1,
        limit: 3,
        reportedValues: 3,
        nextKey: null,
      },
      {
        startKey: BIGINT_1,
        limit: 1000,
        reportedValues: 3,
        nextKey: null,
      },
      {
        startKey: BIGINT_2,
        limit: 2,
        reportedValues: 2,
        nextKey: null,
      },
    ]

    for (const test of tests) {
      const result = await trie.getValueMap(test.startKey, test.limit)
      assert.equal(Object.entries(result.values).length, test.reportedValues)
      assert.equal(result.nextKey, test.nextKey)
    }
  })

  it('random key/value test', async () => {
    // This test dumps a fixed amount of random key/values in the trie
    // and then verifies that the complete `getValueMap` yields the same key/value pairs
    const KEYS = 1000
    const KEY_LEN = 3 // Keys are of equal length
    const gotKeys = new Set()
    const entries: [Uint8Array, string][] = []
    for (let i = 0; i < KEYS; i++) {
      const key = randomBytes(KEY_LEN)
      const keyBigInt = bytesToBigInt(key)
      if (gotKeys.has(keyBigInt)) continue
      gotKeys.add(keyBigInt)
      entries.push([key, bytesToHex(randomBytes(32))])
    }

    const trie = await createMPT({})
    for (const entry of entries) {
      await trie.put(entry[0], hexToBytes(entry[1]))
    }

    const dump = await trie.getValueMap()

    // Check if the reported values are the expected values
    for (const entry of entries) {
      const key = bytesToHex(entry[0])
      const value = entry[1]
      assert.equal(dump.values[key], value)
    }

    assert.equal(dump.nextKey, null)

    assert.equal(Object.entries(dump.values).length, entries.length)
  })
})
