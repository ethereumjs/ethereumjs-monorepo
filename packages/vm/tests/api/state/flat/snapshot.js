const tape = require('tape')
const promisify = require('util-promisify')
const BN = require('bn.js')
const Account = require('ethereumjs-account').default
const { keccak256, KECCAK256_RLP } = require('ethereumjs-util')
const { Snapshot } = require('../../../../dist/state/flat/snapshot')
const Trie = require('merkle-patricia-tree/secure')

tape('snapshot simple get/put', (t) => {
  t.test('should return null for non-existent key', async (st) => {
    const snapshot = new Snapshot()
    const addr = new BN(3).toArrayLike(Buffer, 'be', 20)
    const res = await snapshot.getAccount(addr)
    st.equal(res, null)
    st.end()
  })

  t.test('should put/get account', async (st) => {
    const snapshot = new Snapshot()
    const addr = new BN(3).toArrayLike(Buffer, 'be', 20)
    const val = (new Account()).serialize()
    await snapshot.putAccount(addr, val)
    const res = await snapshot.getAccount(addr)
    st.ok(res.equals(val))
    st.end()
  })

  t.test('should put/get storage slot', async (st) => {
    const snapshot = new Snapshot()
    const addr = new BN(3).toArrayLike(Buffer, 'be', 20)
    const slot = Buffer.from('01', 'hex')
    const val = Buffer.from('2222', 'hex')
    await snapshot.putStorageSlot(addr, slot, val)
    const res = await snapshot.getStorageSlot(addr, slot)
    st.ok(res.equals(val))
    st.end()
  })

  // TODO: what if we insert slot without having inserted account first?
})

tape('snapshot get storage slots for address', (t) => {
  t.test('should return empty for non-existent key', async (st) => {
    const snapshot = new Snapshot()
    const addr = new BN(3).toArrayLike(Buffer, 'be', 20)
    snapshot.getStorageSlots(addr)
    st.end()
  })

  console.log('testing hashes')
  console.log('3', keccak256(new BN(3).toArrayLike(Buffer, 'be', 20)))
  console.log('4', keccak256(new BN(4).toArrayLike(Buffer, 'be', 20)))
  console.log('5', keccak256(new BN(5).toArrayLike(Buffer, 'be', 20)))

  t.test('should return all slots for account', async (st) => {
    const snapshot = new Snapshot()
    const addrs = [
      new BN(3).toArrayLike(Buffer, 'be', 20), // Hash starts with 0x5b
      new BN(4).toArrayLike(Buffer, 'be', 20), // Hash starts with 0xa8
      new BN(5).toArrayLike(Buffer, 'be', 20) // Hash starts with 0x42
    ]

    // Insert an empty account for all the addresses
    const acc = (new Account()).serialize()
    for (const addr of addrs) {
      await snapshot.putAccount(addr, acc)
    }

    snapshot.getAccounts()

    // Insert these slots to every address
    const slots = [[Buffer.from('01', 'hex'), Buffer.from('2222', 'hex')], [Buffer.from('02', 'hex'), Buffer.from('3333', 'hex')]]
    for (const slot of slots) {
      await snapshot.putStorageSlot(addrs[0], slot[0], slot[1])
      await snapshot.putStorageSlot(addrs[1], slot[0], slot[1])
      await snapshot.putStorageSlot(addrs[2], slot[0], slot[1])
    }

    // Should only get slots for given address
    snapshot.getStorageSlots(addrs[0])

    st.end()
  })
})

tape('snapshot merkleize list', (t) => {
  t.test('should merkleize empty list', async (st) => {
    const snapshot = new Snapshot()
    const leaves = []
    const root = snapshot.merkleizeList(leaves)
    st.ok(root.equals(KECCAK256_RLP))
    st.end()
  })

  t.test('should merkleize single leaf', async (st) => {
    const snapshot = new Snapshot()
    const serializedEmptyAcc = (new Account()).serialize()
    const leaves = [
      [new BN(1).toArrayLike(Buffer, 'be', 32), serializedEmptyAcc]
    ]
    let expected = await merkleizeViaTrie(leaves)
    const root = snapshot.merkleizeList(leaves)
    st.ok(root.equals(expected), `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`)
    st.end()
  })

  t.test('should merkleize multiple leaves', async (st) => {
    const snapshot = new Snapshot()
    const serializedEmptyAcc = (new Account()).serialize()
    const leaves = [
      [keccak256(new BN(5).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc],
      [keccak256(new BN(3).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc],
      [keccak256(new BN(4).toArrayLike(Buffer, 'be', 20)), serializedEmptyAcc]
    ]
    let expected = await merkleizeViaTrie(leaves)
    const root = snapshot.merkleizeList(leaves)
    st.ok(root.equals(expected), `Merkleized root ${root.toString('hex')} should match ${expected.toString('hex')}`)
    st.end()
  })
})

async function merkleizeViaTrie (leaves) {
  const trie = new Trie()
  const put = promisify(trie.put.bind(trie))
  for (let leaf of leaves) {
    await put(leaf[0], leaf[1])
  }
  return trie.root
}
