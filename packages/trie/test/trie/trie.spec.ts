import { Level } from 'level'
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
