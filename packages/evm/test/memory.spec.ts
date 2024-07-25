import { assert, describe, it } from 'vitest'

import { Memory } from '../src/memory.js'

const CONTAINER_SIZE = 8192

describe('Memory', () => {
  const m = new Memory()
  it('should have CONTAINER_SIZE capacity initially', () => {
    assert.equal(m._store.length, CONTAINER_SIZE)
  })

  it('should return zeros from empty memory', () => {
    assert.deepEqual(m.read(0, 3), Uint8Array.from([0, 0, 0]))
  })

  it('should extend capacity to CONTAINER_SIZE + CONTAINER_SIZE bytes', () => {
    m.extend(CONTAINER_SIZE, 3)
    assert.equal(m._store.length, CONTAINER_SIZE * 2)
  })

  it('should return zeros before writing', () => {
    assert.deepEqual(m.read(0, 2), Uint8Array.from([0, 0]))
  })

  it('should write value', () => {
    m.write(29, 3, Uint8Array.from([1, 2, 3]))
    assert.deepEqual(m.read(29, 5), Uint8Array.from([1, 2, 3, 0, 0]))
  })

  it('should fail when value len and size are inconsistent', () => {
    assert.throws(() => m.write(0, 5, Uint8Array.from([8, 8, 8])), /size/)
  })

  it('should expand by container (8192 bytes) properly when writing to previously untouched location', () => {
    const memory = new Memory()
    memory.write(0, CONTAINER_SIZE, new Uint8Array(CONTAINER_SIZE))
    assert.equal(
      memory._store.length,
      CONTAINER_SIZE,
      'memory should remain in CONTAINER_SIZE length',
    )
    memory.write(CONTAINER_SIZE, 1, Uint8Array.from([1]))
    assert.equal(
      memory._store.length,
      8192 * 2,
      'memory buffer length expanded by CONTAINER_SIZE bytes',
    )
  })

  it('should expand by container (8192 bytes) when reading a previously untouched location', () => {
    const memory = new Memory()
    memory.write(0, CONTAINER_SIZE, new Uint8Array(CONTAINER_SIZE))
    memory.read(CONTAINER_SIZE, 8)
    assert.equal(memory._store.length, CONTAINER_SIZE * 2)

    memory.read(CONTAINER_SIZE - 2, 8193)
    assert.equal(memory._store.length, 16384)
  })
})
