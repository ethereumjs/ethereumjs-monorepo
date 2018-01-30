/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazly dupilicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
const Buffer = require('safe-buffer').Buffer
const async = require('async')
const utils = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const lookupOpInfo = require('./opcodes.js')
const opFns = require('./opFns.js')
const exceptions = require('./exceptions.js')
const setImmediate = require('timers').setImmediate
const BN = utils.BN

const ERROR = exceptions.ERROR
const VmError = exceptions.VmError

/**
 * Runs EVM code
 * @param opts
 * @param opts.account {Account} the account that the exucuting code belongs to
 * @param opts.address {Buffer}  the address of the account that is exucuting this code
 * @param opts.block {Block} the block that the transaction is part of
 * @param opts.caller {Buffer} the address that ran this code
 * @param opts.code {Buffer} the code to be run
 * @param opts.data {Buffer}  the input data
 * @param opts.gasLimit {Buffer}
 * @param opts.origin {Buffer} the address where the call originated from
 * @param opts.value {Buffer} the amount the being transfered
 * @param cb {Function}
 */
module.exports = function (opts, cb) {
  var self = this
  var stateManager = self.stateManager

  var block = opts.block || new Block()

  // VM internal state
  var runState = {
    stateManager: stateManager,
    returnValue: false,
    stopped: false,
    vmError: false,
    programCounter: 0,
    opCode: undefined,
    opName: undefined,
    gasLeft: new BN(opts.gasLimit),
    gasLimit: new BN(opts.gasLimit),
    gasPrice: opts.gasPrice,
    memory: [],
    memoryWordCount: new BN(0),
    stack: [],
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
    populateCache: opts.populateCache === undefined ? true : opts.populateCache,
    static: opts.static || false
  }

  // temporary - to be factored out
  runState._precompiled = self._precompiled
  runState._vm = self

  // since Homestead
  opFns.DELEGATECALL = opFns._DC

  // prepare to run vm
  preprocessValidJumps(runState)
  // load contract then start vm run
  loadContract(runVm)

  // iterate through the given ops until something breaks or we hit STOP
  function runVm () {
    async.whilst(vmIsActive, iterateVm, parseVmResults)
  }

  // ensure contract is loaded; only used if runCode is called directly
  function loadContract (cb) {
    stateManager.getAccount(runState.address, function (err, account) {
      if (err) return cb(err)
      runState.contract = account
      cb()
    })
  }

  function vmIsActive () {
    var notAtEnd = runState.programCounter < runState.code.length

    return !runState.stopped && notAtEnd && !runState.vmError && !runState.returnValue
  }

  function iterateVm (done) {
    var opCode = runState.code[runState.programCounter]
    var opInfo = lookupOpInfo(opCode)
    var opName = opInfo.name
    var opFn = opFns[opName]

    runState.opName = opName
    runState.opCode = opCode

    // check for invalid opcode
    if (opName === 'INVALID') {
      return done(new VmError(ERROR.INVALID_OPCODE))
    }

    // check for stack underflows
    if (runState.stack.length < opInfo.in) {
      return done(new VmError(ERROR.STACK_UNDERFLOW))
    }

    if ((runState.stack.length - opInfo.in + opInfo.out) > 1024) {
      return done(new VmError(ERROR.STACK_OVERFLOW))
    }

    async.series([
      runStepHook,
      runOp
    ], function (err) {
      setImmediate(done.bind(null, err))
    })

    function runStepHook (cb) {
      var eventObj = {
        pc: runState.programCounter,
        gasLeft: runState.gasLeft,
        opcode: lookupOpInfo(opCode, true),
        stack: runState.stack,
        depth: runState.depth,
        address: runState.address,
        account: runState.contract,
        cache: runState.stateManager.cache,
        memory: runState.memory
      }
      self.emit('step', eventObj, cb)
    }

    function runOp (cb) {
      // calculate gas
      var fee = new BN(opInfo.fee)
      // TODO: move to a shared funtion; subGas in opFuns
      runState.gasLeft = runState.gasLeft.sub(fee)
      if (runState.gasLeft.ltn(0)) {
        runState.gasLeft = new BN(0)
        cb(new VmError(ERROR.OUT_OF_GAS))
        return
      }

      // advance program counter
      runState.programCounter++
      var argsNum = opInfo.in
      var retNum = opInfo.out
      // pop the stack
      var args = argsNum ? runState.stack.splice(-argsNum) : []

      args.reverse()
      args.push(runState)
      // create a callback for async opFunc
      if (opInfo.async) {
        args.push(function (err, result) {
          if (err) return cb(err)

          // save result to the stack
          if (result !== undefined) {
            if (retNum !== 1) {
              // opcode post-stack mismatch
              return cb(new VmError(ERROR.INTERNAL_ERROR))
            }

            runState.stack.push(result)
          } else {
            if (retNum !== 0) {
              // opcode post-stack mismatch
              return cb(new VmError(ERROR.INTERNAL_ERROR))
            }
          }

          cb()
        })
      }

      try {
        // run the opcode
        var result = opFn.apply(null, args)
      } catch (e) {
        cb(e)
        return
      }

      // save result to the stack
      if (result !== undefined) {
        if (retNum !== 1) {
          // opcode post-stack mismatch
          return cb(VmError(ERROR.INTERNAL_ERROR))
        }

        runState.stack.push(result)
      } else {
        if (!opInfo.async && retNum !== 0) {
          // opcode post-stack mismatch
          return cb(VmError(ERROR.INTERNAL_ERROR))
        }
      }

      // call the callback if opFn was sync
      if (!opInfo.async) {
        cb()
      }
    }
  }

  function parseVmResults (err) {
    // remove any logs on error
    if (err) {
      runState.logs = []
      stateManager.revertContracts()
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
      self.stateManager.touched = []
    }

    if (err && err.error !== ERROR.REVERT) {
      results.gasUsed = runState.gasLimit
    } else {
      results.gasUsed = runState.gasLimit.sub(runState.gasLeft)
    }

    if (runState.populateCache) {
      self.stateManager.cache.flush(function () {
        self.stateManager.cache.clear()
        cb(err, results)
      })
    } else {
      cb(err, results)
    }
  }
}

// find all the valid jumps and puts them in the `validJumps` array
function preprocessValidJumps (runState) {
  for (var i = 0; i < runState.code.length; i++) {
    var curOpCode = lookupOpInfo(runState.code[i]).name

    // no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += runState.code[i] - 0x5f
    }

    if (curOpCode === 'JUMPDEST') {
      runState.validJumps.push(i)
    }
  }
}
