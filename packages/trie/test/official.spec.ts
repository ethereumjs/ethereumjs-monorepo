import tape from 'tape'
import { CheckpointTrie } from '../src/index.js'
import { MemoryDB, LevelDB } from '../src/db.js'
import trieTestsJSON from './fixtures/trietest.json'
import trieAnyOrderTestsJSON from './fixtures/trieanyorder.json'
const trieTests = trieTestsJSON.tests as any
const trieAnyOrderTests = trieAnyOrderTestsJSON.tests as any

for (const DB of [MemoryDB, LevelDB]) {
  tape('official tests', async function (t) {
    const testNames = Object.keys(trieTests)
    let trie = new CheckpointTrie({ db: new DB() })

    for (const testName of testNames) {
      const inputs = trieTests[testName].in
      const expect = trieTests[testName].root
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
      trie = new CheckpointTrie({ db: new DB() })
    }
    t.end()
  })

  tape('official tests any order', async function (t) {
    const testNames = Object.keys(trieAnyOrderTests)
    let trie = new CheckpointTrie({ db: new DB() })
    for (const testName of testNames) {
      const test = trieAnyOrderTests[testName]
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
      trie = new CheckpointTrie({ db: new DB() })
    }
    t.end()
  })
}
