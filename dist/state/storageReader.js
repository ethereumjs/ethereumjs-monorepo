'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function StorageReader(stateManager) {
    _classCallCheck(this, StorageReader);

    this._stateManager = stateManager;
    this._storageCache = new Map();
  }

  _createClass(StorageReader, [{
    key: 'getContractStorage',
    value: function getContractStorage(address, key, cb) {
      var _this = this;

      var addressHex = address.toString('hex');
      var keyHex = key.toString('hex');

      this._stateManager.getContractStorage(address, key, function (err, current) {
        if (err) return cb(err);

        var map = null;
        if (!_this._storageCache.has(addressHex)) {
          map = new Map();
          _this._storageCache.set(addressHex, map);
        } else {
          map = _this._storageCache.get(addressHex);
        }

        var original = null;

        if (map.has(keyHex)) {
          original = map.get(keyHex);
        } else {
          map.set(keyHex, current);
          original = current;
        }

        cb(null, {
          original: original,
          current: current
        });
      });
    }
  }]);

  return StorageReader;
}();