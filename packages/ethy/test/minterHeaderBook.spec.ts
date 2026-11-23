import { assert, describe, it } from 'vitest'

import {
  createMinterHeaderBook,
  minterHeaderMatchesStatus,
  noteMinterHeaderVerified,
} from '../src/sync/minterHeaderBook.ts'

describe('[Ethy/Sync]: minter header book', () => {
  it('records and matches verified pivot roots', () => {
    const book = createMinterHeaderBook()
    noteMinterHeaderVerified(book, 'Peer-A', 2048n, '0x' + 'aa'.repeat(32))
    assert.equal(minterHeaderMatchesStatus(book, 'peer-a', 2048n, '0x' + 'aa'.repeat(32)), true)
    assert.equal(minterHeaderMatchesStatus(book, 'peer-a', 2048n, '0x' + 'bb'.repeat(32)), false)
  })
})
