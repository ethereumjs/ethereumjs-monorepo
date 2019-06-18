import BN = require('bn.js')
import {
  toBuffer,
  generateAddress,
  generateAddress2,
  zeros,
  KECCAK256_NULL,
  MAX_INTEGER,
} from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import { VmError, ERROR } from '../exceptions'
import PStateManager from '../state/promisified'
import { getPrecompile, PrecompileFunc, PrecompileResult } from './precompiles'
import { OOGResult } from './precompiles/types'
import TxContext from './txContext'
import Message from './message'
import EEI from './eei'
import { default as Loop, LoopResult, RunState, IsException, RunOpts } from './loop'
const Block = require('ethereumjs-block')

/**
 * Result of executing a message via the [[Interpreter]].
 */
export interface InterpreterResult {
  /**
   * Amount of gas used by the transaction
   */
  gasUsed: BN
  /**
   * Address of created account durint transaction, if any
   */
  createdAddress?: Buffer
  /**
   * Contains the results from running the code, if any, as described in [[runCode]]
   */
  vm: ExecResult
}

/**
 * Result of executing a call via the [[Interpreter]].
 */
export interface ExecResult {
  runState?: RunState
  /**
   * `0` if the contract encountered an exception, `1` otherwise
   */
  exception: IsException
  /**
   * Description of the exception, if any occured
   */
  exceptionError?: VmError | ERROR
  /**
   * Amount of gas left
   */
  gas?: BN
  /**
   * Amount of gas the code used to run
   */
  gasUsed: BN
  /**
   * Return value from the contract
   */
  return: Buffer
  /**
   * Array of logs that the contract emitted
   */
  logs?: any[]
  /**
   * Value returned by the contract
   */
  returnValue?: Buffer
  /**
   * Amount of gas to refund from deleting storage values
   */
  gasRefund?: BN
  /**
   * A map from the accounts that have self-destructed to the addresses to send their funds to
   */
  selfdestruct?: { [k: string]: Buffer }
}

/**
 * Interpreter is responsible for executing an EVM message fully
 * (including any nested calls and creates), processing the results
 * and storing them to state (or discarding changes in case of exceptions).
 * @ignore
 */
export default class Interpreter {
  _vm: any
  _state: PStateManager
  _tx: TxContext
  _block: any

  constructor(vm: any, txContext: TxContext, block: any) {
    this._vm = vm
    this._state = new PStateManager(this._vm.stateManager)
    this._tx = txContext
    this._block = block
  }

  /**
   * Executes an EVM message, determining whether it's a call or create
   * based on the `to` address. It checkpoints the state and reverts changes
   * if an exception happens during the message execution.
   */
  async executeMessage(message: Message): Promise<InterpreterResult> {
    await this._state.checkpoint()

    let result
    if (message.to) {
      result = await this._executeCall(message)
    } else {
      result = await this._executeCreate(message)
    }

    const err = result.vm.exceptionError
    if (err) {
      result.vm.logs = []
      await this._state.revert()
      if (message.isCompiled) {
        // Empty precompiled contracts need to be deleted even in case of OOG
        // because the bug in both Geth and Parity led to deleting RIPEMD precompiled in this case
        // see https://github.com/ethereum/go-ethereum/pull/3341/files#diff-2433aa143ee4772026454b8abd76b9dd
        // We mark the account as touched here, so that is can be removed among other touched empty accounts (after tx finalization)
        if ((err as ERROR) === ERROR.OUT_OF_GAS || (err as VmError).error === ERROR.OUT_OF_GAS) {
          await this._touchAccount(message.to)
        }
      }
    } else {
      await this._state.commit()
    }

    return result
  }

  async _executeCall(message: Message): Promise<InterpreterResult> {
    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    if (!message.delegatecall) {
      await this._reduceSenderBalance(account, message)
    }
    // Load `to` account
    const toAccount = await this._state.getAccount(message.to)
    // Add tx value to the `to` account
    if (!message.delegatecall) {
      await this._addToBalance(toAccount, message)
    }

    // Load code
    await this._loadCode(message)
    if (!message.code || message.code.length === 0) {
      return {
        gasUsed: new BN(0),
        vm: {
          exception: 1,
          gasUsed: new BN(0),
          return: Buffer.alloc(0),
        },
      }
    }

    let result
    if (message.isCompiled) {
      result = this.runPrecompile(message.code as PrecompileFunc, message.data, message.gasLimit)
    } else {
      result = await this.runLoop(message)
    }

    return {
      gasUsed: result.gasUsed,
      vm: result,
    }
  }

  async _executeCreate(message: Message): Promise<InterpreterResult> {
    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    await this._reduceSenderBalance(account, message)

    message.code = message.data
    message.data = Buffer.alloc(0)
    message.to = await this._generateAddress(message)
    let toAccount = await this._state.getAccount(message.to)
    // Check for collision
    if (
      (toAccount.nonce && new BN(toAccount.nonce).gtn(0)) ||
      toAccount.codeHash.compare(KECCAK256_NULL) !== 0
    ) {
      return {
        gasUsed: message.gasLimit,
        createdAddress: message.to,
        vm: {
          return: Buffer.alloc(0),
          exception: 0,
          exceptionError: ERROR.CREATE_COLLISION,
          gasUsed: message.gasLimit,
        },
      }
    }

    await this._state.clearContractStorage(message.to)
    await this._vm._emit('newContract', {
      address: message.to,
      code: message.code,
    })
    toAccount = await this._state.getAccount(message.to)
    toAccount.nonce = new BN(toAccount.nonce).addn(1).toArrayLike(Buffer)

    // Add tx value to the `to` account
    await this._addToBalance(toAccount, message)

    if (!message.code || message.code.length === 0) {
      return {
        gasUsed: new BN(0),
        createdAddress: message.to,
        vm: {
          exception: 1,
          gasUsed: new BN(0),
          return: Buffer.alloc(0),
        },
      }
    }

    let result = await this.runLoop(message)

    // fee for size of the return value
    let totalGas = result.gasUsed
    if (!result.exceptionError) {
      const returnFee = new BN(
        result.return.length * this._vm._common.param('gasPrices', 'createData'),
      )
      totalGas = totalGas.add(returnFee)
    }

    // if not enough gas
    if (
      totalGas.lte(message.gasLimit) &&
      (this._vm.allowUnlimitedContractSize || result.return.length <= 24576)
    ) {
      result.gasUsed = totalGas
    } else {
      result = { ...result, ...OOGResult(message.gasLimit) }
    }

    // Save code if a new contract was created
    if (!result.exceptionError && result.return && result.return.toString() !== '') {
      await this._state.putContractCode(message.to, result.return)
    }

    return {
      gasUsed: result.gasUsed,
      createdAddress: message.to,
      vm: result,
    }
  }

  /**
   * Starts the actual bytecode processing for a CALL or CREATE, providing
   * it with the [[EEI]].
   */
  async runLoop(message: Message, loopOpts: RunOpts = {}): Promise<ExecResult> {
    const env = {
      blockchain: this._vm.blockchain, // Only used in BLOCKHASH
      address: message.to || zeros(32),
      caller: message.caller || zeros(32),
      callData: message.data || Buffer.from([0]),
      callValue: message.value || new BN(0),
      code: message.code as Buffer,
      isStatic: message.isStatic || false,
      depth: message.depth || 0,
      gasPrice: this._tx.gasPrice,
      origin: this._tx.origin || message.caller || zeros(32),
      block: this._block || new Block(),
      contract: await this._state.getAccount(message.to || zeros(32)),
    }
    const eei = new EEI(env, this._state, this, this._vm._common, message.gasLimit.clone())
    if (message.selfdestruct) {
      eei._result.selfdestruct = message.selfdestruct
    }

    const loop = new Loop(this._vm, eei)
    const loopRes = await loop.run(message.code as Buffer, loopOpts)

    let result = eei._result
    let gasUsed = message.gasLimit.sub(eei._gasLeft)
    if (loopRes.exceptionError) {
      if ((loopRes.exceptionError as VmError).error !== ERROR.REVERT) {
        gasUsed = message.gasLimit
      }

      // Clear the result on error
      result = {
        ...result,
        logs: [],
        gasRefund: new BN(0),
        selfdestruct: {},
      }
    }

    return {
      ...result,
      runState: {
        ...loopRes.runState!,
        ...result,
        ...eei._env,
      },
      exception: loopRes.exception,
      exceptionError: loopRes.exceptionError,
      gas: eei._gasLeft,
      gasUsed,
      return: result.returnValue ? result.returnValue : Buffer.alloc(0),
    }
  }

  /**
   * Returns code for precompile at the given address, or undefined
   * if no such precompile exists.
   */
  getPrecompile(address: Buffer): PrecompileFunc {
    return getPrecompile(address.toString('hex'))
  }

  /**
   * Executes a precompiled contract with given data and gas limit.
   */
  runPrecompile(code: PrecompileFunc, data: Buffer, gasLimit: BN): PrecompileResult {
    if (typeof code !== 'function') {
      throw new Error('Invalid precompile')
    }

    const opts = {
      data,
      gasLimit,
      _common: this._vm._common,
    }

    return code(opts)
  }

  async _loadCode(message: Message): Promise<void> {
    if (!message.code) {
      const precompile = this.getPrecompile(message.codeAddress)
      if (precompile) {
        message.code = precompile
        message.isCompiled = true
      } else {
        message.code = await this._state.getContractCode(message.codeAddress)
        message.isCompiled = false
      }
    }
  }

  async _generateAddress(message: Message): Promise<Buffer> {
    let addr
    if (message.salt) {
      addr = generateAddress2(message.caller, message.salt, message.code as Buffer)
    } else {
      const acc = await this._state.getAccount(message.caller)
      const newNonce = new BN(acc.nonce).subn(1)
      addr = generateAddress(message.caller, newNonce.toArrayLike(Buffer))
    }
    return addr
  }

  async _reduceSenderBalance(account: Account, message: Message): Promise<void> {
    const newBalance = new BN(account.balance).sub(message.value)
    account.balance = toBuffer(newBalance)
    return this._state.putAccount(toBuffer(message.caller), account)
  }

  async _addToBalance(toAccount: Account, message: Message): Promise<void> {
    const newBalance = new BN(toAccount.balance).add(message.value)
    if (newBalance.gt(MAX_INTEGER)) {
      throw new Error('Value overflow')
    }
    toAccount.balance = toBuffer(newBalance)
    // putAccount as the nonce may have changed for contract creation
    return this._state.putAccount(toBuffer(message.to), toAccount)
  }

  async _touchAccount(address: Buffer): Promise<void> {
    const acc = await this._state.getAccount(address)
    return this._state.putAccount(address, acc)
  }
}
