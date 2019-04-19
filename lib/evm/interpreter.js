const promisify = require('util.promisify')
const BN = require('bn.js')
const ethUtil = require('ethereumjs-util')
const { ERROR } = require('../exceptions')
const Loop = require('./loop')
const { StorageReader } = require('../state')
const PStateManager = require('../state/promisified').default
const { getPrecompile } = require('./precompiles')

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

    const account = await this._state.getAccount(message.caller)
    // Reduce tx value from sender
    await this._reduceSenderBalance(account, message)

    // Load `to` account
    let toAccount
    let createdAddress
    if (message.to) {
      toAccount = await this._state.getAccount(message.to)
    } else {
      ({ toAccount, createdAddress } = await this._createContract(account, message, message.salt))
    }

    // Add tx value to the `to` account
    await this._addToBalance(toAccount, message)

    // Load code
    await this._loadCode(message)
    if (!message.code || message.code.length === 0) {
      await this._state.commit()
      return {
        gasUsed: new BN(0),
        createdAddress: createdAddress,
        vm: {
          exception: 1
        }
      }
    }

    let { err, results } = await this.runLoop(message)
    results = await this._parseRunResult(err, results, message, createdAddress)

    // Save code if a new contract was created
    if (createdAddress && !results.runState.vmError && results.return && results.return.toString() !== '') {
      await this._state.putContractCode(createdAddress, results.return)
    }

    return {
      gasUsed: results.gasUsed,
      createdAddress: createdAddress,
      vm: results
    }
  }

  async runLoop (message) {
    const opts = {
      storageReader: this._storageReader,
      block: this._block,
      gasPrice: this._tx.gasPrice,
      origin: this._tx.origin,
      code: message.code,
      data: message.data,
      gasLimit: message.gasLimit,
      address: message.to,
      caller: message.caller,
      value: message.value,
      depth: message.depth,
      selfdestruct: message.selfdestruct,
      static: message.isStatic
    }

    // Run code
    let err, results
    const loop = new Loop(this._vm, this)
    if (message.isCompiled) {
      ({ err, results } = await new Promise((resolve, reject) => {
        this._vm.runJIT(opts, (err, results) => {
          // TODO: Standardize errors so they're all VmError
          // if (err && err.errorType !== 'VmError' && err !== ERROR.OUT_OF_GAS) return reject(err)
          return resolve({ err, results })
        })
      }))
    } else {
      ({ err, results } = await loop.run(opts))
    }

    return { err, results }
  }

  /**
   * Returns code for precompile at the given address, or undefined
   * if no such precompile exists.
   * @param {Buffer} address
   */
  getPrecompile (address) {
    return getPrecompile(address.toString('hex'))
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

  async _createContract (from, message, salt) {
    // Generate a new contract if no `to`
    // _loadToAccount
    message.code = message.data
    message.data = undefined
    const newNonce = new BN(from.nonce).subn(1)

    let createdAddress
    if (salt) {
      createdAddress = message.to = ethUtil.generateAddress2(message.caller, salt, message.code)
    } else {
      createdAddress = message.to = ethUtil.generateAddress(message.caller, newNonce.toArray())
    }

    // Check account state
    let address = createdAddress
    let account = await this._state.getAccount(address)
    if ((account.nonce && new BN(account.nonce) > 0) || account.codeHash.compare(ethUtil.KECCAK256_NULL) !== 0) {
      message.code = Buffer.from('fe', 'hex') // Invalid init code
      return { toAccount: account, createdAddress }
    }

    // Setup new contract
    await this._state.clearContractStorage(address)

    await promisify(this._vm.emit.bind(this._vm))('newContract', {
      address: address,
      code: message.code
    })

    account = await this._state.getAccount(address)
    account.nonce = new BN(account.nonce).addn(1).toArrayLike(Buffer)
    return { toAccount: account, createdAddress }
  }

  async _parseRunResult (err, results, message, createdAddress) {
    if (createdAddress) {
      // fee for size of the return value
      var totalGas = results.gasUsed
      if (!results.runState.vmError) {
        var returnFee = new BN(results.return.length * this._vm._common.param('gasPrices', 'createData'))
        totalGas = totalGas.add(returnFee)
      }
      // if not enough gas
      if (totalGas.lte(message.gasLimit) && (this._vm.allowUnlimitedContractSize || results.return.length <= 24576)) {
        results.gasUsed = totalGas
      } else {
        results.return = Buffer.alloc(0)
        // since Homestead
        results.exception = 0
        err = results.exceptionError = ERROR.OUT_OF_GAS
        results.gasUsed = message.gasLimit
      }
    }

    if (err) {
      results.logs = []
      await this._state.revert()
      if (message.isCompiled) {
        // Empty precompiled contracts need to be deleted even in case of OOG
        // because the bug in both Geth and Parity led to deleting RIPEMD precompiled in this case
        // see https://github.com/ethereum/go-ethereum/pull/3341/files#diff-2433aa143ee4772026454b8abd76b9dd
        // We mark the account as touched here, so that is can be removed among other touched empty accounts (after tx finalization)
        if (err === ERROR.OUT_OF_GAS || err.error === ERROR.OUT_OF_GAS) {
          let acc = await this._state.getAccount(message.to)
          await this._state.putAccount(message.to, acc)
        }
      }
    } else {
      await this._state.commit()
    }

    return results
  }
}
