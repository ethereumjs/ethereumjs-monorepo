import { MapDB } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createBinaryTree } from '../src/constructors.ts'

describe('[BinaryTree]: createBinaryTree', () => {
  it('createBinaryTree() restores persisted root from db', async () => {
    const db = new MapDB<string, Uint8Array>()
    const emptyRoot = new Uint8Array(32)
    const tree1 = await createBinaryTree({ db, useRootPersistence: true, root: emptyRoot })
    assert.deepEqual(tree1.root(), emptyRoot)

    const tree2 = await createBinaryTree({ db, useRootPersistence: true })
    assert.deepEqual(tree2.root(), emptyRoot)
  })
})
