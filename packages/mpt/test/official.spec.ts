import { bytesToHex, hexToBytes, isHexString, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie } from '../src/index.js'

import { trieAnyOrderData } from './fixtures/trieAnyOrder.js'
import { trieTestData } from './fixtures/trieTest.js'

describe('official tests', () => {
  it('should work', async () => {
    const testNames = Object.keys(trieTestData.tests) as (keyof typeof trieTestData.tests)[]
    let trie = new MerklePatriciaTrie()

    for (const testName of testNames) {
      const inputs = trieTestData.tests[testName].in
      const expect = trieTestData.tests[testName].root
      for (const input of inputs) {
        const processedInput = input.map((item) => {
          if (item === null) {
            return item
          }

          return isHexString(item) ? hexToBytes(item) : utf8ToBytes(item)
        }) as [Uint8Array, Uint8Array | null]

        await trie.put(processedInput[0], processedInput[1])
      }
      assert.equal(bytesToHex(trie.root()), expect)
      trie = new MerklePatriciaTrie()
    }
  })
})

describe('official tests any order', async () => {
  it('should work', async () => {
    const testNames = Object.keys(trieAnyOrderData.tests) as (keyof typeof trieAnyOrderData.tests)[]
    let trie = new MerklePatriciaTrie()
    for (const testName of testNames) {
      const test = trieAnyOrderData.tests[testName]
      const keys = Object.keys(test.in)
      for (const stringKey of keys) {
        const stringValue: string = test.in[stringKey as keyof typeof test.in]
        let key: Uint8Array
        let value: Uint8Array

        if (isHexString(stringKey)) {
          key = hexToBytes(stringKey)
        } else {
          key = utf8ToBytes(stringKey)
        }

        if (isHexString(stringValue)) {
          value = hexToBytes(stringValue)
        } else {
          value = utf8ToBytes(stringValue)
        }

        await trie.put(key, value)
      }
      assert.equal(bytesToHex(trie.root()), test.root)
      trie = new MerklePatriciaTrie()
    }
  })
})
