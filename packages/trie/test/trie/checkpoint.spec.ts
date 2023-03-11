import { createHash } from 'crypto'
import { keccak256 } from 'ethereum-cryptography/keccak'
import * as tape from 'tape'

import { MapDB, ROOT_DB_KEY, Trie } from '../../src'

import type { BatchDBOp } from '../../src'

tape('testing checkpoints', function (tester) {
  const it = tester.test

  let trie: Trie
  let trieCopy: Trie
  let preRoot: string
  let postRoot: string

  it('setup', async function (t) {
    trie = new Trie()
    await trie.put(Buffer.from('do'), Buffer.from('verb'))
    await trie.put(Buffer.from('doge'), Buffer.from('coin'))
    preRoot = trie.root().toString('hex')
    t.end()
  })

  it('should copy trie and get value added to original trie', async function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root().toString('hex'), preRoot)
    const res = await trieCopy.get(Buffer.from('do'))
    t.ok(Buffer.from('verb').equals(Buffer.from(res!)))
    t.end()
  })

  it('should create a checkpoint', function (t) {
    trie.checkpoint()
    t.ok(trie.hasCheckpoints())
    t.end()
  })

  it('should save to the cache', async function (t) {
    await trie.put(Buffer.from('test'), Buffer.from('something'))
    await trie.put(Buffer.from('love'), Buffer.from('emotion'))
    postRoot = trie.root().toString('hex')
    t.end()
  })

  it('should get values from before checkpoint', async function (t) {
    const res = await trie.get(Buffer.from('doge'))
    t.ok(Buffer.from('coin').equals(Buffer.from(res!)))
    t.end()
  })

  it('should get values from cache', async function (t) {
    const res = await trie.get(Buffer.from('love'))
    t.ok(Buffer.from('emotion').equals(Buffer.from(res!)))
    t.end()
  })

  it('should copy trie and get upstream and cache values after checkpoint', async function (t) {
    trieCopy = trie.copy()
    t.equal(trieCopy.root().toString('hex'), postRoot)
    // @ts-expect-error
    t.equal(trieCopy._db.checkpoints.length, 1)
    t.ok(trieCopy.hasCheckpoints())
    const res = await trieCopy.get(Buffer.from('do'))
    t.ok(Buffer.from('verb').equals(Buffer.from(res!)))
    const res2 = await trieCopy.get(Buffer.from('love'))
    t.ok(Buffer.from('emotion').equals(Buffer.from(res2!)))
    t.end()
  })

  it('should copy trie and use the correct hash function', async function (t) {
    const trie = new Trie({
      db: new MapDB(),
      useKeyHashing: true,
      useKeyHashingFunction: (value) => createHash('sha256').update(value).digest(),
    })

    await trie.put(Buffer.from('key1'), Buffer.from('value1'))
    trie.checkpoint()
    await trie.put(Buffer.from('key2'), Buffer.from('value2'))
    const trieCopy = trie.copy()
    const value = await trieCopy.get(Buffer.from('key1'))
    t.equal(value!.toString(), 'value1')
    t.end()
  })

  it('should revert to the original root', async function (t) {
    t.ok(trie.hasCheckpoints())
    await trie.revert()
    t.equal(trie.root().toString('hex'), preRoot)
    t.notOk(trie.hasCheckpoints())
    t.end()
  })

  it('should not get values from cache after revert', async function (t) {
    const res = await trie.get(Buffer.from('love'))
    t.notOk(res)
    t.end()
  })

  it('should commit a checkpoint', async function (t) {
    trie.checkpoint()
    await trie.put(Buffer.from('test'), Buffer.from('something'))
    await trie.put(Buffer.from('love'), Buffer.from('emotion'))
    await trie.commit()
    t.equal(trie.hasCheckpoints(), false)
    t.equal(trie.root().toString('hex'), postRoot)
    t.end()
  })

  it('should get new values after commit', async function (t) {
    const res = await trie.get(Buffer.from('love'))
    t.ok(Buffer.from('emotion').equals(Buffer.from(res!)))
    t.end()
  })

  it('should commit a nested checkpoint', async function (t) {
    trie.checkpoint()
    await trie.put(Buffer.from('test'), Buffer.from('something else'))
    const root = trie.root()
    trie.checkpoint()
    await trie.put(Buffer.from('the feels'), Buffer.from('emotion'))
    await trie.revert()
    await trie.commit()
    t.equal(trie.hasCheckpoints(), false)
    t.equal(trie.root().toString('hex'), root.toString('hex'))
    t.end()
  })

  const k1 = Buffer.from('k1')
  const v1 = Buffer.from('v1')
  const v12 = Buffer.from('v12')
  const v123 = Buffer.from('v123')

  it('revert -> put', async function (t) {
    trie = new Trie()

    trie.checkpoint()
    await trie.put(k1, v1)
    t.deepEqual(await trie.get(k1), v1, 'before revert: v1 in trie')
    await trie.revert()
    t.deepEqual(await trie.get(k1), null, 'after revert: v1 removed')

    t.end()
  })

  it('revert -> put (update)', async (t) => {
    trie = new Trie()

    await trie.put(k1, v1)
    t.deepEqual(await trie.get(k1), v1, 'before CP: v1')
    trie.checkpoint()
    await trie.put(k1, v12)
    await trie.put(k1, v123)
    await trie.revert()
    t.deepEqual(await trie.get(k1), v1, 'after revert: v1')
    t.end()
  })

  it('revert -> put (update) batched', async (t) => {
    const trie = new Trie()
    await trie.put(k1, v1)
    t.deepEqual(await trie.get(k1), v1, 'before CP: v1')
    trie.checkpoint()
    const ops = [
      { type: 'put', key: k1, value: v12 },
      { type: 'put', key: k1, value: v123 },
    ] as BatchDBOp[]
    await trie.batch(ops)
    await trie.revert()
    t.deepEqual(await trie.get(k1), v1, 'after revert: v1')
    t.end()
  })

  it('Checkpointing: revert -> del', async (t) => {
    const trie = new Trie()
    await trie.put(k1, v1)
    t.deepEqual(await trie.get(k1), v1, 'before CP: v1')
    trie.checkpoint()
    await trie.del(k1)
    t.deepEqual(await trie.get(k1), null, 'before revert: null')
    await trie.revert()
    t.deepEqual(await trie.get(k1), v1, 'after revert: v1')
    t.end()
  })

  it('Checkpointing: nested checkpoints -> commit -> revert', async (t) => {
    const trie = new Trie()
    await trie.put(k1, v1)
    t.deepEqual(await trie.get(k1), v1, 'before CP: v1')
    trie.checkpoint()
    await trie.put(k1, v12)
    trie.checkpoint()
    await trie.put(k1, v123)
    await trie.commit()
    t.deepEqual(await trie.get(k1), v123, 'after commit (second CP): v123')
    await trie.revert()
    t.deepEqual(await trie.get(k1), v1, 'after revert (first CP): v1')
    t.end()
  })

  /*
    In this educational example, it is shown how operations on a clone of a trie
    can be copied into the original trie. This also includes pruning.
    A practical use-case of this could be to take two clones of a trie
    and apply different operations on it. Based on the outcome, pick one.
    If this "checkpoint copy trick" (see test for this "trick") is not used,
    one has to keep track of what key/values are changed and then re-apply these
    on the trie again. However, by copying the checkpoint, one can immediately
    update the original trie (have to manually copy the root after applying the checkpoint, too).
    This test also implicitly checks that on copying a Trie, the checkpoints are deep-copied.
    If it would not deep copy, then some checks in this test will fail.
    See PR 2203 and 2236.
  */
  it('Checkpointing: nested checkpoints -> with pruning, verify that checkpoints are deep-copied', async (t) => {
    const KEY = Buffer.from('last_block_height')
    const KEY_ROOT = Buffer.from(keccak256(ROOT_DB_KEY))

    // Initialise State
    const CommittedState = await Trie.create({
      useKeyHashing: true,
      useNodePruning: true,
      useRootPersistence: true,
    })

    // Put some initial data
    await CommittedState.put(KEY, Buffer.from('1'))

    // Take a checkpoint to enable nested checkpoints
    // From this point, CommittedState will not write on disk
    CommittedState.checkpoint()

    // Copy CommittedState
    const MemoryState = CommittedState.copy()
    MemoryState.checkpoint()

    // Test changes on MemoryState
    await MemoryState.put(KEY, Buffer.from('2'))
    await MemoryState.commit()

    // The CommittedState should not change (not the key/value pairs, not the root, and not the root in DB)
    t.equal((await CommittedState.get(KEY))?.toString(), '1')
    t.equal(
      // @ts-expect-error
      (await CommittedState._db.get(KEY_ROOT))?.toString('hex'),
      '77ddd505d2a5b76a2a6ee34b827a0d35ca19f8d358bee3d74a84eab59794487c'
    )
    t.equal(
      CommittedState.root().toString('hex'),
      '77ddd505d2a5b76a2a6ee34b827a0d35ca19f8d358bee3d74a84eab59794487c'
    )

    // From MemoryState, now take the final checkpoint
    const finalCheckpoint = (<any>MemoryState)._db.checkpoints[0]
    // Insert this into CommittedState
    ;(<any>CommittedState)._db.checkpoints.push(finalCheckpoint)

    // Now all operations done on MemoryState (including pruning) can be
    // committed into CommittedState
    await CommittedState.commit()
    // Flush items to disk
    await CommittedState.commit()
    // Update the root (this information is not fed via the checkpoint, have to do this manually)
    CommittedState.root(MemoryState.root())
    // Setting the root does not automatically persist the root, so persist it
    await CommittedState.persistRoot()

    // Make sure CommittedState looks like we expect (2 keys, last_block_height=2 + __root__)
    // I.e. the trie is pruned.
    t.deepEqual(
      // @ts-expect-error
      [...CommittedState._db.db._database.values()].map((value) => value.toString('hex')),
      [
        'd7eba6ee0f011acb031b79554d57001c42fbfabb150eb9fdd3b6d434f7b791eb',
        'e3a1202418cf7414b1e6c2c8d92b4673eecdb4aac88f7f58623e3be903aefb2fd4655c32',
      ]
    )
    // Verify that the key is updated
    t.equal((await CommittedState.get(KEY))?.toString(), '2')
  })
})
