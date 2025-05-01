import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BinaryNodeType, InternalBinaryNode, decodeBinaryNode } from '../../src/index.ts'

describe('InternalBinaryNode', () => {
  it('should round-trip encode and decode an internal node', () => {
    // Create dummy child pointers:
    const leftCanonicalChild = {
      hash: hexToBytes(`0x${'11'.repeat(32)}`),
      path: [0, 1, 1, 0, 1, 0],
    }
    const rightCanonicalChild = {
      hash: hexToBytes(`0x${'22'.repeat(32)}`),
      path: [1, 1, 0, 0],
    }
    const node = InternalBinaryNode.create([leftCanonicalChild, rightCanonicalChild])
    const serialized = node.serialize()
    const decoded = decodeBinaryNode(serialized)

    // Verify the type
    assert.strictEqual(decoded.type, BinaryNodeType.Internal)
    const [leftRecoveredChild, rightRecoveredChild] = (decoded as InternalBinaryNode).children
    assert.isDefined(leftRecoveredChild, 'Left child should exist')
    assert.isDefined(rightRecoveredChild, 'Right child should exist')
    assert.isTrue(
      equalsBytes(leftRecoveredChild!.hash, leftCanonicalChild.hash),
      'Left child hash should round-trip',
    )

    assert.deepEqual(
      leftRecoveredChild!.path,
      leftCanonicalChild.path,
      'Left child path should round-trip',
    )
    assert.isTrue(
      equalsBytes(rightRecoveredChild!.hash, rightCanonicalChild.hash),
      'Right child hash should round-trip',
    )
    assert.deepEqual(
      rightRecoveredChild!.path,
      rightCanonicalChild.path,
      'Right child path should round-trip',
    )
  })
})
