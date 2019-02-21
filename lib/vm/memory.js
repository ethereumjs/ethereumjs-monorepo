/**
 * Memory implements a simple memory model
 * for the ethereum virtual machine.
 */
module.exports = class Memory {
  constructor () {
    this._store = []
  }

  /**
   * Extends the memory given an offset and size. Rounds extended
   * memory to word-size.
   * @param {Number} offset
   * @param {size} size
   */
  extend (offset, size) {
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
   * @param {Number} offset - Starting position
   * @param {Number} size - How many bytes to write
   * @param {Buffer} value - Value
   */
  write (offset, size, value) {
    if (size === 0) {
      return
    }

    if (value.length !== size) {
      throw new Error('Invalid value size')
    }

    if (offset + size > this._store.length) {
      throw new Error('Value exceeds memory capacity')
    }

    for (let i = 0; i < size; i++) {
      this._store[offset + i] = value[i]
    }
  }

  /**
   * Reads a slice of memory from `offset` till `offset + size` as a `Buffer`.
   * It fills up the difference between memory's length and `offset + size` with zeros.
   * @param {Number} offset - Starting position
   * @param {Number} size - How many bytes to read
   * @returns {Buffer}
   */
  read (offset, size) {
    const loaded = this._store.slice(offset, offset + size)
    // Fill the remaining length with zeros
    for (let i = loaded.length; i < size; i++) {
      loaded[i] = 0
    }
    return Buffer.from(loaded)
  }
}

const ceil = (value, ceiling) => {
  const r = value % ceiling
  if (r === 0) {
    return value
  } else {
    return value + ceiling - r
  }
}
