const async = require('async')
const fees = require('ethereum-common')
const utils = require('ethereumjs-util')
const BN = utils.BN
const rlp = utils.rlp
const constants = require('./constants.js')
const logTable = require('./logTable.js')
const ERROR = constants.ERROR
const MAX_INT = 9007199254740991

// the opcode functions
module.exports = {
  STOP: function (runState) {
    runState.stopped = true
  },
  ADD: function (a, b, runState) {
    runState.stack.push(
      new Buffer(
        new BN(a)
          .add(new BN(b))
          .mod(utils.TWO_POW256)
          .toArray())
    )
  },
  MUL: function (a, b, runState) {
    runState.stack.push(
      new Buffer(
        new BN(a)
          .mul(new BN(b)).mod(utils.TWO_POW256)
          .toArray()
      ))
  },
  SUB: function (a, b, runState) {
    runState.stack.push(
      utils.toUnsigned(
        new BN(a)
          .sub(new BN(b))
      )
    )
  },
  DIV: function (a, b, runState) {
    a = new BN(a)
    b = new BN(b)
    var r
    if (b.toString() === '0') {
      r = [0]
    } else {
      r = a.div(b).toArray()
    }
    runState.stack.push(new Buffer(r))
  },
  SDIV: function (a, b, runState) {
    a = utils.fromSigned(a)
    b = utils.fromSigned(b)

    var r
    if (b.toString() === '0') {
      r = new Buffer([0])
    } else {
      r = utils.toUnsigned(a.div(b))
    }

    runState.stack.push(r)
  },
  MOD: function (a, b, runState) {
    a = new BN(a)
    b = new BN(b)
    var r

    if (b.toString() === '0') {
      r = [0]
    } else {
      r = a.mod(b).toArray()
    }

    runState.stack.push(new Buffer(r))
  },
  SMOD: function (a, b, runState) {
    a = utils.fromSigned(a)
    b = utils.fromSigned(b)
    var r

    if (b.toString() === '0') {
      r = new Buffer([0])
    } else {
      r = a.abs().mod(b.abs())
      if (a.sign) {
        r = r.neg()
      }

      r = utils.toUnsigned(r)
    }
    runState.stack.push(r)
  },
  ADDMOD: function (a, b, c, runState) {
    a = new BN(a).add(new BN(b))
    c = new BN(c)
    var r

    if (c.toString() === '0') {
      r = [0]
    } else {
      r = a.mod(c).toArray()
    }

    runState.stack.push(
      new Buffer(r)
    )
  },
  MULMOD: function (a, b, c, runState) {
    a = new BN(a).mul(new BN(b))
    c = new BN(c)
    var r

    if (c.toString() === '0') {
      r = [0]
    } else {
      r = a.mod(c).toArray()
    }

    runState.stack.push(new Buffer(r))
  },
  EXP: function (base, exponent, runState) {
    base = new BN(base)
    exponent = new BN(exponent)
    var m = BN.red(utils.TWO_POW256)
    var result

    base = base.toRed(m)

    if (exponent.cmpn(0) !== 0) {
      var bytes = 1 + logTable(exponent)
      runState.gasLeft.isub(new BN(bytes).mul(new BN(fees.expByteGas.v)))
      result = new Buffer(base.redPow(exponent).toArray())
    } else {
      result = new Buffer([1])
    }

    runState.stack.push(result)
  },
  SIGNEXTEND: function (k, runState) {
    k = new BN(k)
    var extendOnes = false

    if (k.cmpn(31) <= 0) {
      var val = new Buffer(32)
      utils.pad(runState.stack.pop(), 32).copy(val)

      if (val[31 - k] & 0x80) {
        extendOnes = true
      }

      // 31-k-1 since k-th byte shouldn't be modified
      for (var i = 30 - k; i >= 0; i--) {
        val[i] = extendOnes ? 0xff : 0
      }

      runState.stack.push(val)
    }
  },
  // 0x10 range - bit ops
  LT: function (a, b, runState) {
    runState.stack.push(
      new Buffer([
        new BN(a)
          .cmp(new BN(b)) === -1
      ])
    )
  },
  GT: function (a, b, runState) {
    runState.stack.push(
      new Buffer([
        new BN(a)
          .cmp(new BN(b)) === 1
      ])
    )
  },
  SLT: function (a, b, runState) {
    runState.stack.push(
      new Buffer([
        utils.fromSigned(a)
          .cmp(utils.fromSigned(b)) === -1
      ])
    )
  },
  SGT: function (a, b, runState) {
    runState.stack.push(
      new Buffer([
        utils.fromSigned(a)
          .cmp(utils.fromSigned(b)) === 1
      ])
    )
  },
  EQ: function (a, b, runState) {
    a = utils.unpad(a)
    b = utils.unpad(b)
    runState.stack.push(new Buffer([a.toString('hex') === b.toString('hex')]))
  },
  ISZERO: function (a, runState) {
    a = utils.bufferToInt(a)
    runState.stack.push(new Buffer([!a]))
  },
  AND: function (a, b, runState) {
    runState.stack.push(
      new Buffer((
      new BN(a)
        .and(
          new BN(b)
      )
        )
        .toArray())
    )
  },
  OR: function (a, b, runState) {
    runState.stack.push(
      new Buffer((
      new BN(a)
        .or(
          new BN(b)
      )
        )
        .toArray())
    )
  },
  XOR: function (a, b, runState) {
    runState.stack.push(
      new Buffer((
      new BN(a)
        .xor(
          new BN(b)
      )
        )
        .toArray())
    )
  },
  NOT: function (a, runState) {
    runState.stack.push(
      new Buffer(utils.TWO_POW256.subn(1).sub(new BN(a))
        .toArray())
    )
  },
  BYTE: function (pos, word, runState) {
    pos = utils.bufferToInt(pos)
    word = utils.pad(word, 32)
    var byte

    if (pos < 32) {
      byte = utils.intToBuffer(word[pos])
    } else {
      byte = new Buffer([0])
    }

    runState.stack.push(byte)
  },
  // 0x20 range - crypto
  SHA3: function (offset, length, runState) {
    offset = utils.bufferToInt(offset)
    length = utils.bufferToInt(length)
    var data = memLoad(runState, offset, length)
    if (data === ERROR.OUT_OF_GAS) return data

    // TODO: copy fee
    runState.gasLeft.isubn(fees.sha3WordGas.v * Math.ceil(length / 32))
    if (runState.gasLeft.cmpn(0) === -1) {
      trap(runState, ERROR.OUT_OF_GAS)
      return
    }
    runState.stack.push(utils.sha3(data))
  },
  // 0x30 range - closure state
  ADDRESS: function (runState) {
    runState.stack.push(runState.address)
  },
  BALANCE: function (address, runState, cb) {
    var stateManager = runState.stateManager
    address = address.slice(-20)

    // shortcut if current account
    if (address.toString('hex') === runState.address.toString('hex')) {
      runState.stack.push(runState.contract.balance)
      cb()
      return
    }

    // otherwise load account then return balance
    stateManager.getAccountBalance(address, function (err, balance) {
      if (err) {
        trap(runState, err)
        return cb()
      }
      runState.stack.push(balance)
      cb()
    })
  },
  ORIGIN: function (runState) {
    runState.stack.push(runState.origin)
  },
  CALLER: function (runState) {
    runState.stack.push(runState.caller)
  },
  CALLVALUE: function (runState) {
    runState.stack.push(new Buffer(runState.callValue.toArray()))
  },
  CALLDATALOAD: function (pos, runState) {
    pos = utils.bufferToInt(pos)
    var loaded = runState.callData.slice(pos, pos + 32)

    loaded = loaded.length ? loaded : new Buffer([0])

    // pad end
    if (loaded.length < 32) {
      var dif = 32 - loaded.length
      var pad = new Buffer(dif)
      pad.fill(0)
      loaded = Buffer.concat([loaded, pad], 32)
    }

    runState.stack.push(loaded)
  },
  CALLDATASIZE: function (runState) {
    if (runState.callData.length === 1 && runState.callData[0] === 0) {
      runState.stack.push(new Buffer([0]))
    } else {
      runState.stack.push(utils.intToBuffer(runState.callData.length))
    }
  },
  CALLDATACOPY: function (memOffset, dataOffsetBuf, dataLength, runState) {
    memOffset = utils.bufferToInt(memOffset)
    dataLength = utils.bufferToInt(dataLength)
    var dataOffset = utils.bufferToInt(dataOffsetBuf)

    var err = memStore(runState, memOffset, runState.callData, dataOffset, dataLength)
    if (err) {
      trap(runState, err)
      return
    }
    // sub the COPY fee
    runState.gasLeft.isub(new BN(Number(fees.copyGas.v) * Math.ceil(dataLength / 32)))
  },
  CODESIZE: function (runState) {
    runState.stack.push(utils.intToBuffer(runState.code.length))
  },
  CODECOPY: function (memOffset, codeOffset, length, runState) {
    memOffset = utils.bufferToInt(memOffset)
    codeOffset = utils.bufferToInt(codeOffset)
    length = utils.bufferToInt(length)

    var err = memStore(runState, memOffset, runState.code, codeOffset, length)
    if (err) {
      trap(runState, err)
      return
    }
    // sub the COPY fee
    runState.gasLeft.isubn(fees.copyGas.v * Math.ceil(length / 32))
  },
  EXTCODESIZE: function (address, runState, cb) {
    var stateManager = runState.stateManager
    address = address.slice(-20)
    stateManager.getContractCode(address, function (err, code) {
      if (err) {
        trap(runState, err)
        cb()
        return
      }
      runState.stack.push(utils.intToBuffer(code.length))
      cb()
    })
  },
  EXTCODECOPY: function (address, memOffset, codeOffset, length, runState, cb) {
    var stateManager = runState.stateManager
    address = address.slice(-20)
    memOffset = utils.bufferToInt(memOffset)
    codeOffset = utils.bufferToInt(codeOffset)
    length = utils.bufferToInt(length)

    stateManager.getContractCode(address, function (err, code) {
      code = err ? new Buffer([0]) : code
      err = memStore(runState, memOffset, code, codeOffset, length)
      if (err) {
        trap(runState, err)
        cb()
        return
      }

      // sub the COPY fee
      var fee = new BN(Number(fees.copyGas.v) * Math.ceil(length / 32))
      runState.gasLeft.isub(fee)
      cb()
    })
  },
  GASPRICE: function (runState) {
    runState.stack.push(runState.gasPrice)
  },
  // '0x40' range - block operations
  BLOCKHASH: function (number, runState, cb) {
    var stateManager = runState.stateManager
    number = utils.bufferToInt(number)
    var diff = utils.bufferToInt(runState.block.header.number) - utils.bufferToInt(number)

    // block lookups must be within the past 256 blocks
    if (diff > 256 || diff <= 0) {
      runState.stack.push(new Buffer([0]))
      cb()
      return
    }

    stateManager.getBlockHash(number, function (err, blockHash) {
      if (err) {
        trap(runState, err)
        cb()
        return
      }
      runState.stack.push(blockHash)
      cb()
    })
  },
  COINBASE: function (runState) {
    runState.stack.push(runState.block.header.coinbase)
  },
  TIMESTAMP: function (runState) {
    runState.stack.push(runState.block.header.timestamp)
  },
  NUMBER: function (runState) {
    runState.stack.push(runState.block.header.number)
  },
  DIFFICULTY: function (runState) {
    runState.stack.push(runState.block.header.difficulty)
  },
  GASLIMIT: function (runState) {
    runState.stack.push(runState.block.header.gasLimit)
  },
  // 0x50 range - 'storage' and execution
  POP: function () {},
  MLOAD: function (pos, runState) {
    pos = utils.bufferToInt(pos)
    var loaded = utils.unpad(memLoad(runState, pos, 32))

    if (loaded === ERROR.OUT_OF_GAS) {
      trap(runState, loaded)
      return
    }

    runState.stack.push(loaded)
  },
  MSTORE: function (offset, word, runState) {
    offset = utils.bufferToInt(offset)
    word = utils.pad(word, 32)
    var err = memStore(runState, offset, word, 0, 32)
    if (err) {
      trap(runState, err)
    }
  },
  MSTORE8: function (offset, byte, runState) {
    offset = utils.bufferToInt(offset)
    // grab the last byte
    byte = byte.slice(byte.length - 1)
    var err = memStore(runState, offset, byte, 0, 1)
    if (err) {
      trap(runState, err)
    }
  },
  SLOAD: function (key, runState, cb) {
    var stateManager = runState.stateManager
    key = utils.pad(key, 32)

    stateManager.getContractStorage(runState.address, key, function (err, value) {
      if (err) {
        trap(runState, err)
        cb()
        return
      }
      var loaded = rlp.decode(value)
      loaded = loaded.length ? loaded : new Buffer([0])
      runState.stack.push(loaded)
      cb()
    })
  },
  SSTORE: function (key, val, runState, cb) {
    var stateManager = runState.stateManager
    var address = runState.address
    key = utils.pad(key, 32)
    var value = utils.unpad(val)

    // format input
    if (value.length === 0) {
      // deleting a value
      // set empty buffer to empty string
      value = ''
    } else {
      value = rlp.encode(value)
    }

    stateManager.getContractStorage(runState.address, key, function (err, found) {
      if (err) {
        trap(runState, err)
        cb()
        return
      }
      // calculate gas cost
      if (value === '' && !found) {
        runState.gasLeft.isub(new BN(fees.sstoreResetGas.v))
      } else if (value === '' && found) {
        runState.gasLeft.isub(new BN(fees.sstoreResetGas.v))
        runState.gasRefund.iadd(new BN(fees.sstoreRefundGas.v))
      } else if (value !== '' && !found) {
        runState.gasLeft.isub(new BN(fees.sstoreSetGas.v))
      } else if (value !== '' && found) {
        runState.gasLeft.isub(new BN(fees.sstoreResetGas.v))
      }

      stateManager.putContractStorage(address, key, value, function () {
        runState.contract = stateManager.cache.get(address)
        cb()
      })
    })
  },
  JUMP: function (dest, runState) {
    dest = utils.bufferToInt(dest)

    if (!jumpIsValid(runState, dest)) {
      trap(runState, ERROR.INVALID_JUMP)
      return
    }

    runState.programCounter = dest
  },
  JUMPI: function (c, i, runState) {
    c = utils.bufferToInt(c)
    i = utils.bufferToInt(i)

    var dest = i ? c : runState.programCounter

    if (i && !jumpIsValid(runState, dest)) {
      trap(runState, ERROR.INVALID_JUMP)
    }

    runState.programCounter = dest
  },
  PC: function (runState) {
    runState.stack.push(utils.intToBuffer(runState.programCounter - 1))
  },
  MSIZE: function (runState) {
    runState.stack.push(utils.intToBuffer(runState.memoryWordCount * 32))
  },
  GAS: function (runState) {
    runState.stack.push(new Buffer(runState.gasLeft.toArray()))
  },
  JUMPDEST: function (runState) {},
  PUSH: function (runState) {
    var numToPush = runState.opCode - 0x5f
    var loaded = utils.unpad(runState.code.slice(runState.programCounter, runState.programCounter + numToPush))

    runState.stack.push(loaded)
    runState.programCounter += numToPush
  },
  DUP: function (runState) {
    const stackPos = runState.opCode - 0x7f

    if (stackPos > runState.stack.length) {
      trap(runState, ERROR.STACK_UNDERFLOW)
      return
    }

    // dupilcated stack items point to the same Buffer
    runState.stack.push(runState.stack[runState.stack.length - stackPos])
  },
  SWAP: function (runState) {
    var stackPos = runState.opCode - 0x8f

    // check the stack to make sure we have enough items on teh stack
    var swapIndex = runState.stack.length - stackPos - 1
    if (swapIndex < 0) {
      trap(runState, ERROR.STACK_UNDERFLOW)
      return
    }

    // preform the swap
    var newTop = runState.stack[swapIndex]
    runState.stack[swapIndex] = runState.stack.pop()
    runState.stack.push(newTop)
  },
  LOG: function (memOffset, memLength) {
    var args = Array.prototype.slice.call(arguments, 0)
    args.pop() // pop off callback
    var runState = args.pop()
    var topics = args.slice(2)
    topics = topics.map(function (a) {
      return utils.pad(a, 32)
    })

    memOffset = utils.bufferToInt(memOffset)
    memLength = utils.bufferToInt(memLength)
    const numOfTopics = runState.opCode - 0xa0
    const mem = memLoad(runState, memOffset, memLength)

    if (mem === ERROR.OUT_OF_GAS) {
      trap(runState, mem)
      return
    }

    runState.gasLeft.isubn(numOfTopics * fees.logTopicGas.v + memLength * fees.logDataGas.v)

    // add address
    var log = [runState.address]
    log.push(topics)

    // add data
    log.push(mem)
    runState.logs.push(log)
  },

  // '0xf0' range - closures
  CREATE: function (value, offset, length, runState, done) {
    value = new BN(value)
    offset = utils.bufferToInt(offset)
    length = utils.bufferToInt(length)
    // set up config
    var options = {
      value: value
    }
    var localOpts = {
      inOffset: offset,
      inLength: length
    }

    makeCall(runState, options, localOpts, done)
  },
  CALL: function (gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    gasLimit = new BN(gasLimit)
    toAddress = utils.pad(toAddress, 20)
    value = new BN(value)
    inOffset = utils.bufferToInt(inOffset)
    inLength = utils.bufferToInt(inLength)
    outOffset = utils.bufferToInt(outOffset)
    outLength = utils.bufferToInt(outLength)
    var data = memLoad(runState, inOffset, inLength)
    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data
    }
    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    // add stipend
    if (value.cmpn(0) !== 0) {
      runState.gasLeft.isub(new BN(fees.callValueTransferGas.v)).iadd(new BN(fees.callStipend.v))
      options.gasLimit.iadd(new BN(fees.callStipend.v))
    }

    stateManager.getAccount(toAddress, function (err, account, exists) {
      if (err) {
        done(err)
        return
      }
      if (!exists) {
        runState.gasLeft.isub(new BN(fees.callNewAccountGas.v))
      }
      makeCall(runState, options, localOpts, done)
    })
  },
  CALLCODE: function (gas, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    gas = new BN(gas)
    toAddress = utils.pad(toAddress, 20)
    value = new BN(value)
    inOffset = utils.bufferToInt(inOffset)
    inLength = utils.bufferToInt(inLength)
    outOffset = utils.bufferToInt(outOffset)
    outLength = utils.bufferToInt(outLength)

    const options = {
      gasLimit: gas,
      value: value,
      to: runState.address
    }

    const localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    // add stipend
    if (value.cmpn(0) !== 0) {
      runState.gasLeft.isub(new BN(fees.callValueTransferGas.v)).iadd(new BN(fees.callStipend.v))
      options.gasLimit.iadd(new BN(fees.callStipend.v))
    }

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err)
      if (account.isPrecompiled(toAddress)) {
        options.compiled = true
        options.code = runState._precomiled[toAddress.toString('hex')]
        makeCall(runState, options, localOpts, done)
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err)
          options.code = code
          options.compiled = compiled
          makeCall(runState, options, localOpts, done)
        })
      }
    })
  },
  RETURN: function (offset, length, runState) {
    offset = utils.bufferToInt(offset)
    length = utils.bufferToInt(length)

    runState.returnValue = memLoad(runState, offset, length)
    if (runState.returnValue === ERROR.OUT_OF_GAS) {
      trap(runState, runState.returnValue)
      return
    }
  },
  // '0x70', range - other
  SUICIDE: function (suicideToAddress, runState, cb) {
    var stateManager = runState.stateManager
    var contract = runState.contract
    var contractAddress = runState.address
    suicideToAddress = utils.pad(suicideToAddress, 20)

    // only add to refund if this is the first suicide for the address
    if (!runState.suicides[contractAddress.toString('hex')]) {
      runState.gasRefund = runState.gasRefund.add(new BN(fees.suicideRefundGas.v))
    }

    runState.suicideTo = suicideToAddress
    runState.suicides[contractAddress.toString('hex')] = suicideToAddress
    runState.stopped = true

    stateManager.getAccount(suicideToAddress, function (err, toAccount) {
      // update balances
      if (err) {
        cb(err)
        return
      }
      var newBalance = new Buffer(new BN(contract.balance).add(new BN(toAccount.balance)).toArray())
      async.series([
        stateManager.putAccountBalance.bind(stateManager, suicideToAddress, newBalance),
        stateManager.putAccountBalance.bind(stateManager, contractAddress, new BN(0))
      ], cb)
    })
  }
}

function subGas (amount) {}

function trap (runState, err) {
  runState.vmError = err
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 * @method subMemUsage
 * @param {Number} offset
 * @param {Number} length
 * @return {String}
 */
function subMemUsage (runState, offset, length) {
  //  abort if no usage
  if (!length) return

  // hacky: if the dataOffset is larger than the largest safeInt then just
  // load 0's because if tx.data did have that amount of data then the fee
  // would be high than the maxGasLimit in the block
  if (offset > MAX_INT || length > MAX_INT) {
    return ERROR.OUT_OF_GAS
  }

  var newMemoryWordCount = Math.ceil((offset + length) / 32)
  runState.memoryWordCount = Math.max(newMemoryWordCount, runState.memoryWordCount)
  var words = new BN(newMemoryWordCount)
  var fee = new BN(fees.memoryGas.v)
  var quadCoeff = new BN(fees.quadCoeffDiv.v)
  var cost = words.mul(fee).add(words.mul(words).div(quadCoeff))

  if (cost.cmp(runState.highestMemCost) === 1) {
    runState.gasLeft.isub(cost.sub(runState.highestMemCost))
    runState.highestMemCost = cost
  }

  if (runState.gasLeft.cmpn(0) === -1) {
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
function memLoad (runState, offset, length) {
  // check to see if we have enougth gas for the mem read
  var err = subMemUsage(runState, offset, length)

  if (err) return err

  var loaded = runState.memory.slice(offset, offset + length)

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
function memStore (runState, offset, val, valOffset, length) {
  var err = subMemUsage(runState, offset, length)
  if (err) return err
  for (var i = 0; i < length; i++) {
    runState.memory[offset + i] = val[valOffset + i]
  }
}

// checks if a jump is valid given a destination
function jumpIsValid (runState, dest) {
  return runState.validJumps.indexOf(dest) !== -1
}

// checks to see if we have enough gas left for the memory reads and writes
// required by the CALLs
function checkCallMemCost (runState, callOptions, localOpts) {
  // calculates the gase need for reading the input from memory
  callOptions.data = memLoad(runState, localOpts.inOffset, localOpts.inLength)

  // calculates the gas need for saving the output in memory
  if (localOpts.outLength) {
    var err = subMemUsage(runState, localOpts.outOffset, localOpts.outLength)
  }

  if (!callOptions.gasLimit) {
    callOptions.gasLimit = runState.gasLeft
  }

  if (runState.gasLeft.cmp(callOptions.gasLimit) === -1 || err === ERROR.OUT_OF_GAS || callOptions.data === ERROR.OUT_OF_GAS) {
    return ERROR.OUT_OF_GAS
  }
}

// sets up and calls runCall
function makeCall (runState, callOptions, localOpts, cb) {
  callOptions.caller = runState.address
  callOptions.origin = runState.origin
  callOptions.gasPrice = runState.gasPrice
  callOptions.block = runState.block
  callOptions.populateCache = false
  callOptions.suicides = runState.suicides

  // increment the runState.depth
  callOptions.depth = runState.depth + 1

  var memErr = checkCallMemCost(runState, callOptions, localOpts)
  if (memErr) return cb(memErr)

  // check if account has enough ether
  if (runState.depth >= fees.stackLimit.v || new BN(runState.contract.balance).cmp(callOptions.value) === -1) {
    runState.stack.push(new Buffer([0]))
    cb()
  } else {
    // if creating a new contract then increament the nonce
    if (!callOptions.to) {
      runState.contract.nonce = new BN(runState.contract.nonce).addn(1)
    }

    runState.stateManager.cache.put(runState.address, runState.contract)
    runState._vm.runCall(callOptions, parseCallResults)
  }

  function parseCallResults (err, results) {
    // concat the runState.logs
    if (results.vm.logs) {
      runState.logs = runState.logs.concat(results.vm.logs)
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      runState.gasRefund = runState.gasRefund.add(results.vm.gasRefund)
    }

    runState.gasLeft.isub(results.gasUsed)

    if (!results.vm.exceptionError) {
      // save results to memory
      if (results.vm.return) {
        for (var i = 0; i < Math.min(localOpts.outLength, results.vm.return.length); i++) {
          runState.memory[localOpts.outOffset + i] = results.vm.return[i]
        }
      }

      // push the created address to the stack
      if (results.createdAddress) {
        runState.stack.push(results.createdAddress)
      } else {
        runState.stack.push(new Buffer([results.vm.exception]))
      }

      // update stateRoot on current contract
      runState.stateManager.getAccount(runState.address, function (err, account) {
        if (err) return cb(err)
        runState.contract = account
        cb()
      })
    } else {
      runState.stack.push(new Buffer([results.vm.exception]))

      // creation failed so don't increament the nonce
      if (results.vm.createdAddress) {
        runState.contract.nonce = new BN(runState.contract.nonce).sub(new BN(1))
      }

      cb(err)
    }
  }
}
