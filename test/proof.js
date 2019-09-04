const Trie = require('../dist/index').CheckpointTrie
const async = require('async')
const tape = require('tape')
const promisify = require('util.promisify')

tape('simple merkle proofs generation and verification', (tester) => {
  const it = tester.test
  it('create a merkle proof and verify it', async (t) => {
    const trie = new Trie()
    const put = promisify(trie.put.bind(trie))

    await put('key1aa', '0123456789012345678901234567890123456789xx')
    await put('key2bb', 'aval2')
    await put('key3cc', 'aval3')

    let proof = await Trie.prove(trie, 'key2bb')
    let val = await Trie.verifyProof(trie.root, 'key2bb', proof)
    t.equal(val.toString('utf8'), 'aval2')

    proof = await Trie.prove(trie, 'key1aa')
    val = await Trie.verifyProof(trie.root, 'key1aa', proof)
    t.equal(val.toString('utf8'), '0123456789012345678901234567890123456789xx')

    proof = await Trie.prove(trie, 'key2bb')
    val = await Trie.verifyProof(trie.root, 'key2', proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    t.equal(val, null, 'Expected value at a random key to be null')

    let myKey = 'anyrandomkey'
    proof = await Trie.prove(trie, myKey)
    val = await Trie.verifyProof(trie.root, myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    myKey = 'anothergarbagekey' // should generate a valid proof of null
    proof = await Trie.prove(trie, myKey)
    proof.push(Buffer.from('123456')) // extra nodes are just ignored
    val = await Trie.verifyProof(trie.root, myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    await trie.put('another', '3498h4riuhgwe')

    // to throw an error we need to request proof for one key
    proof = await Trie.prove(trie, 'another')
    // and try to use that proof on another key
    try {
      await Trie.verifyProof(trie.root, 'key1aa', proof)
      t.fail('expected error: Missing node in DB')
    } catch (e) {
      t.equal(e.message, 'Missing node in DB')
    }

    t.end()
  })

  it('create a merkle proof and verify it with a single long key', async (t) => {
    const trie = new Trie()
    const put = promisify(trie.put.bind(trie))

    await put('key1aa', '0123456789012345678901234567890123456789xx')

    const proof = await Trie.prove(trie, 'key1aa')
    const val = await Trie.verifyProof(trie.root, 'key1aa', proof)
    t.equal(val.toString('utf8'), '0123456789012345678901234567890123456789xx')

    t.end()
  })

  it('create a merkle proof and verify it with a single short key', async (t) => {
    const trie = new Trie()
    const put = promisify(trie.put.bind(trie))

    await put('key1aa', '01234')

    const proof = await Trie.prove(trie, 'key1aa')
    const val = await Trie.verifyProof(trie.root, 'key1aa', proof)
    t.equal(val.toString('utf8'), '01234')

    t.end()
  })

  it('create a merkle proof and verify it whit keys in the midle', async (t) => {
    const trie = new Trie()
    const put = promisify(trie.put.bind(trie))

    await put('key1aa', '0123456789012345678901234567890123456789xxx')
    await put('key1', '0123456789012345678901234567890123456789Very_Long')
    await put('key2bb', 'aval3')
    await put('key2', 'short')
    await put('key3cc', 'aval3')
    await put('key3', '1234567890123456789012345678901')

    let proof = await Trie.prove(trie, 'key1')
    let val = await Trie.verifyProof(trie.root, 'key1', proof)
    t.equal(val.toString('utf8'), '0123456789012345678901234567890123456789Very_Long')

    proof = await Trie.prove(trie, 'key2')
    val = await Trie.verifyProof(trie.root, 'key2', proof)
    t.equal(val.toString('utf8'), 'short')

    proof = await Trie.prove(trie, 'key3')
    val = await Trie.verifyProof(trie.root, 'key3', proof)
    t.equal(val.toString('utf8'), '1234567890123456789012345678901')

    t.end()
  })

  it('should succeed with a simple embedded extension-branch', async (t) => {
    const trie = new Trie()
    const put = promisify(trie.put.bind(trie))

    await put('a', 'a')
    await put('b', 'b')
    await put('c', 'c')

    let proof = await Trie.prove(trie, 'a')
    let val = await Trie.verifyProof(trie.root, 'a', proof)
    t.equal(val.toString('utf8'), 'a')

    proof = await Trie.prove(trie, 'b')
    val = await Trie.verifyProof(trie.root, 'b', proof)
    t.equal(val.toString('utf8'), 'b')

    proof = await Trie.prove(trie, 'c')
    val = await Trie.verifyProof(trie.root, 'c', proof)
    t.equal(val.toString('utf8'), 'c')

    t.end()
  })
})
