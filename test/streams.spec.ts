import * as tape from 'tape'
const Trie = require('../dist/index').CheckpointTrie
import { CheckpointTrie } from '../dist/checkpointTrie'
import { BatchDBOp } from '../dist/db'

tape('kv stream test', function (tester) {
  var it = tester.test
  var trie = new Trie() as CheckpointTrie
  var init = [
    {
      type: 'del',
      key: Buffer.from('father'),
    },
    {
      type: 'put',
      key: Buffer.from('name'),
      value: Buffer.from('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: Buffer.from('dob'),
      value: Buffer.from('16 February 1941'),
    },
    {
      type: 'put',
      key: Buffer.from('spouse'),
      value: Buffer.from('Kim Young-sook'),
    },
    {
      type: 'put',
      key: Buffer.from('occupation'),
      value: Buffer.from('Clown'),
    },
    {
      type: 'put',
      key: Buffer.from('nameads'),
      value: Buffer.from('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: Buffer.from('namfde'),
      value: Buffer.from('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: Buffer.from('namsse'),
      value: Buffer.from('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: Buffer.from('dofab'),
      value: Buffer.from('16 February 1941'),
    },
    {
      type: 'put',
      key: Buffer.from('spoudse'),
      value: Buffer.from('Kim Young-sook'),
    },
    {
      type: 'put',
      key: Buffer.from('occupdsation'),
      value: Buffer.from('Clown'),
    },
    {
      type: 'put',
      key: Buffer.from('dozzzb'),
      value: Buffer.from('16 February 1941'),
    },
    {
      type: 'put',
      key: Buffer.from('spouszze'),
      value: Buffer.from('Kim Young-sook'),
    },
    {
      type: 'put',
      key: Buffer.from('occupatdfion'),
      value: Buffer.from('Clown'),
    },
    {
      type: 'put',
      key: Buffer.from('dssob'),
      value: Buffer.from('16 February 1941'),
    },
    {
      type: 'put',
      key: Buffer.from('spossuse'),
      value: Buffer.from('Kim Young-sook'),
    },
    {
      type: 'put',
      key: Buffer.from('occupssation'),
      value: Buffer.from('Clown'),
    },
  ] as BatchDBOp[]

  var valObj = {} as any
  init.forEach(function (i) {
    if (i.type === 'put') {
      valObj[String(i.key)] = i.value
    }
  })

  it('should populate trie', function (t) {
    trie.batch(init, function () {
      t.end()
    })
  })

  it('should fetch all of the nodes', function (t) {
    var stream = trie.createReadStream()
    stream.on('data', function (d: any) {
      t.equal(valObj[d.key.toString()].toString(), d.value.toString())
      delete valObj[d.key.toString()]
    })
    stream.on('end', function () {
      var keys = Object.keys(valObj)
      t.equal(keys.length, 0)
      t.end()
    })
  })
})

tape('db stream test', function (tester) {
  var it = tester.test
  var trie = new Trie()
  var init = [
    {
      type: 'put',
      key: Buffer.from('color'),
      value: Buffer.from('purple'),
    },
    {
      type: 'put',
      key: Buffer.from('food'),
      value: Buffer.from('sushi'),
    },
    {
      type: 'put',
      key: Buffer.from('fight'),
      value: Buffer.from('fire'),
    },
    {
      type: 'put',
      key: Buffer.from('colo'),
      value: Buffer.from('trolo'),
    },
    {
      type: 'put',
      key: Buffer.from('color'),
      value: Buffer.from('blue'),
    },
    {
      type: 'put',
      key: Buffer.from('color'),
      value: Buffer.from('pink'),
    },
  ]

  var expectedNodes = {
    '3c38d9aa6ad288c8e27da701e17fe99a5b67c8b12fd0469651c80494d36bc4c1': true,
    d5f61e1ff2b918d1c2a2c4b1732a3c68bd7e3fd64f35019f2f084896d4546298: true,
    e64329dadee2fb8a113b4c88cfe973aeaa9b523d4dc8510b84ca23f9d5bfbd90: true,
    c916d458bfb5f27603c5bd93b00f022266712514a59cde749f19220daffc743f: true,
    '2386bfb0de9cf93902a110f5ab07b917ffc0b9ea599cb7f4f8bb6fd1123c866c': true,
  } as any

  it('should populate trie', function (t) {
    trie.checkpoint()
    trie.batch(init, t.end)
  })

  it('should only fetch nodes in the current trie', function (t) {
    var stream = trie._createScratchReadStream()
    stream.on('data', function (d: any) {
      var key = d.key.toString('hex')
      t.ok(!!expectedNodes[key])
      delete expectedNodes[key]
    })
    stream.on('end', function () {
      t.equal(Object.keys(expectedNodes).length, 0)
      t.end()
    })
  })
})
