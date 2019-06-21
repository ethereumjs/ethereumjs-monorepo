'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Memory implements a simple memory model
 * for the ethereum virtual machine.
 */
module.exports = function () {
  function Memory() {
    _classCallCheck(this, Memory);

    this._store = [];
  }

  /**
   * Extends the memory given an offset and size. Rounds extended
   * memory to word-size.
   * @param {Number} offset
   * @param {size} size
   */


  _createClass(Memory, [{
    key: 'extend',
    value: function extend(offset, size) {
      if (size === 0) {
        return;
      }

      var newSize = ceil(offset + size, 32);
      var sizeDiff = newSize - this._store.length;
      if (sizeDiff > 0) {
        this._store = this._store.concat(new Array(sizeDiff).fill(0));
      }
    }

    /**
     * Writes a byte array with length `size` to memory, starting from `offset`.
     * @param {Number} offset - Starting position
     * @param {Number} size - How many bytes to write
     * @param {Buffer} value - Value
     */

  }, {
    key: 'write',
    value: function write(offset, size, value) {
      if (size === 0) {
        return;
      }

      if (value.length !== size) {
        throw new Error('Invalid value size');
      }

      if (offset + size > this._store.length) {
        throw new Error('Value exceeds memory capacity');
      }

      for (var i = 0; i < size; i++) {
        this._store[offset + i] = value[i];
      }
    }

    /**
     * Reads a slice of memory from `offset` till `offset + size` as a `Buffer`.
     * It fills up the difference between memory's length and `offset + size` with zeros.
     * @param {Number} offset - Starting position
     * @param {Number} size - How many bytes to read
     * @returns {Buffer}
     */

  }, {
    key: 'read',
    value: function read(offset, size) {
      var loaded = this._store.slice(offset, offset + size);
      // Fill the remaining length with zeros
      for (var i = loaded.length; i < size; i++) {
        loaded[i] = 0;
      }
      return Buffer.from(loaded);
    }
  }]);

  return Memory;
}();

var ceil = function ceil(value, ceiling) {
  var r = value % ceiling;
  if (r === 0) {
    return value;
  } else {
    return value + ceiling - r;
  }
};