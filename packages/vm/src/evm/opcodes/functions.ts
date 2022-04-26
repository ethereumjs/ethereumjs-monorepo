import Common from '@ethereumjs/common'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'
import {
  Address,
  KECCAK256_NULL,
  TWO_POW256,
  MAX_INTEGER_BIGINT,
  bufferToBigInt,
  bigIntToBuffer,
  setLengthLeft,
  ecrecover,
  publicToAddress,
  SECP256K1_ORDER_DIV_2,
  setLengthRight,
} from 'ethereumjs-util'
import {
  addressToBuffer,
  describeLocation,
  getDataSlice,
  jumpIsValid,
  jumpSubIsValid,
  trap,
  writeCallOutput,
  mod,
  fromTwos,
  toTwos,
} from './util'
import { ERROR } from '../../exceptions'
import { RunState } from './../interpreter'
import { exponentation } from '.'

const EIP3074MAGIC = Buffer.from('03', 'hex')

export interface SyncOpHandler {
  (runState: RunState, common: Common): void
}

export interface AsyncOpHandler {
  (runState: RunState, common: Common): Promise<void>
}

export type OpHandler = SyncOpHandler | AsyncOpHandler

// the opcode functions
export const handlers: Map<number, OpHandler> = new Map([
  // 0x00: STOP
  [
    0x00,
    function () {
      trap(ERROR.STOP)
    },
  ],
  // 0x01: ADD
  [
    0x01,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = mod(a + b, TWO_POW256)
      runState.stack.push(r)
    },
  ],
  // 0x02: MUL
  [
    0x02,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = mod(a * b, TWO_POW256)
      runState.stack.push(r)
    },
  ],
  // 0x03: SUB
  [
    0x03,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = mod(a - b, TWO_POW256)
      runState.stack.push(r)
    },
  ],
  // 0x04: DIV
  [
    0x04,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b === BigInt(0)) {
        r = BigInt(0)
      } else {
        r = mod(a / b, TWO_POW256)
      }
      runState.stack.push(r)
    },
  ],
  // 0x05: SDIV
  [
    0x05,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b === BigInt(0)) {
        r = BigInt(0)
      } else {
        r = toTwos(fromTwos(a) / fromTwos(b))
      }
      runState.stack.push(r)
    },
  ],
  // 0x06: MOD
  [
    0x06,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b === BigInt(0)) {
        r = b
      } else {
        r = mod(a, b)
      }
      runState.stack.push(r)
    },
  ],
  // 0x07: SMOD
  [
    0x07,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b === BigInt(0)) {
        r = b
      } else {
        r = fromTwos(a) % fromTwos(b)
      }
      runState.stack.push(toTwos(r))
    },
  ],
  // 0x08: ADDMOD
  [
    0x08,
    function (runState) {
      const [a, b, c] = runState.stack.popN(3)
      let r
      if (c === BigInt(0)) {
        r = BigInt(0)
      } else {
        r = mod(a + b, c)
      }
      runState.stack.push(r)
    },
  ],
  // 0x09: MULMOD
  [
    0x09,
    function (runState) {
      const [a, b, c] = runState.stack.popN(3)
      let r
      if (c === BigInt(0)) {
        r = BigInt(0)
      } else {
        r = mod(a * b, c)
      }
      runState.stack.push(r)
    },
  ],
  // 0x0a: EXP
  [
    0x0a,
    function (runState, common) {
      const [base, exponent] = runState.stack.popN(2)
      if (exponent === BigInt(0)) {
        runState.stack.push(BigInt(1))
        return
      }
      let byteLength = exponent.toString(2).length / 8
      if (byteLength > Math.trunc(byteLength)) {
        byteLength = Math.trunc(byteLength) + 1
      }
      if (byteLength < 1 || byteLength > 32) {
        trap(ERROR.OUT_OF_RANGE)
      }
      const gasPrice = common.param('gasPrices', 'expByte')
      const amount = BigInt(byteLength) * gasPrice
      runState.eei.useGas(amount, 'EXP opcode')

      if (base === BigInt(0)) {
        runState.stack.push(base)
        return
      }
      const r = exponentation(base, exponent)
      runState.stack.push(r)
    },
  ],
  // 0x0b: SIGNEXTEND
  [
    0x0b,
    function (runState) {
      /* eslint-disable-next-line prefer-const */
      let [k, val] = runState.stack.popN(2)
      if (k < BigInt(31)) {
        const signBit = k * BigInt(8) + BigInt(7)
        const mask = (BigInt(1) << signBit) - BigInt(1)
        if ((val >> signBit) & BigInt(1)) {
          val = val | BigInt.asUintN(256, ~mask)
        } else {
          val = val & mask
        }
      }
      runState.stack.push(val)
    },
  ],
  // 0x10 range - bit ops
  // 0x10: LT
  [
    0x10,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a < b ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x11: GT
  [
    0x11,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a > b ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x12: SLT
  [
    0x12,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) < fromTwos(b) ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x13: SGT
  [
    0x13,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) > fromTwos(b) ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x14: EQ
  [
    0x14,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a === b ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x15: ISZERO
  [
    0x15,
    function (runState) {
      const a = runState.stack.pop()
      const r = a === BigInt(0) ? BigInt(1) : BigInt(0)
      runState.stack.push(r)
    },
  ],
  // 0x16: AND
  [
    0x16,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a & b
      runState.stack.push(r)
    },
  ],
  // 0x17: OR
  [
    0x17,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a | b
      runState.stack.push(r)
    },
  ],
  // 0x18: XOR
  [
    0x18,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a ^ b
      runState.stack.push(r)
    },
  ],
  // 0x19: NOT
  [
    0x19,
    function (runState) {
      const a = runState.stack.pop()
      const r = BigInt.asUintN(256, ~a)
      runState.stack.push(r)
    },
  ],
  // 0x1a: BYTE
  [
    0x1a,
    function (runState) {
      const [pos, word] = runState.stack.popN(2)
      if (pos > BigInt(32)) {
        runState.stack.push(BigInt(0))
        return
      }

      const r = (word >> ((BigInt(31) - pos) * BigInt(8))) & BigInt(0xff)
      runState.stack.push(r)
    },
  ],
  // 0x1b: SHL
  [
    0x1b,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      if (a > BigInt(256)) {
        runState.stack.push(BigInt(0))
        return
      }

      const r = (b << a) & MAX_INTEGER_BIGINT
      runState.stack.push(r)
    },
  ],
  // 0x1c: SHR
  [
    0x1c,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      if (a > 256) {
        runState.stack.push(BigInt(0))
        return
      }

      const r = b >> a
      runState.stack.push(r)
    },
  ],
  // 0x1d: SAR
  [
    0x1d,
    function (runState) {
      const [a, b] = runState.stack.popN(2)

      let r
      const bComp = BigInt.asIntN(256, b)
      const isSigned = bComp < 0
      if (a > 256) {
        if (isSigned) {
          r = MAX_INTEGER_BIGINT
        } else {
          r = BigInt(0)
        }
        runState.stack.push(r)
        return
      }

      const c = b >> a
      if (isSigned) {
        const shiftedOutWidth = BigInt(255) - a
        const mask = (MAX_INTEGER_BIGINT >> shiftedOutWidth) << shiftedOutWidth
        r = c | mask
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
    function (runState) {
      const [offset, length] = runState.stack.popN(2)
      let data = Buffer.alloc(0)
      if (length !== BigInt(0)) {
        data = runState.memory.read(Number(offset), Number(length))
      }
      const r = BigInt('0x' + bytesToHex(keccak256(data)))
      runState.stack.push(r)
    },
  ],
  // 0x30 range - closure state
  // 0x30: ADDRESS
  [
    0x30,
    function (runState) {
      const address = bufferToBigInt(runState.eei.getAddress().buf)
      runState.stack.push(address)
    },
  ],
  // 0x31: BALANCE
  [
    0x31,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBigInt))
      const balance = await runState.eei.getExternalBalance(address)
      runState.stack.push(balance)
    },
  ],
  // 0x32: ORIGIN
  [
    0x32,
    function (runState) {
      runState.stack.push(runState.eei.getTxOrigin())
    },
  ],
  // 0x33: CALLER
  [
    0x33,
    function (runState) {
      runState.stack.push(runState.eei.getCaller())
    },
  ],
  // 0x34: CALLVALUE
  [
    0x34,
    function (runState) {
      runState.stack.push(runState.eei.getCallValue())
    },
  ],
  // 0x35: CALLDATALOAD
  [
    0x35,
    function (runState) {
      const pos = runState.stack.pop()
      if (pos > runState.eei.getCallDataSize()) {
        runState.stack.push(BigInt(0))
        return
      }

      const i = Number(pos)
      let loaded = runState.eei.getCallData().slice(i, i + 32)
      loaded = loaded.length ? loaded : Buffer.from([0])
      let r = bufferToBigInt(loaded)
      if (loaded.length < 32) {
        r = r << (BigInt(8) * BigInt(32 - loaded.length))
      }
      runState.stack.push(r)
    },
  ],
  // 0x36: CALLDATASIZE
  [
    0x36,
    function (runState) {
      const r = runState.eei.getCallDataSize()
      runState.stack.push(r)
    },
  ],
  // 0x37: CALLDATACOPY
  [
    0x37,
    function (runState) {
      const [memOffset, dataOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BigInt(0)) {
        const data = getDataSlice(runState.eei.getCallData(), dataOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const dataLengthNum = Number(dataLength)
        runState.memory.extend(memOffsetNum, dataLengthNum)
        runState.memory.write(memOffsetNum, dataLengthNum, data)
      }
    },
  ],
  // 0x38: CODESIZE
  [
    0x38,
    function (runState) {
      runState.stack.push(runState.eei.getCodeSize())
    },
  ],
  // 0x39: CODECOPY
  [
    0x39,
    function (runState) {
      const [memOffset, codeOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BigInt(0)) {
        const data = getDataSlice(runState.eei.getCode(), codeOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.extend(memOffsetNum, lengthNum)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3b: EXTCODESIZE
  [
    0x3b,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const size = await runState.eei.getExternalCodeSize(addressBigInt)
      runState.stack.push(size)
    },
  ],
  // 0x3c: EXTCODECOPY
  [
    0x3c,
    async function (runState) {
      const [addressBigInt, memOffset, codeOffset, dataLength] = runState.stack.popN(4)

      if (dataLength !== BigInt(0)) {
        const code = await runState.eei.getExternalCode(addressBigInt)

        const data = getDataSlice(code, codeOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.extend(memOffsetNum, lengthNum)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3f: EXTCODEHASH
  [
    0x3f,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBigInt))
      const empty = await runState.eei.isAccountEmpty(address)
      if (empty) {
        runState.stack.push(BigInt(0))
        return
      }

      const code = await runState.eei.getExternalCode(addressBigInt)
      if (code.length === 0) {
        runState.stack.push(bufferToBigInt(KECCAK256_NULL))
        return
      }

      runState.stack.push(BigInt('0x' + bytesToHex(keccak256(code))))
    },
  ],
  // 0x3d: RETURNDATASIZE
  [
    0x3d,
    function (runState) {
      runState.stack.push(runState.eei.getReturnDataSize())
    },
  ],
  // 0x3e: RETURNDATACOPY
  [
    0x3e,
    function (runState) {
      const [memOffset, returnDataOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BigInt(0)) {
        const data = getDataSlice(runState.eei.getReturnData(), returnDataOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.extend(memOffsetNum, lengthNum)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3a: GASPRICE
  [
    0x3a,
    function (runState) {
      runState.stack.push(runState.eei.getTxGasPrice())
    },
  ],
  // '0x40' range - block operations
  // 0x40: BLOCKHASH
  [
    0x40,
    async function (runState) {
      const number = runState.stack.pop()

      const diff = runState.eei.getBlockNumber() - number
      // block lookups must be within the past 256 blocks
      if (diff > BigInt(256) || diff <= BigInt(0)) {
        runState.stack.push(BigInt(0))
        return
      }

      const hash = await runState.eei.getBlockHash(number)
      runState.stack.push(hash)
    },
  ],
  // 0x41: COINBASE
  [
    0x41,
    function (runState) {
      runState.stack.push(runState.eei.getBlockCoinbase())
    },
  ],
  // 0x42: TIMESTAMP
  [
    0x42,
    function (runState) {
      runState.stack.push(runState.eei.getBlockTimestamp())
    },
  ],
  // 0x43: NUMBER
  [
    0x43,
    function (runState) {
      runState.stack.push(runState.eei.getBlockNumber())
    },
  ],
  // 0x44: DIFFICULTY (EIP-4399: supplanted as PREVRANDAO)
  [
    0x44,
    function (runState, common) {
      if (common.isActivatedEIP(4399)) {
        runState.stack.push(runState.eei.getBlockPrevRandao())
      } else {
        runState.stack.push(runState.eei.getBlockDifficulty())
      }
    },
  ],
  // 0x45: GASLIMIT
  [
    0x45,
    function (runState) {
      runState.stack.push(runState.eei.getBlockGasLimit())
    },
  ],
  // 0x46: CHAINID
  [
    0x46,
    function (runState) {
      runState.stack.push(runState.eei.getChainId())
    },
  ],
  // 0x47: SELFBALANCE
  [
    0x47,
    function (runState) {
      runState.stack.push(runState.eei.getSelfBalance())
    },
  ],
  // 0x48: BASEFEE
  [
    0x48,
    function (runState) {
      runState.stack.push(runState.eei.getBlockBaseFee())
    },
  ],
  // 0x50 range - 'storage' and execution
  // 0x50: POP
  [
    0x50,
    function (runState) {
      runState.stack.pop()
    },
  ],
  // 0x51: MLOAD
  [
    0x51,
    function (runState) {
      const pos = runState.stack.pop()
      const word = runState.memory.read(Number(pos), 32)
      runState.stack.push(bufferToBigInt(word))
    },
  ],
  // 0x52: MSTORE
  [
    0x52,
    function (runState) {
      const [offset, word] = runState.stack.popN(2)
      const buf = setLengthLeft(bigIntToBuffer(word), 32)
      const offsetNum = Number(offset)
      runState.memory.extend(offsetNum, 32)
      runState.memory.write(offsetNum, 32, buf)
    },
  ],
  // 0x53: MSTORE8
  [
    0x53,
    function (runState) {
      const [offset, byte] = runState.stack.popN(2)

      const buf = bigIntToBuffer(byte & BigInt(0xff))
      const offsetNum = Number(offset)
      runState.memory.extend(offsetNum, 1)
      runState.memory.write(offsetNum, 1, buf)
    },
  ],
  // 0x54: SLOAD
  [
    0x54,
    async function (runState) {
      const key = runState.stack.pop()
      const keyBuf = setLengthLeft(bigIntToBuffer(key), 32)
      const value = await runState.eei.storageLoad(keyBuf)
      const valueBigInt = value.length ? bufferToBigInt(value) : BigInt(0)
      runState.stack.push(valueBigInt)
    },
  ],
  // 0x55: SSTORE
  [
    0x55,
    async function (runState) {
      const [key, val] = runState.stack.popN(2)

      const keyBuf = setLengthLeft(bigIntToBuffer(key), 32)
      // NOTE: this should be the shortest representation
      let value
      if (val === BigInt(0)) {
        value = Buffer.from([])
      } else {
        value = bigIntToBuffer(val)
      }

      await runState.eei.storageStore(keyBuf, value)
    },
  ],
  // 0x56: JUMP
  [
    0x56,
    function (runState) {
      const dest = runState.stack.pop()
      if (dest > runState.eei.getCodeSize()) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      const destNum = Number(dest)

      if (!jumpIsValid(runState, destNum)) {
        trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      runState.programCounter = destNum
    },
  ],
  // 0x57: JUMPI
  [
    0x57,
    function (runState) {
      const [dest, cond] = runState.stack.popN(2)
      if (cond !== BigInt(0)) {
        if (dest > runState.eei.getCodeSize()) {
          trap(ERROR.INVALID_JUMP + ' at ' + describeLocation(runState))
        }

        const destNum = Number(dest)

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
    function (runState) {
      runState.stack.push(BigInt(runState.programCounter - 1))
    },
  ],
  // 0x59: MSIZE
  [
    0x59,
    function (runState) {
      runState.stack.push(runState.memoryWordCount * BigInt(32))
    },
  ],
  // 0x5a: GAS
  [
    0x5a,
    function (runState) {
      runState.stack.push(runState.eei.getGasLeft())
    },
  ],
  // 0x5b: JUMPDEST
  [0x5b, function () {}],
  // 0x5c: BEGINSUB
  [
    0x5c,
    function (runState) {
      trap(ERROR.INVALID_BEGINSUB + ' at ' + describeLocation(runState))
    },
  ],
  // 0x5d: RETURNSUB
  [
    0x5d,
    function (runState) {
      if (runState.returnStack.length < 1) {
        trap(ERROR.INVALID_RETURNSUB)
      }

      const dest = runState.returnStack.pop()
      runState.programCounter = Number(dest)
    },
  ],
  // 0x5e: JUMPSUB
  [
    0x5e,
    function (runState) {
      const dest = runState.stack.pop()

      if (dest > runState.eei.getCodeSize()) {
        trap(ERROR.INVALID_JUMPSUB + ' at ' + describeLocation(runState))
      }

      const destNum = Number(dest)

      if (!jumpSubIsValid(runState, destNum)) {
        trap(ERROR.INVALID_JUMPSUB + ' at ' + describeLocation(runState))
      }

      runState.returnStack.push(BigInt(runState.programCounter))
      runState.programCounter = destNum + 1
    },
  ],
  // 0x5f: PUSH0
  [
    0x5f,
    function (runState) {
      runState.stack.push(BigInt(0))
    },
  ],
  // 0x60: PUSH
  [
    0x60,
    function (runState) {
      const numToPush = runState.opCode - 0x5f
      if (
        runState.eei._common.isActivatedEIP(3540) &&
        runState.programCounter + numToPush > runState.code.length
      ) {
        trap(ERROR.OUT_OF_RANGE)
      }
      const loaded = bufferToBigInt(
        runState.eei.getCode().slice(runState.programCounter, runState.programCounter + numToPush)
      )
      runState.programCounter += numToPush
      runState.stack.push(loaded)
    },
  ],
  // 0x80: DUP
  [
    0x80,
    function (runState) {
      const stackPos = runState.opCode - 0x7f
      runState.stack.dup(stackPos)
    },
  ],
  // 0x90: SWAP
  [
    0x90,
    function (runState) {
      const stackPos = runState.opCode - 0x8f
      runState.stack.swap(stackPos)
    },
  ],
  // 0xa0: LOG
  [
    0xa0,
    function (runState) {
      const [memOffset, memLength] = runState.stack.popN(2)

      const topicsCount = runState.opCode - 0xa0

      const topics = runState.stack.popN(topicsCount)
      const topicsBuf = topics.map(function (a: bigint) {
        return setLengthLeft(bigIntToBuffer(a), 32)
      })

      let mem = Buffer.alloc(0)
      if (memLength !== BigInt(0)) {
        mem = runState.memory.read(Number(memOffset), Number(memLength))
      }

      runState.eei.log(mem, topicsCount, topicsBuf)
    },
  ],
  // 0xb3: TLOAD
  [
    0xb3,
    function (runState) {
      const key = runState.stack.pop()
      const keyBuf = setLengthLeft(bigIntToBuffer(key), 32)
      const value = runState.eei.transientStorageLoad(keyBuf)
      const valueBN = value.length ? bufferToBigInt(value) : BigInt(0)
      runState.stack.push(valueBN)
    },
  ],
  // 0xb4: TSTORE
  [
    0xb4,
    function (runState) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }
      const [key, val] = runState.stack.popN(2)

      const keyBuf = setLengthLeft(bigIntToBuffer(key), 32)
      // NOTE: this should be the shortest representation
      let value
      if (val === BigInt(0)) {
        value = Buffer.from([])
      } else {
        value = bigIntToBuffer(val)
      }

      runState.eei.transientStorageStore(keyBuf, value)
    },
  ],
  // '0xf0' range - closures
  // 0xf0: CREATE
  [
    0xf0,
    async function (runState) {
      const [value, offset, length] = runState.stack.popN(3)

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = Buffer.alloc(0)
      if (length !== BigInt(0)) {
        data = runState.memory.read(Number(offset), Number(length))
      }

      const ret = await runState.eei.create(gasLimit, value, data)
      runState.stack.push(ret)
    },
  ],
  // 0xf5: CREATE2
  [
    0xf5,
    async function (runState) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [value, offset, length, salt] = runState.stack.popN(4)

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = Buffer.alloc(0)
      if (length !== BigInt(0)) {
        data = runState.memory.read(Number(offset), Number(length))
      }

      const ret = await runState.eei.create2(
        gasLimit,
        value,
        data,
        setLengthLeft(bigIntToBuffer(salt), 32)
      )
      runState.stack.push(ret)
    },
  ],
  // 0xf1: CALL
  [
    0xf1,
    async function (runState: RunState) {
      const [_currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      let data = Buffer.alloc(0)
      if (inLength !== BigInt(0)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      const ret = await runState.eei.call(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf2: CALLCODE
  [
    0xf2,
    async function (runState: RunState) {
      const [_currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = Buffer.alloc(0)
      if (inLength !== BigInt(0)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      const ret = await runState.eei.callCode(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf4: DELEGATECALL
  [
    0xf4,
    async function (runState) {
      const value = runState.eei.getCallValue()
      const [_currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      let data = Buffer.alloc(0)
      if (inLength !== BigInt(0)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      const ret = await runState.eei.callDelegate(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf6: AUTH
  [
    0xf6,
    async function (runState) {
      // eslint-disable-next-line prefer-const
      let [authority, memOffset, memLength] = runState.stack.popN(3)

      if (memLength > 128n) {
        memLength = 128n
      }

      let mem = runState.memory.read(Number(memOffset), Number(memLength))
      if (mem.length < 128) {
        mem = setLengthRight(mem, 128)
      }

      const yParity = bufferToBigInt(mem[31])
      const r = mem.slice(32, 64)
      const s = mem.slice(64, 96)
      const commit = mem.slice(96, 128)

      if (bufferToBigInt(s) > SECP256K1_ORDER_DIV_2) {
        trap(ERROR.AUTH_INVALID_S)
      }

      const paddedInvokerAddress = setLengthLeft(runState.eei._env.address.buf, 32)
      const chainId = setLengthLeft(bigIntToBuffer(runState.eei.getChainId()), 32)
      const message = Buffer.concat([EIP3074MAGIC, chainId, paddedInvokerAddress, commit])
      const msgHash = Buffer.from(keccak256(message))

      let recover
      try {
        recover = ecrecover(msgHash, Number(yParity) + 27, r, s)
      } catch (e) {
        // Malformed signature, push 0 on stack, clear auth variable
        runState.stack.push(BigInt(0))
        runState.eei._env.auth = undefined
        return
      }

      const addressBuffer = publicToAddress(recover)
      const address = new Address(addressBuffer)

      const expectedAddress = new Address(setLengthLeft(bigIntToBuffer(authority), 20))

      if (!expectedAddress.equals(address)) {
        // expected address does not equal the recovered address, clear auth variable
        runState.stack.push(BigInt(0))
        runState.eei._env.auth = undefined
        return
      }

      runState.eei._env.auth = address
      runState.stack.push(BigInt(1))
    },
  ],
  // 0xf7: AUTHCALL
  [
    0xf7,
    async function (runState) {
      const [
        _currentGasLimit,
        addr,
        value,
        _valueExt,
        argsOffset,
        argsLength,
        retOffset,
        retLength,
      ] = runState.stack.popN(8)

      const toAddress = new Address(addressToBuffer(addr))

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = Buffer.alloc(0)
      if (argsLength !== BigInt(0)) {
        data = runState.memory.read(Number(argsOffset), Number(argsLength))
      }

      const ret = await runState.eei.authcall(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, retOffset, retLength)
      runState.stack.push(ret)
    },
  ],
  // 0xfa: STATICCALL
  [
    0xfa,
    async function (runState) {
      const value = BigInt(0)
      const [_currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = Buffer.alloc(0)
      if (inLength !== BigInt(0)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      const ret = await runState.eei.callStatic(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf3: RETURN
  [
    0xf3,
    function (runState) {
      const [offset, length] = runState.stack.popN(2)
      let returnData = Buffer.alloc(0)
      if (length !== BigInt(0)) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.eei.finish(returnData)
    },
  ],
  // 0xfd: REVERT
  [
    0xfd,
    function (runState) {
      const [offset, length] = runState.stack.popN(2)
      let returnData = Buffer.alloc(0)
      if (length !== BigInt(0)) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.eei.revert(returnData)
    },
  ],
  // '0x70', range - other
  // 0xff: SELFDESTRUCT
  [
    0xff,
    async function (runState) {
      const selfdestructToAddressBigInt = runState.stack.pop()
      const selfdestructToAddress = new Address(addressToBuffer(selfdestructToAddressBigInt))
      return runState.eei.selfDestruct(selfdestructToAddress)
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
