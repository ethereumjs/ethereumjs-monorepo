import * as tape from 'tape'
import { LevelDB, ROOT_DB_KEY, Trie } from '../../src'

tape('Trie', function (t) {
  const trie = new Trie({ db: new LevelDB() })

  t.test('put fails if the key is the ROOT_DB_KEY', async function (st) {
    try {
      await trie.put(ROOT_DB_KEY, Buffer.from('bar'))
      st.fail("Attempting to set '__root__' should fail but it did not.")
    } catch ({ message }) {
      st.equal(message, "Attempted to set '__root__' key but it is not allowed.")
    }

    st.end()
  })
})
