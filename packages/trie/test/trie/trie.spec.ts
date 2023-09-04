import {
  KECCAK256_RLP,
  MapDB,
  bytesToHex,
  equalsBytes,
  randomBytes,
  unprefixedHexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { ROOT_DB_KEY as BASE_DB_KEY, Trie } from '../../src/index.js'

for (const { constructor, defaults, title } of [
  {
    constructor: Trie,
    title: 'Trie',
  },
  {
    constructor: Trie,
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
    it('creates an instance via the static constructor `create` function and defaults to `false` with a database', async () => {
      // TODO: check this test
      assert.isUndefined(
        ((await constructor.create({ ...defaults, db: new MapDB() })) as any)._useRootPersistence
      )
    })

    it('creates an instance via the static constructor `create` function and respects the `useRootPersistence` option with a database', async () => {
      // TODO: check this test
      assert.isUndefined(
        (
          (await constructor.create({
            ...defaults,
            db: new MapDB(),
            useRootPersistence: false,
          })) as any
        )._useRootPersistence
      )
    })

    it('creates an instance via the static constructor `create` function and respects the `useRootPersistence` option with a database', async () => {
      // TODO: check this test
      assert.isUndefined(
        (
          (await constructor.create({
            ...defaults,
            db: new MapDB(),
            useRootPersistence: false,
          })) as any
        )._useRootPersistence
      )
    })

    it('creates an instance via the static constructor `create` function and defaults to `false` without a database', async () => {
      // TODO: check this test
      assert.isUndefined(
        ((await constructor.create({ ...defaults, db: new MapDB() })) as any)._useRootPersistence
      )
    })

    it('persist the root if the `useRootPersistence` option is `true`', async () => {
      const trie = await constructor.create({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: true,
      })

      // @ts-expect-error
      assert.equal(await trie._db.get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      // @ts-expect-error
      assert.equal(bytesToHex(await trie._db.get(ROOT_DB_KEY)), EXPECTED_ROOTS)
    })

    it('persist the root if the `root` option is given', async () => {
      const trie = await constructor.create({
        ...defaults,
        db: new MapDB(),
        root: KECCAK256_RLP,
        useRootPersistence: true,
      })

      // @ts-expect-error
      assert.ok(equalsBytes((await trie._db.get(ROOT_DB_KEY))!, KECCAK256_RLP))

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      // @ts-expect-error
      assert.isFalse(equalsBytes((await trie._db.get(ROOT_DB_KEY))!, KECCAK256_RLP))
    })

    it('does not persist the root if the `useRootPersistence` option is `false`', async () => {
      const trie = await constructor.create({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: false,
      })

      // @ts-expect-error
      assert.equal(await trie._db.get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('do_not_persist_with_db'), utf8ToBytes('bar'))

      // @ts-expect-error
      assert.equal(await trie._db.get(ROOT_DB_KEY), undefined)
    })

    it('persists the root if the `db` option is not provided', async () => {
      const trie = await constructor.create({ ...defaults, useRootPersistence: true })

      // @ts-expect-error
      assert.equal(await trie._db.get(ROOT_DB_KEY), undefined)

      await trie.put(utf8ToBytes('do_not_persist_without_db'), utf8ToBytes('bar'))

      // @ts-expect-error
      assert.notEqual(await trie._db.get(ROOT_DB_KEY), undefined)
    })

    it('persist and restore the root', async () => {
      const db = new MapDB<string, string>()

      const trie = await constructor.create({ ...defaults, db, useRootPersistence: true })
      // @ts-expect-error
      assert.equal(await trie._db.get(ROOT_DB_KEY), undefined)
      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))
      // @ts-expect-error
      assert.equal(bytesToHex(await trie._db.get(ROOT_DB_KEY)), EXPECTED_ROOTS)

      // Using the same database as `trie` so we should have restored the root
      const copy = await constructor.create({ ...defaults, db, useRootPersistence: true })
      // @ts-expect-error
      assert.equal(bytesToHex(await copy._db.get(ROOT_DB_KEY)), EXPECTED_ROOTS)

      // New trie with a new database so we shouldn't find a root to restore
      const empty = await constructor.create({
        ...defaults,
        db: new MapDB(),
        useRootPersistence: true,
      })
      // @ts-expect-error
      assert.equal(await empty._db.get(ROOT_DB_KEY), undefined)
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
    const trie = await constructor.create({
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
          'Should return true for all nodes in trie'
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
      const emptyTrie = await constructor.create({
        ...defaults,
        db: new MapDB(),
      })
      assert.deepEqual(emptyTrie.EMPTY_TRIE_ROOT, emptyTrie.root(), 'Should return empty trie root')
      assert.isTrue(
        await emptyTrie.checkRoot(emptyTrie.EMPTY_TRIE_ROOT),
        'Should return true for empty root'
      )
      assert.isFalse(
        await emptyTrie.checkRoot(emptyTrie['appliedKey'](ROOT_DB_KEY)),
        'Should return false for persistence key'
      )
      for (const root of roots) {
        assert.isFalse(
          await emptyTrie.checkRoot(unprefixedHexToBytes(root)),
          'Should always return false'
        )
      }
    })
    it('Should throw on unrelated errors', async () => {
      const emptyTrie = await constructor.create({
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
          'Should throw when error is unrelated to checkroot'
        )
      }
    })
  })
}
