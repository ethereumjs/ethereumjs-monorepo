import { tmpdir } from 'os'
import { mkdtempSync } from 'fs'
import { join } from 'path'
import { KECCAK256_RLP } from '@ethereumjs/util'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'
import * as tape from 'tape'

import { CheckpointTrie, SecureTrie, Trie, LevelDB, ROOT_DB_KEY } from '../../src'

function bytesToHex(bytes: Buffer | null) {
  return bytes?.toString('hex')
}

for (const { constructor, title } of [
  {
    constructor: Trie,
    title: 'Trie',
  },
  {
    constructor: CheckpointTrie,
    title: 'CheckpointTrie',
  },
  {
    constructor: SecureTrie,
    title: 'SecureTrie',
  },
]) {
  let dbTmpDir: string
  try {
    dbTmpDir = mkdtempSync(join(tmpdir(), title))
  } catch (error) {
    dbTmpDir = tmpdir()
  }

  tape(`${title} (Persistence)`, function (t) {
    t.test(
      'creates an instance via the static constructor `create` function and defaults to `false` with a database',
      async function (st) {
        st.false(
          ((await constructor.create({ db: new LevelDB(new Level(dbTmpDir)) })) as any)._persistRoot
        )

        st.end()
      }
    )

    t.test(
      'creates an instance via the static constructor `create` function and respects the `persistRoot` option with a database',
      async function (st) {
        st.false(
          ((await Trie.create({ db: new LevelDB(new Level(tmpdir())), persistRoot: false })) as any)
            ._persistRoot
        )

        st.end()
      }
    )

    t.test(
      'creates an instance via the static constructor `create` function and respects the `persistRoot` option with a database',
      async function (st) {
        st.false(
          (
            (await constructor.create({
              db: new LevelDB(new Level(dbTmpDir)),
              persistRoot: false,
            })) as any
          )._persistRoot
        )

        st.end()
      }
    )

    t.test(
      'creates an instance via the static constructor `create` function and defaults to `false` without a database',
      async function (st) {
        st.false(((await constructor.create()) as any)._persistRoot)

        st.end()
      }
    )

    t.test('persist the root if the `persistRoot` option is `true`', async function (st) {
      const trie = await constructor.create({ db: new LevelDB(new MemoryLevel()), persistRoot: true })

      st.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('foo'), Buffer.from('bar'))

      st.equal(
        bytesToHex(await trie.db.get(ROOT_DB_KEY)),
        '99650c730bbb99f6f58ce8b09bca2a8d90b36ac662e71bf81ec401ed23d199fb'
      )

      st.end()
    })

    t.test('persist the root if the `root` option is given', async function (st) {
      const trie = await constructor.create({
        db: new LevelDB(new MemoryLevel()),
        root: KECCAK256_RLP,
        persistRoot: true,
      })

      st.true((await trie.db.get(ROOT_DB_KEY))?.equals(KECCAK256_RLP))

      await trie.put(Buffer.from('foo'), Buffer.from('bar'))

      st.false((await trie.db.get(ROOT_DB_KEY))?.equals(KECCAK256_RLP))

      st.end()
    })

    t.test('does not persist the root if the `persistRoot` option is `false`', async function (st) {
      const trie = await constructor.create({
        db: new LevelDB(new MemoryLevel()),
        persistRoot: false,
      })

      st.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('do_not_persist_with_db'), Buffer.from('bar'))

      st.equal(await trie.db.get(ROOT_DB_KEY), null)

      st.end()
    })

    t.test('persists the root if the `db` option is not provided', async function (st) {
      const trie = await constructor.create({ persistRoot: true })

      st.equal(await trie.db.get(ROOT_DB_KEY), null)

      await trie.put(Buffer.from('do_not_persist_without_db'), Buffer.from('bar'))

      st.notEqual(await trie.db.get(ROOT_DB_KEY), null)

      st.end()
    })

    t.test('persist and restore the root', async function (st) {
      const db = new LevelDB(new MemoryLevel())

      const trie = await constructor.create({ db, persistRoot: true })
      st.equal(await trie.db.get(ROOT_DB_KEY), null)
      await trie.put(Buffer.from('foo'), Buffer.from('bar'))
      st.equal(
        bytesToHex(await trie.db.get(ROOT_DB_KEY)),
        '99650c730bbb99f6f58ce8b09bca2a8d90b36ac662e71bf81ec401ed23d199fb'
      )

      // Using the same database as `trie` so we should have restored the root
      const copy = await constructor.create({ db, persistRoot: true })
      st.equal(
        bytesToHex(await copy.db.get(ROOT_DB_KEY)),
        '99650c730bbb99f6f58ce8b09bca2a8d90b36ac662e71bf81ec401ed23d199fb'
      )

      // New trie with a new database so we shouldn't find a root to restore
      const empty = await constructor.create({ db: new LevelDB(new MemoryLevel()), persistRoot: true })
      st.equal(await empty.db.get(ROOT_DB_KEY), null)

      st.end()
    })

    t.test('put fails if the key is the ROOT_DB_KEY', async function (st) {
      const trie = new constructor({ db: new LevelDB(), persistRoot: true })

      try {
        await trie.put(ROOT_DB_KEY, Buffer.from('bar'))
        st.fail("Attempting to set '__root__' should fail but it did not.")
      } catch ({ message }) {
        st.equal(message, "Attempted to set '__root__' key but it is not allowed.")
      }

      st.end()
    })

    t.end()
  })
}
