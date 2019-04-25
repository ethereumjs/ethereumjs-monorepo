const BN = require('bn.js')
const ethUtil = require('ethereumjs-util')
const { ERROR } = require('../exceptions')
const Loop = require('./loop')
const { StorageReader } = require('../state')
const PStateManager = require('../state/promisified').default
const { getPrecompile } = require('./precompiles')
const { OOGResult } = require('./precompiles/types')

module.exports = class Interpreter {
  constructor (vm, txContext, block, storageReader) {
    this._vm = vm
    this._state = new PStateManager(this._vm.stateManager)
    this._storageReader = storageReader || new StorageReader(this._state._wrapped)
    this._tx = txContext
    this._block = block
  }

  async executeMessage (message) {
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
        if (err === ERROR.OUT_OF_GAS || err.error === ERROR.OUT_OF_GAS) {
          await this._touchAccount(message.to)
        }
      }
    } else {
      await this._state.commit()
    }

    return result
  }

  async _executeCall (message) {
    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    await this._reduceSenderBalance(account, message)
    // Load `to` account
    const toAccount = await this._state.getAccount(message.to)
    // Add tx value to the `to` account
    await this._addToBalance(toAccount, message)

    // Load code
    await this._loadCode(message)
    if (!message.code || message.code.length === 0) {
      return {
        gasUsed: new BN(0),
        vm: {
          exception: 1
        }
      }
    }

    const result = await this.runLoop(message)
    return {
      gasUsed: result.gasUsed,
      vm: result
    }
  }

  async _executeCreate (message) {
    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    await this._reduceSenderBalance(account, message)

    message.code = message.data
    message.data = undefined
    message.to = await this._generateAddress(message)
    let toAccount = await this._state.getAccount(message.to)
    // Check for collision
    if ((toAccount.nonce && new BN(toAccount.nonce) > 0) || toAccount.codeHash.compare(ethUtil.KECCAK256_NULL) !== 0) {
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
          exception: 1
        }
      }
    }

    let result = await this.runLoop(message)

    // fee for size of the return value
    let totalGas = result.gasUsed
    if (!result.runState.vmError) {
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
    if (!result.runState.vmError && result.return && result.return.toString() !== '') {
      await this._state.putContractCode(message.to, result.return)
    }

    return {
      gasUsed: result.gasUsed,
      createdAddress: message.to,
      vm: result
    }
  }

  async runLoop (message) {
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
      results = this.runPrecompile(message.code, message.data, message.gasLimit)
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
  getPrecompile (address) {
    return getPrecompile(address.toString('hex'))
  }

  runPrecompile (code, data, gasLimit) {
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

  async _loadCode (message) {
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

  async _generateAddress (message) {
    let addr
    if (message.salt) {
      addr = ethUtil.generateAddress2(message.caller, message.salt, message.code)
    } else {
      const acc = await this._state.getAccount(message.caller)
      const newNonce = new BN(acc.nonce).subn(1)
      addr = ethUtil.generateAddress(message.caller, newNonce.toArray())
    }
    return addr
  }

  async _reduceSenderBalance (account, message) {
    if (!message.delegatecall) {
      const newBalance = new BN(account.balance).sub(message.value)
      account.balance = newBalance
      await this._state.putAccount(ethUtil.toBuffer(message.caller), account)
    }
  }

  async _addToBalance (toAccount, message) {
    if (!message.delegatecall) {
      const newBalance = new BN(toAccount.balance).add(message.value)
      if (newBalance.gt(ethUtil.MAX_INTEGER)) {
        throw new Error('Value overflow')
      }
      toAccount.balance = newBalance
      // putAccount as the nonce may have changed for contract creation
      this._state.putAccount(ethUtil.toBuffer(message.to), toAccount)
    }
  }

  async _touchAccount (address) {
    const acc = await this._state.getAccount(address)
    return this._state.putAccount(address, acc)
  }
}
