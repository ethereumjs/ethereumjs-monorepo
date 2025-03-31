import { RLP } from '@ethereumjs/rlp'
import { bytesToUtf8, equalsBytes, setLengthLeft, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  MerklePatriciaTrie,
  createMPTFromProof,
  createMerkleProof,
  updateMPTFromMerkleProof,
  verifyMerkleProof,
} from '../src/index.ts'

describe('simple merkle proofs generation and verification', () => {
  it('create a merkle proof and verify it', async () => {
    const trie = new MerklePatriciaTrie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aVal2'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aVal3'))

    let proof = await createMerkleProof(trie, utf8ToBytes('key2bb'))
    let val = await verifyMerkleProof(utf8ToBytes('key2bb'), proof)
    assert.equal(bytesToUtf8(val!), 'aVal2')

    proof = await createMerkleProof(trie, utf8ToBytes('key1aa'))
    val = await verifyMerkleProof(utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')

    proof = await createMerkleProof(trie, utf8ToBytes('key2bb'))
    val = await verifyMerkleProof(utf8ToBytes('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    assert.equal(val, null, 'Expected value at a random key to be null')

    let myKey = utf8ToBytes('anyRandomKey')
    proof = await createMerkleProof(trie, myKey)
    val = await verifyMerkleProof(myKey, proof)
    assert.equal(val, null, 'Expected value to be null')

    myKey = utf8ToBytes('anotherGarbageKey') // should generate a valid proof of null
    proof = await createMerkleProof(trie, myKey)
    proof.push(utf8ToBytes('123456')) // extra nodes are just ignored
    val = await verifyMerkleProof(myKey, proof)
    assert.equal(val, null, 'Expected value to be null')

    await trie.put(utf8ToBytes('another'), utf8ToBytes('3498h4riuhgwe')) // cspell:disable-line

    // to fail our proof we can request a proof for one key
    proof = await createMerkleProof(trie, utf8ToBytes('another'))
    // and try to use that proof on another key
    try {
      await verifyMerkleProof(utf8ToBytes('key1aa'), proof)
      assert.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      assert.equal(e.message, 'Invalid proof provided')
    }

    // we can also corrupt a valid proof
    proof = await createMerkleProof(trie, utf8ToBytes('key2bb'))
    proof[0].reverse()
    try {
      await verifyMerkleProof(utf8ToBytes('key2bb'), proof)
      assert.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      assert.equal(e.message, 'Invalid proof provided')
    }

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = utf8ToBytes('anyRandomKey')
    proof = await createMerkleProof(trie, myKey)
    val = await verifyMerkleProof(myKey, proof)
    assert.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, utf8ToBytes('thisIsaValue'))
    try {
      await createMPTFromProof(proof, { root: trie.root() })
      assert.fail(`expected error: 'The provided proof does not have the expected trie root'`)
    } catch (e: any) {
      assert.equal(e.message, 'The provided proof does not have the expected trie root')
    }
  })

  it('create a merkle proof and verify it with a single long key', async () => {
    const trie = new MerklePatriciaTrie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))

    const proof = await createMerkleProof(trie, utf8ToBytes('key1aa'))
    const val = await verifyMerkleProof(utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')
  })

  it('create a merkle proof and verify it with a single short key', async () => {
    const trie = new MerklePatriciaTrie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))

    const proof = await createMerkleProof(trie, utf8ToBytes('key1aa'))
    const val = await verifyMerkleProof(utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '01234')
  })

  it('create a merkle proof and verify it whit keys in the middle', async () => {
    const trie = new MerklePatriciaTrie()

    await trie.put(
      utf8ToBytes('key1aa'),
      utf8ToBytes('0123456789012345678901234567890123456789xxx'),
    )
    await trie.put(
      utf8ToBytes('key1'),
      utf8ToBytes('0123456789012345678901234567890123456789Very_Long'),
    )
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aVal3'))
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('short'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aVal3'))
    await trie.put(utf8ToBytes('key3'), utf8ToBytes('1234567890123456789012345678901'))

    let proof = await createMerkleProof(trie, utf8ToBytes('key1'))
    let val = await verifyMerkleProof(utf8ToBytes('key1'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789Very_Long')

    proof = await createMerkleProof(trie, utf8ToBytes('key2'))
    val = await verifyMerkleProof(utf8ToBytes('key2'), proof)
    assert.equal(bytesToUtf8(val!), 'short')

    proof = await createMerkleProof(trie, utf8ToBytes('key3'))
    val = await verifyMerkleProof(utf8ToBytes('key3'), proof)
    assert.equal(bytesToUtf8(val!), '1234567890123456789012345678901')
  })

  it('should succeed with a simple embedded extension-branch', async () => {
    const trie = new MerklePatriciaTrie()

    await trie.put(utf8ToBytes('a'), utf8ToBytes('a'))
    await trie.put(utf8ToBytes('b'), utf8ToBytes('b'))
    await trie.put(utf8ToBytes('c'), utf8ToBytes('c'))

    let proof = await createMerkleProof(trie, utf8ToBytes('a'))
    let val = await verifyMerkleProof(utf8ToBytes('a'), proof)
    assert.equal(bytesToUtf8(val!), 'a')

    proof = await createMerkleProof(trie, utf8ToBytes('b'))
    val = await verifyMerkleProof(utf8ToBytes('b'), proof)
    assert.equal(bytesToUtf8(val!), 'b')

    proof = await createMerkleProof(trie, utf8ToBytes('c'))
    val = await verifyMerkleProof(utf8ToBytes('c'), proof)
    assert.equal(bytesToUtf8(val!), 'c')
  })

  it('creates and updates tries from proof', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: true })

    const key = setLengthLeft(new Uint8Array([1, 2, 3]), 32)
    const encodedValue = RLP.encode(new Uint8Array([5]))

    const key2 = setLengthLeft(new Uint8Array([2]), 32)
    const key3 = setLengthLeft(new Uint8Array([3]), 32)

    const encodedValue2 = RLP.encode(new Uint8Array([6]))
    const encodedValue3 = RLP.encode(new Uint8Array([7]))

    await trie.put(key, encodedValue)
    await trie.put(key2, encodedValue2)
    await trie.put(key3, encodedValue3)
    const proof = await createMerkleProof(trie, key)

    const newTrie = await createMPTFromProof(proof, { useKeyHashing: true })
    const trieValue = await newTrie.get(key)

    assert.isTrue(equalsBytes(trieValue!, encodedValue), 'trie value successfully copied')
    assert.isTrue(equalsBytes(trie.root(), newTrie.root()), 'root set correctly')

    const proof2 = await createMerkleProof(trie, key2)
    await updateMPTFromMerkleProof(newTrie, proof2)
    const trieValue2 = await newTrie.get(key2)

    assert.isTrue(equalsBytes(trieValue2!, encodedValue2), 'trie value successfully updated')
    assert.isTrue(equalsBytes(trie.root(), newTrie.root()), 'root set correctly')

    const trieValue3 = await newTrie.get(key3)
    assert.equal(trieValue3, null, 'cannot reach the third key')

    const safeTrie = new MerklePatriciaTrie({ useKeyHashing: true })
    const safeKey = setLengthLeft(new Uint8Array([100]), 32)
    const safeValue = RLP.encode(new Uint8Array([1337]))

    await safeTrie.put(safeKey, safeValue)
    const safeProof = await createMerkleProof(safeTrie, safeKey)

    try {
      await updateMPTFromMerkleProof(newTrie, safeProof, true)
      assert.fail('cannot reach this')
    } catch {
      assert.isTrue(true, 'throws on unmatching proof')
    }

    await updateMPTFromMerkleProof(newTrie, safeProof)
    assert.isTrue(equalsBytes(trie.root(), newTrie.root()), 'root set correctly')

    const newSafeValue = await newTrie.get(safeKey)

    assert.equal(newSafeValue, null, 'cannot reach the trie item unless the root is set')

    newTrie.root(safeTrie.root())

    const updatedNewSafeValue = await newTrie.get(safeKey)
    assert.isTrue(
      equalsBytes(updatedNewSafeValue!, safeValue),
      'successfully set the trie to the new root and got the correct value',
    )
  })
})
