'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
var Tree = require('functional-red-black-tree');
var Account = require('ethereumjs-account');
var async = require('async');

module.exports = function () {
  function Cache(trie) {
    _classCallCheck(this, Cache);

    this._cache = Tree();
    this._checkpoints = [];
    this._trie = trie;
  }

  /**
   * Puts account to cache under its address.
   * @param {Buffer} key - Address of account
   * @param {Account} val - Account
   * @param {bool} [fromTrie]
   */


  _createClass(Cache, [{
    key: 'put',
    value: function put(key, val) {
      var fromTrie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var modified = !fromTrie;
      this._update(key, val, modified, false);
    }

    /**
     * Returns the queried account or an empty account.
     * @param {Buffer} key - Address of account
     */

  }, {
    key: 'get',
    value: function get(key) {
      var account = this.lookup(key);
      if (!account) {
        account = new Account();
      }
      return account;
    }

    /**
     * Returns the queried account or undefined.
     * @param {buffer} key - Address of account
     */

  }, {
    key: 'lookup',
    value: function lookup(key) {
      key = key.toString('hex');

      var it = this._cache.find(key);
      if (it.node) {
        var account = new Account(it.value.val);
        return account;
      }
    }

    /**
     * Looks up address in underlying trie.
     * @param {Buffer} address - Address of account
     * @param {Function} cb - Callback with params (err, account)
     */

  }, {
    key: '_lookupAccount',
    value: function _lookupAccount(address, cb) {
      this._trie.get(address, function (err, raw) {
        if (err) return cb(err);
        var account = new Account(raw);
        cb(null, account);
      });
    }

    /**
     * Looks up address in cache, if not found, looks it up
     * in the underlying trie.
     * @param {Buffer} key - Address of account
     * @param {Function} cb - Callback with params (err, account)
     */

  }, {
    key: 'getOrLoad',
    value: function getOrLoad(key, cb) {
      var _this = this;

      var account = this.lookup(key);
      if (account) {
        async.nextTick(cb, null, account);
      } else {
        this._lookupAccount(key, function (err, account) {
          if (err) return cb(err);
          _this._update(key, account, false, false);
          cb(null, account);
        });
      }
    }

    /**
     * Warms cache by loading their respective account from trie
     * and putting them in cache.
     * @param {Array} addresses - Array of addresses
     * @param {Function} cb - Callback
     */

  }, {
    key: 'warm',
    value: function warm(addresses, cb) {
      var _this2 = this;

      // shim till async supports iterators
      var accountArr = [];
      addresses.forEach(function (val) {
        if (val) accountArr.push(val);
      });

      async.eachSeries(accountArr, function (addressHex, done) {
        var address = Buffer.from(addressHex, 'hex');
        _this2._lookupAccount(address, function (err, account) {
          if (err) return done(err);
          _this2._update(address, account, false, false);
          done();
        });
      }, cb);
    }

    /**
     * Flushes cache by updating accounts that have been modified
     * and removing accounts that have been deleted.
     * @param {function} cb - Callback
     */

  }, {
    key: 'flush',
    value: function flush(cb) {
      var _this3 = this;

      var it = this._cache.begin;
      var next = true;
      async.whilst(function () {
        return next;
      }, function (done) {
        if (it.value && it.value.modified) {
          it.value.modified = false;
          it.value.val = it.value.val.serialize();
          _this3._trie.put(Buffer.from(it.key, 'hex'), it.value.val, function () {
            next = it.hasNext;
            it.next();
            done();
          });
        } else if (it.value && it.value.deleted) {
          it.value.modified = false;
          it.value.deleted = false;
          it.value.val = new Account().serialize();
          _this3._trie.del(Buffer.from(it.key, 'hex'), function () {
            next = it.hasNext;
            it.next();
            done();
          });
        } else {
          next = it.hasNext;
          it.next();
          async.nextTick(done);
        }
      }, cb);
    }

    /**
     * Marks current state of cache as checkpoint, which can
     * later on be reverted or commited.
     */

  }, {
    key: 'checkpoint',
    value: function checkpoint() {
      this._checkpoints.push(this._cache);
    }

    /**
     * Revert changes to cache last checkpoint (no effect on trie).
     */

  }, {
    key: 'revert',
    value: function revert() {
      this._cache = this._checkpoints.pop();
    }

    /**
     * Commits to current state of cache (no effect on trie).
     */

  }, {
    key: 'commit',
    value: function commit() {
      this._checkpoints.pop();
    }

    /**
     * Clears cache.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._cache = Tree();
    }

    /**
     * Marks address as deleted in cache.
     * @params {Buffer} key - Address
     */

  }, {
    key: 'del',
    value: function del(key) {
      this._update(key, new Account(), false, true);
    }
  }, {
    key: '_update',
    value: function _update(key, val, modified, deleted) {
      key = key.toString('hex');
      var it = this._cache.find(key);
      if (it.node) {
        this._cache = it.update({
          val: val,
          modified: modified,
          deleted: deleted
        });
      } else {
        this._cache = this._cache.insert(key, {
          val: val,
          modified: modified,
          deleted: deleted
        });
      }
    }
  }]);

  return Cache;
}();