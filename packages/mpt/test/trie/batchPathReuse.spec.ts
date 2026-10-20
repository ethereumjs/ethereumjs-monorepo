import { RLP } from '@ethereumjs/rlp'
import { MapDB, equalsBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie } from '../../src/index.ts'

import type { BatchDBOp } from '@ethereumjs/util'

async function rootFromPutLoop(keys: Uint8Array[], values: Uint8Array[]): Promise<Uint8Array> {
  const trie = new MerklePatriciaTrie({ db: new MapDB() })
  for (let i = 0; i < keys.length; i++) {
    await trie.put(keys[i]!, values[i]!)
  }
  return trie.root()
}

async function rootFromBatch(keys: Uint8Array[], values: Uint8Array[]): Promise<Uint8Array> {
  const trie = new MerklePatriciaTrie({ db: new MapDB() })
  const ops: BatchDBOp[] = keys.map((key, i) => ({
    type: 'put',
    key,
    value: values[i]!,
  }))
  await trie.batch(ops)
  return trie.root()
}

async function assertSameRoots(keys: Uint8Array[], values: Uint8Array[]) {
  const putRoot = await rootFromPutLoop(keys, values)
  const batchRoot = await rootFromBatch(keys, values)
  assert.isTrue(equalsBytes(putRoot, batchRoot))

  const batchTrie = new MerklePatriciaTrie({ db: new MapDB() })
  await batchTrie.batch(keys.map((key, i) => ({ type: 'put', key, value: values[i]! })))
  const loopTrie = new MerklePatriciaTrie({ db: new MapDB() })
  for (let i = 0; i < keys.length; i++) {
    await loopTrie.put(keys[i]!, values[i]!)
  }
  for (const i of [0, Math.floor(keys.length / 2), keys.length - 1]) {
    if (i < 0 || i >= keys.length) continue
    assert.isTrue(equalsBytes((await loopTrie.get(keys[i]!))!, (await batchTrie.get(keys[i]!))!))
  }
}

describe('[MPT/Trie]: batch path reuse', () => {
  it('matches put loop for ~2500 sequential RLP index keys', async () => {
    const n = 2500
    const keys: Uint8Array[] = []
    const values: Uint8Array[] = []
    for (let i = 0; i < n; i++) {
      keys.push(RLP.encode(i))
      values.push(randomBytes(32))
    }
    await assertSameRoots(keys, values)
  })

  it('matches put loop for random 32-byte keys', async () => {
    const n = 500
    const keys: Uint8Array[] = []
    const values: Uint8Array[] = []
    for (let i = 0; i < n; i++) {
      keys.push(randomBytes(32))
      values.push(randomBytes(8))
    }
    await assertSameRoots(keys, values)
  })

  it('matches put loop when the same key is put twice in one batch', async () => {
    const key = RLP.encode(42)
    const v1 = randomBytes(16)
    const v2 = randomBytes(16)
    const ops: BatchDBOp[] = [
      { type: 'put', key, value: v1 },
      { type: 'put', key, value: v2 },
    ]

    const loopTrie = new MerklePatriciaTrie({ db: new MapDB() })
    await loopTrie.put(key, v1)
    await loopTrie.put(key, v2)

    const batchTrie = new MerklePatriciaTrie({ db: new MapDB() })
    await batchTrie.batch(ops)

    assert.isTrue(equalsBytes(loopTrie.root(), batchTrie.root()))
    assert.isTrue(equalsBytes((await batchTrie.get(key))!, v2))
  })

  it('matches put/delete loop for mixed batch ops', async () => {
    const keys = [RLP.encode(0), RLP.encode(1), RLP.encode(2), RLP.encode(3)]
    const values = keys.map(() => randomBytes(20))

    const loopTrie = new MerklePatriciaTrie({ db: new MapDB() })
    await loopTrie.put(keys[0]!, values[0]!)
    await loopTrie.put(keys[1]!, values[1]!)
    await loopTrie.put(keys[2]!, values[2]!)
    await loopTrie.del(keys[1]!)
    await loopTrie.put(keys[3]!, values[3]!)
    await loopTrie.put(keys[1]!, values[1]!)

    const batchTrie = new MerklePatriciaTrie({ db: new MapDB() })
    await batchTrie.batch([
      { type: 'put', key: keys[0]!, value: values[0]! },
      { type: 'put', key: keys[1]!, value: values[1]! },
      { type: 'put', key: keys[2]!, value: values[2]! },
      { type: 'del', key: keys[1]! },
      { type: 'put', key: keys[3]!, value: values[3]! },
      { type: 'put', key: keys[1]!, value: values[1]! },
    ])

    assert.isTrue(equalsBytes(loopTrie.root(), batchTrie.root()))
    for (let i = 0; i < keys.length; i++) {
      assert.isTrue(equalsBytes((await loopTrie.get(keys[i]!))!, (await batchTrie.get(keys[i]!))!))
    }
  })
})
