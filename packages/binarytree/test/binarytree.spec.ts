import { bytesToHex, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createBinaryTree } from '../src/index.js'

describe('insert', () => {
  it('should not destroy a previous root', async () => {
    const tree = await createBinaryTree({ useRootPersistence: true })
    await tree.put(
      hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d'),
      [0],
      [hexToBytes('0x0100000000000000000000000000000000000000000000000000000000000000')],
    )
    const root = tree.root()

    const tree2 = await createBinaryTree({
      db: tree['_db'].db,
      useRootPersistence: true,
      root,
    })
    assert.deepEqual(tree2.root(), root)
  })

  it('should put, retrieve and compute the correct state root', async () => {
    const tree = await createBinaryTree()

    const key = hexToBytes(`0x${'00'.repeat(32)}`)
    const value = hexToBytes(`0x${'01'.repeat(32)}`)

    // Derive the stem from the key by by taking the first 31 bytes.
    const stem = key.slice(0, 31)

    // Extract the index from the last byte of the key.
    const index = key[31]

    await tree.put(stem, [index], [value])
    const [retrievedValue] = await tree.get(stem, [index])
    assert.exists(retrievedValue, 'Retrieved value should exist')
    assert.isTrue(
      equalsBytes(retrievedValue!, value),
      'Retrieved value should match inserted value',
    )

    // Assert that the computed state root matches the expected hash.
    assert.equal(
      bytesToHex(tree.root()),
      '0x694545468677064fd833cddc8455762fe6b21c6cabe2fc172529e0f573181cd5',
    )
  })

  it('should correctly compute state root and retrieve values for two entries differing in the first bit', async () => {
    const tree = await createBinaryTree()

    // First entry: key is 32 bytes of 0, value is 32 bytes of 1.
    const key1 = hexToBytes(`0x${'00'.repeat(32)}`)
    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)

    // Second entry: key is 0x80 followed by 31 bytes of 0, value is 32 bytes of 2.
    const key2 = hexToBytes(`0x${'80' + '00'.repeat(31)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)

    const stem1 = key1.slice(0, 31)
    const index1 = key1[31]
    const stem2 = key2.slice(0, 31)
    const index2 = key2[31]

    // Insert both entries into the tree.
    await tree.put(stem1, [index1], [value1])
    await tree.put(stem2, [index2], [value2])

    const [retrievedValue1] = await tree.get(stem1, [index1])
    const [retrievedValue2] = await tree.get(stem2, [index2])

    // Retrieved values should exist
    assert.exists(retrievedValue1, 'Value for key1 should exist')
    assert.exists(retrievedValue2, 'Value for key2 should exist')

    // Check that the computed state root matches the expected hash.
    assert.equal(
      bytesToHex(tree.root()),
      '0x85fc622076752a6fcda2c886c18058d639066a83473d9684704b5a29455ed2ed',
    )
  })

  it('should handle one stem with colocated values', async () => {
    const tree = await createBinaryTree()

    const stem = hexToBytes(`0x${'00'.repeat(31)}`)
    const suffixes = [0x03, 0x04, 0x09, 0xff]
    const values = [
      hexToBytes(`0x${'01'.repeat(32)}`),
      hexToBytes(`0x${'02'.repeat(32)}`),
      hexToBytes(`0x${'03'.repeat(32)}`),
      hexToBytes(`0x${'04'.repeat(32)}`),
    ]

    await tree.put(stem, suffixes, values)

    for (let i = 0; i < suffixes.length; i++) {
      const [retrievedValue] = await tree.get(stem, [suffixes[i]])
      assert.exists(retrievedValue, `Value at suffix ${suffixes[i]} should exist`)
      assert.isTrue(
        equalsBytes(retrievedValue!, values[i]),
        `Value at suffix ${suffixes[i]} should match inserted value`,
      )
    }
  })

  it('should handle two stems with colocated values', async () => {
    const tree = await createBinaryTree()

    // Stem 1: 0...0
    const stem1 = hexToBytes(`0x${'00'.repeat(31)}`)
    const suffixes1 = [0x03, 0x04]
    const values1 = [hexToBytes(`0x${'01'.repeat(32)}`), hexToBytes(`0x${'02'.repeat(32)}`)]

    // Stem 2: 10...0
    const stem2 = hexToBytes(`0x${'80'.repeat(31)}`)
    const suffixes2 = [0x03, 0x04]
    const values2 = [hexToBytes(`0x${'01'.repeat(32)}`), hexToBytes(`0x${'02'.repeat(32)}`)]

    await tree.put(stem1, suffixes1, values1)
    await tree.put(stem2, suffixes2, values2)

    for (let i = 0; i < suffixes1.length; i++) {
      const [retrievedValue1] = await tree.get(stem1, [suffixes1[i]])
      const [retrievedValue2] = await tree.get(stem2, [suffixes2[i]])
      assert.exists(retrievedValue1, `Value at suffix ${suffixes1[i]} should exist`)
      assert.exists(retrievedValue2, `Value at suffix ${suffixes2[i]} should exist`)
      assert.isTrue(
        equalsBytes(retrievedValue1!, values1[i]),
        `Value at suffix ${suffixes1[i]} should match inserted value`,
      )
      assert.isTrue(
        equalsBytes(retrievedValue2!, values2[i]),
        `Value at suffix ${suffixes2[i]} should match inserted value`,
      )
    }
  })
  it('should handle two keys that match in the first 42 bits', async () => {
    const tree = await createBinaryTree()

    // Two keys with the same prefix of 42 bits
    const key1 = hexToBytes(`0x${'00'.repeat(5)}${'C0'.repeat(27)}`)
    const key2 = hexToBytes(`0x${'00'.repeat(5)}E0${'00'.repeat(26)}`)

    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)

    const stem1 = key1.slice(0, 31)
    const index1 = key1[31]
    const stem2 = key2.slice(0, 31)
    const index2 = key2[31]

    await tree.put(stem1, [index1], [value1])
    await tree.put(stem2, [index2], [value2])

    const [retrievedValue1] = await tree.get(stem1, [index1])
    const [retrievedValue2] = await tree.get(stem2, [index2])

    assert.exists(retrievedValue1, 'Value for key1 should exist')
    assert.exists(retrievedValue2, 'Value for key2 should exist')
    assert.isTrue(
      equalsBytes(retrievedValue1!, value1),
      'Value for key1 should match inserted value',
    )
    assert.isTrue(
      equalsBytes(retrievedValue2!, value2),
      'Value for key2 should match inserted value',
    )
  })

  it.only('should handle three keys, and compute a consistent root regardless of insert ordering', async () => {
    const tree1 = await createBinaryTree()

    const key1 = hexToBytes(`0x${'C0'.repeat(32)}`)
    const key2 = hexToBytes(`0xE0${'00'.repeat(31)}`)
    const key3 = hexToBytes(`0x00${'01'.repeat(31)}`)

    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)
    const value3 = hexToBytes(`0x${'03'.repeat(32)}`)

    const stem1 = key1.slice(0, 31)
    const index1 = key1[31]
    const stem2 = key2.slice(0, 31)
    const index2 = key2[31]
    const stem3 = key3.slice(0, 31)
    const index3 = key3[31]

    await tree1.put(stem1, [index1], [value1])
    await tree1.put(stem2, [index2], [value2])
    await tree1.put(stem3, [index3], [value3])

    const [retrievedValue1] = await tree1.get(stem1, [index1])
    const [retrievedValue2] = await tree1.get(stem2, [index2])
    const [retrievedValue3] = await tree1.get(stem3, [index3])

    assert.exists(retrievedValue1, 'Value for key1 should exist')
    assert.exists(retrievedValue2, 'Value for key2 should exist')
    assert.exists(retrievedValue3, 'Value for key3 should exist')
    assert.isTrue(
      equalsBytes(retrievedValue1!, value1),
      'Value for key1 should match inserted value',
    )
    assert.isTrue(
      equalsBytes(retrievedValue2!, value2),
      'Value for key2 should match inserted value',
    )
    assert.isTrue(
      equalsBytes(retrievedValue3!, value3),
      'Value for key3 should match inserted value',
    )

    // We should end up with the same tree root regardless of the order of the put operations
    const tree2 = await createBinaryTree()
    await tree2.put(stem3, [index3], [value3])
    await tree2.put(stem1, [index1], [value1])
    await tree2.put(stem2, [index2], [value2])

    assert.isTrue(equalsBytes(tree1.root(), tree2.root()))
  })

  it.only('should handle three keys, when all three have partial match', async () => {
    const tree1 = await createBinaryTree()

    const key1 = hexToBytes(`0x${'C0'.repeat(32)}`)
    const key2 = hexToBytes(`0xE0${'00'.repeat(31)}`)
    const key3 = hexToBytes(`0xE0${'01'.repeat(31)}`)

    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)
    const value3 = hexToBytes(`0x${'03'.repeat(32)}`)

    const stem1 = key1.slice(0, 31)
    const index1 = key1[31]
    const stem2 = key2.slice(0, 31)
    const index2 = key2[31]
    const stem3 = key3.slice(0, 31)
    const index3 = key3[31]

    await tree1.put(stem1, [index1], [value1])
    await tree1.put(stem2, [index2], [value2])
    await tree1.put(stem3, [index3], [value3])

    const [retrievedValue1] = await tree1.get(stem1, [index1])
    const [retrievedValue2] = await tree1.get(stem2, [index2])
    const [retrievedValue3] = await tree1.get(stem3, [index3])

    assert.exists(retrievedValue1, 'Value for key1 should exist')
    assert.exists(retrievedValue2, 'Value for key2 should exist')
    assert.exists(retrievedValue3, 'Value for key3 should exist')
    assert.isTrue(
      equalsBytes(retrievedValue1!, value1),
      'Value for key1 should match inserted value',
    )
    assert.isTrue(
      equalsBytes(retrievedValue2!, value2),
      'Value for key2 should match inserted value',
    )
    assert.isTrue(
      equalsBytes(retrievedValue3!, value3),
      'Value for key3 should match inserted value',
    )
  })

  it('should update value when inserting a duplicate key', async () => {
    const tree = await createBinaryTree()

    const key = hexToBytes(`0x${'01'.repeat(32)}`)
    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)

    const stem = key.slice(0, 31)
    const index = key[31]

    await tree.put(stem, [index], [value1])
    await tree.put(stem, [index], [value2])

    const [retrievedValue] = await tree.get(stem, [index])

    assert.exists(retrievedValue, 'Retrieved value should exist')
    assert.isTrue(
      equalsBytes(retrievedValue!, value2),
      'Retrieved value should match the updated value',
    )
  })

  // Not sure if this test targets expect behavior (since we can't delete values?)
  it.skip('should recover previous root when adding and then deleting a value', async () => {
    const tree = await createBinaryTree()

    const key1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const key2 = hexToBytes(`0x${'02'.repeat(32)}`)
    const value1 = hexToBytes(`0x${'01'.repeat(32)}`)
    const value2 = hexToBytes(`0x${'02'.repeat(32)}`)

    const stem1 = key1.slice(0, 31)
    const index1 = key1[31]
    const stem2 = key2.slice(0, 31)
    const index2 = key2[31]

    await tree.put(stem1, [index1], [value1])

    const initialRoot = tree.root()

    await tree.put(stem2, [index2], [value2])

    const updatedRoot = tree.root()
    assert.isFalse(
      equalsBytes(initialRoot, updatedRoot),
      'Updated root should not match initial root',
    )

    await tree.del(stem2, [index2])

    const recoveredRoot = tree.root()

    const [retrievedValue1] = await tree.get(stem1, [index1])
    const [retrievedValue2] = await tree.get(stem2, [index2])

    assert.exists(retrievedValue1, 'Retrieved value should exist')
    assert.notExists(retrievedValue2, 'Deleted value should not exist')
    assert.isTrue(
      equalsBytes(initialRoot, recoveredRoot),
      'Recovered root should match initial root',
    )
  })
})
