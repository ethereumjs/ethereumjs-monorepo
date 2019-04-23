const BN = require('bn.js')
const Block = require('ethereumjs-block')
const utils = require('ethereumjs-util')
const { StorageReader } = require('../state')
const PStateManager = require('../state/promisified').default
const { ERROR, VmError } = require('../exceptions')
const Memory = require('./memory').default
const Stack = require('./stack').default
const EEI = require('./eei').default
const { lookupOpInfo } = require('./opcodes')
const opFns = require('./opFns.js')

module.exports = class Loop {
  constructor (vm, interpreter) {
    this._vm = vm // TODO: remove when not needed
    this._state = new PStateManager(vm.stateManager)
    this._interpreter = interpreter
    this._result = {
      logs: [],
      returnValue: false,
      gasRefund: new BN(0),
      vmError: false,
      selfdestruct: {}
    }
  }

  async run (opts) {
    // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
    if (opts.selfdestruct || opts.suicides) {
      this._result.selfdestruct = opts.selfdestruct || opts.suicides
    }

    // Initialize internal vm state
    const runState = await this.initRunState(opts)

    // Check that the programCounter is in range
    const pc = runState.programCounter
    if (pc !== 0 && (pc < 0 || pc >= runState.code.length)) {
      return this.parseVmResults(runState, new VmError(ERROR.INVALID_OPCODE))
    }

    let err
    // iterate through the given ops until something breaks or we hit STOP
    while (this.canContinueExecution(runState)) {
      const opCode = runState.code[runState.programCounter]
      runState.opCode = opCode
      await this.runStepHook(runState)

      try {
        await this.runStep(runState)
      } catch (e) {
        err = e
        break
      }
    }

    return this.parseVmResults(runState, err)
  }

  canContinueExecution (runState) {
    const notAtEnd = runState.programCounter < runState.code.length
    return !runState.stopped && notAtEnd && !this._result.vmError && !this._result.returnValue
  }

  async initRunState (opts) {
    const runState = {
      code: opts.code,
      stopped: false,
      programCounter: opts.pc | 0,
      opCode: undefined,
      opName: undefined,
      gasLimit: new BN(opts.gasLimit), // TODO: remove
      gasLeft: new BN(opts.gasLimit),
      memory: new Memory(),
      memoryWordCount: new BN(0),
      stack: new Stack(),
      validJumps: this._getValidJumpDests(opts.code),
      highestMemCost: new BN(0),
      depth: opts.depth || 0,
      lastReturned: [],
      // TODO: Replace with EEI methods
      _common: this._vm._common,
      stateManager: this._state._wrapped,
      storageReader: opts.storageReader || new StorageReader(this._state._wrapped)
    }

    const env = {
      blockchain: this._vm.blockchain, // Only used in BLOCKHASH
      address: opts.address || utils.zeros(32),
      caller: opts.caller || utils.zeros(32),
      callData: opts.data || Buffer.from([0]),
      callValue: opts.value || new BN(0),
      code: opts.code,
      isStatic: opts.isStatic || false,
      gasPrice: opts.gasPrice,
      origin: opts.origin || opts.caller || utils.zeros(32),
      block: opts.block || new Block()
    }

    // Ensure contract is loaded
    if (!env.contract) {
      env.contract = await this._state.getAccount(env.address)
    }

    runState.eei = new EEI(env, runState, this._result, this._state, this._interpreter)

    return runState
  }

  async runStep (runState) {
    const opInfo = lookupOpInfo(runState.opCode, false)
    const opName = opInfo.name

    runState.opName = opName

    // check for invalid opcode
    if (runState.opName === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // calculate gas
    runState.gasLeft = runState.gasLeft.sub(new BN(opInfo.fee))
    if (runState.gasLeft.ltn(0)) {
      runState.gasLeft = new BN(0)
      throw new VmError(ERROR.OUT_OF_GAS)
    }

    // advance program counter
    runState.programCounter++

    await this.handleOp(runState, opInfo)
  }

  async handleOp (runState, opInfo) {
    const opFn = this.getOpHandler(opInfo)
    let args = [runState]

    // run the opcode
    if (opInfo.isAsync) {
      await opFn.apply(null, args)
    } else {
      opFn.apply(null, args)
    }
  }

  getOpHandler (opInfo) {
    return opFns[opInfo.name]
  }

  async parseVmResults (runState, err) {
    // remove any logs on error
    if (err) {
      this._result.logs = []
      this._result.vmError = true
    }

    const results = {
      runState: Object.assign({}, runState, this._result, runState.eei._env),
      selfdestruct: this._result.selfdestruct,
      gasRefund: this._result.gasRefund,
      exception: err ? 0 : 1,
      exceptionError: err,
      logs: this._result.logs,
      gas: runState.gasLeft,
      'return': this._result.returnValue ? this._result.returnValue : Buffer.alloc(0)
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

  async runStepHook (runState) {
    const eventObj = {
      pc: runState.programCounter,
      gasLeft: runState.gasLeft,
      opcode: lookupOpInfo(runState.opCode, true),
      stack: runState.stack._store,
      depth: runState.depth,
      address: runState.eei._env.address,
      account: runState.eei._env.contract,
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
    return this._vm._emit('step', eventObj)
  }

  // Returns all valid jump destinations.
  _getValidJumpDests (code) {
    const jumps = []

    for (let i = 0; i < code.length; i++) {
      const curOpCode = lookupOpInfo(code[i]).name

      // no destinations into the middle of PUSH
      if (curOpCode === 'PUSH') {
        i += code[i] - 0x5f
      }

      if (curOpCode === 'JUMPDEST') {
        jumps.push(i)
      }
    }

    return jumps
  }
}
