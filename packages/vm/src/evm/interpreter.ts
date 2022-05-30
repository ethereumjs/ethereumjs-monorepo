import { debug as createDebugLogger } from 'debug'
import {
  Account,
  Address,
  bigIntToHex,
  bufferToBigInt,
  intToHex,
  MAX_UINT64,
} from 'ethereumjs-util'
import { VmState } from '../eei/vmState'

import { ERROR, VmError } from '../exceptions'
import Memory from './memory'
import Stack from './stack'
import EEI from '../eei/eei'
import { Opcode, OpHandler, AsyncOpHandler, trap } from './opcodes'
import * as eof from './opcodes/eof'
import Common, { ConsensusAlgorithm } from '@ethereumjs/common'
import EVM, { EVMResult } from './evm'
import { Block } from '@ethereumjs/block'
import Message from './message'
import { CallType, EVMEnvironment, EVMEnvironmentExtended, EVMEnvironmentExtendedFilled, FrameEnvironment, FrameEnvironmentExtended, InterpreterEnvironment, Log } from './types'
import { env } from 'process'

const debugGas = createDebugLogger('vm:eei:gas')

export interface InterpreterOpts {
  pc?: number
}

/**
 * Immediate (unprocessed) result of running an EVM bytecode.
 */
export interface RunResult {
  logs: Log[]
  returnValue?: Buffer
  /**
   * A map from the accounts that have self-destructed to the addresses to send their funds to
   */
  selfdestruct: { [k: string]: Buffer }
}

export interface Env {
  address: Address
  caller: Address
  callData: Buffer
  callValue: bigint
  code: Buffer
  isStatic: boolean
  depth: number
  gasPrice: bigint
  origin: Address
  block: Block
  contract: Account
  codeAddress: Address /** Different than address for DELEGATECALL and CALLCODE */
  auth?: Address /** EIP-3074 AUTH parameter */
}

export interface RunState {
  programCounter: number
  opCode: number
  memory: Memory
  memoryWordCount: bigint
  highestMemCost: bigint
  stack: Stack
  returnStack: Stack
  code: Buffer
  shouldDoJumpAnalysis: boolean
  validJumps: Uint8Array // array of values where validJumps[index] has value 0 (default), 1 (jumpdest), 2 (beginsub)
  vmState: VmState
  eei: EEI
  env: Env
  messageGasLimit?: bigint // Cache value from `gas.ts` to save gas limit for a message call
  interpreter: Interpreter
}

export interface InterpreterResult {
  runState: InterpreterEnvironment
  exceptionError?: VmError
}

export interface InterpreterStep {
  gasLeft: bigint
  gasRefund: bigint
  //vmState: VmState
  stack: bigint[]
  returnStack: bigint[]
  pc: number
  depth: number
  opcode: {
    name: string
    fee: number
    dynamicFee?: bigint
    isAsync: boolean
  }
  //account: Account
  address: Address
  memory: Buffer
  memoryWordCount: bigint
  //codeAddress: Address
}

/**
 * Parses and executes EVM bytecode.
 */
export default class Interpreter {
  _vm: any
  _eei: EEI
  _common: Common
  _evm: EVM
  _env: InterpreterEnvironment


  // Opcode debuggers (e.g. { 'push': [debug Object], 'sstore': [debug Object], ...})
  private opDebuggers: { [key: string]: (debug: string) => void } = {}

  // TODO remove eei from constructor this can be directly read from EVM
  // EEI gets created on EVM creation and will not be re-instantiated
  // TODO remove gasLeft as constructor argument
  protected constructor(evm: EVM, eei: EEI, env: InterpreterEnvironment) {
    this._evm = evm
    this._eei = eei
    this._common = this._evm._common
    this._env = env
  }

  static async runInterpreter(evm: EVM, eei: EEI, env: EVMEnvironmentExtendedFilled, opts: InterpreterOpts) {
    const code = env.frameEnvironment.code
    const interpreterEnv = <InterpreterEnvironment>env;
    const frame = interpreterEnv.frameEnvironment
    const common = evm._common
    if (!common.isActivatedEIP(3540) || code[0] !== eof.FORMAT) {
      // EIP-3540 isn't active and first byte is not 0xEF - treat as legacy bytecode
      frame.runtimeCode = code
    } else if (common.isActivatedEIP(3540)) {
      if (code[1] !== eof.MAGIC) {
        // Bytecode contains invalid EOF magic byte
        return {
          runState: interpreterEnv,
          exceptionError: new VmError(ERROR.INVALID_BYTECODE_RESULT),
        }
      }
      if (code[2] !== eof.VERSION) {
        // Bytecode contains invalid EOF version number
        return {
          runState: interpreterEnv,
          exceptionError: new VmError(ERROR.INVALID_EOF_FORMAT),
        }
      }
      // Code is EOF1 format
      const codeSections = eof.codeAnalysis(code)
      if (!codeSections) {
        // Code is invalid EOF1 format if `codeSections` is falsy
        return {
          runState: interpreterEnv,
          exceptionError: new VmError(ERROR.INVALID_EOF_FORMAT),
        }
      }

      if (codeSections.data) {
        // Set code to EOF container code section which starts at byte position 10 if data section is present
        frame.runtimeCode = code.slice(10, 10 + codeSections!.code)
      } else {
        // Set code to EOF container code section which starts at byte position 7 if no data section is present
        frame.runtimeCode = code.slice(7, 7 + codeSections!.code)
      }
    }
    frame.machineState.returnBuffer = Buffer.alloc(0)
    return (new Interpreter(evm, eei, interpreterEnv)).run()
  }

  async run(): Promise<InterpreterResult> {
    // Check that the programCounter is in range
    const frame = this._env.frameEnvironment
    const machineState = frame.machineState
    const pc = machineState.programCounter
    if (pc !== 0 && (pc < 0 || pc >= frame.runtimeCode.length)) {
      throw new Error('Internal error: program counter not in range')
    }

    let err
    // Iterate through the given ops until something breaks or we hit STOP
    while (machineState.programCounter < frame.runtimeCode.length) {
      const opCode = frame.runtimeCode[machineState.programCounter]
      if (
        machineState.shouldDoJumpAnalysis &&
        (opCode === 0x56 || opCode === 0x57 || opCode === 0x5e)
      ) {
        // Only run the jump destination analysis if `code` actually contains a JUMP/JUMPI/JUMPSUB opcode
        machineState.validJumps = this._getValidJumpDests(frame.runtimeCode)
        machineState.shouldDoJumpAnalysis = false
      }

      try {
        await this.runStep(opCode)
      } catch (e: any) {
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
      runState: this._env,
      exceptionError: err,
    }
  }

  /**
   * Executes the opcode to which the program counter is pointing,
   * reducing its base gas cost, and increments the program counter.
   */
  async runStep(opcode: number): Promise<void> {
    const opInfo = this.lookupOpInfo(opcode)

    let gas = BigInt(opInfo.fee)
    // clone the gas limit; call opcodes can add stipend,
    // which makes it seem like the gas left increases
    const gasLimitClone = this.getGasLeft()

    if (opInfo.dynamicGas) {
      const dynamicGasHandler = this._evm._dynamicGasHandlers.get(opcode)!
      // This function updates the gas in-place.
      // It needs the base fee, for correct gas limit calculation for the CALL opcodes
      gas = await dynamicGasHandler(this._env, gas, this._common)
    }

    if (this._evm.listenerCount('step') > 0 || this._evm.DEBUG) {
      // Only run this stepHook function if there is an event listener (e.g. test runner)
      // or if the vm is running in debug mode (to display opcode debug logs)
      await this._runStepHook(opcode, gas, gasLimitClone)
    }

    // Check for invalid opcode
    if (opInfo.name === 'INVALID') {
      throw new VmError(ERROR.INVALID_OPCODE)
    }

    // Reduce opcode's base fee
    this.useGas(gas, `${opInfo.name} fee`)
    // Advance program counter
    this._env.frameEnvironment.machineState.programCounter++

    // Execute opcode handler
    const opFn = this.getOpHandler(opInfo)

    if (opInfo.isAsync) {
      await (opFn as AsyncOpHandler).apply(null, [this._env, this._common])
    } else {
      opFn.apply(null, [this._env, this._common])
    }
  }

  /**
   * Get the handler function for an opcode.
   */
  getOpHandler(opInfo: Opcode): OpHandler {
    return this._evm._handlers.get(opInfo.code)!
  }

  /**
   * Get info for an opcode from VM's list of opcodes.
   */
  lookupOpInfo(op: number): Opcode {
    // if not found, return 0xfe: INVALID
    return this._evm._opcodes.get(op) ?? this._evm._opcodes.get(0xfe)!
  }

  async _runStepHook(opCode: number, dynamicFee: bigint, gasLeft: bigint): Promise<void> {
    const opcode = this.lookupOpInfo(opCode)
    const env = this._env
    const frame = env.frameEnvironment
    const machineState = frame.machineState
    const eventObj: InterpreterStep = {
      pc: machineState.programCounter,
      gasLeft,
      gasRefund: this._env.frameEnvironment.machineState.gasRefund,
      opcode: {
        name: opcode.fullName,
        fee: opcode.fee,
        dynamicFee,
        isAsync: opcode.isAsync,
      },
      stack: machineState.stack._store,
      returnStack: machineState.returnStack._store,
      depth: frame.depth,
      address: frame.currentAddress,
      //account: this._env.contract,
      //vmState: this._runState.vmState,
      memory: machineState.memory._store,
      memoryWordCount: machineState.memoryWordCount,
      //codeAddress: this._env.codeAddress,
    }

    if (this._evm.DEBUG) {
      // Create opTrace for debug functionality
      let hexStack = []
      hexStack = eventObj.stack.map((item: any) => {
        return bigIntToHex(BigInt(item))
      })

      const name = eventObj.opcode.name

      const opTrace = {
        pc: eventObj.pc,
        op: name,
        gas: bigIntToHex(eventObj.gasLeft),
        gasCost: intToHex(eventObj.opcode.fee),
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
     * @property {Object} opcode the next opcode to be ran
     * @property {string}     opcode.name
     * @property {fee}        opcode.number Base fee of the opcode
     * @property {dynamicFee} opcode.dynamicFee Dynamic opcode fee
     * @property {boolean}    opcode.isAsync opcode is async
     * @property {BigInt} gasLeft amount of gasLeft
     * @property {BigInt} gasRefund gas refund
     * @property {StateManager} stateManager a {@link StateManager} instance
     * @property {Array} stack an `Array` of `Buffers` containing the stack
     * @property {Array} returnStack the return stack
     * @property {Account} account the Account which owns the code running
     * @property {Address} address the address of the `account`
     * @property {Number} depth the current number of calls deep the contract is
     * @property {Buffer} memory the memory of the VM as a `buffer`
     * @property {BigInt} memoryWordCount current size of memory in words
     * @property {Address} codeAddress the address of the code which is currently being ran (this differs from `address` in a `DELEGATECALL` and `CALLCODE` call)
     */
    return this._evm._emit('step', eventObj)
  }

  // Returns all valid jump and jumpsub destinations.
  _getValidJumpDests(code: Buffer) {
    const jumps = new Uint8Array(code.length).fill(0)

    for (let i = 0; i < code.length; i++) {
      const opcode = code[i]
      // skip over PUSH0-32 since no jump destinations in the middle of a push block
      if (opcode <= 0x7f) {
        if (opcode >= 0x60) {
          i += opcode - 0x5f
        } else if (opcode === 0x5b) {
          // Define a JUMPDEST as a 1 in the valid jumps array
          jumps[i] = 1
        } else if (opcode === 0x5c) {
          // Define a BEGINSUB as a 2 in the valid jumps array
          jumps[i] = 2
        }
      }
    }
    return jumps
  }

  /**
   * Logic extracted from EEI
   */

  /**
   * Subtracts an amount from the gas counter.
   * @param amount - Amount of gas to consume
   * @param context - Usage context for debugging
   * @throws if out of gas
   */
  useGas(amount: bigint, context?: string): void {
    const machineState = this._env.frameEnvironment.machineState
    machineState.gasLeft -= amount
    if (this._evm.DEBUG) {
      debugGas(`${context ? context + ': ' : ''}used ${amount} gas (-> ${machineState.gasLeft})`)
    }
    if (machineState.gasLeft < BigInt(0)) {
      machineState.gasLeft = BigInt(0)
      trap(ERROR.OUT_OF_GAS)
    }
  }

  /**
   * Adds a positive amount to the gas counter.
   * @param amount - Amount of gas refunded
   * @param context - Usage context for debugging
   */
  refundGas(amount: bigint, context?: string): void {
    const machineState = this._env.frameEnvironment.machineState
    if (this._evm.DEBUG) {
      debugGas(`${context ? context + ': ' : ''}refund ${amount} gas (-> ${machineState.gasRefund})`)
    }
    machineState.gasRefund += amount
  }

  /**
   * Reduces amount of gas to be refunded by a positive value.
   * @param amount - Amount to subtract from gas refunds
   * @param context - Usage context for debugging
   */
  subRefund(amount: bigint, context?: string): void {
    const machineState = this._env.frameEnvironment.machineState
    if (this._evm.DEBUG) {
      debugGas(`${context ? context + ': ' : ''}sub gas refund ${amount} (-> ${machineState.gasRefund})`)
    }
    machineState.gasRefund -= amount
    if (machineState.gasRefund < BigInt(0)) {
      machineState.gasRefund = BigInt(0)
      trap(ERROR.REFUND_EXHAUSTED)
    }
  }

  /**
   * Increments the internal gasLeft counter. Used for adding callStipend.
   * @param amount - Amount to add
   */
  addStipend(amount: bigint): void {
    const machineState = this._env.frameEnvironment.machineState
    if (this._evm.DEBUG) {
      debugGas(`add stipend ${amount} (-> ${machineState.gasLeft})`)
    }
    machineState.gasLeft += amount
  }

  /**
   * Returns balance of the given account.
   * @param address - Address of account
   */
  async getExternalBalance(address: Address): Promise<bigint> {
    // shortcut if current account
    /*if (address.equals(this._env.address)) {
      return this._env.contract.balance
    }*/

    return this._eei.getExternalBalance(address) // This is already cached in EEI or in StateManager
  }

  /**
   * Store 256-bit a value in memory to persistent storage.
   */
  async storageStore(key: Buffer, value: Buffer): Promise<void> {
    await this._eei.storageStore(this._env.frameEnvironment.currentAddress, key, value)
    /*const account = await this._eei.state.getAccount(this._env.address)
    this._env.contract = account*/
  }

  /**
   * Loads a 256-bit value to memory from persistent storage.
   * @param key - Storage key
   * @param original - If true, return the original storage value (default: false)
   */
  async storageLoad(key: Buffer, original = false): Promise<Buffer> {
    return this._eei.storageLoad(this._env.frameEnvironment.currentAddress, key, original)
  }

  /**
   * Store 256-bit a value in memory to transient storage.
   * @param key - Storage key
   * @param value - Storage value
   */
  transientStorageStore(key: Buffer, value: Buffer): void {
    return this._evm._transientStorage.put(this._env.frameEnvironment.currentAddress, key, value)
  }

  /**
   * Loads a 256-bit value to memory from transient storage.
   * @param key - Storage key
   */
  transientStorageLoad(key: Buffer): Buffer {
    return this._evm._transientStorage.get(this._env.frameEnvironment.currentAddress, key)
  }

  /**
   * Set the returning output data for the execution.
   * @param returnData - Output data to return
   */
  finish(returnData: Buffer): void {
    this._env.frameEnvironment.machineState.returnBuffer = returnData
    trap(ERROR.STOP)
  }

  /**
   * Set the returning output data for the execution. This will halt the
   * execution immediately and set the execution result to "reverted".
   * @param returnData - Output data to return
   */
  revert(returnData: Buffer): void {
    this._env.frameEnvironment.machineState.returnBuffer = returnData
    trap(ERROR.REVERT)
  }

  /**
   * Returns address of currently executing account.
   */
  getAddress(): Address {
    return this._env.frameEnvironment.currentAddress
  }

  /**
   * Returns balance of self.
   */
  getSelfBalance(): bigint {
    return this._env.contract.balance // TODO fixme
  }

  /**
   * Returns the deposited value by the instruction/transaction
   * responsible for this execution.
   */
  getCallValue(): bigint {
    return this._env.frameEnvironment.value
  }

  /**
   * Returns input data in current environment. This pertains to the input
   * data passed with the message call instruction or transaction.
   */
  getCallData(): Buffer {
    return this._env.frameEnvironment.data
  }

  /**
   * Returns size of input data in current environment. This pertains to the
   * input data passed with the message call instruction or transaction.
   */
  getCallDataSize(): bigint {
    return BigInt(this.getCallData().length)
  }

  /**
   * Returns caller address. This is the address of the account
   * that is directly responsible for this execution.
   */
  getCaller(): bigint {
    return bufferToBigInt(this._env.frameEnvironment.caller.buf)
  }

  /**
   * Returns the size of code running in current environment.
   */
  getCodeSize(): bigint {
    return BigInt(this._env.frameEnvironment.code.length)
  }

  /**
   * Returns the code running in current environment.
   */
  getCode(): Buffer {
    return this._env.frameEnvironment.code
  }

  /**
   * Returns the current gasCounter.
   */
  getGasLeft(): bigint {
    return this._env.frameEnvironment.machineState.gasLeft
  }

  /**
   * Returns size of current return data buffer. This contains the return data
   * from the last executed call, callCode, callDelegate, callStatic or create.
   * Note: create only fills the return data buffer in case of a failure.
   */
  getReturnDataSize(): bigint {
    return BigInt(this.getReturnData().length)
  }

  /**
   * Returns the current return data buffer. This contains the return data
   * from last executed call, callCode, callDelegate, callStatic or create.
   * Note: create only fills the return data buffer in case of a failure.
   */
  getReturnData(): Buffer {
    return this._env.frameEnvironment.machineState.returnBuffer
  }

  /**
   * Returns true if the current call must be executed statically.
   */
  isStatic(): boolean {
    return this._env.frameEnvironment.isStatic
  }

  /**
   * Returns price of gas in current environment.
   */
  getTxGasPrice(): bigint {
    return this._env.globalEnvironment.gasPrice
  }

  /**
   * Returns the execution's origination address. This is the
   * sender of original transaction; it is never an account with
   * non-empty associated code.
   */
  getTxOrigin(): bigint {
    return bufferToBigInt(this._env.globalEnvironment.origin.buf)
  }

  /**
   * Returns the block’s number.
   */
  getBlockNumber(): bigint {
    return this._env.globalEnvironment.block.header.number
  }

  /**
   * Returns the block's beneficiary address.
   */
  getBlockCoinbase(): bigint {
    let coinbase: Address
    if (this._common.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
      coinbase = this._env.globalEnvironment.block.header.cliqueSigner()
    } else {
      coinbase = this._env.globalEnvironment.block.header.coinbase
    }
    return bufferToBigInt(coinbase.toBuffer())
  }

  /**
   * Returns the block's timestamp.
   */
  getBlockTimestamp(): bigint {
    return this._env.globalEnvironment.block.header.timestamp
  }

  /**
   * Returns the block's difficulty.
   */
  getBlockDifficulty(): bigint {
    return this._env.globalEnvironment.block.header.difficulty
  }

  /**
   * Returns the block's prevRandao field.
   */
  getBlockPrevRandao(): bigint {
    return bufferToBigInt(this._env.globalEnvironment.block.header.prevRandao)
  }

  /**
   * Returns the block's gas limit.
   */
  getBlockGasLimit(): bigint {
    return this._env.globalEnvironment.block.header.gasLimit
  }

  /**
   * Returns the Base Fee of the block as proposed in [EIP-3198](https;//eips.etheruem.org/EIPS/eip-3198)
   */
  getBlockBaseFee(): bigint {
    const baseFee = this._env.globalEnvironment.block.header.baseFeePerGas
    if (baseFee === undefined) {
      // Sanity check
      throw new Error('Block has no Base Fee')
    }
    return baseFee
  }

  /**
   * Returns the chain ID for current chain. Introduced for the
   * CHAINID opcode proposed in [EIP-1344](https://eips.ethereum.org/EIPS/eip-1344).
   */
  getChainId(): bigint {
    return this._common.chainId()
  }

  /**
   * Sends a message with arbitrary data to a given address path.
   */
  async call(gasLimit: bigint, address: Address, value: bigint, data: Buffer): Promise<bigint> {
    const msg: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.currentAddress,
      gasLimit,
      to: address,
      value,
      data,
      isStatic: this._env.frameEnvironment.isStatic,
      depth: this._env.frameEnvironment.depth + 1,
      callType: CallType.Call
    }

    return this._baseCall(msg)
  }

  /**
   * Sends a message with arbitrary data to a given address path.
   */
  async authcall(gasLimit: bigint, address: Address, value: bigint, data: Buffer): Promise<bigint> {
    const msg: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.machineState.auth,
      gasLimit,
      to: address,
      value,
      data,
      isStatic: this._env.frameEnvironment.isStatic,
      depth: this._env.frameEnvironment.depth + 1,
      takeCallValueFrom: this._env.frameEnvironment.currentAddress,
      callType: CallType.AuthCall
    }

    return this._baseCall(msg)
  }

  /**
   * Message-call into this account with an alternative account's code.
   */
  async callCode(gasLimit: bigint, address: Address, value: bigint, data: Buffer): Promise<bigint> {
    const code = await this._eei.state.getContractCode(address)
    const msg: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.currentAddress,
      gasLimit,
      to: this._env.frameEnvironment.currentAddress,
      code: code,
      value,
      data,
      isStatic: this._env.frameEnvironment.isStatic,
      depth: this._env.frameEnvironment.depth + 1,
      callType: CallType.CallCode
    }

    return this._baseCall(msg)
  }

  /**
   * Sends a message with arbitrary data to a given address path, but disallow
   * state modifications. This includes log, create, selfdestruct and call with
   * a non-zero value.
   */
  async callStatic(
    gasLimit: bigint,
    address: Address,
    value: bigint,
    data: Buffer
  ): Promise<bigint> {
    const msg: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.currentAddress,
      gasLimit,
      to: address,
      value,
      data,
      isStatic: true,
      depth: this._env.frameEnvironment.depth + 1,
      callType: CallType.StaticCall
    }

    return this._baseCall(msg)
  }

  /**
   * Message-call into this account with an alternative account’s code, but
   * persisting the current values for sender and value.
   */
  async callDelegate(
    gasLimit: bigint,
    address: Address,
    value: bigint,
    data: Buffer
  ): Promise<bigint> {
    const code = await this._eei.state.getContractCode(address)
    const msg: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.currentAddress,
      gasLimit,
      to: this._env.frameEnvironment.currentAddress,
      code,
      value,
      data,
      isStatic: this._env.frameEnvironment.isStatic,
      depth: this._env.frameEnvironment.depth + 1,
      callType: CallType.DelegateCall
    }

    return this._baseCall(msg)
  }

  async _baseCall(frameEnv: FrameEnvironmentExtended): Promise<bigint> {
    frameEnv.machineState = frameEnv.machineState ?? {}
    const selfdestruct = { ...this._env.frameEnvironment.machineState.selfdestruct }
    frameEnv.machineState.selfdestruct = selfdestruct

    const currentFrame = this._env.frameEnvironment
    const currentMachineState = currentFrame.machineState

    // empty the return data buffer
    this._env.frameEnvironment.machineState.returnBuffer = Buffer.alloc(0)

    // Check if account has enough ether and max depth not exceeded
    if (
      currentFrame.depth >= Number(this._common.param('vm', 'stackLimit'))
    ) {
      return BigInt(0)
    }

    const evmEnvironment: EVMEnvironmentExtended = {
      frameEnvironment: frameEnv,
      globalEnvironment: this._env.globalEnvironment
    }

    const results = await this._evm.runCall(evmEnvironment)

    if (results.execResult.logs) {
      currentMachineState.logs = currentMachineState.logs.concat(results.execResult.logs)
    }

    // this should always be safe
    this.useGas(results.execResult.gasUsed, 'CALL, STATICCALL, DELEGATECALL, CALLCODE')

    // Set return value
    if (
      results.execResult.returnValue &&
      (!results.execResult.exceptionError ||
        results.execResult.exceptionError.error === ERROR.REVERT)
    ) {
      currentMachineState.returnBuffer = results.execResult.returnValue
    }

    if (!results.execResult.exceptionError) {
      // Propagate any new selfdestructed addresses into current machine state
      Object.assign(currentMachineState.selfdestruct, selfdestruct)
    }

    return this._getReturnCode(results)
  }

  /**
   * Creates a new contract with a given value.
   */
  async create(gasLimit: bigint, value: bigint, data: Buffer, salt?: Buffer): Promise<bigint> {
    const currentFrame = this._env.frameEnvironment
    const currentMachineState = currentFrame.machineState

    const selfdestruct = { ...this._env.frameEnvironment.machineState.selfdestruct }

    const contract = await this._eei.state.getAccount(currentFrame.currentAddress)
    const balance = contract.balance

    // Check if account has enough ether and max depth not exceeded
    if (currentFrame.depth >= Number(this._common.param('vm', 'stackLimit')) || balance < value ) {
      return BigInt(0)
    }

    // EIP-2681 check
    if (contract.nonce >= MAX_UINT64) {
      return BigInt(0)
    }

    contract.nonce += BigInt(1)
    await this._eei.state.putAccount(currentFrame.currentAddress, contract)

    if (this._common.isActivatedEIP(3860)) {
      if (data.length > Number(this._common.param('vm', 'maxInitCodeSize'))) {
        return BigInt(0)
      }
    }

    let callType: CallType 
    if (salt) {
      callType = CallType.Create2
    } else {
      callType = CallType.Create
    }

    const createFrame: FrameEnvironmentExtended = {
      caller: this._env.frameEnvironment.currentAddress,
      gasLimit,
      code: data,
      value,
      salt,
      depth: this._env.frameEnvironment.depth + 1,
      callType,
    }

    const evmEnvironment: EVMEnvironmentExtended = {
      frameEnvironment: createFrame,
      globalEnvironment: this._env.globalEnvironment
    }

    const results = await this._evm.runCall(evmEnvironment)

    if (results.execResult.logs) {
      currentMachineState.logs = currentMachineState.logs.concat(results.execResult.logs)
    }

    // this should always be safe
    this.useGas(results.execResult.gasUsed, 'CREATE')

    // Set return buffer in case revert happened
    if (
      results.execResult.exceptionError &&
      results.execResult.exceptionError.error === ERROR.REVERT
    ) {
      currentMachineState.returnBuffer = results.execResult.returnValue
    }

    if (
      !results.execResult.exceptionError ||
      results.execResult.exceptionError.error === ERROR.CODESTORE_OUT_OF_GAS
    ) {
      Object.assign(currentMachineState.selfdestruct, selfdestruct)
      return bufferToBigInt(results.execResult.runState?.frameEnvironment.currentAddress)
    }

    return this._getReturnCode(results)
  }

  /**
   * Creates a new contract with a given value. Generates
   * a deterministic address via CREATE2 rules.
   */
  async create2(gasLimit: bigint, value: bigint, data: Buffer, salt: Buffer): Promise<bigint> {
    return this.create(gasLimit, value, data, salt)
  }

  /**
   * Mark account for later deletion and give the remaining balance to the
   * specified beneficiary address. This will cause a trap and the
   * execution will be aborted immediately.
   * @param toAddress - Beneficiary address
   */
  async selfDestruct(toAddress: Address): Promise<void> {
    return this._selfDestruct(toAddress)
  }

  async _selfDestruct(toAddress: Address): Promise<void> {
    const currentFrame = this._env.frameEnvironment
    const currentMachineState = currentFrame.machineState

    // only add to refund if this is the first selfdestruct for the address
    if (!currentMachineState.selfdestruct[currentFrame.currentAddress.buf.toString('hex')]) {
      this.refundGas(this._common.param('gasPrices', 'selfdestructRefund'))
    }

    currentMachineState.selfdestruct[currentFrame.currentAddress.buf.toString('hex')] = toAddress.buf

    // Add to beneficiary balance
    const toAccount = await this._eei.state.getAccount(toAddress)
    const contract = await this._eei.state.getAccount(currentFrame.currentAddress)
    toAccount.balance += contract.balance
    await this._eei.state.putAccount(toAddress, toAccount)

    // Subtract from contract balance
    await this._eei.state.modifyAccountFields(currentFrame.currentAddress, {
      balance: BigInt(0),
    })

    trap(ERROR.STOP)
  }

  /**
   * Creates a new log in the current environment.
   */
  log(data: Buffer, numberOfTopics: number, topics: Buffer[]): void {
    const currentFrame = this._env.frameEnvironment
    const currentMachineState = currentFrame.machineState
    if (numberOfTopics < 0 || numberOfTopics > 4) {
      trap(ERROR.OUT_OF_RANGE)
    }

    if (topics.length !== numberOfTopics) {
      trap(ERROR.INTERNAL_ERROR)
    }

    const log: Log = [currentFrame.currentAddress.buf, topics, data]
    currentMachineState.logs.push(log)
  }

  private _getReturnCode(results: EVMResult) {
    // This preserves the previous logic, but seems to contradict the EEI spec
    // https://github.com/ewasm/design/blob/38eeded28765f3e193e12881ea72a6ab807a3371/eth_interface.md
    if (results.execResult.exceptionError) {
      return BigInt(0)
    } else {
      return BigInt(1)
    }
  }
}
