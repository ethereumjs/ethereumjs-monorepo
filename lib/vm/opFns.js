const Buffer = require('safe-buffer').Buffer
const async = require('async')
const utils = require('ethereumjs-util')
const BN = utils.BN
const exceptions = require('../exceptions.js')
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
    if (exponent.isZero()) {
      return new BN(1)
    }
    const byteLength = exponent.byteLength()
    if (byteLength < 1 || byteLength > 32) {
      trap(ERROR.OUT_OF_RANGE)
    }
    const gasPrice = runState._common.param('gasPrices', 'expByte')
    const amount = new BN(byteLength).muln(gasPrice)
    subGas(runState, amount)

    if (base.isZero()) {
      return new BN(0)
    }
    const m = BN.red(utils.TWO_POW256)
    base = base.toRed(m)
    return base.redPow(exponent)
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

    return new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
  },
  SHL: function (a, b, runState) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      return new BN(0)
    }
    return b.shln(a.toNumber()).iand(utils.MAX_INTEGER)
  },
  SHR: function (a, b, runState) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      return new BN(0)
    }
    return b.shrn(a.toNumber())
  },
  SAR: function (a, b, runState) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    const isSigned = b.testn(255)
    if (a.gten(256)) {
      if (isSigned) {
        return new BN(utils.MAX_INTEGER)
      } else {
        return new BN(0)
      }
    }
    const c = b.shrn(a.toNumber())
    if (isSigned) {
      const shiftedOutWidth = 255 - a.toNumber()
      const mask = utils.MAX_INTEGER.shrn(shiftedOutWidth).shln(shiftedOutWidth)
      return c.ior(mask)
    } else {
      return c
    }
  },
  // 0x20 range - crypto
  SHA3: function (offset, length, runState) {
    subMemUsage(runState, offset, length)
    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    // copy fee
    subGas(runState, new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
    return new BN(utils.keccak256(data))
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
    stateManager.getAccount(address, function (err, account) {
      if (err) {
        return cb(err)
      }
      cb(null, new BN(account.balance))
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
    subMemUsage(runState, memOffset, dataLength)
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(dataLength.divCeil(new BN(32))))

    const data = getDataSlice(runState.callData, dataOffset, dataLength)
    memOffset = memOffset.toNumber()
    dataLength = dataLength.toNumber()
    runState.memory.extend(memOffset, dataLength)
    runState.memory.write(memOffset, dataLength, data)
  },
  CODESIZE: function (runState) {
    return new BN(runState.code.length)
  },
  CODECOPY: function (memOffset, codeOffset, length, runState) {
    subMemUsage(runState, memOffset, length)
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))

    const data = getDataSlice(runState.code, codeOffset, length)
    memOffset = memOffset.toNumber()
    length = length.toNumber()
    runState.memory.extend(memOffset, length)
    runState.memory.write(memOffset, length, data)
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
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))

    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err)
      const data = getDataSlice(code, codeOffset, length)
      memOffset = memOffset.toNumber()
      length = length.toNumber()
      runState.memory.extend(memOffset, length)
      runState.memory.write(memOffset, length, data)

      cb(null)
    })
  },
  EXTCODEHASH: function (address, runState, cb) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    var stateManager = runState.stateManager
    address = addressToBuffer(address)

    stateManager.getAccount(address, function (err, account) {
      if (err) return cb(err)

      if (account.isEmpty()) {
        return cb(null, new BN(0))
      }

      stateManager.getContractCode(address, function (err, code) {
        if (err) return cb(err)
        if (code.length === 0) {
          return cb(null, new BN(utils.KECCAK256_NULL))
        }

        return cb(null, new BN(utils.keccak256(code)))
      })
    })
  },
  RETURNDATASIZE: function (runState) {
    return new BN(runState.lastReturned.length)
  },
  RETURNDATACOPY: function (memOffset, returnDataOffset, length, runState) {
    if ((returnDataOffset.add(length)).gtn(runState.lastReturned.length)) {
      trap(ERROR.OUT_OF_GAS)
    }

    subMemUsage(runState, memOffset, length)
    subGas(runState, new BN(runState._common.param('gasPrices', 'copy')).mul(length.divCeil(new BN(32))))

    const data = getDataSlice(utils.toBuffer(runState.lastReturned), returnDataOffset, length)
    memOffset = memOffset.toNumber()
    length = length.toNumber()
    runState.memory.extend(memOffset, length)
    runState.memory.write(memOffset, length, data)
  },
  GASPRICE: function (runState) {
    return new BN(runState.gasPrice)
  },
  // '0x40' range - block operations
  BLOCKHASH: function (number, runState, cb) {
    var blockchain = runState.blockchain
    var diff = new BN(runState.block.header.number).sub(number)

    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      cb(null, new BN(0))
      return
    }

    blockchain.getBlock(number, function (err, block) {
      if (err) return cb(err)
      var blockHash = block.hash()
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
    subMemUsage(runState, pos, new BN(32))
    const word = runState.memory.read(pos.toNumber(), 32)
    return new BN(word)
  },
  MSTORE: function (offset, word, runState) {
    word = word.toArrayLike(Buffer, 'be', 32)
    subMemUsage(runState, offset, new BN(32))
    offset = offset.toNumber()
    runState.memory.extend(offset, 32)
    runState.memory.write(offset, 32, word)
  },
  MSTORE8: function (offset, byte, runState) {
    // NOTE: we're using a 'trick' here to get the least significant byte
    byte = Buffer.from([ byte.andln(0xff) ])
    subMemUsage(runState, offset, new BN(1))
    offset = offset.toNumber()
    runState.memory.extend(offset, 1)
    runState.memory.write(offset, 1, byte)
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

    getContractStorage(runState, address, key, function (err, found) {
      if (err) return cb(err)
      try {
        updateSstoreGas(runState, found, value)
      } catch (e) {
        cb(e.error)
        return
      }

      stateManager.putContractStorage(address, key, value, function (err) {
        if (err) return cb(err)
        stateManager.getAccount(address, function (err, account) {
          if (err) return cb(err)
          runState.contract = account
          cb(null)
        })
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
    subMemUsage(runState, memOffset, memLength)
    let mem = Buffer.alloc(0)
    if (!memLength.isZero()) {
      mem = runState.memory.read(memOffset.toNumber(), memLength.toNumber())
    }
    subGas(runState, new BN(runState._common.param('gasPrices', 'logTopic')).imuln(numOfTopics).iadd(memLength.muln(runState._common.param('gasPrices', 'logData'))))

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

    subMemUsage(runState, offset, length)
    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

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
  CREATE2: function (value, offset, length, salt, runState, done) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }

    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    subMemUsage(runState, offset, length)
    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

    // set up config
    var options = {
      value: value,
      data: data,
      salt: salt.toBuffer('be', 32)
    }

    var localOpts = {
      inOffset: offset,
      inLength: length,
      outOffset: new BN(0),
      outLength: new BN(0)
    }

    // Deduct gas costs for hashing
    subGas(runState, new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
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

    subMemUsage(runState, inOffset, inLength)
    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

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
      subGas(runState, new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }

    stateManager.accountIsEmpty(toAddress, function (err, empty) {
      if (err) {
        done(err)
        return
      }

      if (empty) {
        if (!value.isZero()) {
          try {
            subGas(runState, new BN(runState._common.param('gasPrices', 'callNewAccount')))
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
        runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
        options.gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
      }

      makeCall(runState, options, localOpts, done)
    })
  },
  CALLCODE: function (gas, toAddress, value, inOffset, inLength, outOffset, outLength, runState, done) {
    var stateManager = runState.stateManager
    toAddress = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

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
      subGas(runState, new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }

    checkCallMemCost(runState, options, localOpts)
    checkOutOfGas(runState, options)

    if (!value.isZero()) {
      runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
      options.gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
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

    subMemUsage(runState, inOffset, inLength)
    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

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
    var value = new BN(0)
    toAddress = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

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

    try {
      checkCallMemCost(runState, options, localOpts)
      checkOutOfGas(runState, options)
    } catch (e) {
      done(e.error)
      return
    }

    makeCall(runState, options, localOpts, done)
  },
  RETURN: function (offset, length, runState) {
    subMemUsage(runState, offset, length)
    runState.returnValue = Buffer.alloc(0)
    if (!length.isZero()) {
      runState.returnValue = runState.memory.read(offset.toNumber(), length.toNumber())
    }
  },
  REVERT: function (offset, length, runState) {
    runState.stopped = true
    subMemUsage(runState, offset, length)
    runState.returnValue = Buffer.alloc(0)
    if (!length.isZero()) {
      runState.returnValue = runState.memory.read(offset.toNumber(), length.toNumber())
    }
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
          if (empty) {
            try {
              subGas(runState, new BN(runState._common.param('gasPrices', 'callNewAccount')))
            } catch (e) {
              cb(e.error)
              return
            }
          }
        }

        // only add to refund if this is the first selfdestruct for the address
        if (!runState.selfdestruct[contractAddress.toString('hex')]) {
          runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'selfdestructRefund'))
        }
        runState.selfdestruct[contractAddress.toString('hex')] = selfdestructToAddress
        runState.stopped = true

        var newBalance = new BN(contract.balance).add(new BN(toAccount.balance))
        async.waterfall([
          stateManager.getAccount.bind(stateManager, selfdestructToAddress),
          function (account, cb) {
            account.balance = newBalance
            stateManager.putAccount(selfdestructToAddress, account, cb)
          },
          stateManager.getAccount.bind(stateManager, contractAddress),
          function (account, cb) {
            account.balance = new BN(0)
            stateManager.putAccount(contractAddress, account, cb)
          }
        ], function (err) {
          // The reason for this is to avoid sending an array of results
          cb(err)
        })
      })
    })
  }
}

function describeLocation (runState) {
  var hash = utils.keccak256(runState.code).toString('hex')
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
 * @param {Object} runState
 * @param {BN} offset
 * @param {BN} length
 * @returns {String}
 */
function subMemUsage (runState, offset, length) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return

  const newMemoryWordCount = offset.add(length).divCeil(new BN(32))
  if (newMemoryWordCount.lte(runState.memoryWordCount)) return

  const words = newMemoryWordCount
  const fee = new BN(runState._common.param('gasPrices', 'memory'))
  const quadCoeff = new BN(runState._common.param('gasPrices', 'quadCoeffDiv'))
  // words * 3 + words ^2 / 512
  const cost = words.mul(fee).add(words.mul(words).div(quadCoeff))

  if (cost.gt(runState.highestMemCost)) {
    subGas(runState, cost.sub(runState.highestMemCost))
    runState.highestMemCost = cost
  }

  runState.memoryWordCount = newMemoryWordCount
}

/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 * @param {BN} offset
 * @param {BN} length
 * @param {Buffer} data
 */
function getDataSlice (data, offset, length) {
  let len = new BN(data.length)
  if (offset.gt(len)) {
    offset = len
  }

  let end = offset.add(length)
  if (end.gt(len)) {
    end = len
  }

  data = data.slice(offset.toNumber(), end.toNumber())
  // Right-pad with zeros to fill dataLength bytes
  data = utils.setLengthRight(data, length.toNumber())

  return data
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
  var selfdestruct = Object.assign({}, runState.selfdestruct)
  callOptions.caller = callOptions.caller || runState.address
  callOptions.origin = runState.origin
  callOptions.gasPrice = runState.gasPrice
  callOptions.block = runState.block
  callOptions.static = callOptions.static || false
  callOptions.selfdestruct = selfdestruct
  callOptions.storageReader = runState.storageReader

  // increment the runState.depth
  callOptions.depth = runState.depth + 1

  // empty the return data buffer
  runState.lastReturned = Buffer.alloc(0)

  // check if account has enough ether
  // Note: in the case of delegatecall, the value is persisted and doesn't need to be deducted again
  if (runState.depth >= runState._common.param('vm', 'stackLimit') || (callOptions.delegatecall !== true && new BN(runState.contract.balance).lt(callOptions.value))) {
    cb(null, new BN(0))
  } else {
    // if creating a new contract then increament the nonce
    if (!callOptions.to) {
      runState.contract.nonce = new BN(runState.contract.nonce).addn(1)
    }

    runState.stateManager.putAccount(runState.address, runState.contract, function (err) {
      if (err) return cb(err)
      runState._vm.runCall(callOptions, parseCallResults)
    })
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
      if (results.vm.return.length > 0) {
        const data = getDataSlice(results.vm.return, new BN(0), localOpts.outLength)
        const memOffset = localOpts.outOffset.toNumber()
        const dataLength = localOpts.outLength.toNumber()
        runState.memory.extend(memOffset, dataLength)
        runState.memory.write(memOffset, dataLength, data)
      }

      if (results.vm.exceptionError && results.vm.exceptionError.error === ERROR.REVERT && isCreateOpCode(runState.opName)) {
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
      Object.assign(runState.selfdestruct, selfdestruct)
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
      // creation failed so don't increment the nonce
      if (results.vm.createdAddress) {
        runState.contract.nonce = new BN(runState.contract.nonce).subn(1)
      }

      cb(null, new BN(results.vm.exception))
    }
  }
}

function isCreateOpCode (opName) {
  return opName === 'CREATE' || opName === 'CREATE2'
}

function getContractStorage (runState, address, key, cb) {
  if (runState._common.hardfork() === 'constantinople') {
    runState.storageReader.getContractStorage(address, key, cb)
  } else {
    runState.stateManager.getContractStorage(address, key, cb)
  }
}

function updateSstoreGas (runState, found, value) {
  if (runState._common.hardfork() === 'constantinople') {
    var original = found.original
    var current = found.current
    if (current.equals(value)) {
      // If current value equals new value (this is a no-op), 200 gas is deducted.
      subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreNoopGas')))
      return
    }
    // If current value does not equal new value
    if (original.equals(current)) {
      // If original value equals current value (this storage slot has not been changed by the current execution context)
      if (original.length === 0) {
        // If original value is 0, 20000 gas is deducted.
        return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreInitGas')))
      }
      if (value.length === 0) {
        // If new value is 0, add 15000 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreClearRefund'))
      }
      // Otherwise, 5000 gas is deducted.
      return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')))
    }
    // If original value does not equal current value (this storage slot is dirty), 200 gas is deducted. Apply both of the following clauses.
    if (original.length !== 0) {
      // If original value is not 0
      if (current.length === 0) {
        // If current value is 0 (also means that new value is not 0), remove 15000 gas from refund counter. We can prove that refund counter will never go below 0.
        runState.gasRefund = runState.gasRefund.subn(runState._common.param('gasPrices', 'netSstoreClearRefund'))
      } else if (value.length === 0) {
        // If new value is 0 (also means that current value is not 0), add 15000 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreClearRefund'))
      }
    }
    if (original.equals(value)) {
      // If original value equals new value (this storage slot is reset)
      if (original.length === 0) {
        // If original value is 0, add 19800 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreResetClearRefund'))
      } else {
        // Otherwise, add 4800 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreResetRefund'))
      }
    }
    return subGas(runState, new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')))
  } else {
    if (value.length === 0 && !found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')))
    } else if (value.length === 0 && found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')))
      runState.gasRefund.iaddn(runState._common.param('gasPrices', 'sstoreRefund'))
    } else if (value.length !== 0 && !found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreSet')))
    } else if (value.length !== 0 && found.length) {
      subGas(runState, new BN(runState._common.param('gasPrices', 'sstoreReset')))
    }
  }
}
