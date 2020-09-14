import BN = require('bn.js')
import {
  keccak256,
  setLengthRight,
  setLengthLeft,
  TWO_POW256,
  MAX_INTEGER,
  KECCAK256_NULL,
} from 'ethereumjs-util'
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
export const handlers: Map<number, OpHandler> = new Map([
  // 0x00: STOP
  [
    0x00,
    function (runState: RunState) {
      trap(ERROR.STOP)
    },
  ],
  // 0x01: ADD
  [
    0x01,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.add(b).mod(TWO_POW256)
      runState.stack.push(r)
    },
  ],
  // 0x02: MUL
  [
    0x02,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.mul(b).mod(TWO_POW256)
      runState.stack.push(r)
    },
  ],
  // 0x03: SUB
  [
    0x03,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.sub(b).toTwos(256)
      runState.stack.push(r)
    },
  ],
  // 0x04: DIV
  [
    0x04,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b.isZero()) {
        r = new BN(b)
      } else {
        r = a.div(b)
      }
      runState.stack.push(r)
    },
  ],
  // 0x05: SDIV
  [
    0x05,
    function (runState: RunState) {
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
  ],
  // 0x06: MOD
  [
    0x06,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b.isZero()) {
        r = new BN(b)
      } else {
        r = a.mod(b)
      }
      runState.stack.push(r)
    },
  ],
  // 0x07: SMOD
  [
    0x07,
    function (runState: RunState) {
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
  ],
  // 0x08: ADDMOD
  [
    0x08,
    function (runState: RunState) {
      const [a, b, c] = runState.stack.popN(3)
      let r
      if (c.isZero()) {
        r = new BN(c)
      } else {
        r = a.add(b).mod(c)
      }
      runState.stack.push(r)
    },
  ],
  // 0x09: MULMOD
  [
    0x09,
    function (runState: RunState) {
      const [a, b, c] = runState.stack.popN(3)
      let r
      if (c.isZero()) {
        r = new BN(c)
      } else {
        r = a.mul(b).mod(c)
      }
      runState.stack.push(r)
    },
  ],
  // 0x0a: EXP
  [
    0x0a,
    function (runState: RunState) {
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
      const m = BN.red(TWO_POW256)
      const redBase = base.toRed(m)
      const r = redBase.redPow(exponent)
      runState.stack.push(r.fromRed())
    },
  ],
  // 0x0b: SIGNEXTEND
  [
    0x0b,
    function (runState: RunState) {
      let [k, val] = runState.stack.popN(2)
      if (k.ltn(31)) {
        const signBit = k.muln(8).iaddn(7).toNumber()
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
  ],
  // 0x10 range - bit ops
  // 0x10: LT
  [
    0x10,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = new BN(a.lt(b) ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x11: GT
  [
    0x11,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = new BN(a.gt(b) ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x12: SLT
  [
    0x12,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = new BN(a.fromTwos(256).lt(b.fromTwos(256)) ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x13: SGT
  [
    0x13,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = new BN(a.fromTwos(256).gt(b.fromTwos(256)) ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x14: EQ
  [
    0x14,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = new BN(a.eq(b) ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x15: ISZERO
  [
    0x15,
    function (runState: RunState) {
      const a = runState.stack.pop()
      const r = new BN(a.isZero() ? 1 : 0)
      runState.stack.push(r)
    },
  ],
  // 0x16: AND
  [
    0x16,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.and(b)
      runState.stack.push(r)
    },
  ],
  // 0x17: OR
  [
    0x17,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.or(b)
      runState.stack.push(r)
    },
  ],
  // 0x18: XOR
  [
    0x18,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      const r = a.xor(b)
      runState.stack.push(r)
    },
  ],
  // 0x19: NOT
  [
    0x19,
    function (runState: RunState) {
      const a = runState.stack.pop()
      const r = a.notn(256)
      runState.stack.push(r)
    },
  ],
  // 0x1a: BYTE
  [
    0x1a,
    function (runState: RunState) {
      const [pos, word] = runState.stack.popN(2)
      if (pos.gten(32)) {
        runState.stack.push(new BN(0))
        return
      }

      const r = new BN(word.shrn((31 - pos.toNumber()) * 8).andln(0xff))
      runState.stack.push(r)
    },
  ],
  // 0x1b: SHL
  [
    0x1b,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      if (a.gten(256)) {
        runState.stack.push(new BN(0))
        return
      }

      const r = b.shln(a.toNumber()).iand(MAX_INTEGER)
      runState.stack.push(r)
    },
  ],
  // 0x1c: SHR
  [
    0x1c,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)
      if (a.gten(256)) {
        runState.stack.push(new BN(0))
        return
      }

      const r = b.shrn(a.toNumber())
      runState.stack.push(r)
    },
  ],
  // 0x1d: SAR
  [
    0x1d,
    function (runState: RunState) {
      const [a, b] = runState.stack.popN(2)

      let r
      const isSigned = b.testn(255)
      if (a.gten(256)) {
        if (isSigned) {
          r = new BN(MAX_INTEGER)
        } else {
          r = new BN(0)
        }
        runState.stack.push(r)
        return
      }

      const c = b.shrn(a.toNumber())
      if (isSigned) {
        const shiftedOutWidth = 255 - a.toNumber()
        const mask = MAX_INTEGER.shrn(shiftedOutWidth).shln(shiftedOutWidth)
        r = c.ior(mask)
      } else {
        r = c
      }
      runState.stack.push(r)
    },
  ],
  // 0x20 range - crypto
  // 0x20: SHA3
  [
    0x20,
    function (runState: RunState) {
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
      const r = new BN(keccak256(data))
      runState.stack.push(r)
    },
  ],
  // 0x30 range - closure state
  // 0x30: ADDRESS
  [
    0x30,
    function (runState: RunState) {
      runState.stack.push(new BN(runState.eei.getAddress()))
    },
  ],
  // 0x31: BALANCE
  [
    0x31,
    async function (runState: RunState) {
      const address = runState.stack.pop()
      const addressBuf = addressToBuffer(address)
      const balance = await runState.eei.getExternalBalance(addressBuf)
      runState.stack.push(balance)
    },
  ],
  // 0x32: ORIGIN
  [
    0x32,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getTxOrigin())
    },
  ],
  // 0x33: CALLER
  [
    0x33,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getCaller())
    },
  ],
  // 0x34: CALLVALUE
  [
    0x34,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getCallValue())
    },
  ],
  // 0x35: CALLDATALOAD
  [
    0x35,
    function (runState: RunState) {
      let pos = runState.stack.pop()
      if (pos.gt(runState.eei.getCallDataSize())) {
        runState.stack.push(new BN(0))
        return
      }

      const i = pos.toNumber()
      let loaded = runState.eei.getCallData().slice(i, i + 32)
      loaded = loaded.length ? loaded : Buffer.from([0])
      const r = new BN(setLengthRight(loaded, 32))

      runState.stack.push(r)
    },
  ],
  // 0x36: CALLDATASIZE
  [
    0x36,
    function (runState: RunState) {
      const r = runState.eei.getCallDataSize()
      runState.stack.push(r)
    },
  ],
  // 0x37: CALLDATACOPY
  [
    0x37,
    function (runState: RunState) {
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
  ],
  // 0x38: CODESIZE
  [
    0x38,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getCodeSize())
    },
  ],
  // 0x39: CODECOPY
  [
    0x39,
    function (runState: RunState) {
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
  ],
  // 0x3b: EXTCODESIZE
  [
    0x3b,
    async function (runState: RunState) {
      const address = runState.stack.pop()
      const size = await runState.eei.getExternalCodeSize(address)
      runState.stack.push(size)
    },
  ],
  // 0x3c: EXTCODECOPY
  [
    0x3c,
    async function (runState: RunState) {
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
  ],
  // 0x3f: EXTCODEHASH
  [
    0x3f,
    async function (runState: RunState) {
      let address = runState.stack.pop()

      const addressBuf = addressToBuffer(address)
      const empty = await runState.eei.isAccountEmpty(addressBuf)
      if (empty) {
        runState.stack.push(new BN(0))
        return
      }

      const code = await runState.eei.getExternalCode(address)
      if (code.length === 0) {
        runState.stack.push(new BN(KECCAK256_NULL))
        return
      }

      runState.stack.push(new BN(keccak256(code)))
    },
  ],
  // 0x3d: RETURNDATASIZE
  [
    0x3d,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getReturnDataSize())
    },
  ],
  // 0x3e: RETURNDATACOPY
  [
    0x3e,
    function (runState: RunState) {
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
  ],
  // 0x3a: GASPRICE
  [
    0x3a,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getTxGasPrice())
    },
  ],
  // '0x40' range - block operations
  // 0x40: BLOCKHASH
  [
    0x40,
    async function (runState: RunState) {
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
  ],
  // 0x41: COINBASE
  [
    0x41,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getBlockCoinbase())
    },
  ],
  // 0x42: TIMESTAMP
  [
    0x42,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getBlockTimestamp())
    },
  ],
  // 0x43: NUMBER
  [
    0x43,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getBlockNumber())
    },
  ],
  // 0x44: DIFFICULTY
  [
    0x44,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getBlockDifficulty())
    },
  ],
  // 0x45: GASLIMIT
  [
    0x45,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getBlockGasLimit())
    },
  ],
  // 0x46: CHAINID
  [
    0x46,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getChainId())
    },
  ],
  // 0x47: SELFBALANCE
  [
    0x47,
    function (runState: RunState) {
      runState.stack.push(runState.eei.getSelfBalance())
    },
  ],
  // 0x50 range - 'storage' and execution
  // 0x50: POP
  [
    0x50,
    function (runState: RunState) {
      runState.stack.pop()
    },
  ],
  // 0x51: MLOAD
  [
    0x51,
    function (runState: RunState) {
      const pos = runState.stack.pop()
      subMemUsage(runState, pos, new BN(32))
      const word = runState.memory.read(pos.toNumber(), 32)
      runState.stack.push(new BN(word))
    },
  ],
  // 0x52: MSTORE
  [
    0x52,
    function (runState: RunState) {
      let [offset, word] = runState.stack.popN(2)
      const buf = word.toArrayLike(Buffer, 'be', 32)
      subMemUsage(runState, offset, new BN(32))
      const offsetNum = offset.toNumber()
      runState.memory.extend(offsetNum, 32)
      runState.memory.write(offsetNum, 32, buf)
    },
  ],
  // 0x53: MSTORE8
  [
    0x53,
    function (runState: RunState) {
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
  ],
  // 0x54: SLOAD
  [
    0x54,
    async function (runState: RunState) {
      let key = runState.stack.pop()
      const keyBuf = key.toArrayLike(Buffer, 'be', 32)

      const value = await runState.eei.storageLoad(keyBuf)
      const valueBN = value.length ? new BN(value) : new BN(0)
      runState.stack.push(valueBN)
    },
  ],
  // 0x55: SSTORE
  [
    0x55,
    async function (runState: RunState) {
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
      updateSstoreGas(runState, found, setLengthLeftStorage(value))
      await runState.eei.storageStore(keyBuf, value)
    },
  ],
  // 0x56: JUMP
  [
    0x56,
    function (runState: RunState) {
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
  ],
  // 0x57: JUMPI
  [
    0x57,
    function (runState: RunState) {
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
  ],
  // 0x58: PC
  [
    0x58,
    function (runState: RunState) {
      runState.stack.push(new BN(runState.programCounter - 1))
    },
  ],
  // 0x59: MSIZE
  [
    0x59,
    function (runState: RunState) {
      runState.stack.push(runState.memoryWordCount.muln(32))
    },
  ],
  // 0x5a: GAS
  [
    0x5a,
    function (runState: RunState) {
      runState.stack.push(new BN(runState.eei.getGasLeft()))
    },
  ],
  // 0x5b: JUMPDEST
  [0x5b, function (runState: RunState) {}],
  // 0x5c: BEGINSUB
  [
    0x5c,
    function (runState: RunState) {
      trap(ERROR.INVALID_BEGINSUB + ' at ' + describeLocation(runState))
    },
  ],
  // 0x5d: RETURNSUB
  [
    0x5d,
    function (runState: RunState) {
      if (runState.returnStack.length < 1) {
        trap(ERROR.INVALID_RETURNSUB)
      }

      const dest = runState.returnStack.pop()
      runState.programCounter = dest.toNumber()
    },
  ],
  // 0x5e: JUMPSUB
  [
    0x5e,
    function (runState: RunState) {
      const dest = runState.stack.pop()

      if (dest.gt(runState.eei.getCodeSize())) {
        trap(ERROR.INVALID_JUMPSUB + ' at ' + describeLocation(runState))
      }

      const destNum = dest.toNumber()

      if (!jumpSubIsValid(runState, destNum)) {
        trap(ERROR.INVALID_JUMPSUB + ' at ' + describeLocation(runState))
      }

      runState.returnStack.push(new BN(runState.programCounter))
      runState.programCounter = destNum + 1
    },
  ],
  // 0x60: PUSH
  [
    0x60,
    function (runState: RunState) {
      const numToPush = runState.opCode - 0x5f
      const loaded = new BN(
        runState.eei.getCode().slice(runState.programCounter, runState.programCounter + numToPush),
      )
      runState.programCounter += numToPush
      runState.stack.push(loaded)
    },
  ],
  // 0x80: DUP
  [
    0x80,
    function (runState: RunState) {
      const stackPos = runState.opCode - 0x7f
      runState.stack.dup(stackPos)
    },
  ],
  // 0x90: SWAP
  [
    0x90,
    function (runState: RunState) {
      const stackPos = runState.opCode - 0x8f
      runState.stack.swap(stackPos)
    },
  ],
  // 0xa0: LOG
  [
    0xa0,
    function (runState: RunState) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      let [memOffset, memLength] = runState.stack.popN(2)

      const topicsCount = runState.opCode - 0xa0
      if (topicsCount < 0 || topicsCount > 4) {
        trap(ERROR.OUT_OF_RANGE)
      }

      let topics = runState.stack.popN(topicsCount)
      const topicsBuf = topics.map(function (a) {
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
  ],

  // '0xf0' range - closures
  // 0xf0: CREATE
  [
    0xf0,
    async function (runState: RunState) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [value, offset, length] = runState.stack.popN(3)

      subMemUsage(runState, offset, length)
      let gasLimit = new BN(runState.eei.getGasLeft())
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState)

      let data = Buffer.alloc(0)
      if (!length.isZero()) {
        data = runState.memory.read(offset.toNumber(), length.toNumber())
      }

      const ret = await runState.eei.create(gasLimit, value, data)
      runState.stack.push(ret)
    },
  ],
  // 0xf5: CREATE2
  [
    0xf5,
    async function (runState: RunState) {
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
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState) // CREATE2 is only available after TangerineWhistle (Constantinople introduced this opcode)

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
  ],
  // 0xf1: CALL
  [
    0xf1,
    async function (runState: RunState) {
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

      let data = Buffer.alloc(0)
      if (!inLength.isZero()) {
        data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
      }

      if (runState._common.gteHardfork('spuriousDragon')) {
        // We are at or after Spurious Dragon
        // Call new account gas: account is DEAD and we transfer nonzero value
        if ((await runState.eei.isAccountEmpty(toAddressBuf)) && !value.isZero()) {
          runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
        }
      } else if (!(await runState.eei.accountExists(toAddressBuf))) {
        // We are before Spurious Dragon and the account does not exist.
        // Call new account gas: account does not exist (it is not in the state trie, not even as an "empty" account)
        runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
      }

      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft())) {
        trap(ERROR.OUT_OF_GAS)
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
  ],
  // 0xf2: CALLCODE
  [
    0xf2,
    async function (runState: RunState) {
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
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft())) {
        trap(ERROR.OUT_OF_GAS)
      }
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
  ],
  // 0xf4: DELEGATECALL
  [
    0xf4,
    async function (runState: RunState) {
      const value = runState.eei.getCallValue()
      let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
      const toAddressBuf = addressToBuffer(toAddress)

      subMemUsage(runState, inOffset, inLength)
      subMemUsage(runState, outOffset, outLength)
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft())) {
        trap(ERROR.OUT_OF_GAS)
      }

      let data = Buffer.alloc(0)
      if (!inLength.isZero()) {
        data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
      }

      const ret = await runState.eei.callDelegate(gasLimit, toAddressBuf, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0x06: STATICCALL
  [
    0xfa,
    async function (runState: RunState) {
      const value = new BN(0)
      let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = runState.stack.popN(6)
      const toAddressBuf = addressToBuffer(toAddress)

      subMemUsage(runState, inOffset, inLength)
      subMemUsage(runState, outOffset, outLength)
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState) // we set TangerineWhistle or later to true here, as STATICCALL was available from Byzantium (which is after TangerineWhistle)

      let data = Buffer.alloc(0)
      if (!inLength.isZero()) {
        data = runState.memory.read(inOffset.toNumber(), inLength.toNumber())
      }

      const ret = await runState.eei.callStatic(gasLimit, toAddressBuf, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf3: RETURN
  [
    0xf3,
    function (runState: RunState) {
      const [offset, length] = runState.stack.popN(2)
      subMemUsage(runState, offset, length)
      let returnData = Buffer.alloc(0)
      if (!length.isZero()) {
        returnData = runState.memory.read(offset.toNumber(), length.toNumber())
      }
      runState.eei.finish(returnData)
    },
  ],
  // 0xfd: REVERT
  [
    0xfd,
    function (runState: RunState) {
      const [offset, length] = runState.stack.popN(2)
      subMemUsage(runState, offset, length)
      let returnData = Buffer.alloc(0)
      if (!length.isZero()) {
        returnData = runState.memory.read(offset.toNumber(), length.toNumber())
      }
      runState.eei.revert(returnData)
    },
  ],
  // '0x70', range - other
  // 0xff: SELFDESTRUCT
  [
    0xff,
    async function (runState: RunState) {
      let selfdestructToAddress = runState.stack.pop()
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const selfdestructToAddressBuf = addressToBuffer(selfdestructToAddress)
      let deductGas = false
      if (runState._common.gteHardfork('spuriousDragon')) {
        // EIP-161: State Trie Clearing
        const balance = await runState.eei.getExternalBalance(runState.eei.getAddress())
        if (balance.gtn(0)) {
          // This technically checks if account is empty or non-existent
          // TODO: improve on the API here (EEI and StateManager)
          const empty = await runState.eei.isAccountEmpty(selfdestructToAddressBuf)
          if (empty) {
            const account = await runState.stateManager.getAccount(selfdestructToAddressBuf)
            deductGas = true
          }
        }
      } else if (runState._common.gteHardfork('tangerineWhistle')) {
        // Pre EIP-150 (Tangerine Whistle) gas semantics
        const exists = await runState.stateManager.accountExists(selfdestructToAddressBuf)
        if (!exists) {
          deductGas = true
        }
      }
      if (deductGas) {
        runState.eei.useGas(new BN(runState._common.param('gasPrices', 'callNewAccount')))
      }

      return runState.eei.selfDestruct(selfdestructToAddressBuf)
    },
  ],
])

// Fill in rest of PUSHn, DUPn, SWAPn, LOGn for handlers
const pushFn = handlers.get(0x60)!
for (let i = 0x61; i <= 0x7f; i++) {
  handlers.set(i, pushFn)
}
const dupFn = handlers.get(0x80)!
for (let i = 0x81; i <= 0x8f; i++) {
  handlers.set(i, dupFn)
}
const swapFn = handlers.get(0x90)!
for (let i = 0x91; i <= 0x9f; i++) {
  handlers.set(i, swapFn)
}
const logFn = handlers.get(0xa0)!
for (let i = 0xa1; i <= 0xa4; i++) {
  handlers.set(i, logFn)
}

function describeLocation(runState: RunState) {
  const hash = keccak256(runState.eei.getCode()).toString('hex')
  const address = runState.eei.getAddress().toString('hex')
  const pc = runState.programCounter - 1
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
  data = setLengthRight(data, length.toNumber())

  return data
}

// checks if a jump is valid given a destination
function jumpIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps.indexOf(dest) !== -1
}

// returns the max call gas which we want to use for the gas limit
// note that pre-TangerineWhistle there was no hard limit. if you tried sending more gas, your CALLs (or equivalent) went OOG
//

/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 * @param {BN} gasLimit - requested gas Limit
 * @param {BN} gasLeft - current gas left
 * @param {RunState} runState - the current runState
 */
function maxCallGas(gasLimit: BN, gasLeft: BN, runState: RunState): BN {
  const isTangerineWhistleOrLater = runState._common.gteHardfork('tangerineWhistle')
  if (isTangerineWhistleOrLater) {
    const gasAllowed = gasLeft.sub(gasLeft.divn(64))
    return gasLimit.gt(gasAllowed) ? gasAllowed : gasLimit
  } else {
    return gasLimit
  }
}

// checks if a jumpsub is valid given a destination
function jumpSubIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumpSubs.indexOf(dest) !== -1
}

async function getContractStorage(runState: RunState, address: Buffer, key: Buffer) {
  const current = setLengthLeftStorage(await runState.stateManager.getContractStorage(address, key))
  if (
    runState._common.hardfork() === 'constantinople' ||
    runState._common.gteHardfork('istanbul')
  ) {
    const original = setLengthLeftStorage(
      await runState.stateManager.getOriginalContractStorage(address, key),
    )
    return { current, original }
  } else {
    return current
  }
}

function updateSstoreGas(runState: RunState, found: any, value: Buffer) {
  if (runState._common.hardfork() === 'constantinople') {
    const original = found.original
    const current = found.current
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

/**
  setLengthLeftStorage
  @param value: Buffer which we want to pad
  This is just a proxy function to ethereumjs-util's setLengthLeft, except it returns a zero length buffer in case the buffer is full of zeros.
*/

function setLengthLeftStorage(value: Buffer) {
  if (value.equals(Buffer.alloc(value.length, 0))) {
    // return the empty buffer (the value is zero)
    return Buffer.alloc(0)
  } else {
    return setLengthLeft(value, 32)
  }
}
