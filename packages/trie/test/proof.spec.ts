import * as tape from 'tape'
import { CheckpointTrie, LevelDB } from '../src'

tape('simple merkle proofs generation and verification', function (tester) {
  const it = tester.test

  it('create a merkle proof and verify it', async (t) => {
    const trie = new CheckpointTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('key1aa'), Buffer.from('0123456789012345678901234567890123456789xx'))
    await trie.put(Buffer.from('key2bb'), Buffer.from('aval2'))
    await trie.put(Buffer.from('key3cc'), Buffer.from('aval3'))

    let proof = await CheckpointTrie.createProof(trie, Buffer.from('key2bb'))
    let val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key2bb'), proof)
    t.equal(val!.toString('utf8'), 'aval2')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('key1aa'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('key2bb'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    t.equal(val, null, 'Expected value at a random key to be null')

    let myKey = Buffer.from('anyrandomkey')
    proof = await CheckpointTrie.createProof(trie, myKey)
    val = await CheckpointTrie.verifyProof(trie.root, myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    myKey = Buffer.from('anothergarbagekey') // should generate a valid proof of null
    proof = await CheckpointTrie.createProof(trie, myKey)
    proof.push(Buffer.from('123456')) // extra nodes are just ignored
    val = await CheckpointTrie.verifyProof(trie.root, myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    await trie.put(Buffer.from('another'), Buffer.from('3498h4riuhgwe'))

    // to fail our proof we can request a proof for one key
    proof = await CheckpointTrie.createProof(trie, Buffer.from('another'))
    // and try to use that proof on another key
    try {
      await CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // we can also corrupt a valid proof
    proof = await CheckpointTrie.createProof(trie, Buffer.from('key2bb'))
    proof[0].reverse()
    try {
      await CheckpointTrie.verifyProof(trie.root, Buffer.from('key2bb'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = Buffer.from('anyrandomkey')
    proof = await CheckpointTrie.createProof(trie, myKey)
    val = await CheckpointTrie.verifyProof(trie.root, myKey, proof)
    t.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, Buffer.from('thisisavalue'))
    try {
      await CheckpointTrie.verifyProof(trie.root, myKey, proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    t.end()
  })

  it('create a merkle proof and verify it with a single long key', async (t) => {
    const trie = new CheckpointTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('key1aa'), Buffer.from('0123456789012345678901234567890123456789xx'))

    const proof = await CheckpointTrie.createProof(trie, Buffer.from('key1aa'))
    const val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')

    t.end()
  })

  it('create a merkle proof and verify it with a single short key', async (t) => {
    const trie = new CheckpointTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('key1aa'), Buffer.from('01234'))

    const proof = await CheckpointTrie.createProof(trie, Buffer.from('key1aa'))
    const val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '01234')

    t.end()
  })

  it('create a merkle proof and verify it whit keys in the middle', async (t) => {
    const trie = new CheckpointTrie({ db: new LevelDB() })

    await trie.put(
      Buffer.from('key1aa'),
      Buffer.from('0123456789012345678901234567890123456789xxx')
    )
    await trie.put(
      Buffer.from('key1'),
      Buffer.from('0123456789012345678901234567890123456789Very_Long')
    )
    await trie.put(Buffer.from('key2bb'), Buffer.from('aval3'))
    await trie.put(Buffer.from('key2'), Buffer.from('short'))
    await trie.put(Buffer.from('key3cc'), Buffer.from('aval3'))
    await trie.put(Buffer.from('key3'), Buffer.from('1234567890123456789012345678901'))

    let proof = await CheckpointTrie.createProof(trie, Buffer.from('key1'))
    let val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key1'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789Very_Long')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('key2'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key2'), proof)
    t.equal(val!.toString('utf8'), 'short')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('key3'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('key3'), proof)
    t.equal(val!.toString('utf8'), '1234567890123456789012345678901')

    t.end()
  })

  it('should succeed with a simple embedded extension-branch', async (t) => {
    const trie = new CheckpointTrie({ db: new LevelDB() })

    await trie.put(Buffer.from('a'), Buffer.from('a'))
    await trie.put(Buffer.from('b'), Buffer.from('b'))
    await trie.put(Buffer.from('c'), Buffer.from('c'))

    let proof = await CheckpointTrie.createProof(trie, Buffer.from('a'))
    let val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('a'), proof)
    t.equal(val!.toString('utf8'), 'a')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('b'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('b'), proof)
    t.equal(val!.toString('utf8'), 'b')

    proof = await CheckpointTrie.createProof(trie, Buffer.from('c'))
    val = await CheckpointTrie.verifyProof(trie.root, Buffer.from('c'), proof)
    t.equal(val!.toString('utf8'), 'c')

    t.end()
  })
})
