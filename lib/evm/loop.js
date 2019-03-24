const { promisify } = require('util')
const BN = require('bn.js')
const Block = require('ethereumjs-block')
const utils = require('ethereumjs-util')
const { StorageReader } = require('../state')
const { ERROR, VmError } = require('../exceptions')
const Memory = require('./memory')
const Stack = require('./stack')
const lookupOpInfo = require('./opcodes.js')
const opFns = require('./opFns.js')

module.exports = class Loop {
  constructor (vm, interpreter) {
    this._vm = vm // TODO: remove when not needed
    this._state = vm.stateManager
    this._interpreter = interpreter
  }

  async run (opts) {
    const block = opts.block || new Block()

    // VM internal state
    const runState = {
      blockchain: this._vm.blockchain,
      stateManager: this._state,
      storageReader: opts.storageReader || new StorageReader(this._state),
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
      static: opts.static || false,
      interpreter: this._interpreter // TODO: Replace with EEI method
    }

    // temporary - to be factored out
    runState._common = this._vm._common
    runState._precompiled = this._vm._precompiled

    // prepare to run vm
    this._preprocessValidJumps(runState)
    // load contract then start vm run
    // ensure contract is loaded; only used if runCode is called directly
    runState.contract = await this._getAccount(runState.address)

    const vmIsActive = () => {
      var notAtEnd = runState.programCounter < runState.code.length
      return !runState.stopped && notAtEnd && !runState.vmError && !runState.returnValue
    }

    // Check that the programCounter is in range
    const pc = runState.programCounter
    if (pc !== 0 && (pc < 0 || pc >= runState.code.length)) {
      return this._parseVmResults(runState, new VmError(ERROR.INVALID_OPCODE))
    }

    let err
    // iterate through the given ops until something breaks or we hit STOP
    while (vmIsActive()) {
      const opCode = runState.code[runState.programCounter]
      runState.opCode = opCode
      await this._runStepHook(runState)

      try {
        await this._runOp(runState)
      } catch (e) {
        err = e
        break
      }
    }

    return this._parseVmResults(runState, err)
  }

  async _runOp (runState) {
    return new Promise((resolve, reject) => {
      const opInfo = lookupOpInfo(runState.opCode, false, this._vm.emitFreeLogs)
      const opName = opInfo.name
      const opFn = opFns[opName]

      runState.opName = opName

      // check for invalid opcode
      if (runState.opName === 'INVALID') {
        return reject(new VmError(ERROR.INVALID_OPCODE))
      }

      // calculate gas
      const fee = new BN(opInfo.fee)
      // TODO: move to a shared funtion; subGas in opFuns
      runState.gasLeft = runState.gasLeft.sub(fee)
      if (runState.gasLeft.ltn(0)) {
        runState.gasLeft = new BN(0)
        return reject(new VmError(ERROR.OUT_OF_GAS))
      }

      // advance program counter
      runState.programCounter++
      let args = [runState]
      // create a callback for async opFunc
      if (opInfo.async) {
        args.push((err) => {
          if (err) return reject(err)
          return resolve()
        })
      }

      // if opcode is log and emitFreeLogs is enabled, remove static context
      let prevStatic = runState.static
      if (this._vm.emitFreeLogs && runState.opName === 'LOG') {
        runState.static = false
      }

      try {
        // run the opcode
        opFn.apply(null, args)
      } catch (e) {
        if (e.errorType && e.errorType === 'VmError') {
          return reject(e)
        } else {
          throw e
        }
      }

      // restore previous static context
      runState.static = prevStatic

      // call the callback if opFn was sync
      if (!opInfo.async) {
        return resolve()
      }
    })
  }

  async _parseVmResults (runState, err) {
    // remove any logs on error
    if (err) {
      runState.logs = []
      runState.vmError = true
    }

    const results = {
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

    return { err, results }
  }

  async _runStepHook (runState) {
    const eventObj = {
      pc: runState.programCounter,
      gasLeft: runState.gasLeft,
      opcode: lookupOpInfo(runState.opCode, true, this._vm.emitFreeLogs),
      stack: runState.stack._store,
      depth: runState.depth,
      address: runState.address,
      account: runState.contract,
      stateManager: runState.stateManager,
      memory: runState.memory._store, // Return underlying array for backwards-compatibility
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
    return this._emit('step', eventObj)
  }

  // Find all the valid jumps and puts them in the `validJumps` array.
  _preprocessValidJumps (runState) {
    for (let i = 0; i < runState.code.length; i++) {
      const curOpCode = lookupOpInfo(runState.code[i]).name

      // no destinations into the middle of PUSH
      if (curOpCode === 'PUSH') {
        i += runState.code[i] - 0x5f
      }

      if (curOpCode === 'JUMPDEST') {
        runState.validJumps.push(i)
      }
    }
  }

  async _getAccount (addr) {
    return promisify(this._state.getAccount.bind(this._state))(addr)
  }

  async _emit (k, v) {
    return promisify(this._vm.emit.bind(this._vm))(k, v)
  }
}
