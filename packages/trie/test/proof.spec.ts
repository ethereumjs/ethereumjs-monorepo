import { bytesToUtf8, compareBytes, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { Trie } from '../src'

hexStringToBytes

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

tape('createRangeProof()', function (tester) {
  const it = tester.test

  it('throws when lKey is higher than rKey', async (t) => {
    const trie = new Trie({
      useKeyHashing: true,
    })

    await trie.put(hexStringToBytes('1000'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1100'), hexStringToBytes('a'))

    const lKey = hexStringToBytes('ff'.repeat(32))
    const rKey = hexStringToBytes('00'.repeat(32))
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

    await trie.put(hexStringToBytes('1000'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1100'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1110'), hexStringToBytes('a'))

    await trie.put(hexStringToBytes('2000'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2200'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2220'), hexStringToBytes('b'))

    await trie.put(hexStringToBytes('3000'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3300'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3330'), hexStringToBytes('c'))

    const lKey = hexStringToBytes('00'.repeat(32))
    const rKey = hexStringToBytes('00'.repeat(32))

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

    await trie.put(hexStringToBytes('1000'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1100'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1110'), hexStringToBytes('a'))

    await trie.put(hexStringToBytes('2000'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2200'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2220'), hexStringToBytes('b'))

    await trie.put(hexStringToBytes('3000'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3300'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3330'), hexStringToBytes('c'))

    const lKey = hexStringToBytes('00'.repeat(32))
    const rKey = hexStringToBytes('9999' + '00'.repeat(30))

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

    await trie.put(hexStringToBytes('1000'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1100'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1110'), hexStringToBytes('a'))

    await trie.put(hexStringToBytes('2000'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2200'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2220'), hexStringToBytes('b'))

    await trie.put(hexStringToBytes('3000'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3300'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3330'), hexStringToBytes('c'))

    const lKey = hexStringToBytes('EF'.repeat(32))
    const rKey = hexStringToBytes('FF'.repeat(32))

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

    await trie.put(hexStringToBytes('1000'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1100'), hexStringToBytes('a'))
    await trie.put(hexStringToBytes('1110'), hexStringToBytes('a'))

    await trie.put(hexStringToBytes('2000'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2200'), hexStringToBytes('b'))
    await trie.put(hexStringToBytes('2220'), hexStringToBytes('b'))

    await trie.put(hexStringToBytes('3000'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3300'), hexStringToBytes('c'))
    await trie.put(hexStringToBytes('3330'), hexStringToBytes('c'))

    const lKey = hexStringToBytes('00'.repeat(32))
    const rKey = hexStringToBytes('FF'.repeat(32))

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

  it('passes randomly created tries with randomly selected ranges', async (t) => {
    for (let i = 0; i < 1; i++) {
      const trie = new Trie({
        useKeyHashing: true,
      })
      // Generate [100, 1000) key/value pairs
      const keyCount = 100 + Math.floor(Math.random() * 900)
      for (let j = 0; j < keyCount; j++) {
        await trie.put(randomBytes(32), randomBytes(32))
      }

      // 1000 verified requests
      for (let j = 0; j < 1; j++) {
        const lKey = randomBytes(32)
        let rKey = randomBytes(32)
        while (compareBytes(lKey, rKey) > 0) {
          rKey = randomBytes(32)
        }
        const proof = await trie.createRangeProof(lKey, rKey)
        const proverTrie = new Trie()
        if (proof.values.length === 1) {
          const reportedLKey = proof.keys[0]
          if (compareBytes(reportedLKey, rKey) > 0) {
            try {
              await proverTrie.verifyRangeProof(
                trie.root(),
                reportedLKey,
                reportedLKey,
                proof.keys,
                proof.values,
                proof.proof
              )
              t.pass('succesfully verified')
            } catch (e: any) {
              t.fail('could not verify')
              t.comment(e.message)
            }
          } else {
            try {
              await proverTrie.verifyRangeProof(
                trie.root(),
                lKey,
                rKey,
                proof.keys,
                proof.values,
                proof.proof
              )
              t.pass('succesfully verified')
            } catch (e: any) {
              t.fail('could not verify')
              t.comment(e.message)
            }
          }
        }
      }
    }
  })
})
