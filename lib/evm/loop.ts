import BN = require('bn.js')
import { zeros } from 'ethereumjs-util'
import Common from 'ethereumjs-common'
import { StateManager, StorageReader } from '../state'
import PStateManager from '../state/promisified'
import { ERROR, VmError } from '../exceptions'
import Memory from './memory'
import Stack from './stack'
import EEI from './eei'
import Message from './message'
import TxContext from './txContext'
import { lookupOpInfo, OpInfo } from './opcodes'
const opFns = require('./opFns.js')

type IsException = 0 | 1

export interface RunOpts {
  storageReader: StorageReader
  block: any
  message: Message
  txContext: TxContext
  pc?: number
}

export interface RunState {
  stopped: boolean
  programCounter: number
  opCode: number
  memory: Memory
  memoryWordCount: BN
  highestMemCost: BN
  stack: Stack
  code: Buffer
  validJumps: number[]
  _common: Common
  stateManager: StateManager
  storageReader: StorageReader
  eei: EEI
}

export interface LoopResult {
  runState?: RunState
  exception: IsException
  exceptionError?: VmError | ERROR
  gas?: BN
  gasUsed: BN
  return: Buffer
  // From RunResult
  logs?: Buffer[]
  returnValue?: Buffer
  gasRefund?: BN
  selfdestruct?: {[k: string]: Buffer}
}

export default class Loop {
  _vm: any
  _state: PStateManager
  _runState: RunState
  _eei: EEI

  constructor (vm: any, eei: EEI) {
    this._vm = vm // TODO: remove when not needed
    this._state = new PStateManager(vm.stateManager)
    this._eei = eei
    this._runState = {
      stopped: false,
      programCounter: 0,
      opCode: 0xfe, // INVALID opcode
      memory: new Memory(),
      memoryWordCount: new BN(0),
      highestMemCost: new BN(0),
      stack: new Stack(),
      code: Buffer.alloc(0),
      validJumps: [],
      // TODO: Replace with EEI methods
      _common: this._vm._common,
      stateManager: this._state._wrapped,
      storageReader: new StorageReader(this._state._wrapped),
      eei: this._eei
    }
  }

  async run (opts: RunOpts): Promise<LoopResult> {
    if (opts.message.selfdestruct) {
      this._eei._result.selfdestruct = opts.message.selfdestruct
    }

    Object.assign(this._runState, {
      code: opts.message.code,
      programCounter: opts.pc || this._runState.programCounter,
      validJumps: this._getValidJumpDests(opts.message.code as Buffer),
      storageReader: opts.storageReader || this._runState.storageReader
    })

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
        if (e.error === ERROR.STOP) {
          this._runState.stopped = true
        } else {
          err = e
          break
        }
      }
    }

    let result = this._eei._result
    let gasUsed = opts.message.gasLimit.sub(this._eei.getGasLeft())
    if (err) {
      if (err.error !== ERROR.REVERT) {
        gasUsed = opts.message.gasLimit
      }

      // remove any logs on error
      result = Object.assign({}, result, {
        logs: [],
        gasRefund: null,
        selfdestruct: null
      })
    }

    return Object.assign({}, result, {
      runState: Object.assign({}, this._runState, result, this._eei._env),
      exception: err ? 0 as IsException : 1 as IsException,
      exceptionError: err,
      gas: this._eei.getGasLeft(),
      gasUsed,
      'return': result.returnValue ? result.returnValue : Buffer.alloc(0)
    })
  }

  canContinueExecution (): boolean {
    const notAtEnd = this._runState.programCounter < this._runState.code.length
    return !this._runState.stopped && notAtEnd && !this._eei._result.returnValue
  }

  async runStep (): Promise<void> {
    const opInfo = lookupOpInfo(this._runState.opCode)
    // check for invalid opcode
    if (opInfo.name === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // calculate gas
    this._eei.useGas(new BN(opInfo.fee))

    // advance program counter
    this._runState.programCounter++

    await this.handleOp(opInfo)
  }

  async handleOp (opInfo: OpInfo): Promise<void> {
    const opFn = this.getOpHandler(opInfo)
    let args = [this._runState]

    // run the opcode
    if (opInfo.isAsync) {
      await opFn.apply(null, args)
    } else {
      opFn.apply(null, args)
    }
  }

  getOpHandler (opInfo: OpInfo) {
    return opFns[opInfo.name]
  }

  async runStepHook (): Promise<void> {
    const eventObj = {
      pc: this._runState.programCounter,
      gasLeft: this._eei.getGasLeft(),
      opcode: lookupOpInfo(this._runState.opCode, true),
      stack: this._runState.stack._store,
      depth: this._eei._env.depth,
      address: this._eei._env.address,
      account: this._eei._env.contract,
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
  _getValidJumpDests (code: Buffer): number[] {
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
