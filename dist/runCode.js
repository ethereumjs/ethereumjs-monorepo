'use strict';

/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazily duplicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
var Buffer = require('safe-buffer').Buffer;
var async = require('async');
var utils = require('ethereumjs-util');
var Block = require('ethereumjs-block');
var lookupOpInfo = require('./evm/opcodes.js');
var opFns = require('./evm/opFns.js');
var Memory = require('./evm/memory');
var Stack = require('./evm/stack');
var exceptions = require('./exceptions.js');

var _require = require('./state'),
    StorageReader = _require.StorageReader;

var setImmediate = require('timers').setImmediate;
var BN = utils.BN;

var ERROR = exceptions.ERROR;
var VmError = exceptions.VmError;

/**
 * Runs EVM code
 * @method vm.runCode
 * @param {Object} opts
 * @param {Account} opts.account the [`Account`](https://github.com/ethereumjs/ethereumjs-account) that the executing code belongs to. If omitted an empty account will be used
 * @param {Buffer} opts.address the address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`
 * @param {Block} opts.block the [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used
 * @param {Buffer} opts.caller the address that ran this code. The address should be a `Buffer` of 20bits. Defaults to `0`
 * @param {Buffer} opts.code the EVM code to run given as a `Buffer`
 * @param {Buffer} opts.data the input data
 * @param {Buffer} opts.gasLimit the gas limit for the code
 * @param {Buffer} opts.origin the address where the call originated from. The address should be a `Buffer` of 20bits. Defaults to `0`
 * @param {Buffer} opts.value the value in ether that is being sent to `opt.address`. Defaults to `0`
 * @param {Number} opts.pc the initial program counter. Defaults to `0`
 * @param {runCode~callback} cb callback
 */

/**
 * Callback for `runCode` method
 * @callback runCode~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Object} results
 * @param {BN} results.gas the amount of gas left
 * @param {BN} results.gasUsed the amount of gas as a `bignum` the code used to run
 * @param {BN} results.gasRefund a `bignum` containing the amount of gas to refund from deleting storage values
 * @param {Object} results.selfdestruct an `Object` with keys for accounts that have selfdestructed and values for balance transfer recipient accounts
 * @param {Array} results.logs an `Array` of logs that the contract emitted
 * @param {Number} results.exception `0` if the contract encountered an exception, `1` otherwise
 * @param {String} results.exceptionError a `String` describing the exception if there was one
 * @param {Buffer} results.return a `Buffer` containing the value that was returned by the contract
*/
module.exports = function (opts, cb) {
  var self = this;
  var stateManager = self.stateManager;

  var block = opts.block || new Block();

  // VM internal state
  var runState = {
    blockchain: self.blockchain,
    stateManager: stateManager,
    storageReader: opts.storageReader || new StorageReader(stateManager),
    returnValue: false,
    stopped: false,
    vmError: false,
    programCounter: opts.pc | 0,
    opCode: undefined,
    opName: undefined,
    gasLeft: new BN(opts.gasLimit),
    gasLimit: new BN(opts.gasLimit),
    gasPrice: opts.gasPrice,
    memory: new Memory(),
    memoryWordCount: new BN(0),
    stack: new Stack(),
    lastReturned: [],
    logs: [],
    validJumps: [],
    gasRefund: new BN(0),
    highestMemCost: new BN(0),
    depth: opts.depth || 0,
    // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
    selfdestruct: opts.selfdestruct || opts.suicides || {},
    block: block,
    callValue: opts.value || new BN(0),
    address: opts.address || utils.zeros(32),
    caller: opts.caller || utils.zeros(32),
    origin: opts.origin || opts.caller || utils.zeros(32),
    callData: opts.data || Buffer.from([0]),
    code: opts.code,
    static: opts.static || false

    // temporary - to be factored out
  };runState._common = self._common;
  runState._precompiled = self._precompiled;
  runState._vm = self;

  // prepare to run vm
  preprocessValidJumps(runState);
  // load contract then start vm run
  loadContract(runVm);

  // iterate through the given ops until something breaks or we hit STOP
  function runVm(err) {
    // Check that the programCounter is in range. Does not overwrite the previous err, if any.
    var pc = runState.programCounter;
    if (!err && pc !== 0 && (pc < 0 || pc >= runState.code.length)) {
      err = new VmError(ERROR.INVALID_OPCODE);
    }

    if (err) {
      return parseVmResults(err);
    }
    async.whilst(vmIsActive, iterateVm, parseVmResults);
  }

  // ensure contract is loaded; only used if runCode is called directly
  function loadContract(cb) {
    stateManager.getAccount(runState.address, function (err, account) {
      if (err) return cb(err);
      runState.contract = account;
      cb();
    });
  }

  function vmIsActive() {
    var notAtEnd = runState.programCounter < runState.code.length;

    return !runState.stopped && notAtEnd && !runState.vmError && !runState.returnValue;
  }

  function iterateVm(done) {
    var opCode = runState.code[runState.programCounter];
    var opInfo = lookupOpInfo(opCode, false, self.emitFreeLogs);
    var opName = opInfo.name;
    var opFn = opFns[opName];

    runState.opName = opName;
    runState.opCode = opCode;

    async.series([runStepHook, runOp], function (err) {
      setImmediate(done.bind(null, err));
    });

    function runStepHook(cb) {
      var eventObj = {
        pc: runState.programCounter,
        gasLeft: runState.gasLeft,
        opcode: lookupOpInfo(opCode, true, self.emitFreeLogs),
        stack: runState.stack._store,
        depth: runState.depth,
        address: runState.address,
        account: runState.contract,
        stateManager: runState.stateManager,
        memory: runState.memory._store, // Return underlying array for backwards-compatibility
        memoryWordCount: runState.memoryWordCount
        /**
         * The `step` event for trace output
         *
         * @event Event: step
         * @type {Object}
         * @property {Number} pc representing the program counter
         * @property {String} opcode the next opcode to be ran
         * @property {BN} gasLeft amount of gasLeft
         * @property {Array} stack an `Array` of `Buffers` containing the stack
         * @property {Account} account the [`Account`](https://github.com/ethereum/ethereumjs-account) which owns the code running
         * @property {Buffer} address the address of the `account`
         * @property {Number} depth the current number of calls deep the contract is
         * @property {Buffer} memory the memory of the VM as a `buffer`
         * @property {BN} memoryWordCount current size of memory in words
         * @property {StateManager} stateManager a [`StateManager`](stateManager.md) instance (Beta API)
         */
      };self.emit('step', eventObj, cb);
    }

    function runOp(cb) {
      // check for invalid opcode
      if (opName === 'INVALID') {
        return cb(new VmError(ERROR.INVALID_OPCODE));
      }

      // calculate gas
      var fee = new BN(opInfo.fee);
      // TODO: move to a shared funtion; subGas in opFuns
      runState.gasLeft = runState.gasLeft.sub(fee);
      if (runState.gasLeft.ltn(0)) {
        runState.gasLeft = new BN(0);
        cb(new VmError(ERROR.OUT_OF_GAS));
        return;
      }

      // advance program counter
      runState.programCounter++;
      var args = [runState];
      // create a callback for async opFunc
      if (opInfo.async) {
        args.push(cb);
      }

      // if opcode is log and emitFreeLogs is enabled, remove static context
      var prevStatic = runState.static;
      if (self.emitFreeLogs && opName === 'LOG') {
        runState.static = false;
      }

      try {
        // run the opcode
        opFn.apply(null, args);
      } catch (e) {
        if (e.errorType && e.errorType === 'VmError') {
          cb(e);
          return;
        } else {
          throw e;
        }
      }

      // restore previous static context
      runState.static = prevStatic;

      // call the callback if opFn was sync
      if (!opInfo.async) {
        cb();
      }
    }
  }

  function parseVmResults(err) {
    // remove any logs on error
    if (err) {
      runState.logs = [];
      runState.vmError = true;
    }

    var results = {
      runState: runState,
      selfdestruct: runState.selfdestruct,
      gasRefund: runState.gasRefund,
      exception: err ? 0 : 1,
      exceptionError: err,
      logs: runState.logs,
      gas: runState.gasLeft,
      'return': runState.returnValue ? runState.returnValue : Buffer.alloc(0)
    };

    if (results.exceptionError) {
      delete results.gasRefund;
      delete results.selfdestruct;
    }

    if (err && err.error !== ERROR.REVERT) {
      results.gasUsed = runState.gasLimit;
    } else {
      results.gasUsed = runState.gasLimit.sub(runState.gasLeft);
    }

    cb(err, results);
  }
};

// find all the valid jumps and puts them in the `validJumps` array
function preprocessValidJumps(runState) {
  for (var i = 0; i < runState.code.length; i++) {
    var curOpCode = lookupOpInfo(runState.code[i]).name;

    // no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += runState.code[i] - 0x5f;
    }

    if (curOpCode === 'JUMPDEST') {
      runState.validJumps.push(i);
    }
  }
}