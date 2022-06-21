import * as tape from 'tape'
import { BatchDBOp, CheckpointTrie, LevelDB } from '../src'

tape('kv stream test', function (tester) {
  const it = tester.test
  const trie = new CheckpointTrie({ db: new LevelDB() })
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
  const trie = new CheckpointTrie({ db: new LevelDB() })
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

  it('should populate trie', async function (t) {
    trie.checkpoint()
    await trie.batch(ops)
    t.end()
  })
})
