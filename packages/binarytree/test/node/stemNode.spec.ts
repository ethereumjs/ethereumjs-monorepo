import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BinaryNodeType, decodeBinaryNode } from '../../src/index.ts'
import { StemBinaryNode } from '../../src/node/stemNode.ts'

describe('StemBinaryNode', () => {
  it('should round-trip encode and decode a stem node', () => {
    // Create a 31-byte stem (for example, all 0x01 bytes)
    const stem = hexToBytes(`0x${'01'.repeat(31)}`)

    // Create an array of 256 possible values (initially all null)
    const values: (Uint8Array | null)[] = new Array(256).fill(null)
    // Set a few non-null values at specific indices
    const value3 = hexToBytes(`0x${'02'.repeat(32)}`)
    const value100 = hexToBytes(`0x${'03'.repeat(32)}`)
    const value255 = hexToBytes(`0x${'04'.repeat(32)}`)
    values[3] = value3
    values[100] = value100
    values[255] = value255

    // Create the stem node with the given stem and values array.
    const node = new StemBinaryNode({ stem, values })

    // Serialize the node.
    const serialized = node.serialize()

    // Decode the node using the provided decodeBinaryNode helper.
    const decoded = decodeBinaryNode(serialized)
    // Verify that the decoded node is of type Stem.
    assert.strictEqual(decoded.type, BinaryNodeType.Stem, 'Node type should be Stem')

    // Cast the decoded node to StemBinaryNode.
    const recovered = decoded as StemBinaryNode

    // Verify that the stem round-trips.
    assert.isTrue(equalsBytes(recovered.stem, stem), 'Stem should round-trip correctly')

    // Verify that the values array has the correct length.
    assert.strictEqual(recovered.values.length, 256, 'Values array should have 256 elements')

    // Check that the non-null values round-trip.
    assert.isDefined(recovered.values[3], 'Value at index 3 should exist')
    assert.isTrue(
      equalsBytes(recovered.values[3]!, value3),
      'Value at index 3 should round-trip correctly',
    )

    assert.isDefined(recovered.values[100], 'Value at index 100 should exist')
    assert.isTrue(
      equalsBytes(recovered.values[100]!, value100),
      'Value at index 100 should round-trip correctly',
    )

    assert.isDefined(recovered.values[255], 'Value at index 255 should exist')
    assert.isTrue(
      equalsBytes(recovered.values[255]!, value255),
      'Value at index 255 should round-trip correctly',
    )

    // Verify that all other indexes remain null.
    for (let i = 0; i < 256; i++) {
      if (i !== 3 && i !== 100 && i !== 255) {
        assert.isNull(recovered.values[i], `Value at index ${i} should be null`)
      }
    }
  })
})
