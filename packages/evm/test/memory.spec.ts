import { assert, describe, it } from 'vitest'

import { Memory } from '../src/memory.js'

describe('Memory', () => {
  const m = new Memory()
  it('should have 0 capacity initially', () => {
    assert.equal(m._store.length, 0)
  })

  it('should return zeros from empty memory', () => {
    assert.deepEqual(m.read(0, 3), Uint8Array.from([0, 0, 0]))
  })

  it('should extend capacity to 8192 bytes', () => {
    m.extend(0, 3)
    assert.equal(m._store.length, 8192)
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
    assert.equal(memory._store.length, 0, 'memory should start with zero length')
    memory.write(0, 1, Uint8Array.from([1]))
    assert.equal(memory._store.length, 8192, 'memory buffer length expanded to 8192 bytes')
  })

  it('should expand by container (8192 bytes) when reading a previously untouched location', () => {
    const memory = new Memory()
    memory.read(0, 8)
    assert.equal(memory._store.length, 8192)

    memory.read(8190, 8193)
    assert.equal(memory._store.length, 16384)
  })
})
