const BN = require('bn.js')

module.exports = class EEI {
  constructor (env) {
    this._env = env
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
    this._env.stateManager.getContractCode(address, (err, code) => {
      if (err) return cb(err)
      cb(null, code)
    })
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

  storageStore (key, value) {

  }

  storageLoad (key, cb) {
    this._env.stateManager.getContractStorage(this._env.address, key, (err, value) => {
      cb(err, value)
    })
  }

  /**
   * Returns the current gasCounter.
   * @returns {BN}
   */
  getGasLeft () {
    return new BN(this._env.gasLeft)
  }
}

const MASK_160 = new BN(1).shln(160).subn(1)
function addressToBuffer (address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}
