const promisify = require('util.promisify')
const BN = require('bn.js')
const { VmError, ERROR } = require('../exceptions')
const PStateManager = require('../state/promisified').default
const Message = require('./message')

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
   * @returns {Buffer}
   */
  getAddress () {
    return this._env.address
  }

  /**
   * Returns balance of the given account.
   * @param {BN} address - Address of account
   */
  async getExternalBalance (address) {
    address = addressToBuffer(address)

    // shortcut if current account
    if (address.toString('hex') === this._env.address.toString('hex')) {
      return new BN(this._env.contract.balance)
    }

    // otherwise load account then return balance
    const account = await this._state.getAccount(address)
    return new BN(account.balance)
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
   */
  async getExternalCodeSize (address) {
    address = addressToBuffer(address)
    const code = await this._state.getContractCode(address)
    return new BN(code.length)
  }

  /**
   * Returns  code of an account.
   * @param {BN} address - Address of account
   */
  async getExternalCode (address) {
    if (!Buffer.isBuffer(address)) {
      address = addressToBuffer(address)
    }
    return this._state.getContractCode(address)
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
   */
  async getBlockHash (number) {
    const block = await promisify(this._env.blockchain.getBlock).bind(this._env.blockchain)(number)
    return new BN(block.hash())
  }

  /**
   * Store 256-bit a value in memory to persistent storage.
   * @param {Buffer} key
   * @param {Buffer} value
   */
  async storageStore (key, value) {
    await this._state.putContractStorage(this._env.address, key, value)
    const account = await this._state.getAccount(this._env.address)
    this._env.contract = account
  }

  /**
   * Loads a 256-bit value to memory from persistent storage.
   * @param {Buffer} key - Storage key
   * @returns {Buffer}
   */
  async storageLoad (key) {
    return this._state.getContractStorage(this._env.address, key)
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
  async selfDestruct (toAddress) {
    return this._selfDestruct(toAddress)
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

  /**
   * Sends a message with arbitrary data to a given address path.
   * @param {BN} gasLimit
   * @param {Buffer} address
   * @param {BN} value
   * @param {Buffer} data
   */
  async call (gasLimit, address, value, data) {
    const msg = new Message({
      caller: this._env.address,
      gasLimit: gasLimit,
      to: address,
      value: value,
      data: data,
      isStatic: this._env.static,
      depth: this._env.depth + 1
    })

    return this._baseCall(msg)
  }

  /**
   * Message-call into this account with an alternative account's code.
   * @param {BN} gasLimit
   * @param {Buffer} address
   * @param {BN} value
   * @param {Buffer} data
   */
  async callCode (gasLimit, address, value, data) {
    const msg = new Message({
      caller: this._env.address,
      gasLimit: gasLimit,
      to: this._env.address,
      codeAddress: address,
      value: value,
      data: data,
      isStatic: this._env.static,
      depth: this._env.depth + 1
    })

    return this._baseCall(msg)
  }

  /**
   * Sends a message with arbitrary data to a given address path, but disallow
   * state modifications. This includes log, create, selfdestruct and call with
   * a non-zero value.
   * @param {BN} gasLimit
   * @param {Buffer} address
   * @param {BN} value
   * @param {Buffer} data
   */
  async callStatic (gasLimit, address, value, data) {
    const msg = new Message({
      caller: this._env.address,
      gasLimit: gasLimit,
      to: address,
      value: value,
      data: data,
      isStatic: true,
      depth: this._env.depth + 1
    })

    return this._baseCall(msg)
  }

  /**
   * Message-call into this account with an alternative account’s code, but
   * persisting the current values for sender and value.
   * @param {BN} gasLimit
   * @param {Buffer} address
   * @param {BN} value
   * @param {Buffer} data
   */
  async callDelegate (gasLimit, address, value, data) {
    const msg = new Message({
      caller: this._env.caller,
      gasLimit: gasLimit,
      to: this._env.address,
      codeAddress: address,
      value: value,
      data: data,
      isStatic: this._env.static,
      delegatecall: true,
      depth: this._env.depth + 1
    })

    return this._baseCall(msg)
  }

  async _baseCall (msg) {
    const selfdestruct = Object.assign({}, this._env.selfdestruct)
    msg.selfdestruct = selfdestruct

    // empty the return data buffer
    this._env.lastReturned = Buffer.alloc(0)

    // Check if account has enough ether and max depth not exceeded
    if (this._env.depth >= this._env._common.param('vm', 'stackLimit') || (msg.delegatecall !== true && new BN(this._env.contract.balance).lt(msg.value))) {
      return new BN(0)
    }

    const results = await this._env.interpreter.executeMessage(msg)

    // concat the runState.logs
    if (results.vm.logs) {
      this._env.logs = this._env.logs.concat(results.vm.logs)
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      this._env.gasRefund = this._env.gasRefund.add(results.vm.gasRefund)
    }

    // this should always be safe
    this._env.gasLeft.isub(results.gasUsed)

    // Set return value
    if (results.vm.return && (!results.vm.exceptionError || results.vm.exceptionError.error === ERROR.REVERT)) {
      this._env.lastReturned = results.vm.return
    }

    if (!results.vm.exceptionError) {
      Object.assign(this._env.selfdestruct, selfdestruct)
      // update stateRoot on current contract
      const account = await this._state.getAccount(this._env.address)
      this._env.contract = account
    }

    return new BN(results.vm.exception)
  }

  /**
   * Creates a new contract with a given value.
   * @param {BN} gasLimit
   * @param {BN} value
   * @param {Buffer} data
   */
  async create (gasLimit, value, data, salt = null) {
    const selfdestruct = Object.assign({}, this._env.selfdestruct)
    const msg = new Message({
      caller: this._env.address,
      gasLimit: gasLimit,
      value: value,
      data: data,
      salt: salt,
      depth: this._env.depth + 1,
      selfdestruct: selfdestruct
    })

    // empty the return data buffer
    this._env.lastReturned = Buffer.alloc(0)

    // Check if account has enough ether and max depth not exceeded
    if (this._env.depth >= this._env._common.param('vm', 'stackLimit') || (msg.delegatecall !== true && new BN(this._env.contract.balance).lt(msg.value))) {
      return new BN(0)
    }

    this._env.contract.nonce = new BN(this._env.contract.nonce).addn(1)
    await this._state.putAccount(this._env.address, this._env.contract)

    const results = await this._env.interpreter.executeMessage(msg)

    // concat the runState.logs
    if (results.vm.logs) {
      this._env.logs = this._env.logs.concat(results.vm.logs)
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      this._env.gasRefund = this._env.gasRefund.add(results.vm.gasRefund)
    }

    // this should always be safe
    this._env.gasLeft.isub(results.gasUsed)

    // Set return buffer in case revert happened
    if (results.vm.exceptionError && results.vm.exceptionError.error === ERROR.REVERT) {
      this._env.lastReturned = results.vm.return
    }

    if (!results.vm.exceptionError) {
      Object.assign(this._env.selfdestruct, selfdestruct)
      // update stateRoot on current contract
      const account = await this._state.getAccount(this._env.address)
      this._env.contract = account
      if (results.createdAddress) {
        // push the created address to the stack
        return new BN(results.createdAddress)
      }
    } else {
      // creation failed so don't increment the nonce
      if (results.vm.createdAddress) {
        this._env.contract.nonce = new BN(this._env.contract.nonce).subn(1)
      }
    }

    return new BN(results.vm.exception)
  }

  /**
   * Creates a new contract with a given value. Generates
   * a deterministic address via CREATE2 rules.
   * @param {BN} gasLimit
   * @param {BN} value
   * @param {Buffer} data
   * @param {Buffer} salt
   */
  async create2 (gasLimit, value, data, salt) {
    return this.create(gasLimit, value, data, salt)
  }
}

function trap (err) {
  throw new VmError(err)
}

const MASK_160 = new BN(1).shln(160).subn(1)
function addressToBuffer (address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}
