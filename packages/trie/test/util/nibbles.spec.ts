import { assert, describe, it } from 'vitest'

import { getSharedNibbles } from '../../src/util/nibbles.js'

describe('getSharedNibbles', () => {
  const nibbles = [0, 0, 1, 2, 3, 4]

  it('should return whole array if both are equal', () => {
    assert.deepEqual(getSharedNibbles(nibbles, nibbles), nibbles)
  })

  const parent = [0, 0, 1, 2, 3]

  it('should return the shared nibbles for child / parent', () => {
    assert.deepEqual(getSharedNibbles(parent, nibbles), parent)
  })

  const child = [0, 0, 1, 2, 3, 4, 5]

  it('should return the shared nibbles for parent / child', () => {
    assert.deepEqual(getSharedNibbles(nibbles, child), [0, 0, 1, 2, 3, 4])
  })

  const sibling = [0, 1, 2, 3, 8]

  it('should return the shared (parent) nibbles for siblings', () => {
    assert.deepEqual(getSharedNibbles(nibbles, sibling), [0])
  })

  const distant = [0, 0, 2, 4, 5, 6, 7, 8]

  it('should return closest shared (parent) nibbles', () => {
    assert.deepEqual(getSharedNibbles(nibbles, distant), [0, 0])
  })

  const test5 = [1, 2, 3, 4, 5, 6]

  it('should return empty array if no shared nibbles', () => {
    assert.deepEqual(getSharedNibbles(nibbles, test5), [])
  })
})
