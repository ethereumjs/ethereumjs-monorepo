const Buffer = require('safe-buffer').Buffer
const async = require('async')
const fees = require('ethereum-common')
const utils = require('ethereumjs-util')
const BN = utils.BN
const exceptions = require('./exceptions.js')
const logTable = require('./logTable.js')
const ERROR = exceptions.ERROR
const VmError = exceptions.VmError
const MASK_160 = new BN(1).shln(160).subn(1)

// Find Ceil(`this` / `num`)
BN.prototype.divCeil = function divCeil (num) {
  var dm = this.divmod(num)

  // Fast case - exact division
  if (dm.mod.isZero()) return dm.div

  // Round up
  return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1)
}

function addressToBuffer (address) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}

// the opcode functions
module.exports = {
  STOP: function (runState) {
    runState.stopped = true
  },
  ADD: function (a, b, runState) {
    return a.add(b).mod(utils.TWO_POW256)
  },
  MUL: function (a, b, runState) {
    return a.mul(b).mod(utils.TWO_POW256)
  },
  SUB: function (a, b, runState) {
    return a.sub(b).toTwos(256)
  },
  DIV: function (a, b, runState) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      return a.div(b)
    }
  },
  SDIV: function (a, b, runState) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      a = a.fromTwos(256)
      b = b.fromTwos(256)
      return a.div(b).toTwos(256)
    }
  },
  MOD: function (a, b, runState) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      return a.mod(b)
    }
  },
  SMOD: function (a, b, runState) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      a = a.fromTwos(256)
      b = b.fromTwos(256)
      var r = a.abs().mod(b.abs())
      if (a.isNeg()) {
        r = r.ineg()
      }
      return r.toTwos(256)
    }
  },
  ADDMOD: function (a, b, c, runState) {
    if (c.isZero()) {
      return new BN(c)
    } else {
      return a.add(b).mod(c)
    }
  },
  MULMOD: function (a, b, c, runState) {
    if (c.isZero()) {
      return new BN(c)
    } else {
      return a.mul(b).mod(c)
    }
  },
  EXP: function (base, exponent, runState) {
    var m = BN.red(utils.TWO_POW256)

    base = base.toRed(m)

    if (!exponent.isZero()) {
      var bytes = 1 + logTable(exponent)
      subGas(runState, new BN(bytes).muln(fees.expByteGas.v))
      return base.redPow(exponent)
    } else {
      return new BN(1)
    }
  },
  SIGNEXTEND: function (k, val, runState) {
    val = val.toArrayLike(Buffer, 'be', 32)
    var extendOnes = false

    if (k.lten(31)) {
      k = k.toNumber()

      if (val[31 - k] & 0x80) {
        extendOnes = true
      }

      // 31-k-1 since k-th byte shouldn't be modified
      for (var i = 30 - k; i >= 0; i--) {
        val[i] = extendOnes ? 0xff : 0
      }
    }

    return new BN(val)
  },
  // 0x10 range - bit ops
  LT: function (a, b, runState) {
    return new BN(a.lt(b) ? 1 : 0)
  },
  GT: function (a, b, runState) {
    return new BN(a.gt(b) ? 1 : 0)
  },
  SLT: function (a, b, runState) {
    return new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0)
  },
  SGT: function (a, b, runState) {
    return new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0)
  },
  EQ: function (a, b, runState) {
    return new BN(a.eq(b) ? 1 : 0)
  },
  ISZERO: function (a, runState) {
    return new BN(a.isZero() ? 1 : 0)
  },
  AND: function (a, b, runState) {
    return a.and(b)
  },
  OR: function (a, b, runState) {
    return a.or(b)
  },
  XOR: function (a, b, runState) {
    return a.xor(b)
  },
  NOT: function (a, runState) {
    return a.notn(256)
  },
  BYTE: function (pos, word, runState) {
    if (pos.gten(32)) {
      return new BN(0)
    }

    pos = pos.toNumber()
    word = word.toArrayLike(Buffer, 'be', 32)
    word = utils.setLengthLeft(word, 32)

    return new BN(word[pos])
  },
  // 0x20 range - crypto
  SHA3: function (offset, length, runState) {
    var data = memLoad(runState, offset, length)
    // copy fee
    subGas(runState, new BN(fees.sha3WordGas.v).imul(length.divCeil(new BN(32))))
    return new BN(utils.sha3(data))
  },
  // 0x30 range - closure state
  ADDRESS: function (runState) {
    return new BN(runState.address)
  },
  BALANCE: function (address, runState, cb) {
    var stateManager = runState.stateManager
    // stack to address
    address = addressToBuffer(address)

    // shortcut if current account
    if (address.toString('hex') === runState.address.toString('hex')) {
      cb(null, new BN(runState.contract.balance))
      return
    }

    // otherwise load account then return balance
    stateManager.getAccountBalance(address, function (err, value) {
      if (err) {
        return cb(err)
      }
      cb(null, new BN(value))
    })
  },
  ORIGIN: function (runState) {
    return new BN(runState.origin)
  },
  CALLER: function (runState) {
    return new BN(runState.caller)
  },
  CALLVALUE: function (runState) {
    return new BN(runState.callValue)
  },
  CALLDATALOAD: function (pos, runState) {
    if (pos.gtn(runState.callData.length)) {
      return new BN(0)
    } else {
      pos = pos.toNumber()
      var loaded = runState.callData.slice(pos, pos + 32)
      loaded = loaded.length ? loaded : Buffer.from([0])
      return new BN(utils.setLengthRight(loaded, 32))
    }
  },
  CALLDATASIZE: function (runState) {
    if (runState.callData.length === 1 && runState.callData[0] === 0) {
      return new BN(0)
    } else {
      return new BN(runState.callData.length)
    }
  },
  CALLDATACOPY: function (memOffset, dataOffset, dataLength, runState) {
    memStore(runState, memOffset, runState.callData, dataOffset, dataLength)
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).imul(dataLength.divCeil(new BN(32))))
  },
  CODESIZE: function (runState) {
    return new BN(runState.code.length)
  },
  CODECOPY: function (memOffset, codeOffset, length, runState) {
    memStore(runState, memOffset, runState.code, codeOffset, length)
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).imul(length.divCeil(new BN(32))))
  },
  EXTCODESIZE: function (address, runState, cb) {
    var stateManager = runState.stateManager
    address = addressToBuffer(address)
    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err)
      cb(null, new BN(code.length))
    })
  },
  EXTCODECOPY: function (address, memOffset, codeOffset, length, runState, cb) {
    var stateManager = runState.stateManager
    address = addressToBuffer(address)

    // FIXME: for some reason this must come before subGas
    subMemUsage(runState, memOffset, length)
    // copy fee
    subGas(runState, new BN(fees.copyGas.v).imul(length.divCeil(new BN(32))))

    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err)
      memStore(runState, memOffset, code, codeOffset, length, false)
      cb(null)
    })
  },
  RETURNDATASIZE: function (runState) {
    return new BN(runState.lastReturned.length)
  },
  RETURNDATACOPY: function (memOffset, returnDataOffset, length, runState) {
    if ((returnDataOffset.add(length)).gtn(runState.lastReturned.length)) {
      trap(ERROR.OUT_OF_GAS)
    }

    memStore(runState, memOffset, utils.toBuffer(runState.lastReturned), returnDataOffset, length, false)
    // sub the COPY fee
    subGas(runState, new BN(fees.copyGas.v).mul(length.divCeil(new BN(32))))
  },
  GASPRICE: function (runState) {
    return new BN(runState.gasPrice)
  },
  // '0x40' range - block operations
  BLOCKHASH: function (number, runState, cb) {
    var stateManager = runState.stateManager
    var diff = new BN(runState.block.header.number).sub(number)

    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      cb(null, new BN(0))
      return
    }

    stateManager.getBlockHash(number.toArrayLike(Buffer, 'be', 32), function (err, blockHash) {
      if (err) return cb(err)
      cb(null, new BN(blockHash))
    })
  },
  COINBASE: function (runState) {
    return new BN(runState.block.header.coinbase)
  },
  TIMESTAMP: function (runState) {
    return new BN(runState.block.header.timestamp)
  },
  NUMBER: function (runState) {
    return new BN(runState.block.header.number)
  },
  DIFFICULTY: function (runState) {
    return new BN(runState.block.header.difficulty)
  },
  GASLIMIT: function (runState) {
    return new BN(runState.block.header.gasLimit)
  },
  // 0x50 range - 'storage' and execution
  POP: function () {},
  MLOAD: function (pos, runState) {
    return new BN(memLoad(runState, pos, new BN(32)))
  },
  MSTORE: function (offset, word, runState) {
    word = word.toArrayLike(Buffer, 'be', 32)
    memStore(runState, offset, word, new BN(0), new BN(32))
  },
  MSTORE8: function (offset, byte, runState) {
    // NOTE: we're using a 'trick' here to get the least significant byte
    byte = Buffer.from([ byte.andln(0xff) ])
    memStore(runState, offset, byte, new BN(0), new BN(1))
  },
  SLOAD: function (key, runState, cb) {
    var stateManager = runState.stateManager
    key = key.toArrayLike(Buffer, 'be', 32)

    stateManager.getContractStorage(runState.address, key, function (err, value) {
      if (err) return cb(err)
      value = value.length ? new BN(value) : new BN(0)
      cb(null, value)
    })
  },
  SSTORE: function (key, val, runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }
    var stateManager = runState.stateManager
    var address = runState.address
    key = key.toArrayLike(Buffer, 'be', 32)
    // NOTE: this should be the shortest representation
    var value
    if (val.isZero()) {
      value = Buffer.from([])
    } else {
      value = val.toArrayLike(Buffer, 'be')
    }

    stateManager.getContractStorage(runState.address, key, function (err, found) {
      if (err) return cb(err)
      try {
        if (value.length === 0 && !found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v))
        } else if (value.length === 0 && found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v))
          runState.gasRefund.iaddn(fees.sstoreRefundGas.v)
        } else if (value.length !== 0 && !found.length) {
          subGas(runState, new BN(fees.sstoreSetGas.v))
        } else if (value.length !== 0 && found.length) {
          subGas(runState, new BN(fees.sstoreResetGas.v))
        }
      } catch (e) {
        cb(e.error)
        return
      }

      stateManager.putContractStorage(address, key, value, function (err) {
        if (err) return cb(err)
        runState.contract = stateManager.cache.get(address)
        cb(null)
      })
    })
  },
  JUMP: function (dest, runState) {
    if (dest.gtn(runState.code.length)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    dest = dest.toNumber()

    if (!jumpIsValid(runState, dest)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    runState.programCounter = dest
  },
  JUMPI: function (dest, cond, runState) {
    if (!cond.isZero()) {
      if (dest.gtn(runState.code.length)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      dest = dest.toNumber()

      if (!jumpIsValid(runState, dest)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      runState.programCounter = dest
    }
  },
  PC: function (runState) {
    return new BN(runState.programCounter - 1)
  },
  MSIZE: function (runState) {
    return runState.memoryWordCount.muln(32)
  },
  GAS: function (runState) {
    return new BN(runState.gasLeft)
  },
  JUMPDEST: function (runState) {},
  PUSH: function (runState) {
    const numToPush = runState.opCode - 0x5f
    const loaded = new BN(runState.code.slice(runState.programCounter, runState.programCounter + numToPush).toString('hex'), 16)
    runState.programCounter += numToPush
    return loaded
  },
  DUP: function (runState) {
    // NOTE: this function manipulates the stack directly!

    const stackPos = runState.opCode - 0x7f
    if (stackPos > runState.stack.length) {
      trap(ERROR.STACK_UNDERFLOW)
    }
    // create a new copy
    return new BN(runState.stack[runState.stack.length - stackPos])
  },
  SWAP: function (runState) {
    // NOTE: this function manipulates the stack directly!

    var stackPos = runState.opCode - 0x8f

    // check the stack to make sure we have enough items on teh stack
    var swapIndex = runState.stack.length - stackPos - 1
    if (swapIndex < 0) {
      trap(ERROR.STACK_UNDERFLOW)
    }

    // preform the swap
    var topIndex = runState.stack.length - 1
    var tmp = runState.stack[topIndex]
    runState.stack[topIndex] = runState.stack[swapIndex]
    runState.stack[swapIndex] = tmp
  },
  LOG: function (memOffset, memLength) {
    var args = Array.prototype.slice.call(arguments, 0)
    var runState = args.pop()
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    var topics = args.slice(2)
    topics = topics.map(function (a) {
      return a.toArrayLike(Buffer, 'be', 32)
    })

    const numOfTopics = runState.opCode - 0xa0
    const mem = memLoad(runState, memOffset, memLength)
    subGas(runState, new BN(fees.logTopicGas.v).imuln(numOfTopics).iadd(memLength.muln(fees.logDataGas.v)))

    // add address
    var log = [runState.address]
    log.push(topics)

    // add data
    log.push(mem)
    runState.logs.push(log)
  },

  // '0xf0' range - closures
  CREATE: function (value, offset, length, runState, done) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    var data = memLoad(runState, offset, length)

    // set up config
    var options = {
      value: value,
      data: data
    }

    var localOpts = {
      inOffset: offset,
      inLength: length,
      outOffset: new BN(0),
      outLength: new BN(0)
    }

    checkCallMemCost(runState, options, localOpts)
    checkOutOfGas(runState, options)
    makeCall(runState, options, localOpts, done)
  },
  CALL: function (gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    toAddress = addressToBuffer(toAddress)

    if (runState.static && !value.isZero()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    var data = memLoad(runState, inOffset, inLength)

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: runState.static
    }

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    if (!value.isZero()) {
      subGas(runState, new BN(fees.callValueTransferGas.v))
    }

    stateManager.exists(toAddress, function (err, exists) {
      if (err) {
        done(err)
        return
      }

      stateManager.accountIsEmpty(toAddress, function (err, empty) {
        if (err) {
          done(err)
          return
        }

        if (!exists || empty) {
          if (!value.isZero()) {
            try {
              subGas(runState, new BN(fees.callNewAccountGas.v))
            } catch (e) {
              done(e.error)
              return
            }
          }
        }

        try {
          checkCallMemCost(runState, options, localOpts)
          checkOutOfGas(runState, options)
        } catch (e) {
          done(e.error)
          return
        }

        if (!value.isZero()) {
          runState.gasLeft.iaddn(fees.callStipend.v)
          options.gasLimit.iaddn(fees.callStipend.v)
        }

        makeCall(runState, options, localOpts, done)
      })
    })
  },
  CALLCODE: function (gas, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    toAddress = addressToBuffer(toAddress)

    var data = memLoad(runState, inOffset, inLength)

    const options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      static: runState.static
    }

    const localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    if (!value.isZero()) {
      subGas(runState, new BN(fees.callValueTransferGas.v))
    }

    checkCallMemCost(runState, options, localOpts)
    checkOutOfGas(runState, options)

    if (!value.isZero()) {
      runState.gasLeft.iaddn(fees.callStipend.v)
      options.gasLimit.iaddn(fees.callStipend.v)
    }

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err)
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true
        options.code = runState._precompiled[toAddress.toString('hex')]
        makeCall(runState, options, localOpts, done)
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err)
          options.compiled = compiled || false
          options.code = code
          makeCall(runState, options, localOpts, done)
        })
      }
    })
  },
  DELEGATECALL: function (gas, toAddress, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    var value = runState.callValue
    toAddress = addressToBuffer(toAddress)

    var data = memLoad(runState, inOffset, inLength)

    const options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: runState.address,
      caller: runState.caller,
      delegatecall: true,
      static: runState.static
    }

    const localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    checkCallMemCost(runState, options, localOpts)
    checkOutOfGas(runState, options)

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err)
      if (runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true
        options.code = runState._precompiled[toAddress.toString('hex')]
        makeCall(runState, options, localOpts, done)
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err)
          options.compiled = compiled || false
          options.code = code
          makeCall(runState, options, localOpts, done)
        })
      }
    })
  },
  STATICCALL: function (gasLimit, toAddress, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    var value = new BN(0)
    toAddress = addressToBuffer(toAddress)

    var data = memLoad(runState, inOffset, inLength)

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: true
    }

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    stateManager.exists(toAddress, function (err, exists) {
      if (err) {
        done(err)
        return
      }

      stateManager.accountIsEmpty(toAddress, function (err, empty) {
        if (err) {
          done(err)
          return
        }

        try {
          checkCallMemCost(runState, options, localOpts)
          checkOutOfGas(runState, options)
        } catch (e) {
          done(e.error)
          return
        }

        makeCall(runState, options, localOpts, done)
      })
    })
  },
  RETURN: function (offset, length, runState) {
    runState.returnValue = memLoad(runState, offset, length)
  },
  REVERT: function (offset, length, runState) {
    runState.stopped = true
    runState.returnValue = memLoad(runState, offset, length)
    trap(ERROR.REVERT)
  },
  // '0x70', range - other
  SELFDESTRUCT: function (selfdestructToAddress, runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }
    var stateManager = runState.stateManager
    var contract = runState.contract
    var contractAddress = runState.address
    selfdestructToAddress = addressToBuffer(selfdestructToAddress)

    stateManager.getAccount(selfdestructToAddress, function (err, toAccount) {
      // update balances
      if (err) {
        cb(err)
        return
      }

      stateManager.accountIsEmpty(selfdestructToAddress, function (error, empty) {
        if (error) {
          cb(error)
          return
        }

        if ((new BN(contract.balance)).gtn(0)) {
          if (!toAccount.exists || empty) {
            try {
              subGas(runState, new BN(fees.callNewAccountGas.v))
            } catch (e) {
              cb(e.error)
              return
            }
          }
        }

        // only add to refund if this is the first selfdestruct for the address
        if (!runState.selfdestruct[contractAddress.toString('hex')]) {
          runState.gasRefund = runState.gasRefund.addn(fees.suicideRefundGas.v)
        }
        runState.selfdestruct[contractAddress.toString('hex')] = selfdestructToAddress
        runState.stopped = true

        var newBalance = new BN(contract.balance).add(new BN(toAccount.balance))
        async.series([
          stateManager.putAccountBalance.bind(stateManager, selfdestructToAddress, newBalance),
          stateManager.putAccountBalance.bind(stateManager, contractAddress, new BN(0))
        ], function (err) {
          // The reason for this is to avoid sending an array of results
          cb(err)
        })
      })
    })
  }
}

module.exports._DC = module.exports.DELEGATECALL

function describeLocation (runState) {
  var hash = utils.sha3(runState.code).toString('hex')
  var address = runState.address.toString('hex')
  var pc = runState.programCounter - 1
  return hash + '/' + address + ':' + pc
}

function subGas (runState, amount) {
  runState.gasLeft.isub(amount)
  if (runState.gasLeft.ltn(0)) {
    runState.gasLeft = new BN(0)
    trap(ERROR.OUT_OF_GAS)
  }
}

function trap (err) {
  throw new VmError(err)
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 * @method subMemUsage
 * @param {BN} offset
 * @param {BN} length
 * @return {String}
 */
function subMemUsage (runState, offset, length) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return

  const newMemoryWordCount = offset.add(length).divCeil(new BN(32))
  if (newMemoryWordCount.lte(runState.memoryWordCount)) return

  const words = newMemoryWordCount
  const fee = new BN(fees.memoryGas.v)
  const quadCoeff = new BN(fees.quadCoeffDiv.v)
  // words * 3 + words ^2 / 512
  const cost = words.mul(fee).add(words.mul(words).div(quadCoeff))

  if (cost.gt(runState.highestMemCost)) {
    subGas(runState, cost.sub(runState.highestMemCost))
    runState.highestMemCost = cost
  }

  runState.memoryWordCount = newMemoryWordCount
}

/**
 * Loads bytes from memory and returns them as a buffer. If an error occurs
 * a string is instead returned. The function also subtracts the amount of
 * gas need for memory expansion.
 * @method memLoad
 * @param {BN} offset where to start reading from
 * @param {BN} length how far to read
 * @return {Buffer|String}
 */
function memLoad (runState, offset, length) {
  // check to see if we have enougth gas for the mem read
  subMemUsage(runState, offset, length)

  // shortcut
  if (length.isZero()) {
    return Buffer.alloc(0)
  }

  // NOTE: in theory this could overflow, but unlikely due to OOG above
  offset = offset.toNumber()
  length = length.toNumber()

  var loaded = runState.memory.slice(offset, offset + length)
  // fill the remaining lenth with zeros
  for (var i = loaded.length; i < length; i++) {
    loaded[i] = 0
  }
  return Buffer.from(loaded)
}

/**
 * Stores bytes to memory. If an error occurs a string is instead returned.
 * The function also subtracts the amount of gas need for memory expansion.
 * @method memStore
 * @param {BN} offset where to start reading from
 * @param {Buffer} val
 * @param {BN} valOffset
 * @param {BN} length how far to read
 * @param {Boolean} skipSubMem
 * @return {Buffer|String}
 */
function memStore (runState, offset, val, valOffset, length, skipSubMem) {
  if (skipSubMem !== false) {
    subMemUsage(runState, offset, length)
  }

  // shortcut
  if (length.isZero()) {
    return
  }

  // NOTE: in theory this could overflow, but unlikely due to OOG above
  offset = offset.toNumber()
  length = length.toNumber()

  var safeLen = 0
  if (valOffset.addn(length).gtn(val.length)) {
    if (valOffset.gten(val.length)) {
      safeLen = 0
    } else {
      valOffset = valOffset.toNumber()
      safeLen = val.length - valOffset
    }
  } else {
    valOffset = valOffset.toNumber()
    safeLen = val.length
  }

  let i = 0
  if (safeLen > 0) {
    safeLen = safeLen > length ? length : safeLen
    for (; i < safeLen; i++) {
      runState.memory[offset + i] = val[valOffset + i]
    }
  }

  /*
    pad the remaining length with zeros IF AND ONLY IF a value was stored
    (even if value offset > value length, strange spec...)
  */
  if (val.length > 0 && i < length) {
    for (; i < length; i++) {
      runState.memory[offset + i] = 0
    }
  }
}

// checks if a jump is valid given a destination
function jumpIsValid (runState, dest) {
  return runState.validJumps.indexOf(dest) !== -1
}

// checks to see if we have enough gas left for the memory reads and writes
// required by the CALLs
function checkCallMemCost (runState, callOptions, localOpts) {
  // calculates the gas need for saving the output in memory
  subMemUsage(runState, localOpts.outOffset, localOpts.outLength)

  if (!callOptions.gasLimit) {
    callOptions.gasLimit = new BN(runState.gasLeft)
  }
}

function checkOutOfGas (runState, callOptions) {
  const gasAllowed = runState.gasLeft.sub(runState.gasLeft.divn(64))
  if (callOptions.gasLimit.gt(gasAllowed)) {
    callOptions.gasLimit = gasAllowed
  }
}

// sets up and calls runCall
function makeCall (runState, callOptions, localOpts, cb) {
  callOptions.caller = callOptions.caller || runState.address
  callOptions.origin = runState.origin
  callOptions.gasPrice = runState.gasPrice
  callOptions.block = runState.block
  callOptions.populateCache = false
  callOptions.static = callOptions.static || false
  callOptions.selfdestruct = runState.selfdestruct

  // increment the runState.depth
  callOptions.depth = runState.depth + 1

  // empty the return data buffer
  runState.lastReturned = Buffer.alloc(0)

  // check if account has enough ether
  // Note: in the case of delegatecall, the value is persisted and doesn't need to be deducted again
  if (runState.depth >= fees.stackLimit.v || (callOptions.delegatecall !== true && new BN(runState.contract.balance).lt(callOptions.value))) {
    cb(null, new BN(0))
  } else {
    // if creating a new contract then increament the nonce
    if (!callOptions.to) {
      runState.contract.nonce = new BN(runState.contract.nonce).addn(1)
    }

    runState.stateManager.cache.put(runState.address, runState.contract)
    runState._vm.runCall(callOptions, parseCallResults)
  }

  function parseCallResults (err, results) {
    if (err) return cb(err)

    // concat the runState.logs
    if (results.vm.logs) {
      runState.logs = runState.logs.concat(results.vm.logs)
    }

    // add gasRefund
    if (results.vm.gasRefund) {
      runState.gasRefund = runState.gasRefund.add(results.vm.gasRefund)
    }

    // this should always be safe
    runState.gasLeft.isub(results.gasUsed)

    // save results to memory
    if (results.vm.return && (!results.vm.exceptionError || results.vm.exceptionError.error === ERROR.REVERT)) {
      memStore(runState, localOpts.outOffset, results.vm.return, new BN(0), localOpts.outLength, false)

      if (results.vm.exceptionError && results.vm.exceptionError.error === ERROR.REVERT && runState.opName === 'CREATE') {
        runState.lastReturned = results.vm.return
      }

      switch (runState.opName) {
        case 'CALL':
        case 'CALLCODE':
        case 'DELEGATECALL':
        case 'STATICCALL':
          runState.lastReturned = results.vm.return
          break
      }
    }

    if (!results.vm.exceptionError) {
      // update stateRoot on current contract
      runState.stateManager.getAccount(runState.address, function (err, account) {
        if (err) return cb(err)

        runState.contract = account
        // push the created address to the stack
        if (results.createdAddress) {
          cb(null, new BN(results.createdAddress))
        } else {
          cb(null, new BN(results.vm.exception))
        }
      })
    } else {
      // creation failed so don't increament the nonce
      if (results.vm.createdAddress) {
        runState.contract.nonce = new BN(runState.contract.nonce).subn(1)
      }

      cb(null, new BN(results.vm.exception))
    }
  }
}
