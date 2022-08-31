import * as tape from 'tape'

import { Trie } from '../src'

tape('simple merkle proofs generation and verification', function (tester) {
  const it = tester.test

  it('create a merkle proof and verify it', async (t) => {
    const trie = new Trie()

    await trie.put(Buffer.from('key1aa'), Buffer.from('0123456789012345678901234567890123456789xx'))
    await trie.put(Buffer.from('key2bb'), Buffer.from('aval2'))
    await trie.put(Buffer.from('key3cc'), Buffer.from('aval3'))

    let proof = await trie.createProof(Buffer.from('key2bb'))
    let val = await trie.verifyProof(trie.root(), Buffer.from('key2bb'), proof)
    t.equal(val!.toString('utf8'), 'aval2')

    proof = await trie.createProof(Buffer.from('key1aa'))
    val = await trie.verifyProof(trie.root(), Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')

    proof = await trie.createProof(Buffer.from('key2bb'))
    val = await trie.verifyProof(trie.root(), Buffer.from('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    t.equal(val, null, 'Expected value at a random key to be null')

    let myKey = Buffer.from('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    myKey = Buffer.from('anothergarbagekey') // should generate a valid proof of null
    proof = await trie.createProof(myKey)
    proof.push(Buffer.from('123456')) // extra nodes are just ignored
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    await trie.put(Buffer.from('another'), Buffer.from('3498h4riuhgwe'))

    // to fail our proof we can request a proof for one key
    proof = await trie.createProof(Buffer.from('another'))
    // and try to use that proof on another key
    try {
      await trie.verifyProof(trie.root(), Buffer.from('key1aa'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // we can also corrupt a valid proof
    proof = await trie.createProof(Buffer.from('key2bb'))
    proof[0].reverse()
    try {
      await trie.verifyProof(trie.root(), Buffer.from('key2bb'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = Buffer.from('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, Buffer.from('thisisavalue'))
    try {
      await trie.verifyProof(trie.root(), myKey, proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    t.end()
  })

  it('create a merkle proof and verify it with a single long key', async (t) => {
    const trie = new Trie()

    await trie.put(Buffer.from('key1aa'), Buffer.from('0123456789012345678901234567890123456789xx'))

    const proof = await trie.createProof(Buffer.from('key1aa'))
    const val = await trie.verifyProof(trie.root(), Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789xx')

    t.end()
  })

  it('create a merkle proof and verify it with a single short key', async (t) => {
    const trie = new Trie()

    await trie.put(Buffer.from('key1aa'), Buffer.from('01234'))

    const proof = await trie.createProof(Buffer.from('key1aa'))
    const val = await trie.verifyProof(trie.root(), Buffer.from('key1aa'), proof)
    t.equal(val!.toString('utf8'), '01234')

    t.end()
  })

  it('create a merkle proof and verify it whit keys in the middle', async (t) => {
    const trie = new Trie()

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

    let proof = await trie.createProof(Buffer.from('key1'))
    let val = await trie.verifyProof(trie.root(), Buffer.from('key1'), proof)
    t.equal(val!.toString('utf8'), '0123456789012345678901234567890123456789Very_Long')

    proof = await trie.createProof(Buffer.from('key2'))
    val = await trie.verifyProof(trie.root(), Buffer.from('key2'), proof)
    t.equal(val!.toString('utf8'), 'short')

    proof = await trie.createProof(Buffer.from('key3'))
    val = await trie.verifyProof(trie.root(), Buffer.from('key3'), proof)
    t.equal(val!.toString('utf8'), '1234567890123456789012345678901')

    t.end()
  })

  it('should succeed with a simple embedded extension-branch', async (t) => {
    const trie = new Trie()

    await trie.put(Buffer.from('a'), Buffer.from('a'))
    await trie.put(Buffer.from('b'), Buffer.from('b'))
    await trie.put(Buffer.from('c'), Buffer.from('c'))

    let proof = await trie.createProof(Buffer.from('a'))
    let val = await trie.verifyProof(trie.root(), Buffer.from('a'), proof)
    t.equal(val!.toString('utf8'), 'a')

    proof = await trie.createProof(Buffer.from('b'))
    val = await trie.verifyProof(trie.root(), Buffer.from('b'), proof)
    t.equal(val!.toString('utf8'), 'b')

    proof = await trie.createProof(Buffer.from('c'))
    val = await trie.verifyProof(trie.root(), Buffer.from('c'), proof)
    t.equal(val!.toString('utf8'), 'c')

    t.end()
  })
})

tape('createRangeProof()', function (tester) {
  const it = tester.test

  it('throws when lKey is higher than rKey', async (t) => {
    const trie = new Trie({
      useKeyHashing: true,
    })

    await trie.put(Buffer.from('1000', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1100', 'hex'), Buffer.from('a'))

    const lKey = Buffer.from('ff'.repeat(32), 'hex')
    const rKey = Buffer.from('00'.repeat(32), 'hex')
    try {
      await trie.createRangeProof(lKey, rKey)
      t.fail('cannot reach this')
    } catch (e) {
      t.pass('succesfully threw')
    }
  })

  it('creates one key/value proof', async (t) => {
    // In this case, there are no key/values between the left and the right key
    // However, the first value on the right of the rKey key should be reported
    const trie = new Trie({
      useKeyHashing: true,
    })

    const proverTrie = new Trie()

    await trie.put(Buffer.from('1000', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1100', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1110', 'hex'), Buffer.from('a'))

    await trie.put(Buffer.from('2000', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2200', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2220', 'hex'), Buffer.from('b'))

    await trie.put(Buffer.from('3000', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3300', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3330', 'hex'), Buffer.from('c'))

    const lKey = Buffer.from('00'.repeat(32), 'hex')
    const rKey = Buffer.from('1234' + '00'.repeat(30), 'hex')

    const proof = await trie.createRangeProof(lKey, rKey)

    t.ok(proof.keys.length === 1)
    t.ok(proof.values.length === 1)

    await proverTrie.verifyRangeProof(
      trie.root(),
      proof.keys[proof.keys.length - 1],
      proof.keys[proof.keys.length - 1],
      proof.keys,
      proof.values,
      proof.proof
    )

    t.end()
  })

  it('creates multiple key/value proof', async (t) => {
    // In this case, report a part of the key/value pairs, together with the double proof of
    // lKey and rKey
    const trie = new Trie({
      useKeyHashing: true,
    })

    const proverTrie = new Trie()

    await trie.put(Buffer.from('1000', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1100', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1110', 'hex'), Buffer.from('a'))

    await trie.put(Buffer.from('2000', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2200', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2220', 'hex'), Buffer.from('b'))

    await trie.put(Buffer.from('3000', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3300', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3330', 'hex'), Buffer.from('c'))

    const lKey = Buffer.from('00'.repeat(32), 'hex')
    const rKey = Buffer.from('9999' + '00'.repeat(30), 'hex')

    const proof = await trie.createRangeProof(lKey, rKey)

    // This should report a part of the trie, somewhere between 1 and 9 elements

    const vLen = proof.values.length
    const kLen = proof.keys.length

    t.ok(vLen === kLen)
    t.ok(vLen > 1 && vLen < 9)

    await proverTrie.verifyRangeProof(
      trie.root(),
      lKey,
      rKey,
      proof.keys,
      proof.values,
      proof.proof
    )

    t.end()
  })

  it('creates zero key/value proof', async (t) => {
    // In this case, there are no key/values between the left and the right key
    const trie = new Trie({
      useKeyHashing: true,
    })

    const proverTrie = new Trie()

    await trie.put(Buffer.from('1000', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1100', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1110', 'hex'), Buffer.from('a'))

    await trie.put(Buffer.from('2000', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2200', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2220', 'hex'), Buffer.from('b'))

    await trie.put(Buffer.from('3000', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3300', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3330', 'hex'), Buffer.from('c'))

    const lKey = Buffer.from('EF'.repeat(32), 'hex')
    const rKey = Buffer.from('FF'.repeat(32), 'hex')

    const proof = await trie.createRangeProof(lKey, rKey)

    await proverTrie.verifyRangeProof(
      trie.root(),
      lKey,
      rKey,
      proof.keys,
      proof.values,
      proof.proof
    )

    t.end()
  })

  it('creates all elements proof', async (t) => {
    // In this case, report all values of the trie
    const trie = new Trie({
      useKeyHashing: true,
    })

    const proverTrie = new Trie()

    await trie.put(Buffer.from('1000', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1100', 'hex'), Buffer.from('a'))
    await trie.put(Buffer.from('1110', 'hex'), Buffer.from('a'))

    await trie.put(Buffer.from('2000', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2200', 'hex'), Buffer.from('b'))
    await trie.put(Buffer.from('2220', 'hex'), Buffer.from('b'))

    await trie.put(Buffer.from('3000', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3300', 'hex'), Buffer.from('c'))
    await trie.put(Buffer.from('3330', 'hex'), Buffer.from('c'))

    const lKey = Buffer.from('00'.repeat(32), 'hex')
    const rKey = Buffer.from('FF'.repeat(32), 'hex')

    const proof = await trie.createRangeProof(lKey, rKey)

    // We do NOT need the multiproof here
    // However, if we want to check this, we have to:
    // (1) check if there is no item left of lKey
    // (2) check if there is no item right of rKey
    // This is trivial in a flat DB, but this is not yet supported
    // Therefore, probably do not implement this.
    t.ok(proof.proof.length === 0)
    t.ok(proof.values.length === 9)
    t.ok(proof.keys.length === 9)

    await proverTrie.verifyRangeProof(
      trie.root(),
      lKey,
      rKey,
      proof.keys,
      proof.values,
      proof.proof
    )

    t.end()
  })
})
