'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Buffer = require('safe-buffer').Buffer;
var ethUtil = require('ethereumjs-util');

var _require = require('./state'),
    StateManager = _require.StateManager;

var Common = require('ethereumjs-common').default;
var Blockchain = require('ethereumjs-blockchain');
var Account = require('ethereumjs-account');
var AsyncEventEmitter = require('async-eventemitter');
var Trie = require('merkle-patricia-tree/secure.js');
var BN = ethUtil.BN;

// require the precompiled contracts
var num01 = require('./evm/precompiles/01-ecrecover.js');
var num02 = require('./evm/precompiles/02-sha256.js');
var num03 = require('./evm/precompiles/03-ripemd160.js');
var num04 = require('./evm/precompiles/04-identity.js');
var num05 = require('./evm/precompiles/05-modexp.js');
var num06 = require('./evm/precompiles/06-ecadd.js');
var num07 = require('./evm/precompiles/07-ecmul.js');
var num08 = require('./evm/precompiles/08-ecpairing.js');

/**
 * VM Class, `new VM(opts)` creates a new VM object
 * @method VM
 * @param {Object} opts
 * @param {StateManager} opts.stateManager a [`StateManager`](stateManager.md) instance to use as the state store (Beta API)
 * @param {Trie} opts.state a merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} opts.blockchain a blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {String|Number} opts.chain the chain the VM operates on [default: 'mainnet']
 * @param {String} opts.hardfork hardfork rules to be used [default: 'petersburg', supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)]
 * @param {Boolean} opts.activatePrecompiles create entries in the state tree for the precompiled contracts
 * @param {Boolean} opts.allowUnlimitedContractSize allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. (default: `false`; ONLY set to `true` during debugging)
 * @param {Boolean} opts.emitFreeLogs Changes the behavior of the LOG opcode, the gas cost of the opcode becomes zero and calling it using STATICCALL won't throw. (default: `false`; ONLY set to `true` during debugging)
 */
module.exports = function (_AsyncEventEmitter) {
  _inherits(VM, _AsyncEventEmitter);

  function VM() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VM);

    var _this = _possibleConstructorReturn(this, (VM.__proto__ || Object.getPrototypeOf(VM)).call(this));

    _this.opts = opts;

    var chain = opts.chain ? opts.chain : 'mainnet';
    var hardfork = opts.hardfork ? opts.hardfork : 'petersburg';
    var supportedHardforks = ['byzantium', 'constantinople', 'petersburg'];
    _this._common = new Common(chain, hardfork, supportedHardforks);

    if (opts.stateManager) {
      _this.stateManager = opts.stateManager;
    } else {
      var trie = opts.state || new Trie();
      if (opts.activatePrecompiles) {
        for (var i = 1; i <= 8; i++) {
          trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize());
        }
      }
      _this.stateManager = new StateManager({ trie: trie, common: _this._common });
    }

    _this.blockchain = opts.blockchain || new Blockchain({ common: _this._common });

    _this.allowUnlimitedContractSize = opts.allowUnlimitedContractSize === undefined ? false : opts.allowUnlimitedContractSize;
    _this.emitFreeLogs = opts.emitFreeLogs === undefined ? false : opts.emitFreeLogs;

    // precompiled contracts
    _this._precompiled = {};
    _this._precompiled['0000000000000000000000000000000000000001'] = num01;
    _this._precompiled['0000000000000000000000000000000000000002'] = num02;
    _this._precompiled['0000000000000000000000000000000000000003'] = num03;
    _this._precompiled['0000000000000000000000000000000000000004'] = num04;
    _this._precompiled['0000000000000000000000000000000000000005'] = num05;
    _this._precompiled['0000000000000000000000000000000000000006'] = num06;
    _this._precompiled['0000000000000000000000000000000000000007'] = num07;
    _this._precompiled['0000000000000000000000000000000000000008'] = num08;

    _this.runCode = require('./runCode.js').bind(_this);
    _this.runJIT = require('./runJit.js').bind(_this);
    _this.runBlock = require('./runBlock.js').bind(_this);
    _this.runTx = require('./runTx.js').bind(_this);
    _this.runCall = require('./runCall.js').bind(_this);
    _this.runBlockchain = require('./runBlockchain.js').bind(_this);
    return _this;
  }

  _createClass(VM, [{
    key: 'copy',
    value: function copy() {
      return new VM({ stateManager: this.stateManager.copy(), blockchain: this.blockchain });
    }
  }]);

  return VM;
}(AsyncEventEmitter);