import BN = require('bn.js')
import { toBuffer, generateAddress, generateAddress2, KECCAK256_NULL, MAX_INTEGER } from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import { VmError, ERROR } from '../exceptions'
import { StorageReader } from '../state'
import PStateManager from '../state/promisified'
import { getPrecompile, PrecompileFunc, PrecompileResult } from './precompiles'
import { OOGResult } from './precompiles/types'
import TxContext from './txContext'
import Message from './message'
import { default as Loop, LoopResult } from './loop'

export interface InterpreterResult {
  gasUsed: BN
  createdAddress?: Buffer
  vm: LoopResult
}

export default class Interpreter {
  _vm: any
  _state: PStateManager
  _storageReader: StorageReader
  _tx: TxContext
  _block: any

  constructor (vm: any, txContext: TxContext, block: any, storageReader: StorageReader) {
    this._vm = vm
    this._state = new PStateManager(this._vm.stateManager)
    this._storageReader = storageReader || new StorageReader(this._state._wrapped)
    this._tx = txContext
    this._block = block
  }

  async executeMessage (message: Message): Promise<InterpreterResult> {
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
        if (err as ERROR === ERROR.OUT_OF_GAS || (err as VmError).error === ERROR.OUT_OF_GAS) {
          await this._touchAccount(message.to)
        }
      }
    } else {
      await this._state.commit()
    }

    return result
  }

  async _executeCall (message: Message): Promise<InterpreterResult> {
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
          return: Buffer.alloc(0)
        }
      }
    }

    const result = await this.runLoop(message)
    return {
      gasUsed: result.gasUsed,
      vm: result
    }
  }

  async _executeCreate (message: Message): Promise<InterpreterResult> {
    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    await this._reduceSenderBalance(account, message)

    message.code = message.data
    message.data = Buffer.alloc(0)
    message.to = await this._generateAddress(message)
    let toAccount = await this._state.getAccount(message.to)
    // Check for collision
    if ((toAccount.nonce && new BN(toAccount.nonce).gtn(0)) || toAccount.codeHash.compare(KECCAK256_NULL) !== 0) {
      return {
        gasUsed: message.gasLimit,
        createdAddress: message.to,
        vm: {
          return: Buffer.alloc(0),
          exception: 0,
          exceptionError: ERROR.CREATE_COLLISION,
          gasUsed: message.gasLimit
        }
      }
    }

    await this._state.clearContractStorage(message.to)
    await this._vm._emit('newContract', {
      address: message.to,
      code: message.code
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
          return: Buffer.alloc(0)
        }
      }
    }

    let result = await this.runLoop(message)

    // fee for size of the return value
    let totalGas = result.gasUsed
    if (!result.exceptionError) {
      const returnFee = new BN(result.return.length * this._vm._common.param('gasPrices', 'createData'))
      totalGas = totalGas.add(returnFee)
    }

    // if not enough gas
    if (totalGas.lte(message.gasLimit) && (this._vm.allowUnlimitedContractSize || result.return.length <= 24576)) {
      result.gasUsed = totalGas
    } else {
      Object.assign(result, OOGResult(message.gasLimit))
    }

    // Save code if a new contract was created
    if (!result.exceptionError && result.return && result.return.toString() !== '') {
      await this._state.putContractCode(message.to, result.return)
    }

    return {
      gasUsed: result.gasUsed,
      createdAddress: message.to,
      vm: result
    }
  }

  async runLoop (message: Message): Promise<any> {
    const opts = {
      storageReader: this._storageReader,
      block: this._block,
      txContext: this._tx,
      message
    }

    // Run code
    let results
    const loop = new Loop(this._vm, this)
    if (message.isCompiled) {
      results = this.runPrecompile(message.code as PrecompileFunc, message.data, message.gasLimit)
    } else {
      results = await loop.run(opts)
    }

    return results
  }

  /**
   * Returns code for precompile at the given address, or undefined
   * if no such precompile exists.
   * @param {Buffer} address
   */
  getPrecompile (address: Buffer): PrecompileFunc {
    return getPrecompile(address.toString('hex'))
  }

  runPrecompile (code: PrecompileFunc, data: Buffer, gasLimit: BN): PrecompileResult {
    if (typeof code !== 'function') {
      throw new Error('Invalid precompile')
    }

    const opts = {
      data,
      gasLimit,
      _common: this._vm._common
    }

    return code(opts)
  }

  async _loadCode (message: Message): Promise<void> {
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

  async _generateAddress (message: Message): Promise<Buffer> {
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

  async _reduceSenderBalance (account: Account, message: Message): Promise<void> {
    const newBalance = new BN(account.balance).sub(message.value)
    account.balance = toBuffer(newBalance)
    return this._state.putAccount(toBuffer(message.caller), account)
  }

  async _addToBalance (toAccount: Account, message: Message): Promise<void> {
    const newBalance = new BN(toAccount.balance).add(message.value)
    if (newBalance.gt(MAX_INTEGER)) {
      throw new Error('Value overflow')
    }
    toAccount.balance = toBuffer(newBalance)
    // putAccount as the nonce may have changed for contract creation
    return this._state.putAccount(toBuffer(message.to), toAccount)
  }

  async _touchAccount (address: Buffer): Promise<void> {
    const acc = await this._state.getAccount(address)
    return this._state.putAccount(address, acc)
  }
}
