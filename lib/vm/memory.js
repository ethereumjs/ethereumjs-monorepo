/**
 * Memory implements a simple memory model
 * for the ethereum virtual machine.
 */
module.exports = class Memory {
  constructor () {
    this._store = []
  }

  /**
   * Writes a byte array with length `size` to memory, starting from `offset`.
   * @param {Number} offset - Starting position
   * @param {Number} size - How many bytes to write
   * @param {Buffer} value - Value
   */
  write (offset, size, value) {
    if (size > 0) {
      for (let i = 0; i < size; i++) {
        this._store[offset + i] = value[i]
      }
    }
  }

  /**
   * Reads a slice of memory from `offset` till `offset + size` as a `Buffer`.
   * @param {Number} offset - Starting position
   * @param {Number} size - How many bytes to read
   * @returns {Buffer}
   */
  read (offset, size) {
    const loaded = this._store.slice(offset, offset + size)
    // Fill the remaining lenth with zeros
    for (let i = loaded.length; i < size; i++) {
      loaded[i] = 0
    }
    return Buffer.from(loaded)
  }
}
