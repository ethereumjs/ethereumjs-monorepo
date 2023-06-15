import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Trie } from '../src'

tape('simple merkle proofs generation and verification', function (tester) {
  const it = tester.test

  it('create a merkle proof and verify it', async (t) => {
    const trie = await Trie.create({})

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aval2'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aval3'))

    let proof = await trie.createProof(utf8ToBytes('key2bb'))
    let val = await Trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
    if (val instanceof Uint8Array) {
      t.equal(bytesToUtf8(val), 'aval2', `verifyProof returned ${bytesToUtf8(val)} for key2bb`)
    } else {
      t.fail(`verifyProof returned ${val} for key2bb`)
    }
    proof = await trie.createProof(utf8ToBytes('key1aa'))
    val = await Trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.ok(val, 'val returned a value')
    if (val instanceof Uint8Array) {
      t.equal(
        bytesToUtf8(val!),
        '0123456789012345678901234567890123456789xx',
        `verifyProof returned ${bytesToUtf8(val)} for key1aa`
      )
    }
    proof = await trie.createProof(utf8ToBytes('key2bb'))
    val = await Trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    t.equal(val, null, 'Expected value at a random key to be null')

    let myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await Trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')

    myKey = utf8ToBytes('anothergarbagekey') // should generate a valid proof of null
    proof = await trie.createProof(myKey)
    proof.push(utf8ToBytes('123456')) // extra nodes are just ignored
    val = await Trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')
    await trie.put(utf8ToBytes('another'), utf8ToBytes('3498h4riuhgwe'))

    // to fail our proof we can request a proof for one key
    proof = await trie.createProof(utf8ToBytes('another'))
    // and try to use that proof on another key
    let valid = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.equal(valid, null, 'Expected value to be null')

    // we can also corrupt a valid proof
    proof = await trie.createProof(utf8ToBytes('key2bb'))
    proof[0].reverse()
    valid = await Trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
    t.equal(valid, null, 'verify proof should return null for a corrupt proof')

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await Trie.verifyProof(trie.root(), myKey, proof)
    t.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, utf8ToBytes('thisisavalue'))
    valid = await trie.verifyProof(trie.root(), myKey, proof)
    t.equal(valid, null, 'verify proof should return false for an invalid exclusion proof')
    t.end()
  })
  it('create a merkle proof and verify it with a single long key', async (t) => {
    const trie = new Trie({})
    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))
    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.ok(val, 'val returned a value')
    t.deepEqual(
      val,
      utf8ToBytes('0123456789012345678901234567890123456789xx'),
      'verified proof for key1aa'
    )
    t.end()
  })
  it('create a merkle proof and verify it with a single short key', async (t) => {
    const trie = new Trie({})

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))

    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await Trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    t.ok(val, 'val returned a value')
    t.deepEqual(val, utf8ToBytes('01234'), 'verified proof for key1aa')
    t.end()
  })

  it('create a merkle proof and verify it whit keys in the middle', async (t) => {
    const trie = new Trie({})
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
    let val = await Trie.verifyProof(trie.root(), utf8ToBytes('key1'), proof)
    t.deepEqual(
      val,
      utf8ToBytes('0123456789012345678901234567890123456789Very_Long'),
      'retrieved value for key1'
    )
    proof = await trie.createProof(utf8ToBytes('key2'))
    val = await Trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    t.deepEqual(val, utf8ToBytes('short'), 'retrieved value for key2')

    proof = await trie.createProof(utf8ToBytes('key3'))
    val = await Trie.verifyProof(trie.root(), utf8ToBytes('key3'), proof)
    t.deepEqual(val, utf8ToBytes('1234567890123456789012345678901'), 'retrieved value for key3')

    t.end()
  })

  it('should succeed with a simple embedded extension-branch', async (t) => {
    const trie = new Trie({})

    await trie.put(utf8ToBytes('a'), utf8ToBytes('a'))
    await trie.put(utf8ToBytes('b'), utf8ToBytes('b'))
    await trie.put(utf8ToBytes('c'), utf8ToBytes('c'))

    let proof = await trie.createProof(utf8ToBytes('a'))
    let val = await Trie.verifyProof(trie.root(), utf8ToBytes('a'), proof)
    t.deepEqual(val, utf8ToBytes('a'))
    if (val instanceof Uint8Array) {
      proof = await trie.createProof(utf8ToBytes('b'))
      val = await Trie.verifyProof(trie.root(), utf8ToBytes('b'), proof)
      t.deepEqual(val, utf8ToBytes('b'))

      proof = await trie.createProof(utf8ToBytes('c'))
      const proofTrie = new Trie({ rootNodeRLP: proof[0] })
      val = await proofTrie.verifyProof(trie.root(), utf8ToBytes('c'), proof)
      t.deepEqual(val, utf8ToBytes('c'))
      t.end()
    }
  })
})
