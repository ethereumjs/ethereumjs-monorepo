import { KECCAK256_RLP, equalsBytes, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { ROOT_DB_KEY as BASE_DB_KEY, Trie, TrieDatabase } from '../../src/index.js'

import type { TrieWrapOptions } from '../../src/index.js'

const createTrie = async (defaults?: TrieWrapOptions) => Trie.create({ ...defaults })
const createSecureTrie = async (defaults?: TrieWrapOptions) =>
  Trie.create({ ...defaults, secure: true })
for (const [secure, constructor] of [createTrie, createSecureTrie].entries()) {
  const title = secure ? 'SecureTrie' : 'Trie'
  const IS_SECURE_TRIE = title === 'SecureTrie'

  let ROOT_DB_KEY: Uint8Array
  if (IS_SECURE_TRIE) {
    ROOT_DB_KEY = keccak256(BASE_DB_KEY)
  } else {
    ROOT_DB_KEY = BASE_DB_KEY
  }

  let EXPECTED_ROOTS: string
  if (IS_SECURE_TRIE) {
    EXPECTED_ROOTS = '8204723ce0fb452b130a282ecc727e07295c18cbd2c2eef33ba9eb9c7a9ded9b'
  } else {
    EXPECTED_ROOTS = '99650c730bbb99f6f58ce8b09bca2a8d90b36ac662e71bf81ec401ed23d199fb'
  }

  describe(`${title} (Persistence)`, () => {
    it('creates an instance via the static constructor `create` function and defaults to `false` with a database', async () => {
      // TODO: check this test
      assert.false((await constructor()).persistent)
    })

    it('creates an instance via the static constructor `create` function and respects the `useRootPersistence` option with a database', async () => {
      // TODO: check this test
      assert.isUndefined(
        (
          (await constructor({
            useRootPersistence: false,
          })) as any
        )._useRootPersistence
      )
    })

    it('creates an instance via the static constructor `create` function and respects the `useRootPersistence` option with a database', async () => {
      // TODO: check this test
      assert.false(
        (
          await constructor({
            db: await TrieDatabase.create(),
            persistent: false,
          })
        ).persistent
      )
    })

    it('creates an instance via the static constructor `create` function and respects the `persistent` option with a database', async () => {
      assert.isFalse(
        (
          await constructor({
            db: await TrieDatabase.create(),
            persistent: false,
          })
        ).persistent
      )
    })

    it('persist the root if the `useRootPersistence` option is `true`', async () => {
      const trie = await constructor({
        ...defaults,
        useRootPersistence: true,
      })
      assert.true(trie.persistent, 'trie should be persistent')
      assert.equal(await trie.database().get(ROOT_DB_KEY), undefined, 'no root passed')

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      assert.deepEqual(
        await trie.database().get(ROOT_DB_KEY),
        hexStringToBytes(EXPECTED_ROOTS),
        'root should be in db'
      )
    })

    it('persist the root if the `root` option is given', async () => {
      const trie = await constructor({
        db: await TrieDatabase.create(),
        rootNodeRLP: KECCAK256_RLP,
        persistent: true,
      })

      assert.deepEqual(
        await trie.database().get(ROOT_DB_KEY),
        KECCAK256_RLP,
        'root persisted in create'
      )

      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))

      assert.isFalse(equalsBytes((await trie.database().get(ROOT_DB_KEY))!, KECCAK256_RLP))
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
      const db = await TrieDatabase.create()

      const trie = await constructor({ db, persistent: true })
      assert.equal(await trie.database().get(ROOT_DB_KEY), undefined)
      await trie.put(utf8ToBytes('foo'), utf8ToBytes('bar'))
      assert.deepEqual(await trie.database().get(ROOT_DB_KEY), hexStringToBytes(EXPECTED_ROOTS))

      // Using the same database as `trie` so we should have restored the root
      const copy = await constructor.create({ ...defaults, db, useRootPersistence: true })
      // @ts-expect-error
      assert.equal(bytesToHex(await copy._db.get(ROOT_DB_KEY)), EXPECTED_ROOTS)

      // New trie with a new database so we shouldn't find a root to restore
      const empty = await constructor({
        db: await TrieDatabase.create(),
        persistent: true,
      })
      // @ts-expect-error
      assert.equal(await empty._db.get(ROOT_DB_KEY), undefined)
    })

    it('put fails if the key is the ROOT_DB_KEY', async () => {
      const trie = await constructor({ db: await TrieDatabase.create(), persistent: true })

      try {
        await trie.put(BASE_DB_KEY, utf8ToBytes('bar'))
        assert.fail("Attempting to set '__root__' should fail but it did not.")
      } catch (error: any) {
        assert.equal(error.message, "Attempted to set '__root__' key but it is not allowed.")
      }
    })
  })
}
