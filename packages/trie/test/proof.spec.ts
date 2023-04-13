import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Trie } from '../src'

tape('simple merkle proofs generation and verification', function (tester) {
  const it = tester.test

  it('create a merkle proof and verify it', async (t) => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aval2'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aval3'))

    let proof = await trie.createProof(utf8ToBytes('key2bb'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
    t.equal(bytesToUtf8(val!), 'aval2')

    proof = await trie.createProof(utf8ToBytes('key1aa'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')

    proof = await trie.createProof(utf8ToBytes('key2bb'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    t.equal(val, null, 'Expected value at a random key to be null')

    let myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    myKey = utf8ToBytes('anothergarbagekey') // should generate a valid proof of null
    proof = await trie.createProof(myKey)
    proof.push(utf8ToBytes('123456')) // extra nodes are just ignored
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    await trie.put(utf8ToBytes('another'), utf8ToBytes('3498h4riuhgwe'))

    // to fail our proof we can request a proof for one key
    proof = await trie.createProof(utf8ToBytes('another'))
    // and try to use that proof on another key
    try {
      await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // we can also corrupt a valid proof
    proof = await trie.createProof(utf8ToBytes('key2bb'))
    proof[0].reverse()
    try {
      await trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
      t.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      t.equal(e.message, 'Invalid proof provided')
    }

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, utf8ToBytes('thisisavalue'))
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

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))

    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')

    t.end()
  })

  it('create a merkle proof and verify it with a single short key', async (t) => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))

    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.equal(bytesToUtf8(val!), '01234')

    t.end()
  })

  it('create a merkle proof and verify it whit keys in the middle', async (t) => {
    const trie = new Trie()

    await trie.put(
      utf8ToBytes('key1aa'),
      utf8ToBytes('0123456789012345678901234567890123456789xxx')
    )
    await trie.put(
      utf8ToBytes('key1'),
      utf8ToBytes('0123456789012345678901234567890123456789Very_Long')
    )
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aval3'))
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('short'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aval3'))
    await trie.put(utf8ToBytes('key3'), utf8ToBytes('1234567890123456789012345678901'))

    let proof = await trie.createProof(utf8ToBytes('key1'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('key1'), proof)
    t.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789Very_Long')

    proof = await trie.createProof(utf8ToBytes('key2'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    t.equal(bytesToUtf8(val!), 'short')

    proof = await trie.createProof(utf8ToBytes('key3'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key3'), proof)
    t.equal(bytesToUtf8(val!), '1234567890123456789012345678901')

    t.end()
  })

  it('should succeed with a simple embedded extension-branch', async (t) => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('a'), utf8ToBytes('a'))
    await trie.put(utf8ToBytes('b'), utf8ToBytes('b'))
    await trie.put(utf8ToBytes('c'), utf8ToBytes('c'))

    let proof = await trie.createProof(utf8ToBytes('a'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('a'), proof)
    t.equal(bytesToUtf8(val!), 'a')

    proof = await trie.createProof(utf8ToBytes('b'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('b'), proof)
    t.equal(bytesToUtf8(val!), 'b')

    proof = await trie.createProof(utf8ToBytes('c'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('c'), proof)
    t.equal(bytesToUtf8(val!), 'c')

    t.end()
  })
})
