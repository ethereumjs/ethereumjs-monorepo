import { bytesToPrefixedHexString, hexStringToBytes, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Trie } from '../src'

tape('official tests', async function (t) {
  const jsonTests = require('./fixtures/trietest.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new Trie()

  for await (const [idx, testName] of testNames.entries()) {
    t.pass(`Starting ${idx + 1}/${testNames.length}: ${testName}`)
    const inputs = jsonTests[testName].in
    const expect = jsonTests[testName].root
    for await (const [_i_input, input] of inputs.entries()) {
      console.log(_i_input, input[0], input[1])
      for (let i = 0; i < 2; i++) {
        if (typeof input[i] === 'string' && input[i].slice(0, 2) === '0x') {
          input[i] = hexStringToBytes(input[i])
        } else if (typeof input[i] === 'string') {
          input[i] = utf8ToBytes(input[i])
        }
      }
      await trie.put(input[0], input[1])
      console.log(_i_input, bytesToPrefixedHexString(trie.root()))
    }
    t.equal(bytesToPrefixedHexString(trie.root()), expect)
    trie = new Trie()
  }
  t.end()
})

tape('official tests any order', async function (t) {
  const jsonTests = require('./fixtures/trieanyorder.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new Trie()
  for (const testName of testNames) {
    const test = jsonTests[testName]
    const keys = Object.keys(test.in)
    let key: any
    for (key of keys) {
      let val = test.in[key]

      if (typeof key === 'string' && key.slice(0, 2) === '0x') {
        key = hexStringToBytes(key)
      } else if (typeof key === 'string') {
        key = utf8ToBytes(key)
      }

      if (typeof val === 'string' && val.slice(0, 2) === '0x') {
        val = hexStringToBytes(val)
      } else if (typeof val === 'string') {
        val = utf8ToBytes(val)
      }

      await trie.put(key, val)
    }
    t.equal(bytesToPrefixedHexString(trie.root()), test.root)
    trie = new Trie()
  }
  t.end()
})
