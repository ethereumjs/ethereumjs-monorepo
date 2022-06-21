import * as tape from 'tape'
import { CheckpointTrie, LevelDB } from '../src'

tape('official tests', async function (t) {
  const jsonTests = require('./fixtures/trietest.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new CheckpointTrie({ db: new LevelDB() })

  for (const testName of testNames) {
    const inputs = jsonTests[testName].in
    const expect = jsonTests[testName].root
    for (const input of inputs) {
      for (let i = 0; i < 2; i++) {
        if (input[i] && input[i].slice(0, 2) === '0x') {
          input[i] = Buffer.from(input[i].slice(2), 'hex')
        } else if (input[i] && typeof input[i] === 'string') {
          input[i] = Buffer.from(input[i])
        }
        await trie.put(Buffer.from(input[0]), input[1])
      }
    }
    t.equal('0x' + trie.root.toString('hex'), expect)
    trie = new CheckpointTrie({ db: new LevelDB() })
  }
  t.end()
})

tape('official tests any order', async function (t) {
  const jsonTests = require('./fixtures/trieanyorder.json').tests
  const testNames = Object.keys(jsonTests)
  let trie = new CheckpointTrie({ db: new LevelDB() })
  for (const testName of testNames) {
    const test = jsonTests[testName]
    const keys = Object.keys(test.in)
    let key: any
    for (key of keys) {
      let val = test.in[key]

      if (key.slice(0, 2) === '0x') {
        key = Buffer.from(key.slice(2), 'hex')
      }

      if (val && val.slice(0, 2) === '0x') {
        val = Buffer.from(val.slice(2), 'hex')
      }

      await trie.put(Buffer.from(key), Buffer.from(val))
    }
    t.equal('0x' + trie.root.toString('hex'), test.root)
    trie = new CheckpointTrie({ db: new LevelDB() })
  }
  t.end()
})
