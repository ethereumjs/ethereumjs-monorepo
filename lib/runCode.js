/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazly dupilicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.

*/

const async = require('async')
const utils = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const lookupOpInfo = require('./opcodes.js')
const opFns = require('./opFns.js')
const constants = require('./constants.js')
const setImmediate = require('timers').setImmediate
const BN = utils.BN

const ERROR = constants.ERROR

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

  // VM internal state
  var runState = {
    stateManager: stateManager,
    returnValue: new Buffer([]),
    stopped: false,
    vmError: false,
    suicideTo: undefined,
    programCounter: 0,
    opCode: undefined,
    opName: undefined,
    gasLeft: new BN(opts.gasLimit),
    gasLimit: new BN(opts.gasLimit),
    gasPrice: opts.gasPrice,
    memory: [],
    memoryWordCount: 0,
    stack: [],
    logs: [],
    validJumps: [],
    gasRefund: new BN(0),
    highestMemCost: new BN(0),
    depth: opts.depth || 0,
    suicides: opts.suicides || {},
    block: opts.block || new Block(),
    callValue: opts.value || new Buffer([0]),
    address: opts.address || utils.zeros(32),
    caller: opts.caller || utils.zeros(32),
    origin: opts.origin || opts.caller || utils.zeros(32),
    callData: opts.data || new Buffer([0]),
    code: opts.code,
    populateCache: opts.populateCache === undefined ? true : opts.populateCache
  }

  // temporary - to be factored out
  runState._precomiled = self._precomiled
  runState._vm = self

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
    if (runState.gasLeft.cmpn(0) === -1) {
      runState.vmError = ERROR.OUT_OF_GAS
      return false
    }
    var notAtEnd = runState.programCounter < runState.code.length
    return !runState.stopped && notAtEnd
  }

  function iterateVm (done) {
    if (runState.stack.length > 1024) {
      return done(ERROR.INVALID_OPCODE)
    }

    var opCode = runState.code[runState.programCounter]
    var opInfo = lookupOpInfo(opCode)
    var opName = opInfo.opcode
    var opFn = opFns[opName]

    runState.opName = opName
    runState.opCode = opCode

    // check for invalid opcode
    if (opName === 'INVALID') {
      return done(ERROR.INVALID_OPCODE)
    }

    // check for stack underflows
    if (runState.stack.length < opInfo.in) {
      return done(ERROR.STACK_UNDERFLOW)
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
        memory: runState.memory
      }
      self.emit('step', eventObj, cb)
    }

    function runOp (cb) {
      // calculate gas
      var fee = new BN(opInfo.fee)
      runState.gasLeft = runState.gasLeft.sub(fee)
      // advance program counter
      runState.programCounter++

      // call opFn - sync or async
      if (opFn.length === 2) {
        opFn(runState, cb)
      } else {
        var err = opFn(runState)
        cb(err)
      }
    }
  }

  function parseVmResults (err) {
    err = runState.vmError || err

    // remove any logs on error
    if (err) {
      runState.logs = []
      stateManager.revertContracts()
    }

    var results = {
      suicides: runState.suicides,
      suicideTo: runState.suicideTo,
      gasRefund: runState.gasRefund,
      exception: err ? 0 : 1,
      exceptionError: err,
      logs: runState.logs,
      gas: runState.gasLeft,
      'return': runState.returnValue
    }

    if (results.exceptionError) {
      delete results.gasRefund
    }

    if (err) {
      results.gasUsed = runState.gasLimit
    } else {
      results.gasUsed = runState.gasLimit.sub(runState.gasLeft)
    }

    if (runState.populateCache) {
      self.stateManager.cache.flush(cb.bind(this, err, results))
    } else {
      cb(err, results)
    }
  }
}

// find all the valid jumps and puts them in the `validJumps` array
function preprocessValidJumps (runState) {
  for (var i = 0; i < runState.code.length; i++) {
    var curOpCode = lookupOpInfo(runState.code[i]).opcode

    // no destinations into the middle of PUSH
    if (curOpCode === 'PUSH') {
      i += runState.code[i] - 0x5f
    }

    if (curOpCode === 'JUMPDEST') {
      runState.validJumps.push(i)
    }
  }
}
