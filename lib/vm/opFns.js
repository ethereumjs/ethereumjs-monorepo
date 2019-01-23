const Buffer = require('safe-buffer').Buffer
const async = require('async')
const utils = require('ethereumjs-util')
const BN = utils.BN
const exceptions = require('../exceptions.js')
const logTable = require('./logTable.js')
const ERROR = exceptions.ERROR
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
  STOP: function (eei) {
    eei.stop()
  },
  ADD: function (a, b, eei) {
    return a.add(b).mod(utils.TWO_POW256)
  },
  MUL: function (a, b, eei) {
    return a.mul(b).mod(utils.TWO_POW256)
  },
  SUB: function (a, b, eei) {
    return a.sub(b).toTwos(256)
  },
  DIV: function (a, b, eei) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      return a.div(b)
    }
  },
  SDIV: function (a, b, eei) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      a = a.fromTwos(256)
      b = b.fromTwos(256)
      return a.div(b).toTwos(256)
    }
  },
  MOD: function (a, b, eei) {
    if (b.isZero()) {
      return new BN(b)
    } else {
      return a.mod(b)
    }
  },
  SMOD: function (a, b, eei) {
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
  ADDMOD: function (a, b, c, eei) {
    if (c.isZero()) {
      return new BN(c)
    } else {
      return a.add(b).mod(c)
    }
  },
  MULMOD: function (a, b, c, eei) {
    if (c.isZero()) {
      return new BN(c)
    } else {
      return a.mul(b).mod(c)
    }
  },
  EXP: function (base, exponent, eei) {
    if (exponent.isZero()) {
      return new BN(1)
    } else {
      var bytes = 1 + logTable(exponent)
      const gasAmount = new BN(bytes).muln(eei._runState._common.param('gasPrices', 'expByte'))
      eei.subGas(gasAmount)

      var m = BN.red(utils.TWO_POW256)
      base = base.toRed(m)
      return base.redPow(exponent)
    }
  },
  SIGNEXTEND: function (k, val, eei) {
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
  LT: function (a, b, eei) {
    return new BN(a.lt(b) ? 1 : 0)
  },
  GT: function (a, b, eei) {
    return new BN(a.gt(b) ? 1 : 0)
  },
  SLT: function (a, b, eei) {
    return new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0)
  },
  SGT: function (a, b, eei) {
    return new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0)
  },
  EQ: function (a, b, eei) {
    return new BN(a.eq(b) ? 1 : 0)
  },
  ISZERO: function (a, eei) {
    return new BN(a.isZero() ? 1 : 0)
  },
  AND: function (a, b, eei) {
    return a.and(b)
  },
  OR: function (a, b, eei) {
    return a.or(b)
  },
  XOR: function (a, b, eei) {
    return a.xor(b)
  },
  NOT: function (a, eei) {
    return a.notn(256)
  },
  BYTE: function (pos, word, eei) {
    if (pos.gten(32)) {
      return new BN(0)
    }

    return new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
  },
  SHL: function (a, b, eei) {
    if (!eei._runState._common.gteHardfork('constantinople')) {
      eei.trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      return new BN(0)
    }
    return b.shln(a.toNumber()).iand(utils.MAX_INTEGER)
  },
  SHR: function (a, b, eei) {
    if (!eei._runState._common.gteHardfork('constantinople')) {
      eei.trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      return new BN(0)
    }
    return b.shrn(a.toNumber())
  },
  SAR: function (a, b, eei) {
    if (!eei._runState._common.gteHardfork('constantinople')) {
      eei.trap(ERROR.INVALID_OPCODE)
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
  SHA3: function (offset, length, eei) {
    var data = eei.memLoad(offset, length)
    // copy fee
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
    return new BN(utils.keccak256(data))
  },
  // 0x30 range - closure state
  ADDRESS: function (eei) {
    return new BN(eei.getAddress())
  },
  BALANCE: function (address, eei, cb) {
    var stateManager = eei._runState.stateManager
    // stack to address
    address = addressToBuffer(address)

    // shortcut if current account
    if (address.toString('hex') === eei.getAddress().toString('hex')) {
      cb(null, new BN(eei._runState.contract.balance))
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
  ORIGIN: function (eei) {
    return new BN(eei.getTxOrigin())
  },
  CALLER: function (eei) {
    return new BN(eei.getCaller())
  },
  CALLVALUE: function (eei) {
    return new BN(eei.getCallValue())
  },
  CALLDATALOAD: function (pos, eei) {
    if (pos.gtn(eei._runState.callData.length)) {
      return new BN(0)
    } else {
      pos = pos.toNumber()
      var loaded = eei._runState.callData.slice(pos, pos + 32)
      loaded = loaded.length ? loaded : Buffer.from([0])
      return new BN(utils.setLengthRight(loaded, 32))
    }
  },
  CALLDATASIZE: function (eei) {
    const callData = eei.getCallData()
    if (callData.length === 1 && callData[0] === 0) {
      return new BN(0)
    } else {
      return new BN(callData.length)
    }
  },
  CALLDATACOPY: function (memOffset, dataOffset, dataLength, eei) {
    eei.memStore(memOffset, eei.getCallData(), dataOffset, dataLength)
    // sub the COPY fee
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'copy')).imul(dataLength.divCeil(new BN(32))))
  },
  CODESIZE: function (eei) {
    return new BN(eei.getCodeSize())
  },
  CODECOPY: function (memOffset, codeOffset, length, eei) {
    eei.memStore(memOffset, eei.getCode(), codeOffset, length)
    // sub the COPY fee
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))
  },
  EXTCODESIZE: function (address, eei, cb) {
    var stateManager = eei._runState.stateManager
    address = addressToBuffer(address)
    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err)
      cb(null, new BN(code.length))
    })
  },
  EXTCODECOPY: function (address, memOffset, codeOffset, length, eei, cb) {
    var stateManager = eei._runState.stateManager
    address = addressToBuffer(address)

    // FIXME: for some reason this must come before subGas
    eei.subMemUsage(memOffset, length)
    // copy fee
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))

    stateManager.getContractCode(address, function (err, code) {
      if (err) return cb(err)
      eei.memStore(memOffset, code, codeOffset, length, false)
      cb(null)
    })
  },
  EXTCODEHASH: function (address, eei, cb) {
    if (!eei._runState._common.gteHardfork('constantinople')) {
      eei.trap(ERROR.INVALID_OPCODE)
    }
    var stateManager = eei._runState.stateManager
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
  RETURNDATASIZE: function (eei) {
    return new BN(eei.getReturnDataSize())
  },
  RETURNDATACOPY: function (memOffset, returnDataOffset, length, eei) {
    if ((returnDataOffset.add(length)).gtn(eei.getReturnDataSize())) {
      eei.trap(ERROR.OUT_OF_GAS)
    }

    eei.memStore(memOffset, utils.toBuffer(eei.getReturnDataSize()), returnDataOffset, length, false)
    // sub the COPY fee
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'copy')).mul(length.divCeil(new BN(32))))
  },
  GASPRICE: function (eei) {
    return new BN(eei.getTxGasPrice())
  },
  // '0x40' range - block operations
  BLOCKHASH: function (number, eei, cb) {
    var blockchain = eei._runState.blockchain
    var diff = new BN(eei.getBlockNumber()).sub(number)

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
  COINBASE: function (eei) {
    return new BN(eei.getBlockCoinbase())
  },
  TIMESTAMP: function (eei) {
    return new BN(eei.getBlockTimestamp())
  },
  NUMBER: function (eei) {
    return new BN(eei.getBlockNumber())
  },
  DIFFICULTY: function (eei) {
    return new BN(eei.getBlockDifficulty())
  },
  GASLIMIT: function (eei) {
    return new BN(eei.getBlockGasLimit())
  },
  // 0x50 range - 'storage' and execution
  POP: function () {},
  MLOAD: function (pos, eei) {
    return new BN(eei.memLoad(pos, new BN(32)))
  },
  MSTORE: function (offset, word, eei) {
    word = word.toArrayLike(Buffer, 'be', 32)
    eei.memStore(offset, word, new BN(0), new BN(32))
  },
  MSTORE8: function (offset, byte, eei) {
    // NOTE: we're using a 'trick' here to get the least significant byte
    byte = Buffer.from([ byte.andln(0xff) ])
    eei.memStore(offset, byte, new BN(0), new BN(1))
  },
  SLOAD: function (key, eei, cb) {
    var stateManager = eei._runState.stateManager
    key = key.toArrayLike(Buffer, 'be', 32)

    stateManager.getContractStorage(eei.getAddress(), key, function (err, value) {
      if (err) return cb(err)
      value = value.length ? new BN(value) : new BN(0)
      cb(null, value)
    })
  },
  SSTORE: function (key, val, eei, cb) {
    if (eei._runState.static) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }
    var stateManager = eei._runState.stateManager
    var address = eei.getAddress()
    key = key.toArrayLike(Buffer, 'be', 32)
    // NOTE: this should be the shortest representation
    var value
    if (val.isZero()) {
      value = Buffer.from([])
    } else {
      value = val.toArrayLike(Buffer, 'be')
    }

    eei.getContractStorage(address, key, function (err, found) {
      if (err) return cb(err)
      try {
        eei.updateSstoreGas(found, value)
      } catch (e) {
        cb(e.error)
        return
      }

      stateManager.putContractStorage(address, key, value, function (err) {
        if (err) return cb(err)
        stateManager.getAccount(address, function (err, account) {
          if (err) return cb(err)
          eei._runState.contract = account
          cb(null)
        })
      })
    })
  },
  JUMP: function (dest, eei) {
    if (dest.gtn(eei.getCodeSize())) {
      eei.trap(ERROR.INVALID_JUMP + ' at ' + eei.describeLocation())
    }

    dest = dest.toNumber()

    if (!eei.jumpIsValid(dest)) {
      eei.trap(ERROR.INVALID_JUMP + ' at ' + eei.describeLocation())
    }

    eei._runState.programCounter = dest
  },
  JUMPI: function (dest, cond, eei) {
    if (!cond.isZero()) {
      if (dest.gtn(eei.getCodeSize())) {
        eei.trap(ERROR.INVALID_JUMP + ' at ' + eei.describeLocation())
      }

      dest = dest.toNumber()

      if (!eei.jumpIsValid(dest)) {
        eei.trap(ERROR.INVALID_JUMP + ' at ' + eei.describeLocation())
      }

      eei._runState.programCounter = dest
    }
  },
  PC: function (eei) {
    return new BN(eei._runState.programCounter - 1)
  },
  MSIZE: function (eei) {
    return eei._runState.memoryWordCount.muln(32)
  },
  GAS: function (eei) {
    return new BN(eei.getGasLeft())
  },
  JUMPDEST: function (eei) {},
  PUSH: function (eei) {
    const numToPush = eei._runState.opCode - 0x5f
    const loaded = new BN(eei.getCode().slice(eei._runState.programCounter, eei._runState.programCounter + numToPush).toString('hex'), 16)
    eei._runState.programCounter += numToPush
    return loaded
  },
  DUP: function (eei) {
    // NOTE: this function manipulates the stack directly!

    const stackPos = eei._runState.opCode - 0x7f
    if (stackPos > eei._runState.stack.length) {
      eei.trap(ERROR.STACK_UNDERFLOW)
    }
    // create a new copy
    return new BN(eei._runState.stack[eei._runState.stack.length - stackPos])
  },
  SWAP: function (eei) {
    // NOTE: this function manipulates the stack directly!

    var stackPos = eei._runState.opCode - 0x8f

    // check the stack to make sure we have enough items on teh stack
    var swapIndex = eei._runState.stack.length - stackPos - 1
    if (swapIndex < 0) {
      eei.trap(ERROR.STACK_UNDERFLOW)
    }

    // preform the swap
    var topIndex = eei._runState.stack.length - 1
    var tmp = eei._runState.stack[topIndex]
    eei._runState.stack[topIndex] = eei._runState.stack[swapIndex]
    eei._runState.stack[swapIndex] = tmp
  },
  LOG: function (memOffset, memLength) {
    var args = Array.prototype.slice.call(arguments, 0)
    var eei = args.pop()
    if (eei._runState.static) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }

    var topics = args.slice(2)
    topics = topics.map(function (a) {
      return a.toArrayLike(Buffer, 'be', 32)
    })

    const numOfTopics = eei._runState.opCode - 0xa0
    const mem = eei.memLoad(memOffset, memLength)
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'logTopic')).imuln(numOfTopics).iadd(memLength.muln(eei._runState._common.param('gasPrices', 'logData'))))

    // add address
    var log = [eei.getAddress()]
    log.push(topics)

    // add data
    log.push(mem)
    eei._runState.logs.push(log)
  },

  // '0xf0' range - closures
  CREATE: function (value, offset, length, eei, done) {
    if (eei._runState.static) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }

    var data = eei.memLoad(offset, length)

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

    eei.checkCallMemCost(options, localOpts)
    eei.checkOutOfGas(options)
    eei.makeCall(options, localOpts, done)
  },
  CREATE2: function (value, offset, length, salt, eei, done) {
    if (!eei._runState._common.gteHardfork('constantinople')) {
      eei.trap(ERROR.INVALID_OPCODE)
    }

    if (eei._runState.static) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }

    var data = eei.memLoad(offset, length)

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
    eei.subGas(new BN(eei._runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
    eei.checkCallMemCost(options, localOpts)
    eei.checkOutOfGas(options)
    eei.makeCall(options, localOpts, done)
  },
  CALL: function (gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength, eei, done) {
    var stateManager = eei._runState.stateManager
    toAddress = addressToBuffer(toAddress)

    if (eei._runState.static && !value.isZero()) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }

    var data = eei.memLoad(inOffset, inLength)

    var options = {
      gasLimit: gasLimit,
      value: value,
      to: toAddress,
      data: data,
      static: eei._runState.static
    }

    var localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    if (!value.isZero()) {
      eei.subGas(new BN(eei._runState._common.param('gasPrices', 'callValueTransfer')))
    }

    stateManager.accountIsEmpty(toAddress, function (err, empty) {
      if (err) {
        done(err)
        return
      }

      if (empty) {
        if (!value.isZero()) {
          try {
            eei.subGas(new BN(eei._runState._common.param('gasPrices', 'callNewAccount')))
          } catch (e) {
            done(e.error)
            return
          }
        }
      }

      try {
        eei.checkCallMemCost(options, localOpts)
        eei.checkOutOfGas(options)
      } catch (e) {
        done(e.error)
        return
      }

      if (!value.isZero()) {
        eei.getGasLeft().iaddn(eei._runState._common.param('gasPrices', 'callStipend'))
        options.gasLimit.iaddn(eei._runState._common.param('gasPrices', 'callStipend'))
      }

      eei.makeCall(options, localOpts, done)
    })
  },
  CALLCODE: function (gas, toAddress, value, inOffset, inLength, outOffset, outLength, eei, done) {
    var stateManager = eei._runState.stateManager
    toAddress = addressToBuffer(toAddress)

    var data = eei.memLoad(inOffset, inLength)

    const options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: eei.getAddress(),
      static: eei._runState.static
    }

    const localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    if (!value.isZero()) {
      eei.subGas(new BN(eei._runState._common.param('gasPrices', 'callValueTransfer')))
    }

    eei.checkCallMemCost(options, localOpts)
    eei.checkOutOfGas(options)

    if (!value.isZero()) {
      eei.getGasLeft().iaddn(eei._runState._common.param('gasPrices', 'callStipend'))
      options.gasLimit.iaddn(eei._runState._common.param('gasPrices', 'callStipend'))
    }

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err)
      if (eei._runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true
        options.code = eei._runState._precompiled[toAddress.toString('hex')]
        eei.makeCall(options, localOpts, done)
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err)
          options.compiled = compiled || false
          options.code = code
          eei.makeCall(options, localOpts, done)
        })
      }
    })
  },
  DELEGATECALL: function (gas, toAddress, inOffset, inLength, outOffset, outLength, eei, done) {
    var stateManager = eei._runState.stateManager
    var value = eei.getCallValue()
    toAddress = addressToBuffer(toAddress)

    var data = eei.memLoad(inOffset, inLength)

    const options = {
      gasLimit: gas,
      value: value,
      data: data,
      to: eei.getAddress(),
      caller: eei.getCaller(),
      delegatecall: true,
      static: eei._runState.static
    }

    const localOpts = {
      inOffset: inOffset,
      inLength: inLength,
      outOffset: outOffset,
      outLength: outLength
    }

    eei.checkCallMemCost(options, localOpts)
    eei.checkOutOfGas(options)

    // load the code
    stateManager.getAccount(toAddress, function (err, account) {
      if (err) return done(err)
      if (eei._runState._precompiled[toAddress.toString('hex')]) {
        options.compiled = true
        options.code = eei._runState._precompiled[toAddress.toString('hex')]
        eei.makeCall(options, localOpts, done)
      } else {
        stateManager.getContractCode(toAddress, function (err, code, compiled) {
          if (err) return done(err)
          options.compiled = compiled || false
          options.code = code
          eei.makeCall(options, localOpts, done)
        })
      }
    })
  },
  STATICCALL: function (gasLimit, toAddress, inOffset, inLength, outOffset, outLength, eei, done) {
    var value = new BN(0)
    toAddress = addressToBuffer(toAddress)

    var data = eei.memLoad(inOffset, inLength)

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
      eei.checkCallMemCost(options, localOpts)
      eei.checkOutOfGas(options)
    } catch (e) {
      done(e.error)
      return
    }

    eei.makeCall(options, localOpts, done)
  },
  RETURN: function (offset, length, eei) {
    eei._runState.returnValue = eei.memLoad(offset, length)
  },
  REVERT: function (offset, length, eei) {
    eei._runState.stopped = true
    eei._runState.returnValue = eei.memLoad(offset, length)
    eei.trap(ERROR.REVERT)
  },
  // '0x70', range - other
  SELFDESTRUCT: function (selfdestructToAddress, eei, cb) {
    if (eei._runState.static) {
      eei.trap(ERROR.STATIC_STATE_CHANGE)
    }
    var stateManager = eei._runState.stateManager
    var contract = eei._runState.contract
    var contractAddress = eei.getAddress()
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
              eei.subGas(new BN(eei._runState._common.param('gasPrices', 'callNewAccount')))
            } catch (e) {
              cb(e.error)
              return
            }
          }
        }

        // only add to refund if this is the first selfdestruct for the address
        if (!eei._runState.selfdestruct[contractAddress.toString('hex')]) {
          eei._runState.gasRefund = eei._runState.gasRefund.addn(eei._runState._common.param('gasPrices', 'selfdestructRefund'))
        }
        eei._runState.selfdestruct[contractAddress.toString('hex')] = selfdestructToAddress
        eei._runState.stopped = true

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
