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
    this._runState = {
      stopped: false,
      programCounter: 0,
      opCode: undefined,
      memory: new Memory(),
      memoryWordCount: new BN(0),
      highestMemCost: new BN(0),
      stack: new Stack(),
      // TODO: Replace with EEI methods
      _common: this._vm._common,
      stateManager: this._state._wrapped,
      storageReader: new StorageReader(this._state._wrapped)
    }
    this._result = {
      logs: [],
      returnValue: false,
      gasRefund: new BN(0),
      vmError: false,
      selfdestruct: {}
    }
  }

  async run (opts) {
    if (opts.message.selfdestruct) {
      this._result.selfdestruct = opts.message.selfdestruct
    }

    // Initialize internal vm state
    await this.initRunState(opts)

    // Check that the programCounter is in range
    const pc = this._runState.programCounter
    if (pc !== 0 && (pc < 0 || pc >= this._runState.code.length)) {
      throw new Error('Internal error: program counter not in range')
    }

    let err
    // iterate through the given ops until something breaks or we hit STOP
    while (this.canContinueExecution()) {
      const opCode = this._runState.code[this._runState.programCounter]
      this._runState.opCode = opCode
      await this.runStepHook()

      try {
        await this.runStep()
      } catch (e) {
        err = e
        break
      }
    }

    let gasUsed = opts.message.gasLimit.sub(this._runState.gasLeft)
    if (err) {
      if (err.error !== ERROR.REVERT) {
        gasUsed = opts.message.gasLimit
      }

      // remove any logs on error
      this._result = Object.assign({}, this._result, {
        logs: [],
        vmError: true,
        gasRefund: null,
        selfdestruct: null
      })
    }

    return Object.assign({}, this._result, {
      runState: Object.assign({}, this._runState, this._result, this._runState.eei._env),
      exception: err ? 0 : 1,
      exceptionError: err,
      gas: this._runState.gasLeft,
      gasUsed,
      'return': this._result.returnValue ? this._result.returnValue : Buffer.alloc(0)
    })
  }

  canContinueExecution () {
    const notAtEnd = this._runState.programCounter < this._runState.code.length
    return !this._runState.stopped && notAtEnd && !this._result.vmError && !this._result.returnValue
  }

  async initRunState (opts) {
    Object.assign(this._runState, {
      code: opts.message.code,
      programCounter: opts.pc | this._runState.programCounter,
      gasLeft: new BN(opts.message.gasLimit),
      validJumps: this._getValidJumpDests(opts.message.code),
      storageReader: opts.storageReader || this._runState.storageReader
    })

    const env = {
      blockchain: this._vm.blockchain, // Only used in BLOCKHASH
      address: opts.message.to || utils.zeros(32),
      caller: opts.message.caller || utils.zeros(32),
      callData: opts.message.data || Buffer.from([0]),
      callValue: opts.message.value || new BN(0),
      code: opts.message.code,
      isStatic: opts.message.isStatic || false,
      depth: opts.message.depth || 0,
      gasPrice: opts.txContext.gasPrice,
      origin: opts.txContext.origin || opts.message.caller || utils.zeros(32),
      block: opts.block || new Block(),
      contract: await this._state.getAccount(opts.message.to || utils.zeros(32))
    }

    this._runState.eei = new EEI(env, this._runState, this._result, this._state, this._interpreter)
  }

  async runStep () {
    const opInfo = lookupOpInfo(this._runState.opCode, false)
    // check for invalid opcode
    if (opInfo.name === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // calculate gas
    this._runState.gasLeft = this._runState.gasLeft.sub(new BN(opInfo.fee))
    if (this._runState.gasLeft.ltn(0)) {
      this._runState.gasLeft = new BN(0)
      throw new VmError(ERROR.OUT_OF_GAS)
    }

    // advance program counter
    this._runState.programCounter++

    await this.handleOp(opInfo)
  }

  async handleOp (opInfo) {
    const opFn = this.getOpHandler(opInfo)
    let args = [this._runState]

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

  async runStepHook () {
    const eventObj = {
      pc: this._runState.programCounter,
      gasLeft: this._runState.gasLeft,
      opcode: lookupOpInfo(this._runState.opCode, true),
      stack: this._runState.stack._store,
      depth: this._runState.eei._env.depth,
      address: this._runState.eei._env.address,
      account: this._runState.eei._env.contract,
      stateManager: this._runState.stateManager,
      memory: this._runState.memory._store, // Return underlying array for backwards-compatibility
      memoryWordCount: this._runState.memoryWordCount
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
