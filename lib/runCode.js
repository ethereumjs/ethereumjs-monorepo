/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazily duplicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
const Buffer = require('safe-buffer').Buffer
const async = require('async')
const lookupOpInfo = require('./vm/opcodes.js')
const exceptions = require('./exceptions.js')
const setImmediate = require('timers').setImmediate

const ERROR = exceptions.ERROR
const VmError = exceptions.VmError

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
  const self = this
  let runState

  this.initRunState(opts)
    .then(function (state) {
      runState = state
      runVm()
    }).catch(function (err) {
      cb(err)
    })

  // iterate through the given ops until something breaks or we hit STOP
  function runVm (err) {
    // Check that the programCounter is in range. Does not overwrite the previous err, if any.
    const pc = runState.programCounter
    if (!err && pc !== 0 && (pc < 0 || pc >= runState.code.length)) {
      err = new VmError(ERROR.INVALID_OPCODE)
    }

    if (err) {
      return parseVmResults(err)
    }
    async.whilst(vmIsActive, iterateVm, parseVmResults)
  }

  function vmIsActive () {
    return self.canContinueExecution(runState)
  }

  function iterateVm (done) {
    var opCode = runState.code[runState.programCounter]

    async.series(
      self.emit === undefined ? [runOp] : [runStepHook, runOp],
      function (err) {
      setImmediate(done.bind(null, err))
    })

    function runStepHook (cb) {
      var eventObj = {
        pc: runState.programCounter,
        gasLeft: runState.gasLeft,
        opcode: lookupOpInfo(opCode, true, self.emitFreeLogs),
        stack: runState.stack,
        depth: runState.depth,
        address: runState.address,
        account: runState.contract,
        stateManager: runState.stateManager,
        memory: runState.memory,
        memoryWordCount: runState.memoryWordCount
      }
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
      self.emit('step', eventObj, cb)
    }

    function runOp (cb) {
      self.runNextStep(runState)
        .then(
          function () {
            cb()
          }
        ).catch(
          function (err) {
            cb(err)
          }
        )
    }
  }

  function parseVmResults (err) {
    // remove any logs on error
    if (err) {
      runState.logs = []
      runState.vmError = true
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
    }

    if (results.exceptionError) {
      delete results.gasRefund
      delete results.selfdestruct
    }

    if (err && err.error !== ERROR.REVERT) {
      results.gasUsed = runState.gasLimit
    } else {
      results.gasUsed = runState.gasLimit.sub(runState.gasLeft)
    }

    cb(err, results)
  }
}
