import { bytesToBits, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BinaryNodeType, InternalBinaryNode, decodeBinaryNode } from '../../src/index.js'
import {} from '../../src/types.js'

describe('InternalBinaryNode', () => {
  it('should round-trip encode and decode an internal node', () => {
    // Create dummy child pointers:
    const leftCanonicalChild = {
      hash: hexToBytes('0x' + '11'.repeat(32)),
      // For testing, we use a one-byte path (i.e. [0]) – in practice this is produced by bytesToBits.
      path: bytesToBits(hexToBytes('0x00')),
    }
    const rightCanonicalChild = {
      hash: hexToBytes('0x' + '22'.repeat(32)),
      path: bytesToBits(hexToBytes('0x01')),
    }
    const node = InternalBinaryNode.create([leftCanonicalChild, rightCanonicalChild])
    const serialized = node.serialize()
    const decoded = decodeBinaryNode(serialized)

    // Verify the type
    assert.equal(decoded.type, BinaryNodeType.Internal)
    const [leftRecoveredChild, rightRecoveredChild] = (decoded as InternalBinaryNode).children
    assert.exists(leftRecoveredChild, 'Left child should exist')
    assert.exists(rightRecoveredChild, 'Right child should exist')
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
