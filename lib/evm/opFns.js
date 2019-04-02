const Buffer = require('safe-buffer').Buffer
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
  ADD: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.add(b).mod(utils.TWO_POW256)
    runState.stack.push(r)
  },
  MUL: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.mul(b).mod(utils.TWO_POW256)
    runState.stack.push(r)
  },
  SUB: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.sub(b).toTwos(256)
    runState.stack.push(r)
  },
  DIV: function (runState) {
    const [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      r = a.div(b)
    }
    runState.stack.push(r)
  },
  SDIV: function (runState) {
    let [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      a = a.fromTwos(256)
      b = b.fromTwos(256)
      r = a.div(b).toTwos(256)
    }
    runState.stack.push(r)
  },
  MOD: function (runState) {
    const [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      r = a.mod(b)
    }
    runState.stack.push(r)
  },
  SMOD: function (runState) {
    let [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      a = a.fromTwos(256)
      b = b.fromTwos(256)
      r = a.abs().mod(b.abs())
      if (a.isNeg()) {
        r = r.ineg()
      }
      r = r.toTwos(256)
    }
    runState.stack.push(r)
  },
  ADDMOD: function (runState) {
    const [a, b, c] = runState.stack.popN(3)
    let r
    if (c.isZero()) {
      r = new BN(c)
    } else {
      r = a.add(b).mod(c)
    }
    runState.stack.push(r)
  },
  MULMOD: function (runState) {
    const [a, b, c] = runState.stack.popN(3)
    let r
    if (c.isZero()) {
      r = new BN(c)
    } else {
      r = a.mul(b).mod(c)
    }
    runState.stack.push(r)
  },
  EXP: function (runState) {
    let [base, exponent] = runState.stack.popN(2)
    if (exponent.isZero()) {
      runState.stack.push(new BN(1))
      return
    }
    const byteLength = exponent.byteLength()
    if (byteLength < 1 || byteLength > 32) {
      trap(ERROR.OUT_OF_RANGE)
    }
    const gasPrice = runState._common.param('gasPrices', 'expByte')
    const amount = new BN(byteLength).muln(gasPrice)
    runState.eei.useGas(amount)

    if (base.isZero()) {
      runState.stack.push(new BN(0))
      return
    }
    const m = BN.red(utils.TWO_POW256)
    base = base.toRed(m)
    const r = base.redPow(exponent)
    runState.stack.push(r)
  },
  SIGNEXTEND: function (runState) {
    let [k, val] = runState.stack.popN(2)
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

    runState.stack.push(new BN(val))
  },
  // 0x10 range - bit ops
  LT: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.lt(b) ? 1 : 0)
    runState.stack.push(r)
  },
  GT: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.gt(b) ? 1 : 0)
    runState.stack.push(r)
  },
  SLT: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0)
    runState.stack.push(r)
  },
  SGT: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0)
    runState.stack.push(r)
  },
  EQ: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.eq(b) ? 1 : 0)
    runState.stack.push(r)
  },
  ISZERO: function (runState) {
    const a = runState.stack.pop()
    const r = new BN(a.isZero() ? 1 : 0)
    runState.stack.push(r)
  },
  AND: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.and(b)
    runState.stack.push(r)
  },
  OR: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.or(b)
    runState.stack.push(r)
  },
  XOR: function (runState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.xor(b)
    runState.stack.push(r)
  },
  NOT: function (runState) {
    const a = runState.stack.pop()
    const r = a.notn(256)
    runState.stack.push(r)
  },
  BYTE: function (runState) {
    const [pos, word] = runState.stack.popN(2)
    if (pos.gten(32)) {
      runState.stack.push(new BN(0))
      return
    }

    const r = new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
    runState.stack.push(r)
  },
  SHL: function (runState) {
    const [a, b] = runState.stack.popN(2)
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      runState.stack.push(new BN(0))
      return
    }

    const r = b.shln(a.toNumber()).iand(utils.MAX_INTEGER)
    runState.stack.push(r)
  },
  SHR: function (runState) {
    const [a, b] = runState.stack.popN(2)
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    if (a.gten(256)) {
      runState.stack.push(new BN(0))
      return
    }

    const r = b.shrn(a.toNumber())
    runState.stack.push(r)
  },
  SAR: function (runState) {
    const [a, b] = runState.stack.popN(2)
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }

    let r
    const isSigned = b.testn(255)
    if (a.gten(256)) {
      if (isSigned) {
        r = new BN(utils.MAX_INTEGER)
      } else {
        r = new BN(0)
      }
      runState.stack.push(r)
      return
    }

    const c = b.shrn(a.toNumber())
    if (isSigned) {
      const shiftedOutWidth = 255 - a.toNumber()
      const mask = utils.MAX_INTEGER.shrn(shiftedOutWidth).shln(shiftedOutWidth)
      r = c.ior(mask)
    } else {
      r = c
    }
    runState.stack.push(r)
  },
  // 0x20 range - crypto
  SHA3: function (runState) {
    const [offset, length] = runState.stack.popN(2)
    subMemUsage(runState, offset, length)
    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    // copy fee
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
    const r = new BN(utils.keccak256(data))
    runState.stack.push(r)
  },
  // 0x30 range - closure state
  ADDRESS: function (runState) {
    runState.stack.push(new BN(runState.eei.getAddress()))
  },
  BALANCE: function (runState, cb) {
    const address = runState.stack.pop()
    runState.eei.getExternalBalance(address, (err, balance) => {
      if (err) {
        return cb(err)
      }

      runState.stack.push(balance)
      cb(null)
    })
  },
  ORIGIN: function (runState) {
    runState.stack.push(runState.eei.getTxOrigin())
  },
  CALLER: function (runState) {
    runState.stack.push(runState.eei.getCaller())
  },
  CALLVALUE: function (runState) {
    runState.stack.push(runState.eei.getCallValue())
  },
  CALLDATALOAD: function (runState) {
    let pos = runState.stack.pop()
    if (pos.gtn(runState.eei.getCallDataSize())) {
      runState.stack.push(new BN(0))
      return
    }

    pos = pos.toNumber()
    let loaded = runState.eei.getCallData().slice(pos, pos + 32)
    loaded = loaded.length ? loaded : Buffer.from([0])
    const r = new BN(utils.setLengthRight(loaded, 32))

    runState.stack.push(r)
  },
  CALLDATASIZE: function (runState) {
    const r = runState.eei.getCallDataSize()
    runState.stack.push(r)
  },
  CALLDATACOPY: function (runState) {
    let [memOffset, dataOffset, dataLength] = runState.stack.popN(3)

    subMemUsage(runState, memOffset, dataLength)
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'copy')).imul(dataLength.divCeil(new BN(32))))

    const data = getDataSlice(runState.eei.getCallData(), dataOffset, dataLength)
    memOffset = memOffset.toNumber()
    dataLength = dataLength.toNumber()
    runState.memory.extend(memOffset, dataLength)
    runState.memory.write(memOffset, dataLength, data)
  },
  CODESIZE: function (runState) {
    runState.stack.push(runState.eei.getCodeSize())
  },
  CODECOPY: function (runState) {
    let [memOffset, codeOffset, length] = runState.stack.popN(3)

    subMemUsage(runState, memOffset, length)
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))

    const data = getDataSlice(runState.eei.getCode(), codeOffset, length)
    memOffset = memOffset.toNumber()
    length = length.toNumber()
    runState.memory.extend(memOffset, length)
    runState.memory.write(memOffset, length, data)
  },
  EXTCODESIZE: function (runState, cb) {
    const address = runState.stack.pop()
    runState.eei.getExternalCodeSize(address, (err, size) => {
      if (err) {
        return cb(err)
      }

      runState.stack.push(size)
      cb(null)
    })
  },
  EXTCODECOPY: function (runState, cb) {
    let [address, memOffset, codeOffset, length] = runState.stack.popN(4)

    // FIXME: for some reason this must come before subGas
    subMemUsage(runState, memOffset, length)
    // copy fee
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'copy')).imul(length.divCeil(new BN(32))))

    runState.eei.getExternalCode(address, (err, code) => {
      if (err) {
        return cb(err)
      }

      const data = getDataSlice(code, codeOffset, length)
      memOffset = memOffset.toNumber()
      length = length.toNumber()
      runState.memory.extend(memOffset, length)
      runState.memory.write(memOffset, length, data)

      cb(null)
    })
  },
  EXTCODEHASH: function (runState, cb) {
    let address = runState.stack.pop()
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }
    var stateManager = runState.stateManager
    address = addressToBuffer(address)

    stateManager.getAccount(address, function (err, account) {
      if (err) return cb(err)

      if (account.isEmpty()) {
        runState.stack.push(new BN(0))
        return cb(null)
      }

      runState.eei.getExternalCode(address, function (err, code) {
        if (err) return cb(err)
        if (code.length === 0) {
          runState.stack.push(new BN(utils.KECCAK256_NULL))
          return cb(null)
        }

        runState.stack.push(new BN(utils.keccak256(code)))
        return cb(null)
      })
    })
  },
  RETURNDATASIZE: function (runState) {
    runState.stack.push(runState.eei.getReturnDataSize())
  },
  RETURNDATACOPY: function (runState) {
    let [memOffset, returnDataOffset, length] = runState.stack.popN(3)

    if ((returnDataOffset.add(length)).gt(runState.eei.getReturnDataSize())) {
      trap(ERROR.OUT_OF_GAS)
    }

    subMemUsage(runState, memOffset, length)
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'copy')).mul(length.divCeil(new BN(32))))

    const data = getDataSlice(runState.eei.getReturnData(), returnDataOffset, length)
    memOffset = memOffset.toNumber()
    length = length.toNumber()
    runState.memory.extend(memOffset, length)
    runState.memory.write(memOffset, length, data)
  },
  GASPRICE: function (runState) {
    runState.stack.push(runState.eei.getTxGasPrice())
  },
  // '0x40' range - block operations
  BLOCKHASH: function (runState, cb) {
    const number = runState.stack.pop()

    const diff = runState.eei.getBlockNumber().sub(number)
    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      runState.stack.push(new BN(0))
      cb(null)
      return
    }

    runState.eei.getBlockHash(number, (err, hash) => {
      if (err) {
        return cb(err)
      }

      runState.stack.push(hash)
      cb(null)
    })
  },
  COINBASE: function (runState) {
    runState.stack.push(runState.eei.getBlockCoinbase())
  },
  TIMESTAMP: function (runState) {
    runState.stack.push(runState.eei.getBlockTimestamp())
  },
  NUMBER: function (runState) {
    runState.stack.push(runState.eei.getBlockNumber())
  },
  DIFFICULTY: function (runState) {
    runState.stack.push(runState.eei.getBlockDifficulty())
  },
  GASLIMIT: function (runState) {
    runState.stack.push(runState.eei.getBlockGasLimit())
  },
  // 0x50 range - 'storage' and execution
  POP: function (runState) {
    runState.stack.pop()
  },
  MLOAD: function (runState) {
    const pos = runState.stack.pop()
    subMemUsage(runState, pos, new BN(32))
    const word = runState.memory.read(pos.toNumber(), 32)
    runState.stack.push(new BN(word))
  },
  MSTORE: function (runState) {
    let [offset, word] = runState.stack.popN(2)
    word = word.toArrayLike(Buffer, 'be', 32)
    subMemUsage(runState, offset, new BN(32))
    offset = offset.toNumber()
    runState.memory.extend(offset, 32)
    runState.memory.write(offset, 32, word)
  },
  MSTORE8: function (runState) {
    let [offset, byte] = runState.stack.popN(2)

    // NOTE: we're using a 'trick' here to get the least significant byte
    byte = Buffer.from([ byte.andln(0xff) ])
    subMemUsage(runState, offset, new BN(1))
    offset = offset.toNumber()
    runState.memory.extend(offset, 1)
    runState.memory.write(offset, 1, byte)
  },
  SLOAD: function (runState, cb) {
    let key = runState.stack.pop()
    key = key.toArrayLike(Buffer, 'be', 32)

    runState.eei.storageLoad(key, (err, value) => {
      if (err) {
        return cb(err)
      }

      value = value.length ? new BN(value) : new BN(0)
      runState.stack.push(value)
      cb(null)
    })
  },
  SSTORE: function (runState, cb) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    let [key, val] = runState.stack.popN(2)

    key = key.toArrayLike(Buffer, 'be', 32)
    // NOTE: this should be the shortest representation
    var value
    if (val.isZero()) {
      value = Buffer.from([])
    } else {
      value = val.toArrayLike(Buffer, 'be')
    }

    // TODO: Replace getContractStorage with EEI method
    getContractStorage(runState, runState.eei.getAddress(), key, function (err, found) {
      if (err) return cb(err)
      try {
        updateSstoreGas(runState, found, value)
      } catch (e) {
        cb(e.error)
        return
      }

      runState.eei.storageStore(key, value, cb)
    })
  },
  JUMP: function (runState) {
    let dest = runState.stack.pop()
    if (dest.gtn(runState.eei.getCodeSize())) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    dest = dest.toNumber()

    if (!jumpIsValid(runState, dest)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    runState.programCounter = dest
  },
  JUMPI: function (runState) {
    let [dest, cond] = runState.stack.popN(2)
    if (!cond.isZero()) {
      if (dest.gtn(runState.eei.getCodeSize())) {
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
    runState.stack.push(new BN(runState.programCounter - 1))
  },
  MSIZE: function (runState) {
    runState.stack.push(runState.memoryWordCount.muln(32))
  },
  GAS: function (runState) {
    runState.stack.push(runState.eei.getGasLeft())
  },
  JUMPDEST: function (runState) {},
  PUSH: function (runState) {
    const numToPush = runState.opCode - 0x5f
    const loaded = new BN(runState.code.slice(runState.programCounter, runState.programCounter + numToPush).toString('hex'), 16)
    runState.programCounter += numToPush
    runState.stack.push(loaded)
  },
  DUP: function (runState) {
    const stackPos = runState.opCode - 0x7f
    runState.stack.dup(stackPos)
  },
  SWAP: function (runState) {
    const stackPos = runState.opCode - 0x8f
    runState.stack.swap(stackPos)
  },
  LOG: function (runState) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    let [memOffset, memLength] = runState.stack.popN(2)

    const topicsCount = runState.opCode - 0xa0
    if (topicsCount < 0 || topicsCount > 4) {
      trap(ERROR.OUT_OF_RANGE)
    }

    let topics = runState.stack.popN(topicsCount)
    topics = topics.map(function (a) {
      return a.toArrayLike(Buffer, 'be', 32)
    })

    subMemUsage(runState, memOffset, memLength)
    let mem = Buffer.alloc(0)
    if (!memLength.isZero()) {
      mem = runState.memory.read(memOffset.toNumber(), memLength.toNumber())
    }
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'logTopic')).imuln(topicsCount).iadd(memLength.muln(runState._common.param('gasPrices', 'logData'))))

    runState.eei.log(mem, topicsCount, topics)
  },

  // '0xf0' range - closures
  CREATE: function (runState, done) {
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    const [value, offset, length] = runState.stack.popN(3)

    subMemUsage(runState, offset, length)
    let gasLimit = new BN(runState.gasLeft)
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)

    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

    runState.eei.create(gasLimit, value, data, (err, ret) => {
      if (err) {
        return done(err)
      }

      runState.stack.push(ret)
      done(null)
    })
  },
  CREATE2: function (runState, done) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }

    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    const [value, offset, length, salt] = runState.stack.popN(4)

    subMemUsage(runState, offset, length)
    // Deduct gas costs for hashing
    runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sha3Word')).imul(length.divCeil(new BN(32))))
    let gasLimit = new BN(runState.gasLeft)
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)

    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

    runState.eei.create2(gasLimit, value, data, salt.toArrayLike(Buffer, 'be', 32), (err, ret) => {
      if (err) {
        return done(err)
      }

      runState.stack.push(ret)
      done(null)
    })
  },
  CALL: function (runState, done) {
    let [gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength] = runState.stack.popN(7)
    toAddress = addressToBuffer(toAddress)

    if (runState.static && !value.isZero()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    if (!value.isZero()) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    runState.stateManager.accountIsEmpty(toAddress, function (err, empty) {
      if (err) {
        done(err)
        return
      }

      if (empty) {
        if (!value.isZero()) {
          try {
            runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
          } catch (e) {
            done(e.error)
            return
          }
        }
      }

      if (!value.isZero()) {
        runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
        gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
      }

      runState.eei.call(gasLimit, toAddress, value, data, (err, ret) => {
        if (err) {
          return done(err)
        }

        // Write return data to memory
        writeCallOutput(runState, outOffset, outLength)

        runState.stack.push(ret)
        done(null)
      })
    })
  },
  CALLCODE: function (runState, done) {
    let [gasLimit, toAddress, value, inOffset, inLength, outOffset, outLength] = runState.stack.popN(7)
    toAddress = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    if (!value.isZero()) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)
    if (!value.isZero()) {
      runState.gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
      gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
    }

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    runState.eei.callCode(gasLimit, toAddress, value, data, (err, ret) => {
      if (err) {
        return done(err)
      }

      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)

      runState.stack.push(ret)
      done(null)
    })
  },
  DELEGATECALL: function (runState, done) {
    const value = runState.callValue
    let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
    toAddress = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    runState.eei.callDelegate(gasLimit, toAddress, value, data, (err, ret) => {
      if (err) {
        return done(err)
      }

      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)

      runState.stack.push(ret)
      done(null)
    })
  },
  STATICCALL: function (runState, done) {
    const value = new BN(0)
    let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
    toAddress = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    gasLimit = maxCallGas(gasLimit, runState.gasLeft)

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    runState.eei.callStatic(gasLimit, toAddress, value, data, (err, ret) => {
      if (err) {
        return done(err)
      }

      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)

      runState.stack.push(ret)
      done(null)
    })
  },
  RETURN: function (runState) {
    const [offset, length] = runState.stack.popN(2)
    subMemUsage(runState, offset, length)
    let returnData = Buffer.alloc(0)
    if (!length.isZero()) {
      returnData = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    runState.eei.finish(returnData)
  },
  REVERT: function (runState) {
    const [offset, length] = runState.stack.popN(2)
    runState.stopped = true
    subMemUsage(runState, offset, length)
    let returnData = Buffer.alloc(0)
    if (!length.isZero()) {
      returnData = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    runState.eei.revert(returnData)
  },
  // '0x70', range - other
  SELFDESTRUCT: function (runState, cb) {
    let selfdestructToAddress = runState.stack.pop()
    if (runState.static) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    selfdestructToAddress = addressToBuffer(selfdestructToAddress)
    runState.eei.selfDestruct(selfdestructToAddress, cb)
  }
}

function describeLocation (runState) {
  var hash = utils.keccak256(runState.code).toString('hex')
  var address = runState.address.toString('hex')
  var pc = runState.programCounter - 1
  return hash + '/' + address + ':' + pc
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
    runState.eei.useGas(cost.sub(runState.highestMemCost))
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

function maxCallGas (gasLimit, gasLeft) {
  const gasAllowed = gasLeft.sub(gasLeft.divn(64))
  return gasLimit.gt(gasAllowed) ? gasAllowed : gasLimit
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
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreNoopGas')))
      return
    }
    // If current value does not equal new value
    if (original.equals(current)) {
      // If original value equals current value (this storage slot has not been changed by the current execution context)
      if (original.length === 0) {
        // If original value is 0, 20000 gas is deducted.
        return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreInitGas')))
      }
      if (value.length === 0) {
        // If new value is 0, add 15000 gas to refund counter.
        runState.gasRefund = runState.gasRefund.addn(runState._common.param('gasPrices', 'netSstoreClearRefund'))
      }
      // Otherwise, 5000 gas is deducted.
      return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')))
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
    return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')))
  } else {
    if (value.length === 0 && !found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
    } else if (value.length === 0 && found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
      runState.gasRefund.iaddn(runState._common.param('gasPrices', 'sstoreRefund'))
    } else if (value.length !== 0 && !found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreSet')))
    } else if (value.length !== 0 && found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
    }
  }
}

function writeCallOutput (runState, outOffset, outLength) {
  const returnData = runState.eei.getReturnData()
  if (returnData.length > 0) {
    const memOffset = outOffset.toNumber()
    let dataLength = outLength.toNumber()
    if (returnData.length < dataLength) {
      dataLength = returnData.length
    }
    const data = getDataSlice(returnData, new BN(0), new BN(dataLength))
    runState.memory.extend(memOffset, dataLength)
    runState.memory.write(memOffset, dataLength, data)
  }
}
