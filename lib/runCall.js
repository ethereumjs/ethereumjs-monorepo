const ethUtil = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const BN = ethUtil.BN
const { StorageReader } = require('./state')
const TxContext = require('./evm/txContext').default
const Message = require('./evm/message').default
const Interpreter = require('./evm/interpreter')

/**
 * runs a CALL operation
 * @method vm.runCall
 * @private
 * @param opts
 * @param opts.block {Block}
 * @param opts.caller {Buffer}
 * @param opts.code {Buffer} this is for CALLCODE where the code to load is different than the code from the to account.
 * @param opts.data {Buffer}
 * @param opts.gasLimit {Buffer | BN.js }
 * @param opts.gasPrice {Buffer}
 * @param opts.origin {Buffer} []
 * @param opts.to {Buffer}
 * @param opts.value {Buffer}
 * @param {Function} cb the callback
 */
module.exports = function (opts, cb) {
  const block = opts.block || new Block()
  const storageReader = opts.storageReader || new StorageReader(this.stateManager)

  const txContext = new TxContext(opts.gasPrice, opts.origin || opts.caller)
  const message = new Message({
    caller: opts.caller,
    gasLimit: opts.gasLimit ? new BN(opts.gasLimit) : new BN(0xffffff),
    to: opts.to && opts.to.toString('hex') !== '' ? opts.to : undefined,
    value: opts.value,
    data: opts.data,
    code: opts.code,
    depth: opts.depth,
    isCompiled: opts.compiled,
    isStatic: opts.static,
    salt: opts.salt,
    // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
    selfdestruct: opts.selfdestruct || opts.suicides,
    delegatecall: opts.delegatecall
  })

  const interpreter = new Interpreter(this, txContext, block, storageReader)
  interpreter.executeMessage(message)
    .then((results) => cb(null, results))
    .catch((err) => cb(err, null))
}
