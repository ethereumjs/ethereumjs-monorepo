const { promisify } = require('util')
const BN = require('bn.js')
const ethUtil = require('ethereumjs-util')
const { ERROR } = require('../exceptions')
const Loop = require('./loop')
const { StorageReader } = require('../state')

module.exports = class Interpreter {
  constructor (vm, txContext, block) {
    this._vm = vm
    this._state = this._vm.stateManager
    this._storageReader = new StorageReader(this._state)
    this._tx = txContext
    this._block = block
  }

  async executeMessage (message) {
    await this._checkpointState()

    const account = await this._getAccount(message.caller)

    // Reduce tx value from sender
    if (!message.delegatecall) {
      const newBalance = new BN(account.balance).sub(message.value)
      account.balance = newBalance
      await this._putAccount(ethUtil.toBuffer(message.caller), account)
    }

    // Load `to` account
    let toAccount
    let createdAddress
    if (message.to) {
      toAccount = await this._getAccount(message.to)
    } else {
      ({ toAccount, createdAddress } = await this._createContract(account, message, message.salt))
    }

    // add the amount sent to the `to` account
    if (!message.delegatecall) {
      const newBalance = new BN(toAccount.balance).add(message.value)
      if (newBalance.gt(ethUtil.MAX_INTEGER)) {
        throw new Error('Value overflow')
      }
      toAccount.balance = newBalance
      // putAccount as the nonce may have changed for contract creation
      this._putAccount(ethUtil.toBuffer(message.to), toAccount)
    }

    // Load code
    let isCompiled = message.isCompiled
    if (!message.code) {
      if (this._vm._precompiled[message.to.toString('hex')]) {
        message.code = this._vm._precompiled[message.to.toString('hex')]
        isCompiled = true
      } else {
        message.code = await this._getContractCode(message.to)
        isCompiled = false
      }
    }

    if (!message.code || message.code.length === 0) {
      await this._commitState()
      return {
        gasUsed: new BN(0),
        createdAddress: createdAddress,
        vm: {
          exception: 1
        }
      }
    }

    const runCodeOpts = {
      storageReader: this._storageReader,
      block: this._block,
      gasPrice: this._tx.gasPrice,
      origin: this._tx.origin,
      code: message.code,
      data: message.data,
      gasLimit: message.gasLimit,
      address: message.to,
      caller: message.caller,
      value: message.value.toArrayLike(Buffer),
      depth: message.depth,
      selfdestruct: message.selfdestruct,
      static: message.isStatic
    }

    // Run code
    const loop = new Loop(this._vm, this)
    let err, results
    if (isCompiled) {
      ({ err, results } = await new Promise((resolve, reject) => {
        this._vm.runJIT(runCodeOpts, (err, results) => {
          // TODO: Standardize errors so they're all VmError
          // if (err && err.errorType !== 'VmError' && err !== ERROR.OUT_OF_GAS) return reject(err)
          return resolve({ err, results })
        })
      }))
    } else {
      try {
        ({ err, results } = await loop.run(runCodeOpts))
      } catch (e) {
        throw e
      }
    }

    results = await this._parseRunResult(err, results, message, createdAddress, isCompiled)

    // Save code if a new contract was created
    if (createdAddress && !results.runState.vmError && results.return && results.return.toString() !== '') {
      await this._putContractCode(createdAddress, results.return)
    }

    return {
      gasUsed: results.gasUsed,
      createdAddress: createdAddress,
      vm: results
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
    let account = await this._getAccount(address)
    if ((account.nonce && new BN(account.nonce) > 0) || account.codeHash.compare(ethUtil.KECCAK256_NULL) !== 0) {
      message.code = Buffer.from('fe', 'hex') // Invalid init code
      return { toAccount: account, createdAddress }
    }

    // Setup new contract
    await this._clearContractStorage(address)

    await promisify(this._vm.emit.bind(this._vm))('newContract', {
      address: address,
      code: message.code
    })

    account = await this._getAccount(address)
    account.nonce = new BN(account.nonce).addn(1).toArrayLike(Buffer)
    return { toAccount: account, createdAddress }
  }

  async _parseRunResult (err, results, message, createdAddress, isCompiled) {
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
      await this._revertState()
      if (isCompiled) {
        // Empty precompiled contracts need to be deleted even in case of OOG
        // because the bug in both Geth and Parity led to deleting RIPEMD precompiled in this case
        // see https://github.com/ethereum/go-ethereum/pull/3341/files#diff-2433aa143ee4772026454b8abd76b9dd
        // We mark the account as touched here, so that is can be removed among other touched empty accounts (after tx finalization)
        if (err === ERROR.OUT_OF_GAS || err.error === ERROR.OUT_OF_GAS) {
          let acc = await this._getAccount(message.to)
          await this._putAccount(message.to, acc)
        }
      }
    } else {
      await this._commitState()
    }

    return results
  }

  async _checkpointState () {
    return promisify(this._state.checkpoint.bind(this._state))()
  }

  async _commitState () {
    return promisify(this._state.commit.bind(this._state))()
  }

  async _revertState () {
    return promisify(this._state.revert.bind(this._state))()
  }

  async _getAccount (addr) {
    return promisify(this._state.getAccount.bind(this._state))(addr)
  }

  async _putAccount (addr, account) {
    return promisify(this._state.putAccount.bind(this._state))(addr, account)
  }

  async _getContractCode (addr) {
    return promisify(this._state.getContractCode.bind(this._state))(addr)
  }

  async _putContractCode (addr, code) {
    return promisify(this._state.putContractCode.bind(this._state))(addr, code)
  }

  async _clearContractStorage (addr) {
    return promisify(this._state.clearContractStorage.bind(this._state))(addr)
  }
}
