'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Buffer = require('safe-buffer').Buffer;
var async = require('async');
var utils = require('ethereumjs-util');
var BN = utils.BN;
var exceptions = require('../exceptions.js');
var ERROR = exceptions.ERROR;
var VmError = exceptions.VmError;
var MASK_160 = new BN(1).shln(160).subn(1);

// Find Ceil(`this` / `num`)
BN.prototype.divCeil = function divCeil(num) {
  var dm = this.divmod(num);

  // Fast case - exact division
  if (dm.mod.isZero()) return dm.div;

  // Round up
  return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
};

function addressToBuffer(address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20);
}

// the opcode functions
module.exports = {
  STOP: function STOP(runState) {
    runState.stopped = true;
  },
  ADD: function ADD(runState) {
    var _runState$stack$popN = runState.stack.popN(2),
        _runState$stack$popN2 = _slicedToArray(_runState$stack$popN, 2),
        a = _runState$stack$popN2[0],
        b = _runState$stack$popN2[1];

    var r = a.add(b).mod(utils.TWO_POW256);
    runState.stack.push(r);
  },
  MUL: function MUL(runState) {
    var _runState$stack$popN3 = runState.stack.popN(2),
        _runState$stack$popN4 = _slicedToArray(_runState$stack$popN3, 2),
        a = _runState$stack$popN4[0],
        b = _runState$stack$popN4[1];

    var r = a.mul(b).mod(utils.TWO_POW256);
    runState.stack.push(r);
  },
  SUB: function SUB(runState) {
    var _runState$stack$popN5 = runState.stack.popN(2),
        _runState$stack$popN6 = _slicedToArray(_runState$stack$popN5, 2),
        a = _runState$stack$popN6[0],
        b = _runState$stack$popN6[1];

    var r = a.sub(b).toTwos(256);
    runState.stack.push(r);
  },
  DIV: function DIV(runState) {
    var _runState$stack$popN7 = runState.stack.popN(2),
        _runState$stack$popN8 = _slicedToArray(_runState$stack$popN7, 2),
        a = _runState$stack$popN8[0],
        b = _runState$stack$popN8[1];

    var r = void 0;
    if (b.isZero()) {
      r = new BN(b);
    } else {
      r = a.div(b);
    }
    runState.stack.push(r);
  },
  SDIV: function SDIV(runState) {
    var _runState$stack$popN9 = runState.stack.popN(2),
        _runState$stack$popN10 = _slicedToArray(_runState$stack$popN9, 2),
        a = _runState$stack$popN10[0],
        b = _runState$stack$popN10[1];

    var r = void 0;
    if (b.isZero()) {
      r = new BN(b);
    } else {
      a = a.fromTwos(256);
      b = b.fromTwos(256);
      r = a.div(b).toTwos(256);
    }
    runState.stack.push(r);
  },
  MOD: function MOD(runState) {
    var _runState$stack$popN11 = runState.stack.popN(2),
        _runState$stack$popN12 = _slicedToArray(_runState$stack$popN11, 2),
        a = _runState$stack$popN12[0],
        b = _runState$stack$popN12[1];

    var r = void 0;
    if (b.isZero()) {
      r = new BN(b);
    } else {
      r = a.mod(b);
    }
    runState.stack.push(r);
  },
  SMOD: function SMOD(runState) {
    var _runState$stack$popN13 = runState.stack.popN(2),
        _runState$stack$popN14 = _slicedToArray(_runState$stack$popN13, 2),
        a = _runState$stack$popN14[0],
        b = _runState$stack$popN14[1];

    var r = void 0;
    if (b.isZero()) {
      r = new BN(b);
    } else {
      a = a.fromTwos(256);
      b = b.fromTwos(256);
      r = a.abs().mod(b.abs());
      if (a.isNeg()) {
        r = r.ineg();
      }
      r = r.toTwos(256);
    }
    runState.stack.push(r);
  },
  ADDMOD: function ADDMOD(runState) {
    var _runState$stack$popN15 = runState.stack.popN(3),
        _runState$stack$popN16 = _slicedToArray(_runState$stack$popN15, 3),
        a = _runState$stack$popN16[0],
        b = _runState$stack$popN16[1],
        c = _runState$stack$popN16[2];

    var r = void 0;
    if (c.isZero()) {
      r = new BN(c);
    } else {
      r = a.add(b).mod(c);
    }
    runState.stack.push(r);
  },
  MULMOD: function MULMOD(runState) {
    var _runState$stack$popN17 = runState.stack.popN(3),
        _runState$stack$popN18 = _slicedToArray(_runState$stack$popN17, 3),
        a = _runState$stack$popN18[0],
        b = _runState$stack$popN18[1],
        c = _runState$stack$popN18[2];

    var r = void 0;
    if (c.isZero()) {
      r = new BN(c);
    } else {
      r = a.mul(b).mod(c);
    }
    runState.stack.push(r);
  },
  EXP: function EXP(runState) {
    var _runState$stack$popN19 = runState.stack.popN(2),
        _runState$stack$popN20 = _slicedToArray(_runState$stack$popN19, 2),
        base = _runState$stack$popN20[0],
        exponent = _runState$stack$popN20[1];

    if (exponent.isZero()) {
      runState.stack.push(new BN(1));
      return;
    }
    var byteLength = exponent.byteLength();
    if (byteLength < 1 || byteLength > 32) {
      trap(ERROR.OUT_OF_RANGE);
    }
    var gasPrice = runState._common.param('gasPrices', 'expByte');
    var amount = new BN(byteLength).muln(gasPrice);
    subGas(runState, amount);

    if (base.isZero()) {
      runState.stack.push(new BN(0));
      return;
    }
    var m = BN.red(utils.TWO_POW256);
    base = base.toRed(m);
    var r = base.redPow(exponent);
    runState.stack.push(r);
  },
  SIGNEXTEND: function SIGNEXTEND(runState) {
    var _runState$stack$popN21 = runState.stack.popN(2),
        _runState$stack$popN22 = _slicedToArray(_runState$stack$popN21, 2),
        k = _runState$stack$popN22[0],
        val = _runState$stack$popN22[1];

    val = val.toArrayLike(Buffer, 'be', 32);
    var extendOnes = false;

    if (k.lten(31)) {
      k = k.toNumber();

      if (val[31 - k] & 0x80) {
        extendOnes = true;
      }

      // 31-k-1 since k-th byte shouldn't be modified
      for (var i = 30 - k; i >= 0; i--) {
        val[i] = extendOnes ? 0xff : 0;
      }
    }

    runState.stack.push(new BN(val));
  },
  // 0x10 range - bit ops
  LT: function LT(runState) {
    var _runState$stack$popN23 = runState.stack.popN(2),
        _runState$stack$popN24 = _slicedToArray(_runState$stack$popN23, 2),
        a = _runState$stack$popN24[0],
        b = _runState$stack$popN24[1];

    var r = new BN(a.lt(b) ? 1 : 0);
    runState.stack.push(r);
  },
  GT: function GT(runState) {
    var _runState$stack$popN25 = runState.stack.popN(2),
        _runState$stack$popN26 = _slicedToArray(_runState$stack$popN25, 2),
        a = _runState$stack$popN26[0],
        b = _runState$stack$popN26[1];

    var r = new BN(a.gt(b) ? 1 : 0);
    runState.stack.push(r);
  },
  SLT: function SLT(runState) {
    var _runState$stack$popN27 = runState.stack.popN(2),
        _runState$stack$popN28 = _slicedToArray(_runState$stack$popN27, 2),
        a = _runState$stack$popN28[0],
        b = _runState$stack$popN28[1];

    var r = new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0);
    runState.stack.push(r);
  },
  SGT: function SGT(runState) {
    var _runState$stack$popN29 = runState.stack.popN(2),
        _runState$stack$popN30 = _slicedToArray(_runState$stack$popN29, 2),
        a = _runState$stack$popN30[0],
        b = _runState$stack$popN30[1];

    var r = new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0);
    runState.stack.push(r);
  },
  EQ: function EQ(runState) {
    var _runState$stack$popN31 = runState.stack.popN(2),
        _runState$stack$popN32 = _slicedToArray(_runState$stack$popN31, 2),
        a = _runState$stack$popN32[0],
        b = _runState$stack$popN32[1];

    var r = new BN(a.eq(b) ? 1 : 0);
    runState.stack.push(r);
  },
  ISZERO: function ISZERO(runState) {
    var a = runState.stack.pop();
    var r = new BN(a.isZero() ? 1 : 0);
    runState.stack.push(r);
  },
  AND: function AND(runState) {
    var _runState$stack$popN33 = runState.stack.popN(2),
        _runState$stack$popN34 = _slicedToArray(_runState$stack$popN33, 2),
        a = _runState$stack$popN34[0],
        b = _runState$stack$popN34[1];

    var r = a.and(b);
    runState.stack.push(r);
  },
  OR: function OR(runState) {
    var _runState$stack$popN35 = runState.stack.popN(2),
        _runState$stack$popN36 = _slicedToArray(_runState$stack$popN35, 2),
        a = _runState$stack$popN36[0],
        b = _runState$stack$popN36[1];

    var r = a.or(b);
    runState.stack.push(r);
  },
  XOR: function XOR(runState) {
    var _runState$stack$popN37 = runState.stack.popN(2),
        _runState$stack$popN38 = _slicedToArray(_runState$stack$popN37, 2),
        a = _runState$stack$popN38[0],
        b = _runState$stack$popN38[1];

    var r = a.xor(b);
    runState.stack.push(r);
  },
  NOT: function NOT(runState) {
    var a = runState.stack.pop();
    var r = a.notn(256);
    runState.stack.push(r);
  },
  BYTE: function BYTE(runState) {
    var _runState$stack$popN39 = runState.stack.popN(2),
        _runState$stack$popN40 = _slicedToArray(_runState$stack$popN39, 2),
        pos = _runState$stack$popN40[0],
        word = _runState$stack$popN40[1];

    if (pos.gten(32)) {
      runState.stack.push(new BN(0));
      return;
    }

    var r = new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff));
    runState.stack.push(r);
  },
  SHL: function SHL(runState) {
    var _runState$stack$popN41 = runState.stack.popN(2),
        _runState$stack$popN42 = _slicedToArray(_runState$stack$popN41, 2),
        a = _runState$stack$popN42[0],
        b = _runState$stack$popN42[1];

    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE);
    }
    if (a.gten(256)) {
      runState.stack.push(new BN(0));
      return;
    }

    var r = b.shln(a.toNumber()).iand(utils.MAX_INTEGER);
    runState.stack.push(r);
  },
  SHR: function SHR(runState) {
    var _runState$stack$popN43 = runState.stack.popN(2),
        _runState$stack$popN44 = _slicedToArray(_runState$stack$popN43, 2),
        a = _runState$stack$popN44[0],
        b = _runState$stack$popN44[1];

    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE);
    }
    if (a.gten(256)) {
      runState.stack.push(new BN(0));
      return;
    }

    var r = b.shrn(a.toNumber());
    runState.stack.push(r);
  },
  SAR: function SAR(runState) {
    var _runState$stack$popN45 = runState.stack.popN(2),
        _runState$stack$popN46 = _slicedToArray(_runState$stack$popN45, 2),
        a = _runState$stack$popN46[0],
        b = _runState$stack$popN46[1];

    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE);
    }

    var r = void 0;
    var isSigned = b.testn(255);
    if (a.gten(256)) {
      if (isSigned) {
        r = new BN(utils.MAX_INTEGER);
      } else {
        r = new BN(0);
      }
      runState.stack.push(r);
      return;
    }

    var c = b.shrn(a.toNumber());
    if (isSigned) {
      var shiftedOutWidth = 255 - a.toNumber();
      var mask = utils.MAX_INTEGER.shrn(shiftedOutWidth).shln(shiftedOutWidth);
      r = c.ior(mask);
    } else {
      r = c;
    }
    runState.stack.push(r);
  },
  // 0x20 range - crypto
  SHA3: function SHA3(runState) {
    var _runState$stack$popN47 = runState.stack.popN(2),
        _runState$stack$popN48 = _slicedToArray(_runState$stack$popN47, 2),
        offset = _runState$stack$popN48[0],
        length = _runState$stack$popN48[1];

    subMemUsage(runState, offset, length);
    var data = Buffer.alloc(0);
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber());
    }
    // copy fee
    subGas(runState, new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))));
    var r = new BN(utils.keccak256(data));
    runState.stack.push(r);
  },
  // 0x30 range - closure state
  ADDRESS: function ADDRESS(runState) {
    runState.stack.push(new BN(runState.address));
  },
  BALANCE: function BALANCE(runState, cb) {
    var address = runState.stack.pop();
    var stateManager = runState.stateManager;
    // stack to address
    address = addressToBuffer(address);

    // shortcut if current account
    if (address.toString('hex') === runState.address.toString('hex')) {
      runState.stack.push(new BN(runState.contract.balance));
      cb(null);
      return;
    }

    // otherwise load account then return balance
    stateManager.getAccount(address, function (err, account) {
      if (err) {
        return cb(err);
      }
      runState.stack.push(new BN(account.balance));
      cb(null);
    });
  },
  ORIGIN: function ORIGIN(runState) {
    runState.stack.push(new BN(runState.origin));
  },
  CALLER: function CALLER(runState) {
    runState.stack.push(new BN(runState.caller));
  },
  CALLVALUE: function CALLVALUE(runState) {
    runState.stack.push(new BN(runState.callValue));
  },
  CALLDATALOAD: function CALLDATALOAD(runState) {
    var pos = runState.stack.pop();
    var r = void 0;
    if (pos.gtn(runState.callData.length)) {
      r = new BN(0);
    } else {
      pos = pos.toNumber();
      var loaded = runState.callData.slice(pos, pos + 32);
      loaded = loaded.length ? loaded : Buffer.from([0]);
      r = new BN(utils.setLengthRight(loaded, 32));
    }
    runState.stack.push(r);
  },
  CALLDATASIZE: function CALLDATASIZE(runState) {
    var r = void 0;
    if (runState.callData.length === 1 && runState.callData[0] === 0) {
      r = new BN(0);
    } else {
      r = new BN(runState.callData.length);
    }
    runState.stack.push(r);
  },
  CALLDATACOPY: function CALLDATACOPY(runState) {
    var _runState$stack$popN49 = runState.stack.popN(3),
        _runState$stack$popN50 = _slicedToArray(_runState$stack$popN49, 3),
        memOffset = _runState$stack$popN50[0],
        dataOffset = _runState$stack$popN50[1],
        dataLength = _runState$stack$popN50[2];

    subMemUsage(runState, memOffset, dataLength);
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(dataLength.divCeil(new BN(32))));

    var data = getDataSlice(runState.callData, dataOffset, dataLength);
    memOffset = memOffset.toNumber();
    dataLength = dataLength.toNumber();
    runState.memory.extend(memOffset, dataLength);
    runState.memory.write(memOffset, dataLength, data);
  },
  CODESIZE: function CODESIZE(runState) {
    runState.stack.push(new BN(runState.code.length));
  },
  CODECOPY: function CODECOPY(runState) {
    var _runState$stack$popN51 = runState.stack.popN(3),
        _runState$stack$popN52 = _slicedToArray(_runState$stack$popN51, 3),
        memOffset = _runState$stack$popN52[0],
        codeOffset = _runState$stack$popN52[1],
        length = _runState$stack$popN52[2];

    subMemUsage(runState, memOffset, length);
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))));

    var data = getDataSlice(runState.code, codeOffset, length);
    memOffset = memOffset.toNumber();
    length = length.toNumber();
    runState.memory.extend(memOffset, length);
    runState.memory.write(memOffset, length, data);
  },
  EXTCODESIZE: function EXTCODESIZE(runState, cb) {
    var address = runState.stack.pop();
    var stateManager = runState.stateManager;
    address = addressToBuffer(address);
    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err);
      runState.stack.push(new BN(code.length));
      cb(null);
    });
  },
  EXTCODECOPY: function EXTCODECOPY(runState, cb) {
    var _runState$stack$popN53 = runState.stack.popN(4),
        _runState$stack$popN54 = _slicedToArray(_runState$stack$popN53, 4),
        address = _runState$stack$popN54[0],
        memOffset = _runState$stack$popN54[1],
        codeOffset = _runState$stack$popN54[2],
        length = _runState$stack$popN54[3];

    var stateManager = runState.stateManager;
    address = addressToBuffer(address);

    // FIXME: for some reason this must come before subGas
    subMemUsage(runState, memOffset, length);
    // copy fee
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))));

    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err);
      var data = getDataSlice(code, codeOffset, length);
      memOffset = memOffset.toNumber();
      length = length.toNumber();
      runState.memory.extend(memOffset, length);
      runState.memory.write(memOffset, length, data);

      cb(null);
    });
  },
  EXTCODEHASH: function EXTCODEHASH(runState, cb) {
    var address = runState.stack.pop();
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE);
    }
    var stateManager = runState.stateManager;
    address = addressToBuffer(address);

    stateManager.getAccount(address, function (err, account) {
      if (err) return cb(err);

      if (account.isEmpty()) {
        runState.stack.push(new BN(0));
        return cb(null);
      }

      stateManager.getContractCode(address, function (err, code) {
        if (err) return cb(err);
        if (code.length === 0) {
          runState.stack.push(new BN(utils.KECCAK256_NULL));
          return cb(null);
        }

        runState.stack.push(new BN(utils.keccak256(code)));
        return cb(null);
      });
    });
  },
  RETURNDATASIZE: function RETURNDATASIZE(runState) {
    runState.stack.push(new BN(runState.lastReturned.length));
  },
  RETURNDATACOPY: function RETURNDATACOPY(runState) {
    var _runState$stack$popN55 = runState.stack.popN(3),
        _runState$stack$popN56 = _slicedToArray(_runState$stack$popN55, 3),
        memOffset = _runState$stack$popN56[0],
        returnDataOffset = _runState$stack$popN56[1],
        length = _runState$stack$popN56[2];

    if (returnDataOffset.add(length).gtn(runState.lastReturned.length)) {
      trap(ERROR.OUT_OF_GAS);
    }

    subMemUsage(runState, memOffset, length);
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).mul(length.divCeil(new BN(32))));

    var data = getDataSlice(utils.toBuffer(runState.lastReturned), returnDataOffset, length);
    memOffset = memOffset.toNumber();
    length = length.toNumber();
    runState.memory.extend(memOffset, length);
    runState.memory.write(memOffset, length, data);
  },
  GASPRICE: function GASPRICE(runState) {
    runState.stack.push(new BN(runState.gasPrice));
  },
  // '0x40' range - block operations
  BLOCKHASH: function BLOCKHASH(runState, cb) {
    var number = runState.stack.pop();
    var blockchain = runState.blockchain;
    var diff = new BN(runState.block.header.number).sub(number);

    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      runState.stack.push(new BN(0));
      cb(null);
      return;
    }

    blockchain.getBlock(number, function (err, block) {
      if (err) return cb(err);
      var blockHash = new BN(block.hash());
      runState.stack.push(blockHash);
      cb(null);
    });
  },
  COINBASE: function COINBASE(runState) {
    runState.stack.push(new BN(runState.block.header.coinbase));
  },
  TIMESTAMP: function TIMESTAMP(runState) {
    runState.stack.push(new BN(runState.block.header.timestamp));
  },
  NUMBER: function NUMBER(runState) {
    runState.stack.push(new BN(runState.block.header.number));
  },
  DIFFICULTY: function DIFFICULTY(runState) {
    runState.stack.push(new BN(runState.block.header.difficulty));
  },
  GASLIMIT: function GASLIMIT(runState) {
    runState.stack.push(new BN(runState.block.header.gasLimit));
  },
  // 0x50 range - 'storage' and execution
  POP: function POP(runState) {
    runState.stack.pop();
  },
  MLOAD: function MLOAD(runState) {
    var pos = runState.stack.pop();
    subMemUsage(runState, pos, new BN(32));
    var word = runState.memory.read(pos.toNumber(), 32);
    runState.stack.push(new BN(word));
  },
  MSTORE: function MSTORE(runState) {
    var _runState$stack$popN57 = runState.stack.popN(2),
        _runState$stack$popN58 = _slicedToArray(_runState$stack$popN57, 2),
        offset = _runState$stack$popN58[0],
        word = _runState$stack$popN58[1];

    word = word.toArrayLike(Buffer, 'be', 32);
    subMemUsage(runState, offset, new BN(32));
    offset = offset.toNumber();
    runState.memory.extend(offset, 32);
    runState.memory.write(offset, 32, word);
  },
  MSTORE8: function MSTORE8(runState) {
    var _runState$stack$popN59 = runState.stack.popN(2),
        _runState$stack$popN60 = _slicedToArray(_runState$stack$popN59, 2),
        offset = _runState$stack$popN60[0],
        byte = _runState$stack$popN60[1];

    // NOTE: we're using a 'trick' here to get the least significant byte


    byte = Buffer.from([byte.andln(0xff)]);
    subMemUsage(runState, offset, new BN(1));
    offset = offset.toNumber();
    runState.memory.extend(offset, 1);
    runState.memory.write(offset, 1, byte);
  },
  SLOAD: function SLOAD(runState, cb) {
    var key = runState.stack.pop();
    var stateManager = runState.stateManager;
    key = key.toArrayLike(Buffer, 'be', 32);

    stateManager.getContractStorage(runState.address, key, function (err, value) {
      if (err) return cb(err);
      value = value.length ? new BN(value) : new BN(0);
      runState.stack.push(value);
      cb(null);
    });
  },
  SSTORE: function SSTORE(runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var _runState$stack$popN61 = runState.stack.popN(2),
        _runState$stack$popN62 = _slicedToArray(_runState$stack$popN61, 2),
        key = _runState$stack$popN62[0],
        val = _runState$stack$popN62[1];

    var stateManager = runState.stateManager;
    var address = runState.address;
    key = key.toArrayLike(Buffer, 'be', 32);
    // NOTE: this should be the shortest representation
    var value;
    if (val.isZero()) {
      value = Buffer.from([]);
    } else {
      value = val.toArrayLike(Buffer, 'be');
    }

    getContractStorage(runState, address, key, function (err, found) {
      if (err) return cb(err);
      try {
        updateSstoreGas(runState, found, value);
      } catch (e) {
        cb(e.error);
        return;
      }

      stateManager.putContractStorage(address, key, value, function (err) {
        if (err) return cb(err);
        stateManager.getAccount(address, function (err, account) {
          if (err) return cb(err);
          runState.contract = account;
          cb(null);
        });
      });
    });
  },
  JUMP: function JUMP(runState) {
    var dest = runState.stack.pop();
    if (dest.gtn(runState.code.length)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
    }

    dest = dest.toNumber();

    if (!jumpIsValid(runState, dest)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
    }

    runState.programCounter = dest;
  },
  JUMPI: function JUMPI(runState) {
    var _runState$stack$popN63 = runState.stack.popN(2),
        _runState$stack$popN64 = _slicedToArray(_runState$stack$popN63, 2),
        dest = _runState$stack$popN64[0],
        cond = _runState$stack$popN64[1];

    if (!cond.isZero()) {
      if (dest.gtn(runState.code.length)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
      }

      dest = dest.toNumber();

      if (!jumpIsValid(runState, dest)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState));
      }

      runState.programCounter = dest;
    }
  },
  PC: function PC(runState) {
    runState.stack.push(new BN(runState.programCounter - 1));
  },
  MSIZE: function MSIZE(runState) {
    runState.stack.push(runState.memoryWordCount.muln(32));
  },
  GAS: function GAS(runState) {
    runState.stack.push(new BN(runState.gasLeft));
  },
  JUMPDEST: function JUMPDEST(runState) {},
  PUSH: function PUSH(runState) {
    var numToPush = runState.opCode - 0x5f;
    var loaded = new BN(runState.code.slice(runState.programCounter, runState.programCounter + numToPush).toString('hex'), 16);
    runState.programCounter += numToPush;
    runState.stack.push(loaded);
  },
  DUP: function DUP(runState) {
    var stackPos = runState.opCode - 0x7f;
    runState.stack.dup(stackPos);
  },
  SWAP: function SWAP(runState) {
    var stackPos = runState.opCode - 0x8f;
    runState.stack.swap(stackPos);
  },
  LOG: function LOG(runState) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var _runState$stack$popN65 = runState.stack.popN(2),
        _runState$stack$popN66 = _slicedToArray(_runState$stack$popN65, 2),
        memOffset = _runState$stack$popN66[0],
        memLength = _runState$stack$popN66[1];

    var topicsCount = runState.opCode - 0xa0;
    if (topicsCount < 0 || topicsCount > 4) {
      trap(ERROR.OUT_OF_RANGE);
    }

    var topics = runState.stack.popN(topicsCount);
    topics = topics.map(function (a) {
      return a.toArrayLike(Buffer, 'be', 32);
    });

    var numOfTopics = runState.opCode - 0xa0;
    subMemUsage(runState, memOffset, memLength);
    var mem = Buffer.alloc(0);
    if (!memLength.isZero()) {
      mem = runState.memory.read(memOffset.toNumber(), memLength.toNumber());
    }
    subGas(runState, new BN(runState._common.param('gasPrices', 'logTopic')).imuln(numOfTopics).iadd(memLength.muln(runState._common.param('gasPrices', 'logData'))));

    // add address
    var log = [runState.address];
    log.push(topics);

    // add data
    log.push(mem);
    runState.logs.push(log);
  },

  // '0xf0' range - closures
  CREATE: function CREATE(runState, done) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var _runState$stack$popN67 = runState.stack.popN(3),
        _runState$stack$popN68 = _slicedToArray(_runState$stack$popN67, 3),
        value = _runState$stack$popN68[0],
        offset = _runState$stack$popN68[1],
        length = _runState$stack$popN68[2];

    subMemUsage(runState, offset, length);
    var data = Buffer.alloc(0);
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber());
    }

    // set up config
    var options = {
      value: value,
      data: data
    };

    var localOpts = {
      inOffset: offset,
      inLength: length,
      outOffset: new BN(0),
      outLength: new BN(0)
    };

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);
    makeCall(runState, options, localOpts, done);
  },
  CREATE2: function CREATE2(runState, done) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE);
    }

    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    var _runState$stack$popN69 = runState.stack.popN(4),
        _runState$stack$popN70 = _slicedToArray(_runState$stack$popN69, 4),
        value = _runState$stack$popN70[0],
        offset = _runState$stack$popN70[1],
        length = _runState$stack$popN70[2],
        salt = _runState$stack$popN70[3];

    subMemUsage(runState, offset, length);
    var data = Buffer.alloc(0);
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber());
    }

    // set up config
    var options = {
      value: value,
      data: data,
      salt: salt.toArrayLike(Buffer, 'be', 32)
    };

    var localOpts = {
      inOffset: offset,
      inLength: length,
      outOffset: new BN(0),
      outLength: new BN(0)

      // Deduct gas costs for hashing
    };subGas(runState, new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))));
    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);
    makeCall(runState, options, localOpts, done);
  },
  CALL: function CALL(runState, done) {
    var stateManager = runState.stateManager;

    var _runState$stack$popN71 = runState.stack.popN(7),
        _runState$stack$popN72 = _slicedToArray(_runState$stack$popN71, 7),
        gasLimit = _runState$stack$popN72[0],
        toAddress = _runState$stack$popN72[1],
        value = _runState$stack$popN72[2],
        inOffset = _runState$stack$popN72[3],
        inLength = _runState$stack$popN72[4],
        outOffset = _runState$stack$popN72[5],
        outLength = _runState$stack$popN72[6];

    toAddress = addressToBuffer(toAddress);

    if (runState.static && !value.isZero()) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }

    subMemUsage(runState, inOffset, inLength);
    var data = Buffer.alloc(0);
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber());
    }

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    if (!value.isZero()) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'callValueTransfer')));
    }

    stateManager.accountIsEmpty(toAddress, function (err, empty) {
      if (err) {
        done(err);
        return;
      }

      if (empty) {
        if (!value.isZero()) {
          try {
            subGas(runState, new BN(runState._common.param('gasPrices', 'callNewAccount')));
          } catch (e) {
            done(e.error);
            return;
          }
        }
      }

      try {
        checkCallMemCost(runState, options, localOpts);
        checkOutOfGas(runState, options);
      } catch (e) {
        done(e.error);
        return;
      }

      if (!value.isZero()) {
        runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'));
        options.gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'));
      }

      makeCall(runState, options, localOpts, done);
    });
  },
  CALLCODE: function CALLCODE(runState, done) {
    var stateManager = runState.stateManager;

    var _runState$stack$popN73 = runState.stack.popN(7),
        _runState$stack$popN74 = _slicedToArray(_runState$stack$popN73, 7),
        gas = _runState$stack$popN74[0],
        toAddress = _runState$stack$popN74[1],
        value = _runState$stack$popN74[2],
        inOffset = _runState$stack$popN74[3],
        inLength = _runState$stack$popN74[4],
        outOffset = _runState$stack$popN74[5],
        outLength = _runState$stack$popN74[6];

    toAddress = addressToBuffer(toAddress);

    subMemUsage(runState, inOffset, inLength);
    var data = Buffer.alloc(0);
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber());
    }

    var options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    if (!value.isZero()) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'callValueTransfer')));
    }

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);

    if (!value.isZero()) {
      runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'));
      options.gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'));
    }

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err);
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true;
        options.code = runState._precompiled[toAddress.toString('hex')];
        makeCall(runState, options, localOpts, done);
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err);
          options.compiled = compiled || false;
          options.code = code;
          makeCall(runState, options, localOpts, done);
        });
      }
    });
  },
  DELEGATECALL: function DELEGATECALL(runState, done) {
    var stateManager = runState.stateManager;
    var value = runState.callValue;

    var _runState$stack$popN75 = runState.stack.popN(6),
        _runState$stack$popN76 = _slicedToArray(_runState$stack$popN75, 6),
        gas = _runState$stack$popN76[0],
        toAddress = _runState$stack$popN76[1],
        inOffset = _runState$stack$popN76[2],
        inLength = _runState$stack$popN76[3],
        outOffset = _runState$stack$popN76[4],
        outLength = _runState$stack$popN76[5];

    toAddress = addressToBuffer(toAddress);

    subMemUsage(runState, inOffset, inLength);
    var data = Buffer.alloc(0);
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber());
    }

    var options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      caller: runState.caller,
      delegatecall: true,
      static: runState.static
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    checkCallMemCost(runState, options, localOpts);
    checkOutOfGas(runState, options);

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err);
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true;
        options.code = runState._precompiled[toAddress.toString('hex')];
        makeCall(runState, options, localOpts, done);
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err);
          options.compiled = compiled || false;
          options.code = code;
          makeCall(runState, options, localOpts, done);
        });
      }
    });
  },
  STATICCALL: function STATICCALL(runState, done) {
    var value = new BN(0);

    var _runState$stack$popN77 = runState.stack.popN(6),
        _runState$stack$popN78 = _slicedToArray(_runState$stack$popN77, 6),
        gasLimit = _runState$stack$popN78[0],
        toAddress = _runState$stack$popN78[1],
        inOffset = _runState$stack$popN78[2],
        inLength = _runState$stack$popN78[3],
        outOffset = _runState$stack$popN78[4],
        outLength = _runState$stack$popN78[5];

    toAddress = addressToBuffer(toAddress);

    subMemUsage(runState, inOffset, inLength);
    var data = Buffer.alloc(0);
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber());
    }

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: true
    };

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    };

    try {
      checkCallMemCost(runState, options, localOpts);
      checkOutOfGas(runState, options);
    } catch (e) {
      done(e.error);
      return;
    }

    makeCall(runState, options, localOpts, done);
  },
  RETURN: function RETURN(runState) {
    var _runState$stack$popN79 = runState.stack.popN(2),
        _runState$stack$popN80 = _slicedToArray(_runState$stack$popN79, 2),
        offset = _runState$stack$popN80[0],
        length = _runState$stack$popN80[1];

    subMemUsage(runState, offset, length);
    runState.returnValue = Buffer.alloc(0);
    if (!length.isZero()) {
      runState.returnValue = runState.memory.read(offset.toNumber(), length.toNumber());
    }
  },
  REVERT: function REVERT(runState) {
    var _runState$stack$popN81 = runState.stack.popN(2),
        _runState$stack$popN82 = _slicedToArray(_runState$stack$popN81, 2),
        offset = _runState$stack$popN82[0],
        length = _runState$stack$popN82[1];

    runState.stopped = true;
    subMemUsage(runState, offset, length);
    runState.returnValue = Buffer.alloc(0);
    if (!length.isZero()) {
      runState.returnValue = runState.memory.read(offset.toNumber(), length.toNumber());
    }
    trap(ERROR.REVERT);
  },
  // '0x70', range - other
  SELFDESTRUCT: function SELFDESTRUCT(runState, cb) {
    var selfdestructToAddress = runState.stack.pop();
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE);
    }
    var stateManager = runState.stateManager;
    var contract = runState.contract;
    var contractAddress = runState.address;
    selfdestructToAddress = addressToBuffer(selfdestructToAddress);

    stateManager.getAccount(selfdestructToAddress, function (err, toAccount) {
      // update balances
      if (err) {
        cb(err);
        return;
      }

      stateManager.accountIsEmpty(selfdestructToAddress, function (error, empty) {
        if (error) {
          cb(error);
          return;
        }

        if (new BN(contract.balance).gtn(0)) {
          if (empty) {
            try {
              subGas(runState, new BN(runState._common.param('gasPrices', 'callNewAccount')));
            } catch (e) {
              cb(e.error);
              return;
            }
          }
        }

        // only add to refund if this is the first selfdestruct for the address
        if (!runState.selfdestruct[contractAddress.toString('hex')]) {
          runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'selfdestructRefund'));
        }
        runState.selfdestruct[contractAddress.toString('hex')] = selfdestructToAddress;
        runState.stopped = true;

        var newBalance = new BN(contract.balance).add(new BN(toAccount.balance));
        async.waterfall([stateManager.getAccount.bind(stateManager, selfdestructToAddress), function (account, cb) {
          account.balance = newBalance;
          stateManager.putAccount(selfdestructToAddress, account, cb);
        }, stateManager.getAccount.bind(stateManager, contractAddress), function (account, cb) {
          account.balance = new BN(0);
          stateManager.putAccount(contractAddress, account, cb);
        }], function (err) {
          // The reason for this is to avoid sending an array of results
          cb(err);
        });
      });
    });
  }
};

function describeLocation(runState) {
  var hash = utils.keccak256(runState.code).toString('hex');
  var address = runState.address.toString('hex');
  var pc = runState.programCounter - 1;
  return hash + '/' + address + ':' + pc;
}

function subGas(runState, amount) {
  runState.gasLeft.isub(amount);
  if (runState.gasLeft.ltn(0)) {
    runState.gasLeft = new BN(0);
    trap(ERROR.OUT_OF_GAS);
  }
}

function trap(err) {
  throw new VmError(err);
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 * @method subMemUsage
 * @param {Object} runState
 * @param {BN} offset
 * @param {BN} length
 * @returns {String}
 */
function subMemUsage(runState, offset, length) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return;

  var newMemoryWordCount = offset.add(length).divCeil(new BN(32));
  if (newMemoryWordCount.lte(runState.memoryWordCount)) return;

  var words = newMemoryWordCount;
  var fee = new BN(runState._common.param('gasPrices', 'memory'));
  var quadCoeff = new BN(runState._common.param('gasPrices', 'quadCoeffDiv'));
  // words * 3 + words ^2 / 512
  var cost = words.mul(fee).add(words.mul(words).div(quadCoeff));

  if (cost.gt(runState.highestMemCost)) {
    subGas(runState, cost.sub(runState.highestMemCost));
    runState.highestMemCost = cost;
  }

  runState.memoryWordCount = newMemoryWordCount;
}

/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 * @param {BN} offset
 * @param {BN} length
 * @param {Buffer} data
 */
function getDataSlice(data, offset, length) {
  var len = new BN(data.length);
  if (offset.gt(len)) {
    offset = len;
  }

  var end = offset.add(length);
  if (end.gt(len)) {
    end = len;
  }

  data = data.slice(offset.toNumber(), end.toNumber());
  // Right-pad with zeros to fill dataLength bytes
  data = utils.setLengthRight(data, length.toNumber());

  return data;
}

// checks if a jump is valid given a destination
function jumpIsValid(runState, dest) {
  return runState.validJumps.indexOf(dest) !== -1;
}

// checks to see if we have enough gas left for the memory reads and writes
// required by the CALLs
function checkCallMemCost(runState, callOptions, localOpts) {
  // calculates the gas need for saving the output in memory
  subMemUsage(runState, localOpts.outOffset, localOpts.outLength);

  if (!callOptions.gasLimit) {
    callOptions.gasLimit = new BN(runState.gasLeft);
  }
}

function checkOutOfGas(runState, callOptions) {
  var gasAllowed = runState.gasLeft.sub(runState.gasLeft.divn(64));
  if (callOptions.gasLimit.gt(gasAllowed)) {
    callOptions.gasLimit = gasAllowed;
  }
}

// sets up and calls runCall
function makeCall(runState, callOptions, localOpts, cb) {
  var selfdestruct = Object.assign({}, runState.selfdestruct);
  callOptions.caller = callOptions.caller || runState.address;
  callOptions.origin = runState.origin;
  callOptions.gasPrice = runState.gasPrice;
  callOptions.block = runState.block;
  callOptions.static = callOptions.static || false;
  callOptions.selfdestruct = selfdestruct;
  callOptions.storageReader = runState.storageReader;

  // increment the runState.depth
  callOptions.depth = runState.depth + 1;

  // empty the return data buffer
  runState.lastReturned = Buffer.alloc(0);

  // check if account has enough ether
  // Note: in the case of delegatecall, the value is persisted and doesn't need to be deducted again
  if (runState.depth >= runState._common.param('vm', 'stackLimit') || callOptions.delegatecall !== true && new BN(runState.contract.balance).lt(callOptions.value)) {
    runState.stack.push(new BN(0));
    cb(null);
  } else {
    // if creating a new contract then increament the nonce
    if (!callOptions.to) {
      runState.contract.nonce = new BN(runState.contract.nonce).addn(1);
    }

    runState.stateManager.putAccount(runState.address, runState.contract, function (err) {
      if (err) return cb(err);
      runState._vm.runCall(callOptions, parseCallResults);
    });
  }

  function parseCallResults(err, results) {
    if (err) return cb(err);

    // concat the runState.logs
    if (results.vm.logs) {
      runState.logs = runState.logs.concat(results.vm.logs);
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      runState.gasRefund = runState.gasRefund.add(results.vm.gasRefund);
    }

    // this should always be safe
    runState.gasLeft.isub(results.gasUsed);

    // save results to memory
    if (results.vm.return && (!results.vm.exceptionError || results.vm.exceptionError.error === ERROR.REVERT)) {
      if (results.vm.return.length > 0) {
        var memOffset = localOpts.outOffset.toNumber();
        var dataLength = localOpts.outLength.toNumber();
        if (results.vm.return.length < dataLength) {
          dataLength = results.vm.return.length;
        }
        var data = getDataSlice(results.vm.return, new BN(0), new BN(dataLength));
        runState.memory.extend(memOffset, dataLength);
        runState.memory.write(memOffset, dataLength, data);
      }

      if (results.vm.exceptionError && results.vm.exceptionError.error === ERROR.REVERT && isCreateOpCode(runState.opName)) {
        runState.lastReturned = results.vm.return;
      }

      switch (runState.opName) {
        case 'CALL':
        case 'CALLCODE':
        case 'DELEGATECALL':
        case 'STATICCALL':
          runState.lastReturned = results.vm.return;
          break;
      }
    }

    if (!results.vm.exceptionError) {
      Object.assign(runState.selfdestruct, selfdestruct);
      // update stateRoot on current contract
      runState.stateManager.getAccount(runState.address, function (err, account) {
        if (err) return cb(err);

        runState.contract = account;
        // push the created address to the stack
        if (results.createdAddress) {
          runState.stack.push(new BN(results.createdAddress));
          cb(null);
        } else {
          runState.stack.push(new BN(results.vm.exception));
          cb(null);
        }
      });
    } else {
      // creation failed so don't increment the nonce
      if (results.vm.createdAddress) {
        runState.contract.nonce = new BN(runState.contract.nonce).subn(1);
      }

      runState.stack.push(new BN(results.vm.exception));
      cb(null);
    }
  }
}

function isCreateOpCode(opName) {
  return opName === 'CREATE' || opName === 'CREATE2';
}

function getContractStorage(runState, address, key, cb) {
  if (runState._common.hardfork() === 'constantinople') {
    runState.storageReader.getContractStorage(address, key, cb);
  } else {
    runState.stateManager.getContractStorage(address, key, cb);
  }
}

function updateSstoreGas(runState, found, value) {
  if (runState._common.hardfork() === 'constantinople') {
    var original = found.original;
    var current = found.current;
    if (current.equals(value)) {
      // If current value equals new value (this is a no-op), 200 gas is deducted.
      subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreNoopGas')));
      return;
    }
    // If current value does not equal new value
    if (original.equals(current)) {
      // If original value equals current value (this storage slot has not been changed by the current execution context)
      if (original.length === 0) {
        // If original value is 0, 20000 gas is deducted.
        return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreInitGas')));
      }
      if (value.length === 0) {
        // If new value is 0, add 15000 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreClearRefund'));
      }
      // Otherwise, 5000 gas is deducted.
      return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')));
    }
    // If original value does not equal current value (this storage slot is dirty), 200 gas is deducted. Apply both of the following clauses.
    if (original.length !== 0) {
      // If original value is not 0
      if (current.length === 0) {
        // If current value is 0 (also means that new value is not 0), remove 15000 gas from refund counter. We can prove that refund counter will never go below 0.
        runState.gasRefund = runState.gasRefund.subn(runState._common.param('gasPrices', 'netSstoreClearRefund'));
      } else if (value.length === 0) {
        // If new value is 0 (also means that current value is not 0), add 15000 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreClearRefund'));
      }
    }
    if (original.equals(value)) {
      // If original value equals new value (this storage slot is reset)
      if (original.length === 0) {
        // If original value is 0, add 19800 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreResetClearRefund'));
      } else {
        // Otherwise, add 4800 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreResetRefund'));
      }
    }
    return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')));
  } else {
    if (value.length === 0 && !found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')));
    } else if (value.length === 0 && found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')));
      runState.gasRefund.iaddn(runState._common.param('gasPrices', 'sstoreRefund'));
    } else if (value.length !== 0 && !found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreSet')));
    } else if (value.length !== 0 && found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')));
    }
  }
}