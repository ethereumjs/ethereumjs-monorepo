/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).


NOTES:

stack items are lazly dupilicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.

*/

const async = require('async')
const utils = require('ethereumjs-util')
const BN = utils.BN
const rlp = utils.rlp
const Account = require('ethereumjs-account')
const Block = require('ethereumjs-block')
const fees = require('ethereum-common')
const opcodes = require('./opcodes.js')
const constants = require('./constants.js')
const logTable = require('./logTable.js')
const assert = require('assert')
const setImmediate = require('timers').setImmediate

const ERROR = constants.ERROR
const MAX_INT = 9007199254740991


/**
 * Runs EVM code
 * @param opts
 * @param opts.account {Account} the account that the exucuting code belongs to
 * @param opts.address {Buffer}  the address of the account that is exucuting this code
 * @param opts.block {Block} the block that the transaction is part of
 * @param opts.caller {Buffer} the address that ran this code
 * @param opts.code {Buffer} the code to be run
 * @param opts.data {Buffer}  the input data
 * @param opts.gasLimit {Buffer}
 * @param opts.origin {Buffer} the address where the call originated from
 * @param opts.value {Buffer} the amount the being transfered
 * @param cb {Function}
 */
module.exports = function (opts, cb) {
  var self = this

  // VM internal state

  var returnValue = new Buffer([])
  var stopped = false
  var vmError = false
  // the to address for the remaining balance
  var suicideTo
  // program counter
  var pc = 0
  // the current opcode (Number)
  var op
  // the current opcode name (String)
  var opcode
  var gasLeft = new BN(opts.gasLimit)
  var memory = []
  var wordsInMem = 0
  var stack = []
  var logs = []
  var validJumps = []
  var gasRefund = new BN(0)
  var lastMemExpCost = new BN(0)
  var depth = opts.depth || 0

  // parse options
  opts.suicides = opts.suicides || {}
  opts.block = opts.block || new Block()
  opts.account = opts.account || new Account()
  opts.value = opts.value || new Buffer([0])
  opts.address = opts.address || utils.zeros(32)
  opts.caller = opts.caller || utils.zeros(32)
  opts.origin = opts.origin || opts.caller
  opts.data = opts.data || new Buffer([0])
  
  // an list of storage tries that need to be commited at the end of everything
  var storageTries = []
  // copy creates a shared cached.
  var storageTrie = this.trie.copy()
  storageTrie._checkpoints = []
  storageTrie.root = opts.account.stateRoot
  storageTries.push(storageTrie)

  // define the opcode functions
  var opFuncs = {
    STOP: function () {
      stopped = true
    },
    ADD: function () {
      stack.push(
        new Buffer(
          new BN(stack.pop())
          .add(new BN(stack.pop())).mod(utils.TWO_POW256)
          .toArray())
      )
    },
    MUL: function () {
      stack.push(
        new Buffer(
          new BN(stack.pop())
          .mul(new BN(stack.pop())).mod(utils.TWO_POW256)
          .toArray()
        ))
    },
    SUB: function () {
      stack.push(
        utils.toUnsigned(
          new BN(stack.pop())
          .sub(new BN(stack.pop()))
        )
      )
    },
    DIV: function () {
      const a = new BN(stack.pop())
      const b = new BN(stack.pop())
      var r
      if (b.toString() === '0') {
        r = [0]
      } else {
        r = a.div(b).toArray()
      }
      stack.push(new Buffer(r))
    },
    SDIV: function () {
      const a = utils.fromSigned(stack.pop())
      const b = utils.fromSigned(stack.pop())

      var r
      if (b.toString() === '0')
        r = new Buffer([0])
      else
        r = utils.toUnsigned(a.div(b))

      stack.push(r)
    },
    MOD: function () {
      const a = new BN(stack.pop())
      const b = new BN(stack.pop())
      var r

      if (b.toString() === '0')
        r = [0]
      else
        r = a.mod(b).toArray()

      stack.push(new Buffer(r))
    },
    SMOD: function () {
      const a = utils.fromSigned(stack.pop())
      const b = utils.fromSigned(stack.pop())
      var r

      if (b.toString() === '0')
        r = new Buffer([0])
      else {
        r = a.abs().mod(b.abs())
        if (a.sign)
          r = r.neg()

        r = utils.toUnsigned(r)
      }
      stack.push(r)
    },
    ADDMOD: function () {
      const a = new BN(stack.pop()).add(new BN(stack.pop()))
      const b = new BN(stack.pop())
      var r

      if (b.toString() === '0')
        r = [0]
      else
        r = a.mod(b).toArray()

      stack.push(
        new Buffer(r)
      )
    },
    MULMOD: function () {
      const a = new BN(stack.pop()).mul(new BN(stack.pop()))
      const b = new BN(stack.pop())
      var r

      if (b.toString() === '0')
        r = [0]
      else
        r = a.mod(b).toArray()

      stack.push(
        new Buffer(r)
      )
    },
    EXP: function () {
      var base = new BN(stack.pop())
      var exponent = new BN(stack.pop())
      var m = BN.red(utils.TWO_POW256)
      base = base.toRed(m)

      var result
      if (exponent.cmp(new BN(0)) !== 0) {
        var bytes = 1 + logTable(exponent)
        gasLeft.isub(new BN(bytes).mul(new BN(fees.expByteGas.v)))
        result = new Buffer(base.redPow(exponent).toArray())
      } else
        result = new Buffer([1])

      stack.push(result)
    },
    SIGNEXTEND: function () {
      var k = new BN(stack.pop())
      var extendOnes = false

      if (k.cmp(new BN(31)) <= 0) {
        var val = new Buffer(32)
        utils.pad(stack.pop(), 32).copy(val)

        if (val[31 - k] & 0x80) {
          extendOnes = true
        }

        // 31-k-1 since k-th byte shouldn't be modified
        for (var i = 30 - k; i >= 0; i--) {
          val[i] = extendOnes ? 0xff : 0
        }

        stack.push(val)
      }
    },
    // 0x10 range - bit ops
    LT: function () {
      stack.push(
        new Buffer([
          new BN(stack.pop())
          .cmp(new BN(stack.pop())) === -1
        ])
      )
    },
    GT: function () {
      stack.push(
        new Buffer([
          new BN(stack.pop())
          .cmp(new BN(stack.pop())) === 1
        ])
      )
    },
    SLT: function () {
      stack.push(
        new Buffer([
          utils.fromSigned(stack.pop())
          .cmp(utils.fromSigned(stack.pop())) === -1
        ])
      )
    },
    SGT: function () {
      stack.push(
        new Buffer([
          utils.fromSigned(stack.pop())
          .cmp(utils.fromSigned(stack.pop())) === 1
        ])
      )
    },
    EQ: function () {
      const a = utils.unpad(stack.pop())
      const b = utils.unpad(stack.pop())
      stack.push(new Buffer([a.toString('hex') === b.toString('hex')]))
    },
    ISZERO: function () {
      const i = utils.bufferToInt(stack.pop())
      stack.push(new Buffer([!i]))
    },
    AND: function () {
      stack.push(
        new Buffer((
            new BN(stack.pop())
            .and(
              new BN(stack.pop())
            )
          )
          .toArray())
      )
    },
    OR: function () {
      stack.push(
        new Buffer((
            new BN(stack.pop())
            .or(
              new BN(stack.pop())
            )
          )
          .toArray())
      )
    },
    XOR: function () {
      stack.push(
        new Buffer((
            new BN(stack.pop())
            .xor(
              new BN(stack.pop())
            )
          )
          .toArray())
      )
    },
    NOT: function () {
      stack.push(
        new Buffer(utils.TWO_POW256.sub(new BN(1)).sub(new BN(stack.pop()))
          .toArray())
      )
    },
    BYTE: function () {
      var pos = utils.bufferToInt(stack.pop())
      var word = utils.pad(stack.pop(), 32)
      var byte

      if (pos < 32) {
        byte = utils.intToBuffer(word[pos])
      } else {
        byte = new Buffer([0])
      }

      stack.push(byte)
    },
    // 0x20 range - crypto
    SHA3: function () {
      var offset = utils.bufferToInt(stack.pop())
      var length = utils.bufferToInt(stack.pop())
      var data = memLoad(offset, length)
      if (data === ERROR.OUT_OF_GAS) return data

      // TODO: copy fee
      gasLeft.isubn(fees.sha3WordGas.v * Math.ceil(length / 32))

      if (gasLeft.cmpn(0) === -1) return ERROR.OUT_OF_GAS

      stack.push(utils.sha3(data))
    },
    // 0x30 range - closure state
    ADDRESS: function () {
      stack.push(opts.address)
    },
    BALANCE: function (done) {
      var address = stack.pop().slice(-20)
      
      // shortcut if current account
      if (address.toString('hex') === opts.address.toString('hex')) {
        stack.push(opts.account.balance)
        done()
        return
      }

      // otherwise load account then return balance
      self.cache.getOrLoad(address, function (err, account) {
        if (err) return done(err)
        stack.push(account.balance)
        done()
      })
    },
    ORIGIN: function () {
      stack.push(opts.origin)
    },
    CALLER: function () {
      stack.push(opts.caller)
    },
    CALLVALUE: function () {
      stack.push(new Buffer(opts.value.toArray()))
    },
    CALLDATALOAD: function () {
      var pos = utils.bufferToInt(stack.pop())
      var loaded = opts.data.slice(pos, pos + 32)

      loaded = loaded.length ? loaded : new Buffer([0])

      // pad end
      if (loaded.length < 32) {
        var dif = 32 - loaded.length
        var pad = new Buffer(dif)
        pad.fill(0)
        loaded = Buffer.concat([loaded, pad], 32)
      }

      stack.push(loaded)
    },
    CALLDATASIZE: function () {
      if (opts.data.length === 1 && opts.data[0] === 0) {
        stack.push(new Buffer([0]))
      } else {
        stack.push(utils.intToBuffer(opts.data.length))
      }
    },
    CALLDATACOPY: function () {
      var memOffset = utils.bufferToInt(stack.pop())
      var dataOffsetBuf = stack.pop()
      var dataLength = utils.bufferToInt(stack.pop())
      var dataOffset = utils.bufferToInt(dataOffsetBuf)

      var err = memStore(memOffset, opts.data, dataOffset, dataLength)
      if (err) return err
      // sub the COPY fee
      gasLeft.isub(new BN(Number(fees.copyGas.v) * Math.ceil(dataLength / 32)))
    },
    CODESIZE: function () {
      stack.push(utils.intToBuffer(opts.code.length))
    },
    CODECOPY: function () {
      var memOffset = utils.bufferToInt(stack.pop()),
        codeOffset = utils.bufferToInt(stack.pop()),
        length = utils.bufferToInt(stack.pop())

      var err = memStore(memOffset, opts.code, codeOffset, length)
      if (err) return err
      // sub the COPY fee
      gasLeft.isubn(fees.copyGas.v * Math.ceil(length / 32))
    },
    EXTCODESIZE: function (done) {
      var address = stack.pop().slice(-20)
      self.cache.getOrLoad(address, function (err, account) {
        account.getCode(self.trie, function (err2, code) {
          stack.push(utils.intToBuffer(code.length))
          done(err || err2)
        })
      })
    },
    EXTCODECOPY: function (done) {
      var address = stack.pop().slice(-20)
      var memOffset = utils.bufferToInt(stack.pop())
      var codeOffset = utils.bufferToInt(stack.pop())
      var length = utils.bufferToInt(stack.pop())

      self.cache.getOrLoad(address, function (err, account) {
        account.getCode(self.trie, function (err2, code) {
          code = err ? new Buffer([0]) : code
          err = memStore(memOffset, code, codeOffset, length)
          if (err || err2) {
            done(err || err2)
            return
          }

          // sub the COPY fee
          gasLeft = gasLeft.sub(new BN(Number(fees.copyGas.v) * Math.ceil(length / 32)))
          done()
        })
      })
    },
    GASPRICE: function () {
      stack.push(opts.gasPrice)
    },
    // '0x40' range - block operations
    BLOCKHASH: function (done) {
      var number = utils.unpad(stack.pop())
      var diff = utils.bufferToInt(opts.block.header.number) - utils.bufferToInt(number)

      if (diff > 256 || diff <= 0) {
        stack.push(new Buffer([0]))
        done()
        return 
      }

      self.blockchain.getBlockByNumber(number, function (err, block) {
        if (err) return done(err)
        stack.push(block.hash())
        done()
      })
    },
    COINBASE: function () {
      stack.push(opts.block.header.coinbase)
    },
    TIMESTAMP: function () {
      stack.push(opts.block.header.timestamp)
    },
    NUMBER: function () {
      stack.push(opts.block.header.number)
    },
    DIFFICULTY: function () {
      stack.push(opts.block.header.difficulty)
    },
    GASLIMIT: function () {
      stack.push(opts.block.header.gasLimit)
    },
    // 0x50 range - 'storage' and execution
    POP: function () {
      stack.pop()
    },
    MLOAD: function () {
      var pos = utils.bufferToInt(stack.pop())
      var loaded = utils.unpad(memLoad(pos, 32))

      if (loaded === ERROR.OUT_OF_GAS) {
        return loaded
      }

      stack.push(loaded)
    },
    MSTORE: function () {
      var offset = utils.bufferToInt(stack.pop())
      var word = utils.pad(stack.pop(), 32)
      return memStore(offset, word, 0, 32)
    },
    MSTORE8: function () {
      var offset = utils.bufferToInt(stack.pop())
      var byte = stack.pop()
        // grab the last byte
      byte = byte.slice(byte.length - 1)
      return memStore(offset, byte, 0, 1)
    },
    SLOAD: function (done) {
      var key = utils.pad(stack.pop(), 32)

      storageTrie.get(key, function (err, val) {
        var loaded = rlp.decode(val)

        loaded = loaded.length ? loaded : new Buffer([0])
        stack.push(loaded)
        done(err)
      })
    },
    SSTORE: function (done) {
      // memory.store(stack.pop(), stack.pop())
      var key = utils.pad(stack.pop(), 32)
      var val = utils.unpad(stack.pop())

      storageTrie.get(key, function (err, found) {
        if (val.length === 0) {
          // deleting a value
          val = ''
        } else {
          val = rlp.encode(val)
        }

        if (val === '' && !found) {
          gasLeft = gasLeft.sub(new BN(fees.sstoreResetGas.v))
        } else if (val === '' && found) {
          gasLeft = gasLeft.sub(new BN(fees.sstoreResetGas.v))
          gasRefund = gasRefund.add(new BN(fees.sstoreRefundGas.v))
        } else if (val !== '' && !found) {
          gasLeft = gasLeft.sub(new BN(fees.sstoreSetGas.v))
        } else if (val !== '' && found) {
          gasLeft = gasLeft.sub(new BN(fees.sstoreResetGas.v))
        }

        storageTrie.put(key, val, function (err2) {
          // update the stateRoot on the account
          opts.account.stateRoot = storageTrie.root
          done(err || err2)
        })
      })
    },
    JUMP: function () {
      var dest = utils.bufferToInt(stack.pop())

      if (!jumpIsValid(dest)) {
        var err = ERROR.INVALID_JUMP
      }

      pc = dest
      return err
    },
    JUMPI: function () {
      var c = utils.bufferToInt(stack.pop())
      var i = utils.bufferToInt(stack.pop())

      var dest = i ? c : pc

      if (i && !jumpIsValid(dest)) {  
        var err = ERROR.INVALID_JUMP
      }

      pc = dest
      return err
    },
    PC: function () {
      stack.push(utils.intToBuffer(pc - 1))
    },
    MSIZE: function () {
      stack.push(utils.intToBuffer(wordsInMem * 32))
    },
    GAS: function () {
      stack.push(new Buffer(gasLeft.toArray()))
    },
    JUMPDEST: function () {},
    PUSH: function () {
      var numToPush = op - 0x5f
      var loaded = utils.unpad(opts.code.slice(pc, pc + numToPush))

      stack.push(loaded)
      pc += numToPush
    },
    DUP: function () {
      const stackPos = op - 0x7f

      if (stackPos > stack.length) {
        return ERROR.STACK_UNDERFLOW
      }

      // dupilcated stack items point to the same Buffer
      stack.push(stack[stack.length - stackPos])
    },
    SWAP: function () {
      var stackPos = op - 0x8f

      // check the stack to make sure we have enough items on teh stack
      var swapIndex = stack.length - stackPos - 1
      if (swapIndex < 0) {
        return ERROR.STACK_UNDERFLOW
      }

      // preform the swap
      var newTop = stack[swapIndex]
      stack[swapIndex] = stack.pop()
      stack.push(newTop)
    },
    LOG: function () {
      const memOffset = utils.bufferToInt(stack.pop())
      const memLength = utils.bufferToInt(stack.pop())
      const numOfTopics = op - 0xa0
      const mem = memLoad(memOffset, memLength)

      if (mem === ERROR.OUT_OF_GAS) {
        return mem
      }

      if (stack.length < numOfTopics) {
        return ERROR.STACK_UNDERFLOW
      }

      gasLeft.isubn(numOfTopics * fees.logTopicGas.v + memLength * fees.logDataGas.v)

      // add address
      var log = [opts.address]

      // add topics
      var topics = []
      for (var i = 0; i < numOfTopics; i++) {
        topics.push(utils.pad(stack.pop(), 32))
      }

      log.push(topics)

      // add data
      log.push(mem)
      logs.push(log)
    },

    // '0xf0' range - closures
    CREATE: function (done) {
      var value = new BN(stack.pop())
      var offset = utils.bufferToInt(stack.pop())
      var length = utils.bufferToInt(stack.pop())
      // set up config
      var options = {
        value: value,
      }
      var localOpts = {
        inOffset: offset,
        inLength: length,
      }

      makeCall(options, localOpts, done)
    },
    CALL: function (done) {
      var gasLimit = new BN(stack.pop())
      var to = utils.pad(stack.pop(), 20)
      var value = new BN(stack.pop())
      var inOffset = utils.bufferToInt(stack.pop())
      var inLength = utils.bufferToInt(stack.pop())
      var outOffset = utils.bufferToInt(stack.pop())
      var outLength = utils.bufferToInt(stack.pop())
      var data = memLoad(inOffset, inLength)
      var options = {
        gasLimit: gasLimit,
        value: value,
        to: to,
        data: data,
      }
      var localOpts = {
        inOffset: inOffset,
        inLength: inLength,
        outOffset: outOffset,
        outLength: outLength,
      }

      // add stipend
      if (value.cmpn(0) !== 0) {
        gasLeft = gasLeft.sub(new BN(fees.callValueTransferGas.v)).add(new BN(fees.callStipend.v))
        options.gasLimit = options.gasLimit.add(new BN(fees.callStipend.v))
      }

      self.cache.getOrLoad(to, function (err, c, raw) {
        if (!raw) {
          gasLeft = gasLeft.sub(new BN(fees.callNewAccountGas.v))
        }

        makeCall(options, localOpts, done)
      })
    },
    CALLCODE: function (done) {
      const gas = new BN(stack.pop())
      const to = utils.pad(stack.pop(), 20)
      const value = new BN(stack.pop())
      const inOffset = utils.bufferToInt(stack.pop())
      const inLength = utils.bufferToInt(stack.pop())
      const outOffset = utils.bufferToInt(stack.pop())
      const outLength = utils.bufferToInt(stack.pop())

      const options = {
        gasLimit: gas,
        value: value,
        to: opts.address,
      }

      const localOpts = {
        inOffset: inOffset,
        inLength: inLength,
        outOffset: outOffset,
        outLength: outLength,
      }

      // add stipend
      if (value.cmpn(0) !== 0) {
        gasLeft = gasLeft.sub(new BN(fees.callValueTransferGas.v)).add(new BN(fees.callStipend.v))
        options.gasLimit = options.gasLimit.add(new BN(fees.callStipend.v))
      }

      // load the code
      self.cache.getOrLoad(to, function (err, account) {
        if (err) return done(err)
        if (account.isPrecompiled(to)) {
          options.compiled = true
          options.code = self._precomiled[to.toString('hex')]
          makeCall(options, localOpts, done)
        } else {
          account.getCode(self.trie, function (err, code, compiled) {
            if (err) return done(err)
            options.code = code
            options.compiled = compiled
            makeCall(options, localOpts, done)
          })
        }
      })
    },
    RETURN: function () {
      var offset = utils.bufferToInt(stack.pop())
      var length = utils.bufferToInt(stack.pop())

      returnValue = memLoad(offset, length)
      if (returnValue === ERROR.OUT_OF_GAS) {
        return returnValue
      }

      stopped = true
    },
    // '0x70', range - other
    SUICIDE: function (done) {
      suicideTo = utils.pad(stack.pop(), 20)

      // only add to refund if this is the first suicide for the address
      if (!opts.suicides[opts.address.toString('hex')]) {
        gasRefund = gasRefund.add(new BN(fees.suicideRefundGas.v))
      }

      opts.suicides[opts.address.toString('hex')] = suicideTo

      self.cache.getOrLoad(suicideTo, function(err, toAccount){
        // var account = self.cache.get(opts.address)
        toAccount.balance = new Buffer(new BN(opts.account.balance).add(new BN(toAccount.balance)).toArray())
        self.cache.put(suicideTo, toAccount)
        // account.balance = 0
        opts.account.balance = 0
        self.cache.put(opts.address, opts.account)
        done()
      })

      stopped = true
    }
  }

  preprocessValidJumps()

  // iterate through the given ops until something breaks or we hit STOP
  async.whilst(vmIsActive, iterateVm, parseVmResults)

  function vmIsActive() {
    if (gasLeft.cmp(new BN(0)) === -1) {
      vmError = ERROR.OUT_OF_GAS
      return false
    }
    return !stopped && pc < opts.code.length
  }

  function iterateVm(done) {

    if (stack.length > 1024) {
      return done(ERROR.INVALID_OPCODE)
    }

    op = opts.code[pc]
    var opcodeInfo = opcodes(op)
    opcode = opcodeInfo.opcode

    if (opcode === 'INVALID') {
      return done(ERROR.INVALID_OPCODE)
    }

    // get fee, decrment gas left
    var fee = opcodeInfo.fee

    async.series([
      runStepHook,
      runOp,
    ], function (err) {
      // gets ride of recursion in async.whilst for opFuncs that are not async.
      setImmediate(done.bind(null, err))
    })

    function runStepHook(cb) {
      if (self.onStep) {
        self.onStep({
          pc: pc,
          gasLeft: gasLeft,
          opcode: opcodes(op, true),
          storageTrie: storageTrie,
          stack: stack,
          depth: depth,
          address: opts.address,
          account: opts.account,
          memory: memory
        }, cb)
      } else {
        cb()
      }
    }

    function runOp(cb) {
      // calculate gas
      gasLeft = gasLeft.sub(new BN(fee))
      // advance program counter
      pc++

      var opFunc = opFuncs[opcode]

      // check for stack underflows
      if (stack.length < opcodeInfo.in) {
        return cb(ERROR.STACK_UNDERFLOW)
      }

      if (opcodeInfo.async) {
        opFunc(cb)
      } else {
        err = opFunc()
        cb(err)
      }
    }

  }

  function parseVmResults(err) {

    err = vmError || err

    // remove any logs on error
    if (err) {
      logs = []
      storageTries = []
    }

    var results = {
      suicides: opts.suicides,
      suicideTo: suicideTo,
      gasRefund: gasRefund,
      account: opts.account,
      exception: err ? 0 : 1,
      exceptionError: err,
      logs: logs,
      gas: gasLeft,
      storageTries: storageTries,
      "return": returnValue,
    }

    if (results.exceptionError) {
      delete results.gasRefund
    }

    if (err) {
      results.gasUsed = new BN(opts.gasLimit)
    } else {
      results.gasUsed = new BN(opts.gasLimit).sub(gasLeft)
    }

    cb(err, results)
  }


  /**
   * Subtracts the amount needed for memory usage from `gasLeft`
   * @method subMemUsage
   * @param {Number} offset
   * @param {Number} length
   * @return {String}
   */
  function subMemUsage(offset, length) {
    //  abort if no usage
    if (!length) return

    // hacky: if the dataOffset is larger than the largest safeInt then just
    // load 0's because if tx.data did have that amount of data then the fee
    // would be high than the maxGasLimit in the block
    if (offset > MAX_INT || length > MAX_INT) {
      return ERROR.OUT_OF_GAS
    }

    var newWordsInMem = Math.ceil((offset + length) / 32)
    wordsInMem = Math.max(newWordsInMem, wordsInMem)
    var words = new BN(newWordsInMem)
    var fee = new BN(fees.memoryGas.v)
    var quadCoeff = new BN(fees.quadCoeffDiv.v)
    var cost = words.mul(fee).add(words.mul(words).div(quadCoeff))

    if (cost.cmp(lastMemExpCost) === 1) {
      gasLeft.isub(cost.sub(lastMemExpCost))
      lastMemExpCost = cost
    }

    if (gasLeft.cmpn(0) === -1) {
      return ERROR.OUT_OF_GAS
    }
  }

  /**
   * Loads bytes from memory and returns them as a buffer. If an error occurs
   * a string is instead returned. The function also subtracts the amount of
   * gas need for memory expansion.
   * @method memLoad
   * @param {Number} offset where to start reading from
   * @param {Number} length how far to read
   * @return {Buffer|String}
   */
  function memLoad(offset, length) {
    // check to see if we have enougth gas for the mem read
    var err = subMemUsage(offset, length)

    if (err) return err

    var loaded = memory.slice(offset, offset + length)

    // fill the remaining lenth with zeros
    for (var i = loaded.length; i < length; i++) {
      loaded.push(0)
    }

    return new Buffer(loaded)
  }

  /**
   * Stores bytes to memory. If an error occurs a string is instead returned.
   * The function also subtracts the amount of gas need for memory expansion.
   * @method memStore
   * @param {Number} offset where to start reading from
   * @param {Number} length how far to read
   * @return {Buffer|String}
   */
  function memStore(offset, val, valOffset, length) {
    var err = subMemUsage(offset, length)
    if (err) return err
    for (var i = 0; i < length; i++) {
      memory[offset + i] = val[valOffset + i]
    }
  }

  // find all the valid jumps and puts them in the `invalidJumps` array
  function preprocessValidJumps() {
    for (var i = 0; i < opts.code.length; i++) {
      var curOpCode = opcodes(opts.code[i]).opcode

      // no destinations into the middle of PUSH
      if (curOpCode === 'PUSH') {
        i += opts.code[i] - 0x5f
      }

      if (curOpCode === 'JUMPDEST') {
        validJumps.push(i)
      }
    }
  }

  // checks if a jump is valid given a destination
  function jumpIsValid(dest) {
    return validJumps.indexOf(dest) !== -1
  }

  // checks to see if we have enough gas left for the memory reads and writes
  // required by the CALLs
  function checkCallMemCost(callOptions, localOpts) {
    // calculates the gase need for reading the input from memory
    callOptions.data = memLoad(localOpts.inOffset, localOpts.inLength)

    // calculates the gas need for saving the output in memory
    if (localOpts.outLength) {
      var err = subMemUsage(localOpts.outOffset, localOpts.outLength)
    }

    if (!callOptions.gasLimit) {
      callOptions.gasLimit = gasLeft
    }

    if (gasLeft.cmp(callOptions.gasLimit) === -1 || err === ERROR.OUT_OF_GAS || callOptions.data === ERROR.OUT_OF_GAS) {
      return ERROR.OUT_OF_GAS
    }
  }

  // sets up and calls runCall
  function makeCall(callOptions, localOpts, done) {
    callOptions.account = opts.account
    callOptions.caller = opts.address
    callOptions.origin = opts.origin
    callOptions.gasPrice = opts.gasPrice
    callOptions.block = opts.block
    callOptions.populateCache = false
    callOptions.suicides = opts.suicides

    // increment the depth
    callOptions.depth = depth + 1

    var memErr = checkCallMemCost(callOptions, localOpts)
    if (memErr) return done(memErr)

    // check if account has enough ether
    if (depth > constants.MAX_CALL_DEPTH || new BN(opts.account.balance).cmp(callOptions.value) === -1) {
      stack.push(new Buffer([0]))
      done()
    } else {
      // if creating a new contract then increament the nonce
      if (!callOptions.to) {
        opts.account.nonce = new BN(opts.account.nonce).add(new BN(1))
      }
      self.runCall(callOptions, parseCallResults)
    }

    function parseCallResults(err, results) {
      // concat the logs
      if (results.vm.logs) {
        logs = logs.concat(results.vm.logs)
      }

      // add gasRefund
      if (results.vm.gasRefund) {
        gasRefund = gasRefund.add(results.vm.gasRefund)
      }

      gasLeft.isub(new BN(results.gasUsed))
      if (!results.vm.exceptionError) {
        storageTries = storageTries.concat(results.vm.storageTries)

        // save results to memory
        if (results.vm.return) {
          for (var i = 0; i < Math.min(localOpts.outLength, results.vm.return.length); i++) {
            memory[localOpts.outOffset + i] = results.vm.return[i]
          }
        }

        // push the created address to the stack
        if (results.createdAddress) {
          stack.push(results.createdAddress)
        } else {
          stack.push(new Buffer([results.vm.exception]))
        }

        // update stateRoot on current contract
        opts.account = self.cache.get(opts.address)
        storageTrie.root = opts.account.stateRoot
        done()
      } else {
        stack.push(new Buffer([results.vm.exception]))

        // creation failed so don't increament the nonce
        if (results.vm.createdAddress) {
          opts.account.nonce = new BN(opts.account.nonce).sub(new BN(1))
        }

        done(err)
      }
    }

  }

}
