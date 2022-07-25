import { Level } from 'level'
import { MemoryLevel } from 'memory-level'
import { tmpdir } from 'os'
import * as tape from 'tape'
import { LevelDB, ROOT_DB_KEY, Trie } from '../../src'

tape('Trie', function (t) {
  t.test(
    'creates an instance via the static constructor `make` function and defaults to `true` with a database',
    async function (st) {
      st.true(((await Trie.make({ db: new LevelDB(new Level(tmpdir())) })) as any)._persistRoot)
    }
  )

  t.test(
    'creates an instance via the static constructor `make` function and respects the `persistRoot` option with a database',
    async function (st) {
      st.false(
        ((await Trie.make({ db: new LevelDB(new Level(tmpdir())), persistRoot: false })) as any)
          ._persistRoot
      )
    }
  )

  t.test(
    'creates an instance via the static constructor `make` function and defaults to `false` without a database',
    async function (st) {
      st.false(((await Trie.make()) as any)._persistRoot)
    }
  )

  t.test('persist the root if the `persistRoot` option is not `false`', async function (st) {
    const trie = await Trie.make({ db: new LevelDB(new MemoryLevel()) })

    st.equal(await trie.db.get(ROOT_DB_KEY), null)

    await trie.put(Buffer.from('foo'), Buffer.from('bar'))

    st.notEqual(await trie.db.get(ROOT_DB_KEY), null)
  })

  t.test('does not persist the root if the `persistRoot` option is `false`', async function (st) {
    const trie = await Trie.make({ db: new LevelDB(new MemoryLevel()), persistRoot: false })

    st.equal(await trie.db.get(ROOT_DB_KEY), null)

    await trie.put(Buffer.from('do_not_persist_with_db'), Buffer.from('bar'))

    st.equal(await trie.db.get(ROOT_DB_KEY), null)
  })

  t.test('does not persist the root if the `db` option is not provided', async function (st) {
    const trie = await Trie.make()

    st.equal(await trie.db.get(ROOT_DB_KEY), null)

    await trie.put(Buffer.from('do_not_persist_without_db'), Buffer.from('bar'))

    st.equal(await trie.db.get(ROOT_DB_KEY), null)
  })

  t.test('put fails if the key is the ROOT_DB_KEY', async function (st) {
    const trie = new Trie({ db: new LevelDB() })

    try {
      await trie.put(ROOT_DB_KEY, Buffer.from('bar'))
      st.fail("Attempting to set '__root__' should fail but it did not.")
    } catch ({ message }) {
      st.equal(message, "Attempted to set '__root__' key but it is not allowed.")
    }
  })
})
