import tape from 'tape'
import { CheckpointTrie } from '../src'
import { BatchDBOp } from '../src/db'

tape('kv stream test', function (tester) {
  const it = tester.test
  const trie = new CheckpointTrie()
  const ops = [
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

  const valObj = {} as any
  for (const op of ops) {
    if (op.type === 'put') {
      valObj[op.key.toString()] = op.value.toString()
    }
  }

  it('should populate trie', async function (t) {
    await trie.batch(ops)
    t.end()
  })

  it('should fetch all of the nodes', function (t) {
    const stream = trie.createReadStream()
    stream.on('data', (d: any) => {
      const key = d.key.toString()
      const value = d.value.toString()
      t.equal(valObj[key], value)
      delete valObj[key]
    })
    stream.on('end', () => {
      const keys = Object.keys(valObj)
      t.equal(keys.length, 0)
      t.end()
    })
  })
})

tape('db stream test', function (tester) {
  const it = tester.test
  const trie = new CheckpointTrie()
  const ops = [
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
  ] as BatchDBOp[]

  /*const expectedNodes = {
    '3c38d9aa6ad288c8e27da701e17fe99a5b67c8b12fd0469651c80494d36bc4c1': true,
    d5f61e1ff2b918d1c2a2c4b1732a3c68bd7e3fd64f35019f2f084896d4546298: true,
    e64329dadee2fb8a113b4c88cfe973aeaa9b523d4dc8510b84ca23f9d5bfbd90: true,
    c916d458bfb5f27603c5bd93b00f022266712514a59cde749f19220daffc743f: true,
    '2386bfb0de9cf93902a110f5ab07b917ffc0b9ea599cb7f4f8bb6fd1123c866c': true,
  } as any*/

  it('should populate trie', async function (t) {
    trie.checkpoint()
    await trie.batch(ops)
    t.end()
  })

  /*it('should only fetch nodes in the current trie', function (t) {
    const stream = trie._createScratchReadStream()
    stream.on('data', (d: any) => {
      const key = d.key.toString('hex')
      t.ok(!!expectedNodes[key])
      delete expectedNodes[key]
    })
    stream.on('end', () => {
      const keys = Object.keys(expectedNodes)
      t.equal(keys.length, 0)
      t.end()
    })
  })*/
})
