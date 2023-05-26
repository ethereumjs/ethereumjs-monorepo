import { bytesToPrefixedHexString, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import * as hexencoded from '../../../ethereum-tests/TrieTests/hex_encoded_securetrie_test.json'
import * as trieanyorder from '../../../ethereum-tests/TrieTests/trieanyorder.json'
import * as secure_anyOrder from '../../../ethereum-tests/TrieTests/trieanyorder_secureTrie.json'
import * as trietest from '../../../ethereum-tests/TrieTests/trietest.json'
import * as securetest from '../../../ethereum-tests/TrieTests/trietest_secureTrie.json'
import { Trie } from '../../src'

tape('trietest.json', async (_tape) => {
  _tape.test('emptyValues', async (t) => {
    const test = trietest.emptyValues
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({})
    const toTest: Map<string, string | null> = new Map()
    for await (const [k, v] of test_in) {
      const key = utf8ToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(utf8ToBytes(_k!))
        t.deepEqual(stored_v2, _value, `trie should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash should match test')
    t.end()
  })
  _tape.test('branchingTests', async (t) => {
    const test = trietest.branchingTests
    const test_in: [string, string | null][] = test.in as [string, string | null][]
    t.pass(`${test_in}`)
    const trie_v2 = new Trie({})
    const toTest: Map<string, string | null> = new Map()

    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        t.deepEqual(
          stored_v2,
          _value,
          `after put(${k},${v}) trie should retrieve key/value: ${_k} / ${_v}`
        )
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash should match test root')
    t.end()
  })
  _tape.test('jeff', async (t) => {
    const test = trietest.jeff
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({})
    const toTest: Map<string, string | null> = new Map()

    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? hexStringToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)

      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? hexStringToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    t.end()
  })
  _tape.test('insert-middle-leaf', async (t) => {
    const test = trietest['insert-middle-leaf']
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({})
    const toTest: Map<string | null, string | null> = new Map()
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = utf8ToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      const toTest: Map<string | null, string | null> = new Map()

      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(utf8ToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    t.end()
  })
  _tape.test('branch-value-update', async (t) => {
    const test = trietest['branch-value-update']
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({})
    const toTest: Map<string | null, string | null> = new Map()
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = utf8ToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)

      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(utf8ToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    t.end()
  })
  _tape.end()
})
tape('hex_encoded_securetrie_test.json', async (_tape) => {
  _tape.test('emptyValues', async (t) => {
    const test = securetest.emptyValues
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    const toTest: Map<string | null, string | null> = new Map()
    for await (const [k, v] of test_in) {
      const key = utf8ToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(utf8ToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match')
    t.end()
  })
  _tape.test('branchingTests', async (t) => {
    const toTest: Map<string | null, string | null> = new Map()
    const test = securetest.branchingTests
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? utf8ToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? utf8ToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    t.end()
  })
  _tape.test('jeff', async (t) => {
    const toTest: Map<string | null, string | null> = new Map()
    const test = securetest.jeff
    const test_in: [string, string | null][] = test.in as [string, string | null][]

    t.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? hexStringToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)

      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? hexStringToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        t.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    t.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    t.end()
  })
  _tape.end()
})
tape('securetrie', async (t) => {
  t.test('1', async (st) => {
    const toTest: Map<string | null, string | null> = new Map()
    const test = hexencoded.test1
    const test_in: [string, string | null][] = Object.entries(test.in)
    st.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? hexStringToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? hexStringToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        st.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    st.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    st.end()
  })
  t.test('2', async (st) => {
    const toTest: Map<string | null, string | null> = new Map()
    const test = hexencoded.test2
    const test_in: [string, string | null][] = Object.entries(test.in)
    st.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? hexStringToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? hexStringToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        st.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    st.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    st.end()
  })
  t.test('3', async (st) => {
    const toTest: Map<string | null, string | null> = new Map()
    const test = hexencoded.test3
    const test_in: [string, string | null][] = Object.entries(test.in)
    st.pass(`${test_in}`)
    const trie_v2 = new Trie({ secure: true })
    for await (const [idx, [k, v]] of test_in.entries()) {
      const key = hexStringToBytes(k!)
      const value = typeof v === 'string' ? hexStringToBytes(v) : null
      await trie_v2.put(key, value)
      toTest.set(k, v)
      for await (const [_k, _v] of toTest.entries()) {
        const _value = typeof _v === 'string' ? hexStringToBytes(_v) : null
        const stored_v2 = await trie_v2.get(hexStringToBytes(_k!))
        st.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
      }
    }
    const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
    st.equal(rootHashv2, test.root, 'root hash v2 should match test root')
    st.end()
  })
  t.end()
})
const serializer = (value: string, hex: boolean = false): Uint8Array => {
  return hex ? hexStringToBytes(value) : utf8ToBytes(value)
}
tape('secure_anyOrder', async (t) => {
  for (const _test of Object.keys(secure_anyOrder)) {
    const hex = _test === 'hex'
    t.test(`${_test}`, async (st) => {
      const test = secure_anyOrder[_test as keyof typeof secure_anyOrder]
      const test_in: [string, string | null][] = Object.entries(test.in)
      const trie_v2 = new Trie({ secure: true })
      const toTest: Map<string | null, string | null> = new Map()
      for await (const [k, v] of test_in) {
        const key = serializer(k!, hex)
        const value = typeof v === 'string' ? serializer(v, hex) : null
        await trie_v2.put(key, value)
        toTest.set(k, v)
        for await (const [_k, _v] of toTest.entries()) {
          const _value = typeof _v === 'string' ? serializer(_v, hex) : null
          const stored_v2 = await trie_v2.get(serializer(_k!, hex))
          st.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
        }
      }
      const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
      st.equal(rootHashv2, test.root, 'root hash v2 should match')
      st.end()
    })
  }
  t.end()
})
tape('anyOrder', async (t) => {
  for (const _test of Object.keys(trieanyorder)) {
    const hex = _test === 'hex'
    t.test(`${_test}`, async (st) => {
      const test = trieanyorder[_test as keyof typeof trieanyorder]
      const test_in: [string, string | null][] = Object.entries(test.in)
      const trie_v2 = new Trie({})
      const toTest: Map<string | null, string | null> = new Map()
      for await (const [k, v] of test_in) {
        const key = serializer(k!, hex)
        const value = typeof v === 'string' ? serializer(v, hex) : null
        await trie_v2.put(key, value)
        toTest.set(k, v)

        for await (const [_k, _v] of toTest.entries()) {
          const _value = typeof _v === 'string' ? serializer(_v, hex) : null
          const stored_v2 = await trie_v2.get(serializer(_k!, hex))
          st.deepEqual(stored_v2, _value, `v2 should retrieve key/value: ${_k} / ${_v}`)
        }
      }
      const rootHashv2 = bytesToPrefixedHexString(trie_v2.root())
      st.equal(rootHashv2, test.root, 'root hash v2 should match')
      st.end()
    })
  }
  t.end()
})
