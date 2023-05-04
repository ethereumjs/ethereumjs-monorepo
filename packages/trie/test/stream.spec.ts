import { utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Trie } from '../src'

import type { BatchDBOp } from '@ethereumjs/util'

tape('kv stream test', function (tester) {
  const it = tester.test
  const trie = new Trie()
  const ops = [
    {
      type: 'del',
      key: utf8ToBytes('father'),
    },
    {
      type: 'put',
      key: utf8ToBytes('name'),
      value: utf8ToBytes('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: utf8ToBytes('dob'),
      value: utf8ToBytes('16 February 1941'),
    },
    {
      type: 'put',
      key: utf8ToBytes('spouse'),
      value: utf8ToBytes('Kim Young-sook'),
    },
    {
      type: 'put',
      key: utf8ToBytes('occupation'),
      value: utf8ToBytes('Clown'),
    },
    {
      type: 'put',
      key: utf8ToBytes('nameads'),
      value: utf8ToBytes('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: utf8ToBytes('namfde'),
      value: utf8ToBytes('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: utf8ToBytes('namsse'),
      value: utf8ToBytes('Yuri Irsenovich Kim'),
    },
    {
      type: 'put',
      key: utf8ToBytes('dofab'),
      value: utf8ToBytes('16 February 1941'),
    },
    {
      type: 'put',
      key: utf8ToBytes('spoudse'),
      value: utf8ToBytes('Kim Young-sook'),
    },
    {
      type: 'put',
      key: utf8ToBytes('occupdsation'),
      value: utf8ToBytes('Clown'),
    },
    {
      type: 'put',
      key: utf8ToBytes('dozzzb'),
      value: utf8ToBytes('16 February 1941'),
    },
    {
      type: 'put',
      key: utf8ToBytes('spouszze'),
      value: utf8ToBytes('Kim Young-sook'),
    },
    {
      type: 'put',
      key: utf8ToBytes('occupatdfion'),
      value: utf8ToBytes('Clown'),
    },
    {
      type: 'put',
      key: utf8ToBytes('dssob'),
      value: utf8ToBytes('16 February 1941'),
    },
    {
      type: 'put',
      key: utf8ToBytes('spossuse'),
      value: utf8ToBytes('Kim Young-sook'),
    },
    {
      type: 'put',
      key: utf8ToBytes('occupssation'),
      value: utf8ToBytes('Clown'),
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
  const trie = new Trie()
  const ops = [
    {
      type: 'put',
      key: utf8ToBytes('color'),
      value: utf8ToBytes('purple'),
    },
    {
      type: 'put',
      key: utf8ToBytes('food'),
      value: utf8ToBytes('sushi'),
    },
    {
      type: 'put',
      key: utf8ToBytes('fight'),
      value: utf8ToBytes('fire'),
    },
    {
      type: 'put',
      key: utf8ToBytes('colo'),
      value: utf8ToBytes('trolo'),
    },
    {
      type: 'put',
      key: utf8ToBytes('color'),
      value: utf8ToBytes('blue'),
    },
    {
      type: 'put',
      key: utf8ToBytes('color'),
      value: utf8ToBytes('pink'),
    },
  ] as BatchDBOp[]

  it('should populate trie', async function (t) {
    trie.checkpoint()
    await trie.batch(ops)
    t.end()
  })
})
