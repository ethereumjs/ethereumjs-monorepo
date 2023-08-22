const tape = require('tape')
const promisify = require('util-promisify')
const BN = require('bn.js')
const Account = require('ethereumjs-account').default
const { keccak256, KECCAK256_RLP } = require('ethereumjs-util')
const BaseTrie = require('merkle-patricia-tree/baseTrie')

const { merkleizeList } = require('../../../../dist/state/flat/stackTrie')

tape('snapshot merkleize list', (t) => {
  t.test('should merkleize empty list', async (st) => {
    const leaves = []
    const root = merkleizeList(leaves)
    st.ok(root.equals(KECCAK256_RLP))
    st.end()
  })

  t.test('should merkleize single leaf', async (st) => {
    const serializedEmptyAcc = new Account().serialize()
    const leaves = [[new BN(1).toArrayLike(Buffer, 'be', 32), serializedEmptyAcc]]
    const expected = await merkleizeViaTrie(leaves)
    const root = merkleizeList(leaves)
    st.ok(
      root.equals(expected),
      `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
    )
    st.end()
  })

  t.test('should merkleize two leaves', async (st) => {
    const serializedEmptyAcc = new Account().serialize()
    const leaves = [
      [Buffer.from('01111111111111111111111111111111', 'hex'), serializedEmptyAcc],
      [Buffer.from('02111111111111111111111111111111', 'hex'), serializedEmptyAcc],
    ]
    const expected = await merkleizeViaTrie(leaves)
    const root = merkleizeList(leaves)
    st.ok(
      root.equals(expected),
      `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
    )
    st.end()
  })

  t.test('should merkleize trie with leaf inserted to branch', async (st) => {
    const serializedEmptyAcc = new Account().serialize()
    const leaves = [
      [Buffer.from('01111111111111111111111111111111', 'hex'), serializedEmptyAcc],
      [Buffer.from('12111111111111111111111111111111', 'hex'), serializedEmptyAcc],
      [Buffer.from('13111111111111111111111111111111', 'hex'), serializedEmptyAcc],
    ]
    const expected = await merkleizeViaTrie(leaves)
    const root = merkleizeList(leaves)
    st.ok(
      root.equals(expected),
      `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
    )
    st.end()
  })

  t.test('should merkleize trie with extension insertion', async (st) => {
    const serializedEmptyAcc = new Account().serialize()
    const testcases = [
      [
        [Buffer.from('01111111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('02111111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('03111111111111111111111111111111', 'hex'), serializedEmptyAcc],
      ],
      [
        [Buffer.from('00001111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('00002111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('00111111111111111111111111111111', 'hex'), serializedEmptyAcc],
      ],
      [
        [Buffer.from('00001111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('00002111111111111111111111111111', 'hex'), serializedEmptyAcc],
        [Buffer.from('00011111111111111111111111111111', 'hex'), serializedEmptyAcc],
      ],
    ]

    for (const leaves of testcases) {
      const expected = await merkleizeViaTrie(leaves)
      const root = merkleizeList(leaves)
      st.ok(
        root.equals(expected),
        `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
      )
    }

    st.end()
  })

  t.test('should merkleize multiple leaves', async (st) => {
    const serializedEmptyAcc = new Account().serialize()
    const leaves = [
      [keccak256(new BN(5).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc],
      [keccak256(new BN(3).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc],
      [keccak256(new BN(4).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc],
    ]
    const expected = await merkleizeViaTrie(leaves)
    const root = merkleizeList(leaves)
    st.ok(
      root.equals(expected),
      `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
    )
    st.end()
  })

  t.test('should merkleize trie with embedded nodes', async (st) => {
    const value = Buffer.from('11', 'hex')
    const leaves = [
      [new BN(1).toArrayLike(Buffer, 'be', 32), value],
      [new BN(2).toArrayLike(Buffer, 'be', 32), value],
      [new BN(3).toArrayLike(Buffer, 'be', 32), value],
    ]
    const expected = await merkleizeViaTrie(leaves)
    const root = merkleizeList(leaves)
    st.ok(
      root.equals(expected),
      `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`
    )
    st.end()
  })
})

async function merkleizeViaTrie(leaves) {
  const trie = new BaseTrie()
  const put = promisify(trie.put.bind(trie))
  for (const leaf of leaves) {
    await put(leaf[0], leaf[1])
  }
  return trie.root
}
