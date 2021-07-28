import { debug as createDebugLogger } from 'debug'
import { Account, Address, BN } from 'ethereumjs-util'
import { StateManager } from '../state/index'
import { ERROR, VmError } from '../exceptions'
import Memory from './memory'
import Stack from './stack'
import EEI from './eei'
import { Opcode, handlers as opHandlers, OpHandler, AsyncOpHandler } from './opcodes'

export interface InterpreterOpts {
  pc?: number
}

export interface RunState {
  programCounter: number
  opCode: number
  memory: Memory
  memoryWordCount: BN
  highestMemCost: BN
  stack: Stack
  returnStack: Stack
  code: Buffer
  validJumps: number[]
  validJumpSubs: number[]
  stateManager: StateManager
  eei: EEI
}

export interface InterpreterResult {
  runState?: RunState
  exceptionError?: VmError
}

export interface InterpreterStep {
  gasLeft: BN
  gasRefund: BN
  stateManager: StateManager
  stack: BN[]
  returnStack: BN[]
  pc: number
  depth: number
  address: Address
  memory: Buffer
  memoryWordCount: BN
  opcode: {
    name: string
    fee: number
    isAsync: boolean
  }
  account: Account
  codeAddress: Address
}

interface JumpDests {
  jumps: number[]
  jumpSubs: number[]
}

/**
 * Parses and executes EVM bytecode.
 */
export default class Interpreter {
  _vm: any
  _state: StateManager
  _runState: RunState
  _eei: EEI

  // Opcode debuggers (e.g. { 'push': [debug Object], 'sstore': [debug Object], ...})
  private opDebuggers: { [key: string]: (debug: string) => void } = {}

  constructor(vm: any, eei: EEI) {
    this._vm = vm
    this._state = vm.stateManager
    this._eei = eei
    this._runState = {
      programCounter: 0,
      opCode: 0xfe, // INVALID opcode
      memory: new Memory(),
      memoryWordCount: new BN(0),
      highestMemCost: new BN(0),
      stack: new Stack(),
      returnStack: new Stack(1023), // 1023 return stack height limit per EIP 2315 spec
      code: Buffer.alloc(0),
      validJumps: [],
      validJumpSubs: [],
      stateManager: this._state,
      eei: this._eei,
    }
  }

  async run(code: Buffer, opts: InterpreterOpts = {}): Promise<InterpreterResult> {
    this._runState.code = code
    this._runState.programCounter = opts.pc ?? this._runState.programCounter

    const valid = this._getValidJumpDests(code)
    this._runState.validJumps = valid.jumps
    this._runState.validJumpSubs = valid.jumpSubs

    // Check that the programCounter is in range
    const pc = this._runState.programCounter
    if (pc !== 0 && (pc < 0 || pc >= this._runState.code.length)) {
      throw new Error('Internal error: program counter not in range')
    }

    let err
    // Iterate through the given ops until something breaks or we hit STOP
    while (this._runState.programCounter < this._runState.code.length) {
      const opCode = this._runState.code[this._runState.programCounter]
      this._runState.opCode = opCode
      await this._runStepHook()

      try {
        await this.runStep()
      } catch (e) {
        // re-throw on non-VM errors
        if (!('errorType' in e && e.errorType === 'VmError')) {
          throw e
        }
        // STOP is not an exception
        if (e.error !== ERROR.STOP) {
          err = e
        }
        break
      }
    }

    return {
      runState: this._runState,
      exceptionError: err,
    }
  }

  /**
   * Executes the opcode to which the program counter is pointing,
   * reducing its base gas cost, and increments the program counter.
   */
  async runStep(): Promise<void> {
    const opInfo = this.lookupOpInfo(this._runState.opCode)
    // Check for invalid opcode
    if (opInfo.name === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // Reduce opcode's base fee
    this._eei.useGas(new BN(opInfo.fee), `${opInfo.name} (base fee)`)
    // Advance program counter
    this._runState.programCounter++

    // Execute opcode handler
    const opFn = this.getOpHandler(opInfo)
    if (opInfo.isAsync) {
      await (opFn as AsyncOpHandler).apply(null, [this._runState, this._vm._common])
    } else {
      opFn.apply(null, [this._runState, this._vm._common])
    }
  }

  /**
   * Get the handler function for an opcode.
   */
  getOpHandler(opInfo: Opcode): OpHandler {
    return opHandlers.get(opInfo.code)!
  }

  /**
   * Get info for an opcode from VM's list of opcodes.
   */
  lookupOpInfo(op: number): Opcode {
    // if not found, return 0xfe: INVALID
    return this._vm._opcodes.get(op) ?? this._vm._opcodes.get(0xfe)
  }

  async _runStepHook(): Promise<void> {
    const opcode = this.lookupOpInfo(this._runState.opCode)
    const eventObj: InterpreterStep = {
      pc: this._runState.programCounter,
      gasLeft: this._eei.getGasLeft(),
      gasRefund: this._eei._evm._refund,
      opcode: {
        name: opcode.fullName,
        fee: opcode.fee,
        isAsync: opcode.isAsync,
      },
      stack: this._runState.stack._store,
      returnStack: this._runState.returnStack._store,
      depth: this._eei._env.depth,
      address: this._eei._env.address,
      account: this._eei._env.contract,
      stateManager: this._runState.stateManager,
      memory: this._runState.memory._store, // Return underlying array for backwards-compatibility
      memoryWordCount: this._runState.memoryWordCount,
      codeAddress: this._eei._env.codeAddress,
    }

    if (this._vm.DEBUG) {
      // Create opTrace for debug functionality
      let hexStack = []
      hexStack = eventObj.stack.map((item: any) => {
        return '0x' + new BN(item).toString(16, 0)
      })

      const name = eventObj.opcode.name

      const opTrace = {
        pc: eventObj.pc,
        op: name,
        gas: '0x' + eventObj.gasLeft.toString('hex'),
        gasCost: '0x' + eventObj.opcode.fee.toString(16),
        stack: hexStack,
        depth: eventObj.depth,
      }

      if (!(name in this.opDebuggers)) {
        this.opDebuggers[name] = createDebugLogger(`vm:ops:${name}`)
      }
      this.opDebuggers[name](JSON.stringify(opTrace))
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
     * @property {Account} account the Account which owns the code running
     * @property {Address} address the address of the `account`
     * @property {Number} depth the current number of calls deep the contract is
     * @property {Buffer} memory the memory of the VM as a `buffer`
     * @property {BN} memoryWordCount current size of memory in words
     * @property {StateManager} stateManager a {@link StateManager} instance
     * @property {Address} codeAddress the address of the code which is currently being ran (this differs from `address` in a `DELEGATECALL` and `CALLCODE` call)
     */
    return this._vm._emit('step', eventObj)
  }

  // Returns all valid jump and jumpsub destinations.
  _getValidJumpDests(code: Buffer): JumpDests {
    const jumps = []
    const jumpSubs = []

    for (let i = 0; i < code.length; i++) {
      const curOpCode = this.lookupOpInfo(code[i]).name

      // no destinations into the middle of PUSH
      if (curOpCode === 'PUSH') {
        i += code[i] - 0x5f
      }

      if (curOpCode === 'JUMPDEST') {
        jumps.push(i)
      }

      if (curOpCode === 'BEGINSUB') {
        jumpSubs.push(i)
      }
    }

    return { jumps, jumpSubs }
  }
}
