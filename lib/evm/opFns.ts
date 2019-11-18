import BN = require('bn.js')
import * as utils from 'ethereumjs-util'
import { ERROR, VmError } from '../exceptions'
import { RunState } from './interpreter'

const MASK_160 = new BN(1).shln(160).subn(1)

// Find Ceil(`this` / `num`)
function divCeil(a: BN, b: BN) {
  const div = a.div(b)
  const mod = a.mod(b)

  // Fast case - exact division
  if (mod.isZero()) return div

  // Round up
  return div.isNeg() ? div.isubn(1) : div.iaddn(1)
}

function addressToBuffer(address: BN) {
  return address.and(MASK_160).toArrayLike(Buffer, 'be', 20)
}

export interface SyncOpHandler {
  (runState: RunState): void
}

export interface AsyncOpHandler {
  (runState: RunState): Promise<void>
}

export type OpHandler = SyncOpHandler | AsyncOpHandler

// the opcode functions
export const handlers: { [k: string]: OpHandler } = {
  STOP: function(runState: RunState) {
    trap(ERROR.STOP)
  },
  ADD: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.add(b).mod(utils.TWO_POW256)
    runState.stack.push(r)
  },
  MUL: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.mul(b).mod(utils.TWO_POW256)
    runState.stack.push(r)
  },
  SUB: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.sub(b).toTwos(256)
    runState.stack.push(r)
  },
  DIV: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      r = a.div(b)
    }
    runState.stack.push(r)
  },
  SDIV: function(runState: RunState) {
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
  MOD: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    let r
    if (b.isZero()) {
      r = new BN(b)
    } else {
      r = a.mod(b)
    }
    runState.stack.push(r)
  },
  SMOD: function(runState: RunState) {
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
  ADDMOD: function(runState: RunState) {
    const [a, b, c] = runState.stack.popN(3)
    let r
    if (c.isZero()) {
      r = new BN(c)
    } else {
      r = a.add(b).mod(c)
    }
    runState.stack.push(r)
  },
  MULMOD: function(runState: RunState) {
    const [a, b, c] = runState.stack.popN(3)
    let r
    if (c.isZero()) {
      r = new BN(c)
    } else {
      r = a.mul(b).mod(c)
    }
    runState.stack.push(r)
  },
  EXP: function(runState: RunState) {
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
    const redBase = base.toRed(m)
    const r = redBase.redPow(exponent)
    runState.stack.push(r.fromRed())
  },
  SIGNEXTEND: function(runState: RunState) {
    let [k, val] = runState.stack.popN(2)
    if (k.ltn(31)) {
      const signBit = k
        .muln(8)
        .iaddn(7)
        .toNumber()
      const mask = new BN(1).ishln(signBit).isubn(1)
      if (val.testn(signBit)) {
        val = val.or(mask.notn(256))
      } else {
        val = val.and(mask)
      }
    } else {
      // return the same value
      val = new BN(val)
    }
    runState.stack.push(val)
  },
  // 0x10 range - bit ops
  LT: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.lt(b) ? 1 : 0)
    runState.stack.push(r)
  },
  GT: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.gt(b) ? 1 : 0)
    runState.stack.push(r)
  },
  SLT: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0)
    runState.stack.push(r)
  },
  SGT: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0)
    runState.stack.push(r)
  },
  EQ: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = new BN(a.eq(b) ? 1 : 0)
    runState.stack.push(r)
  },
  ISZERO: function(runState: RunState) {
    const a = runState.stack.pop()
    const r = new BN(a.isZero() ? 1 : 0)
    runState.stack.push(r)
  },
  AND: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.and(b)
    runState.stack.push(r)
  },
  OR: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.or(b)
    runState.stack.push(r)
  },
  XOR: function(runState: RunState) {
    const [a, b] = runState.stack.popN(2)
    const r = a.xor(b)
    runState.stack.push(r)
  },
  NOT: function(runState: RunState) {
    const a = runState.stack.pop()
    const r = a.notn(256)
    runState.stack.push(r)
  },
  BYTE: function(runState: RunState) {
    const [pos, word] = runState.stack.popN(2)
    if (pos.gten(32)) {
      runState.stack.push(new BN(0))
      return
    }

    const r = new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
    runState.stack.push(r)
  },
  SHL: function(runState: RunState) {
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
  SHR: function(runState: RunState) {
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
  SAR: function(runState: RunState) {
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
  SHA3: function(runState: RunState) {
    const [offset, length] = runState.stack.popN(2)
    subMemUsage(runState, offset, length)
    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    // copy fee
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'sha3Word')).imul(divCeil(length, new BN(32))),
    )
    const r = new BN(utils.keccak256(data))
    runState.stack.push(r)
  },
  // 0x30 range - closure state
  ADDRESS: function(runState: RunState) {
    runState.stack.push(new BN(runState.eei.getAddress()))
  },
  BALANCE: async function(runState: RunState) {
    const address = runState.stack.pop()
    const addressBuf = addressToBuffer(address)
    const balance = await runState.eei.getExternalBalance(addressBuf)
    runState.stack.push(balance)
  },
  ORIGIN: function(runState: RunState) {
    runState.stack.push(runState.eei.getTxOrigin())
  },
  CALLER: function(runState: RunState) {
    runState.stack.push(runState.eei.getCaller())
  },
  CALLVALUE: function(runState: RunState) {
    runState.stack.push(runState.eei.getCallValue())
  },
  CALLDATALOAD: function(runState: RunState) {
    let pos = runState.stack.pop()
    if (pos.gt(runState.eei.getCallDataSize())) {
      runState.stack.push(new BN(0))
      return
    }

    const i = pos.toNumber()
    let loaded = runState.eei.getCallData().slice(i, i + 32)
    loaded = loaded.length ? loaded : Buffer.from([0])
    const r = new BN(utils.setLengthRight(loaded, 32))

    runState.stack.push(r)
  },
  CALLDATASIZE: function(runState: RunState) {
    const r = runState.eei.getCallDataSize()
    runState.stack.push(r)
  },
  CALLDATACOPY: function(runState: RunState) {
    let [memOffset, dataOffset, dataLength] = runState.stack.popN(3)

    subMemUsage(runState, memOffset, dataLength)
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32))),
    )

    const data = getDataSlice(runState.eei.getCallData(), dataOffset, dataLength)
    const memOffsetNum = memOffset.toNumber()
    const dataLengthNum = dataLength.toNumber()
    runState.memory.extend(memOffsetNum, dataLengthNum)
    runState.memory.write(memOffsetNum, dataLengthNum, data)
  },
  CODESIZE: function(runState: RunState) {
    runState.stack.push(runState.eei.getCodeSize())
  },
  CODECOPY: function(runState: RunState) {
    let [memOffset, codeOffset, length] = runState.stack.popN(3)

    subMemUsage(runState, memOffset, length)
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'copy')).imul(divCeil(length, new BN(32))),
    )

    const data = getDataSlice(runState.eei.getCode(), codeOffset, length)
    const memOffsetNum = memOffset.toNumber()
    const lengthNum = length.toNumber()
    runState.memory.extend(memOffsetNum, lengthNum)
    runState.memory.write(memOffsetNum, lengthNum, data)
  },
  EXTCODESIZE: async function(runState: RunState) {
    const address = runState.stack.pop()
    const size = await runState.eei.getExternalCodeSize(address)
    runState.stack.push(size)
  },
  EXTCODECOPY: async function(runState: RunState) {
    let [address, memOffset, codeOffset, length] = runState.stack.popN(4)

    // FIXME: for some reason this must come before subGas
    subMemUsage(runState, memOffset, length)
    // copy fee
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'copy')).imul(divCeil(length, new BN(32))),
    )

    const code = await runState.eei.getExternalCode(address)

    const data = getDataSlice(code, codeOffset, length)
    const memOffsetNum = memOffset.toNumber()
    const lengthNum = length.toNumber()
    runState.memory.extend(memOffsetNum, lengthNum)
    runState.memory.write(memOffsetNum, lengthNum, data)
  },
  EXTCODEHASH: async function(runState: RunState) {
    let address = runState.stack.pop()
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }

    const addressBuf = addressToBuffer(address)
    const empty = await runState.eei.isAccountEmpty(addressBuf)
    if (empty) {
      runState.stack.push(new BN(0))
      return
    }

    const code = await runState.eei.getExternalCode(address)
    if (code.length === 0) {
      runState.stack.push(new BN(utils.KECCAK256_NULL))
      return
    }

    runState.stack.push(new BN(utils.keccak256(code)))
  },
  RETURNDATASIZE: function(runState: RunState) {
    runState.stack.push(runState.eei.getReturnDataSize())
  },
  RETURNDATACOPY: function(runState: RunState) {
    let [memOffset, returnDataOffset, length] = runState.stack.popN(3)

    if (returnDataOffset.add(length).gt(runState.eei.getReturnDataSize())) {
      trap(ERROR.OUT_OF_GAS)
    }

    subMemUsage(runState, memOffset, length)
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'copy')).mul(divCeil(length, new BN(32))),
    )

    const data = getDataSlice(runState.eei.getReturnData(), returnDataOffset, length)
    const memOffsetNum = memOffset.toNumber()
    const lengthNum = length.toNumber()
    runState.memory.extend(memOffsetNum, lengthNum)
    runState.memory.write(memOffsetNum, lengthNum, data)
  },
  GASPRICE: function(runState: RunState) {
    runState.stack.push(runState.eei.getTxGasPrice())
  },
  // '0x40' range - block operations
  BLOCKHASH: async function(runState: RunState) {
    const number = runState.stack.pop()

    const diff = runState.eei.getBlockNumber().sub(number)
    // block lookups must be within the past 256 blocks
    if (diff.gtn(256) || diff.lten(0)) {
      runState.stack.push(new BN(0))
      return
    }

    const hash = await runState.eei.getBlockHash(number)
    runState.stack.push(hash)
  },
  COINBASE: function(runState: RunState) {
    runState.stack.push(runState.eei.getBlockCoinbase())
  },
  TIMESTAMP: function(runState: RunState) {
    runState.stack.push(runState.eei.getBlockTimestamp())
  },
  NUMBER: function(runState: RunState) {
    runState.stack.push(runState.eei.getBlockNumber())
  },
  DIFFICULTY: function(runState: RunState) {
    runState.stack.push(runState.eei.getBlockDifficulty())
  },
  GASLIMIT: function(runState: RunState) {
    runState.stack.push(runState.eei.getBlockGasLimit())
  },
  CHAINID: function(runState: RunState) {
    if (!runState._common.gteHardfork('istanbul')) {
      trap(ERROR.INVALID_OPCODE)
    }

    runState.stack.push(runState.eei.getChainId())
  },
  SELFBALANCE: function(runState: RunState) {
    if (!runState._common.gteHardfork('istanbul')) {
      trap(ERROR.INVALID_OPCODE)
    }

    runState.stack.push(runState.eei.getSelfBalance())
  },
  // 0x50 range - 'storage' and execution
  POP: function(runState: RunState) {
    runState.stack.pop()
  },
  MLOAD: function(runState: RunState) {
    const pos = runState.stack.pop()
    subMemUsage(runState, pos, new BN(32))
    const word = runState.memory.read(pos.toNumber(), 32)
    runState.stack.push(new BN(word))
  },
  MSTORE: function(runState: RunState) {
    let [offset, word] = runState.stack.popN(2)
    const buf = word.toArrayLike(Buffer, 'be', 32)
    subMemUsage(runState, offset, new BN(32))
    const offsetNum = offset.toNumber()
    runState.memory.extend(offsetNum, 32)
    runState.memory.write(offsetNum, 32, buf)
  },
  MSTORE8: function(runState: RunState) {
    let [offset, byte] = runState.stack.popN(2)

    // NOTE: we're using a 'trick' here to get the least significant byte
    // NOTE: force cast necessary because `BN.andln` returns number but
    // the types are wrong
    const buf = Buffer.from([(byte.andln(0xff) as unknown) as number])
    subMemUsage(runState, offset, new BN(1))
    const offsetNum = offset.toNumber()
    runState.memory.extend(offsetNum, 1)
    runState.memory.write(offsetNum, 1, buf)
  },
  SLOAD: async function(runState: RunState) {
    let key = runState.stack.pop()
    const keyBuf = key.toArrayLike(Buffer, 'be', 32)

    const value = await runState.eei.storageLoad(keyBuf)
    const valueBN = value.length ? new BN(value) : new BN(0)
    runState.stack.push(valueBN)
  },
  SSTORE: async function(runState: RunState) {
    if (runState.eei.isStatic()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    let [key, val] = runState.stack.popN(2)

    const keyBuf = key.toArrayLike(Buffer, 'be', 32)
    // NOTE: this should be the shortest representation
    let value
    if (val.isZero()) {
      value = Buffer.from([])
    } else {
      value = val.toArrayLike(Buffer, 'be')
    }

    // TODO: Replace getContractStorage with EEI method
    const found = await getContractStorage(runState, runState.eei.getAddress(), keyBuf)
    updateSstoreGas(runState, found, value)
    await runState.eei.storageStore(keyBuf, value)
  },
  JUMP: function(runState: RunState) {
    const dest = runState.stack.pop()
    if (dest.gt(runState.eei.getCodeSize())) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    const destNum = dest.toNumber()

    if (!jumpIsValid(runState, destNum)) {
      trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
    }

    runState.programCounter = destNum
  },
  JUMPI: function(runState: RunState) {
    let [dest, cond] = runState.stack.popN(2)
    if (!cond.isZero()) {
      if (dest.gt(runState.eei.getCodeSize())) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      const destNum = dest.toNumber()

      if (!jumpIsValid(runState, destNum)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      runState.programCounter = destNum
    }
  },
  PC: function(runState: RunState) {
    runState.stack.push(new BN(runState.programCounter - 1))
  },
  MSIZE: function(runState: RunState) {
    runState.stack.push(runState.memoryWordCount.muln(32))
  },
  GAS: function(runState: RunState) {
    runState.stack.push(new BN(runState.eei.getGasLeft()))
  },
  JUMPDEST: function(runState: RunState) {},
  PUSH: function(runState: RunState) {
    const numToPush = runState.opCode - 0x5f
    const loaded = new BN(
      runState.eei
        .getCode()
        .slice(runState.programCounter, runState.programCounter + numToPush)
        .toString('hex'),
      16,
    )
    runState.programCounter += numToPush
    runState.stack.push(loaded)
  },
  DUP: function(runState: RunState) {
    const stackPos = runState.opCode - 0x7f
    runState.stack.dup(stackPos)
  },
  SWAP: function(runState: RunState) {
    const stackPos = runState.opCode - 0x8f
    runState.stack.swap(stackPos)
  },
  LOG: function(runState: RunState) {
    if (runState.eei.isStatic()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    let [memOffset, memLength] = runState.stack.popN(2)

    const topicsCount = runState.opCode - 0xa0
    if (topicsCount < 0 || topicsCount > 4) {
      trap(ERROR.OUT_OF_RANGE)
    }

    let topics = runState.stack.popN(topicsCount)
    const topicsBuf = topics.map(function(a) {
      return a.toArrayLike(Buffer, 'be', 32)
    })

    subMemUsage(runState, memOffset, memLength)
    let mem = Buffer.alloc(0)
    if (!memLength.isZero()) {
      mem = runState.memory.read(memOffset.toNumber(), memLength.toNumber())
    }
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'logTopic'))
        .imuln(topicsCount)
        .iadd(memLength.muln(runState._common.param('gasPrices', 'logData'))),
    )

    runState.eei.log(mem, topicsCount, topicsBuf)
  },

  // '0xf0' range - closures
  CREATE: async function(runState: RunState) {
    if (runState.eei.isStatic()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    const [value, offset, length] = runState.stack.popN(3)

    subMemUsage(runState, offset, length)
    let gasLimit = new BN(runState.eei.getGasLeft())
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())

    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

    const ret = await runState.eei.create(gasLimit, value, data)
    runState.stack.push(ret)
  },
  CREATE2: async function(runState: RunState) {
    if (!runState._common.gteHardfork('constantinople')) {
      trap(ERROR.INVALID_OPCODE)
    }

    if (runState.eei.isStatic()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    const [value, offset, length, salt] = runState.stack.popN(4)

    subMemUsage(runState, offset, length)
    // Deduct gas costs for hashing
    runState.eei.useGas(
      new BN(runState._common.param('gasPrices', 'sha3Word')).imul(divCeil(length, new BN(32))),
    )
    let gasLimit = new BN(runState.eei.getGasLeft())
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())

    let data = Buffer.alloc(0)
    if (!length.isZero()) {
      data = runState.memory.read(offset.toNumber(), length.toNumber())
    }

    const ret = await runState.eei.create2(
      gasLimit,
      value,
      data,
      salt.toArrayLike(Buffer, 'be', 32),
    )
    runState.stack.push(ret)
  },
  CALL: async function(runState: RunState) {
    let [
      gasLimit,
      toAddress,
      value,
      inOffset,
      inLength,
      outOffset,
      outLength,
    ] = runState.stack.popN(7)
    const toAddressBuf = addressToBuffer(toAddress)

    if (runState.eei.isStatic() && !value.isZero()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    if (!value.isZero()) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    const empty = await runState.eei.isAccountEmpty(toAddressBuf)
    if (empty) {
      if (!value.isZero()) {
        runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
      }
    }

    if (!value.isZero()) {
      // TODO: Don't use private attr directly
      runState.eei._gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
      gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
    }

    const ret = await runState.eei.call(gasLimit, toAddressBuf, value, data)
    // Write return data to memory
    writeCallOutput(runState, outOffset, outLength)
    runState.stack.push(ret)
  },
  CALLCODE: async function(runState: RunState) {
    let [
      gasLimit,
      toAddress,
      value,
      inOffset,
      inLength,
      outOffset,
      outLength,
    ] = runState.stack.popN(7)
    const toAddressBuf = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    if (!value.isZero()) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callValueTransfer')))
    }
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())
    if (!value.isZero()) {
      // TODO: Don't use private attr directly
      runState.eei._gasLeft.iaddn(runState._common.param('gasPrices', 'callStipend'))
      gasLimit.iaddn(runState._common.param('gasPrices', 'callStipend'))
    }

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    const ret = await runState.eei.callCode(gasLimit, toAddressBuf, value, data)
    // Write return data to memory
    writeCallOutput(runState, outOffset, outLength)
    runState.stack.push(ret)
  },
  DELEGATECALL: async function(runState: RunState) {
    const value = runState.eei.getCallValue()
    let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
    const toAddressBuf = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    const ret = await runState.eei.callDelegate(gasLimit, toAddressBuf, value, data)
    // Write return data to memory
    writeCallOutput(runState, outOffset, outLength)
    runState.stack.push(ret)
  },
  STATICCALL: async function(runState: RunState) {
    const value = new BN(0)
    let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
    const toAddressBuf = addressToBuffer(toAddress)

    subMemUsage(runState, inOffset, inLength)
    subMemUsage(runState, outOffset, outLength)
    gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft())

    let data = Buffer.alloc(0)
    if (!inLength.isZero()) {
      data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
    }

    const ret = await runState.eei.callStatic(gasLimit, toAddressBuf, value, data)
    // Write return data to memory
    writeCallOutput(runState, outOffset, outLength)
    runState.stack.push(ret)
  },
  RETURN: function(runState: RunState) {
    const [offset, length] = runState.stack.popN(2)
    subMemUsage(runState, offset, length)
    let returnData = Buffer.alloc(0)
    if (!length.isZero()) {
      returnData = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    runState.eei.finish(returnData)
  },
  REVERT: function(runState: RunState) {
    const [offset, length] = runState.stack.popN(2)
    subMemUsage(runState, offset, length)
    let returnData = Buffer.alloc(0)
    if (!length.isZero()) {
      returnData = runState.memory.read(offset.toNumber(), length.toNumber())
    }
    runState.eei.revert(returnData)
  },
  // '0x70', range - other
  SELFDESTRUCT: async function(runState: RunState) {
    let selfdestructToAddress = runState.stack.pop()
    if (runState.eei.isStatic()) {
      trap(ERROR.STATIC_STATE_CHANGE)
    }

    const selfdestructToAddressBuf = addressToBuffer(selfdestructToAddress)
    const balance = await runState.eei.getExternalBalance(runState.eei.getAddress())
    if (balance.gtn(0)) {
      const empty = await runState.eei.isAccountEmpty(selfdestructToAddressBuf)
      if (empty) {
        runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
      }
    }

    return runState.eei.selfDestruct(selfdestructToAddressBuf)
  },
}

function describeLocation(runState: RunState) {
  var hash = utils.keccak256(runState.eei.getCode()).toString('hex')
  var address = runState.eei.getAddress().toString('hex')
  var pc = runState.programCounter - 1
  return hash + '/' + address + ':' + pc
}

function trap(err: string) {
  // TODO: facilitate extra data along with errors
  throw new VmError(err as ERROR)
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 * @method subMemUsage
 * @param {Object} runState
 * @param {BN} offset
 * @param {BN} length
 * @returns {String}
 */
function subMemUsage(runState: RunState, offset: BN, length: BN) {
  // YP (225): access with zero length will not extend the memory
  if (length.isZero()) return

  const newMemoryWordCount = divCeil(offset.add(length), new BN(32))
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
function getDataSlice(data: Buffer, offset: BN, length: BN): Buffer {
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
function jumpIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps.indexOf(dest) !== -1
}

function maxCallGas(gasLimit: BN, gasLeft: BN): BN {
  const gasAllowed = gasLeft.sub(gasLeft.divn(64))
  return gasLimit.gt(gasAllowed) ? gasAllowed : gasLimit
}

function getContractStorage(runState: RunState, address: Buffer, key: Buffer) {
  return new Promise((resolve, reject) => {
    const cb = (err: Error | null, res: any) => {
      if (err) return reject(err)
      resolve(res)
    }
    runState.stateManager.getContractStorage(address, key, (err: Error, current: Buffer) => {
      if (err) return cb(err, null)
      if (
        runState._common.hardfork() === 'constantinople' ||
        runState._common.gteHardfork('istanbul')
      ) {
        runState.stateManager.getOriginalContractStorage(
          address,
          key,
          (err: Error, original: Buffer) => {
            if (err) return cb(err, null)
            cb(null, { current, original })
          },
        )
      } else {
        cb(null, current)
      }
    })
  })
}

function updateSstoreGas(runState: RunState, found: any, value: Buffer) {
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
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      }
      // Otherwise, 5000 gas is deducted.
      return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreCleanGas')))
    }
    // If original value does not equal current value (this storage slot is dirty), 200 gas is deducted. Apply both of the following clauses.
    if (original.length !== 0) {
      // If original value is not 0
      if (current.length === 0) {
        // If current value is 0 (also means that new value is not 0), remove 15000 gas from refund counter. We can prove that refund counter will never go below 0.
        runState.eei.subRefund(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      } else if (value.length === 0) {
        // If new value is 0 (also means that current value is not 0), add 15000 gas to refund counter.
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreClearRefund')))
      }
    }
    if (original.equals(value)) {
      // If original value equals new value (this storage slot is reset)
      if (original.length === 0) {
        // If original value is 0, add 19800 gas to refund counter.
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'netSstoreResetClearRefund')),
        )
      } else {
        // Otherwise, add 4800 gas to refund counter.
        runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'netSstoreResetRefund')))
      }
    }
    return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'netSstoreDirtyGas')))
  } else if (runState._common.gteHardfork('istanbul')) {
    // EIP-2200
    const original = found.original
    const current = found.current
    // Fail if not enough gas is left
    if (
      runState.eei.getGasLeft().lten(runState._common.param('gasPrices', 'sstoreSentryGasEIP2200'))
    ) {
      trap(ERROR.OUT_OF_GAS)
    }

    // Noop
    if (current.equals(value)) {
      return runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'sstoreNoopGasEIP2200')),
      )
    }
    if (original.equals(current)) {
      // Create slot
      if (original.length === 0) {
        return runState.eei.useGas(
          new BN(runState._common.param('gasPrices', 'sstoreInitGasEIP2200')),
        )
      }
      // Delete slot
      if (value.length === 0) {
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200')),
        )
      }
      // Write existing slot
      return runState.eei.useGas(
        new BN(runState._common.param('gasPrices', 'sstoreCleanGasEIP2200')),
      )
    }
    if (original.length > 0) {
      if (current.length === 0) {
        // Recreate slot
        runState.eei.subRefund(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200')),
        )
      } else if (value.length === 0) {
        // Delete slot
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreClearRefundEIP2200')),
        )
      }
    }
    if (original.equals(value)) {
      if (original.length === 0) {
        // Reset to original non-existent slot
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreInitRefundEIP2200')),
        )
      } else {
        // Reset to original existing slot
        runState.eei.refundGas(
          new BN(runState._common.param('gasPrices', 'sstoreCleanRefundEIP2200')),
        )
      }
    }
    // Dirty update
    return runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreDirtyGasEIP2200')))
  } else {
    if (value.length === 0 && !found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
    } else if (value.length === 0 && found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
      runState.eei.refundGas(new BN(runState._common.param('gasPrices', 'sstoreRefund')))
    } else if (value.length !== 0 && !found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreSet')))
    } else if (value.length !== 0 && found.length) {
      runState.eei.useGas(new BN(runState._common.param('gasPrices', 'sstoreReset')))
    }
  }
}

function writeCallOutput(runState: RunState, outOffset: BN, outLength: BN) {
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
