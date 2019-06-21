'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BN = require('bn.js');
var ethUtil = require('ethereumjs-util');

var _require = require('../exceptions'),
    ERROR = _require.ERROR,
    VmError = _require.VmError;

/**
 * Implementation of the stack used in evm.
 */


module.exports = function () {
  function Stack() {
    _classCallCheck(this, Stack);

    this._store = [];
  }

  _createClass(Stack, [{
    key: 'push',
    value: function push(value) {
      if (this._store.length > 1023) {
        throw new VmError(ERROR.STACK_OVERFLOW);
      }

      if (!this._isValidValue(value)) {
        throw new VmError(ERROR.OUT_OF_RANGE);
      }

      this._store.push(value);
    }
  }, {
    key: 'pop',
    value: function pop() {
      if (this._store.length < 1) {
        throw new VmError(ERROR.STACK_UNDERFLOW);
      }

      return this._store.pop();
    }

    /**
     * Pop multiple items from stack. Top of stack is first item
     * in returned array.
     * @param {Number} num - Number of items to pop
     * @returns {Array}
     */

  }, {
    key: 'popN',
    value: function popN() {
      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this._store.length < num) {
        throw new VmError(ERROR.STACK_UNDERFLOW);
      }

      if (num === 0) {
        return [];
      }

      return this._store.splice(-1 * num).reverse();
    }

    /**
     * Swap top of stack with an item in the stack.
     * @param {Number} position - Index of item from top of the stack (0-indexed)
     */

  }, {
    key: 'swap',
    value: function swap(position) {
      if (this._store.length <= position) {
        throw new VmError(ERROR.STACK_UNDERFLOW);
      }

      var head = this._store.length - 1;
      var i = this._store.length - position - 1;

      var tmp = this._store[head];
      this._store[head] = this._store[i];
      this._store[i] = tmp;
    }

    /**
     * Pushes a copy of an item in the stack.
     * @param {Number} position - Index of item to be copied (1-indexed)
     */

  }, {
    key: 'dup',
    value: function dup(position) {
      if (this._store.length < position) {
        throw new VmError(ERROR.STACK_UNDERFLOW);
      }

      var i = this._store.length - position;
      this.push(this._store[i]);
    }
  }, {
    key: '_isValidValue',
    value: function _isValidValue(value) {
      if (BN.isBN(value)) {
        if (value.lte(ethUtil.MAX_INTEGER)) {
          return true;
        }
      } else if (Buffer.isBuffer(value)) {
        if (value.length <= 32) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'length',
    get: function get() {
      return this._store.length;
    }
  }]);

  return Stack;
}();