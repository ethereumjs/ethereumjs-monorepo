import * as assert from 'assert'

/**
 * Memory implements a simple memory model
 * for the ethereum virtual machine.
 */
export default class Memory {
  _store: number[]

  constructor() {
    this._store = []
  }

  /**
   * Extends the memory given an offset and size. Rounds extended
   * memory to word-size.
   */
  extend(offset: number, size: number) {
    if (size === 0) {
      return
    }

    const newSize = ceil(offset + size, 32)
    const sizeDiff = newSize - this._store.length
    if (sizeDiff > 0) {
      this._store = this._store.concat(new Array(sizeDiff).fill(0))
    }
  }

  /**
   * Writes a byte array with length `size` to memory, starting from `offset`.
   * @param offset - Starting position
   * @param size - How many bytes to write
   * @param value - Value
   */
  write(offset: number, size: number, value: Buffer) {
    if (size === 0) {
      return
    }

    assert(value.length === size, 'Invalid value size')
    assert(offset + size <= this._store.length, 'Value exceeds memory capacity')
    assert(Buffer.isBuffer(value), 'Invalid value type')

    for (let i = 0; i < size; i++) {
      this._store[offset + i] = value[i]
    }
  }

  /**
   * Reads a slice of memory from `offset` till `offset + size` as a `Buffer`.
   * It fills up the difference between memory's length and `offset + size` with zeros.
   * @param offset - Starting position
   * @param size - How many bytes to read
   */
  read(offset: number, size: number): Buffer {
    const loaded = this._store.slice(offset, offset + size)
    // Fill the remaining length with zeros
    for (let i = loaded.length; i < size; i++) {
      loaded[i] = 0
    }
    return Buffer.from(loaded)
  }
}

const ceil = (value: number, ceiling: number): number => {
  const r = value % ceiling
  if (r === 0) {
    return value
  } else {
    return value + ceiling - r
  }
}
