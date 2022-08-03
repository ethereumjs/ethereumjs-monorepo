import { tmpdir } from 'os'
import { KECCAK256_RLP } from '@ethereumjs/util'
import { mkdtempSync } from 'fs'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'
import * as tape from 'tape'

import { LevelDB, ROOT_DB_KEY, Trie } from '../../src'

tape('Trie', function (t) {
  t.test(
    'creates an instance via the static constructor `create` function and defaults to `true` with a database',
    async function (st) {
      st.true(((await Trie.create({ db: new LevelDB(new Level(tmpdir())) })) as any)._persistRoot)
    }
  )

  t.test(
    'creates an instance via the static constructor `create` function and respects the `persistRoot` option with a database',
    async function (st) {
      st.false(
        ((await Trie.create({ db: new LevelDB(new Level(tmpdir())), persistRoot: false })) as any)
          ._persistRoot
      )
    })

    test('creates an instance via the static constructor `create` function and respects the `persistRoot` option with a database', async function (assert) {
      assert.false(
        (
          (await constructor.create({
            db: new LevelDB(new Level(dbTmpDir)),
            persistRoot: false,
          })) as any
        )._persistRoot
      )
    })

    test('creates an instance via the static constructor `create` function and defaults to `false` without a database', async function (assert) {
      assert.false(((await constructor.create()) as any)._persistRoot)
    })

    test('persist the root if the `persistRoot` option is not `false`', async function (assert) {
      const trie = await constructor.create({ db: new LevelDB(new MemoryLevel()) })

      assert.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('foo'), Buffer.from('bar'))

      assert.notEqual(await trie.db.get(ROOT_DB_KEY), null)
    })

    test('persist the root if the `root` option is given', async function (assert) {
      const trie = await constructor.create({
        db: new LevelDB(new MemoryLevel()),
        root: KECCAK256_RLP,
      })

      assert.true((await trie.db.get(ROOT_DB_KEY))?.equals(KECCAK256_RLP))

      await trie.put(Buffer.from('foo'), Buffer.from('bar'))

      assert.false((await trie.db.get(ROOT_DB_KEY))?.equals(KECCAK256_RLP))
    })

    test('does not persist the root if the `persistRoot` option is `false`', async function (assert) {
      const trie = await constructor.create({
        db: new LevelDB(new MemoryLevel()),
        persistRoot: false,
      })

      assert.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('do_not_persist_with_db'), Buffer.from('bar'))

      assert.equal(await trie.db.get(ROOT_DB_KEY), null)
    })

    test('does not persist the root if the `db` option is not provided', async function (assert) {
      const trie = await constructor.create()

      assert.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('do_not_persist_without_db'), Buffer.from('bar'))

      assert.equal(await trie.db.get(ROOT_DB_KEY), null)
    })

    test('persist and restore the root', async function (assert) {
      const db = new LevelDB(new MemoryLevel())

      const trie = await constructor.create({ db })
      assert.equal(await trie.db.get(ROOT_DB_KEY), null)
      await trie.put(Buffer.from('foo'), Buffer.from('bar'))
      assert.notEqual(await trie.db.get(ROOT_DB_KEY), null)

      // Using the same database as `trie` so we should have restored the root
      const copy = await constructor.create({ db })
      assert.notEqual(await copy.db.get(ROOT_DB_KEY), null)

      // New trie with a new database so we shouldn't find a root to restore
      const empty = await constructor.create({ db: new LevelDB(new MemoryLevel()) })
      assert.equal(await empty.db.get(ROOT_DB_KEY), null)
    })

    test('put fails if the key is the ROOT_DB_KEY', async function (assert) {
      const trie = new constructor({ db: new LevelDB() })

      try {
        await trie.put(ROOT_DB_KEY, Buffer.from('bar'))
        assert.fail("Attempting to set '__root__' should fail but it did not.")
      } catch ({ message }) {
        assert.equal(message, "Attempted to set '__root__' key but it is not allowed.")
      }
    })
  })
}
