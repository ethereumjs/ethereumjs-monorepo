const BN = require('bn.js')
const { VmError, ERROR } = require('../exceptions')
const PStateManager = require('../state/promisified')

module.exports = class EEI {
  constructor (env) {
    this._env = env
    this._state = new PStateManager(this._env.stateManager)
  }

  /**
   * Subtracts an amount from the gas counter.
   * @param {BN} amount - Amount of gas to consume
   * @throws if out of gas
   */
  useGas (amount) {
    this._env.gasLeft.isub(amount)
    if (this._env.gasLeft.ltn(0)) {
      this._env.gasLeft = new BN(0)
      trap(ERROR.OUT_OF_GAS)
    }
  }

  /**
   * Returns address of currently executing account.
   * @returns {BN}
   */
  getAddress () {
    return new BN(this._env.address)
  }

  /**
   * Returns balance of the given account.
   * @param {BN} address - Address of account
   */
  getExternalBalance (address, cb) {
    address = addressToBuffer(address)

    // shortcut if current account
    if (address.toString('hex') === this._env.address.toString('hex')) {
      return cb(null, new BN(this._env.contract.balance))
    }

    // otherwise load account then return balance
    this._env.stateManager.getAccount(address, (err, account) => {
      if (err) {
        return cb(err, null)
      }
      cb(null, new BN(account.balance))
    })
  }

  /**
   * Returns caller address. This is the address of the account
   * that is directly responsible for this execution.
   * @returns {BN}
   */
  getCaller () {
    return new BN(this._env.caller)
  }

  /**
   * Returns the deposited value by the instruction/transaction
   * responsible for this execution.
   * @returns {BN}
   */
  getCallValue () {
    return new BN(this._env.callValue)
  }

  /**
   * Returns input data in current environment. This pertains to the input
   * data passed with the message call instruction or transaction.
   * @param {BN} pos - Offset of calldata
   * @returns {Buffer}
   */
  getCallData (pos) {
    return this._env.callData
  }

  /**
   * Returns size of input data in current environment. This pertains to the
   * input data passed with the message call instruction or transaction.
   * @returns {BN}
   */
  getCallDataSize () {
    if (this._env.callData.length === 1 && this._env.callData[0] === 0) {
      return new BN(0)
    }

    return new BN(this._env.callData.length)
  }

  /**
   * Returns the size of code running in current environment.
   * @returns {BN}
   */
  getCodeSize () {
    return new BN(this._env.code.length)
  }

  /**
   * Returns the code running in current environment.
   * @returns {BN}
   */
  getCode () {
    return this._env.code
  }

  /**
   * Get size of an account’s code.
   * @param {BN} address - Address of account
   * @param {function} cb
   */
  getExternalCodeSize (address, cb) {
    address = addressToBuffer(address)
    this._env.stateManager.getContractCode(address, (err, code) => {
      if (err) return cb(err)
      cb(null, new BN(code.length))
    })
  }

  /**
   * Returns  code of an account.
   * @param {BN} address - Address of account
   * @param {function} cb
   */
  getExternalCode (address, cb) {
    address = addressToBuffer(address)
    this._env.stateManager.getContractCode(address, cb)
  }

  /**
   * Returns size of current return data buffer. This contains the return data
   * from the last executed call, callCode, callDelegate, callStatic or create.
   * Note: create only fills the return data buffer in case of a failure.
   * @returns {BN}
   */
  getReturnDataSize () {
    return new BN(this._env.lastReturned.length)
  }

  /**
   * Returns the current return data buffer. This contains the return data
   * from last executed call, callCode, callDelegate, callStatic or create.
   * Note: create only fills the return data buffer in case of a failure.
   * @returns {Buffer}
   */
  getReturnData () {
    return this._env.lastReturned
  }

  /**
   * Returns price of gas in current environment.
   * @returns {BN}
   */
  getTxGasPrice () {
    return new BN(this._env.gasPrice)
  }

  /**
   * Returns the execution's origination address. This is the
   * sender of original transaction; it is never an account with
   * non-empty associated code.
   * @returns {BN}
   */
  getTxOrigin () {
    return new BN(this._env.origin)
  }

  /**
   * Returns the block’s number.
   * @returns {BN}
   */
  getBlockNumber () {
    return new BN(this._env.block.header.number)
  }

  /**
   * Returns the block's beneficiary address.
   * @returns {BN}
   */
  getBlockCoinbase () {
    return new BN(this._env.block.header.coinbase)
  }

  /**
   * Returns the block's timestamp.
   * @returns {BN}
   */
  getBlockTimestamp () {
    return new BN(this._env.block.header.timestamp)
  }

  /**
   * Returns the block's difficulty.
   * @returns {BN}
   */
  getBlockDifficulty () {
    return new BN(this._env.block.header.difficulty)
  }

  /**
   * Returns the block's gas limit.
   * @returns {BN}
   */
  getBlockGasLimit () {
    return new BN(this._env.block.header.gasLimit)
  }

  /**
   * Returns Gets the hash of one of the 256 most recent complete blocks.
   * @param {BN} - Number of block
   * @param {function} cb
   */
  getBlockHash (number, cb) {
    this._env.blockchain.getBlock(number, (err, block) => {
      if (err) return cb(err)
      const blockHash = new BN(block.hash())
      cb(null, blockHash)
    })
  }

  /**
   * Store 256-bit a value in memory to persistent storage.
   * @param {Buffer} key
   * @param {Buffer} value
   */
  storageStore (key, value, cb) {
    this._state.putContractStorage(this._env.address, key, value)
      .then(() => this._state.getAccount(this._env.address))
      .then((account) => {
        this._env.contract = account
        cb(null)
      })
      .catch(cb)
  }

  /**
   * Loads a 256-bit value to memory from persistent storage.
   * @param {Buffer} key - Storage key
   * @returns {Buffer}
   */
  storageLoad (key, cb) {
    this._env.stateManager.getContractStorage(this._env.address, key, cb)
  }

  /**
   * Returns the current gasCounter.
   * @returns {BN}
   */
  getGasLeft () {
    return new BN(this._env.gasLeft)
  }

  /**
   * Set the returning output data for the execution.
   * @param {Buffer} returnData - Output data to return
   */
  finish (returnData) {
    this._env.returnValue = returnData
  }

  /**
   * Set the returning output data for the execution. This will halt the
   * execution immediately and set the execution result to "reverted".
   * @param {Buffer} returnData - Output data to return
   */
  revert (returnData) {
    this._env.returnValue = returnData
    trap(ERROR.REVERT)
  }

  /**
   * Mark account for later deletion and give the remaining balance to the
   * specified beneficiary address. This will cause a trap and the
   * execution will be aborted immediately.
   * @param {Buffer} toAddress - Beneficiary address
   */
  selfDestruct (toAddress, cb) {
    this._selfDestruct(toAddress).then(() => cb(null)).catch(cb)
  }

  async _selfDestruct (toAddress) {
    // TODO: Determine if gas consumption & refund should happen in EEI or opFn
    if ((new BN(this._env.contract.balance)).gtn(0)) {
      const empty = await this._state.accountIsEmpty(toAddress)
      if (empty) {
        this.useGas(new BN(this._env._common.param('gasPrices', 'callNewAccount')))
      }
    }

    // only add to refund if this is the first selfdestruct for the address
    if (!this._env.selfdestruct[this._env.address.toString('hex')]) {
      this._env.gasRefund = this._env.gasRefund.addn(this._env._common.param('gasPrices', 'selfdestructRefund'))
    }

    this._env.selfdestruct[this._env.address.toString('hex')] = toAddress
    this._env.stopped = true

    // Add to beneficiary balance
    const toAccount = await this._state.getAccount(toAddress)
    const newBalance = new BN(this._env.contract.balance).add(new BN(toAccount.balance))
    toAccount.balance = newBalance
    await this._state.putAccount(toAddress, toAccount)

    // Subtract from contract balance
    const account = await this._state.getAccount(this._env.address)
    account.balance = new BN(0)
    await this._state.putAccount(this._env.address, account)
  }

  /**
   * Creates a new log in the current environment.
   * @param {Buffer} data
   * @param {Number} numberOfTopics
   * @param {BN[]} topics
   */
  log (data, numberOfTopics, topics) {
    if (numberOfTopics < 0 || numberOfTopics > 4) {
      trap(ERROR.OUT_OF_RANGE)
    }

    if (topics.length !== numberOfTopics) {
      trap(ERROR.INTERNAL_ERROR)
    }

    // add address
    const log = [this._env.address]
    log.push(topics)

    // add data
    log.push(data)
    this._env.logs.push(log)
  }
}

function trap (err) {
  throw new VmError(err)
}

const MASK_160 = new BN(1).shln(160).subn(1)
function addressToBuffer (address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}
