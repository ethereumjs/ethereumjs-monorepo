import Common from '@ethereumjs/common'
import {
  Address,
  keccak256,
  KECCAK256_NULL,
  TWO_POW256_BIGINT,
  MAX_INTEGER_BIGINT,
  bufferToHex,
  toBuffer,
  setLengthLeft,
} from 'ethereumjs-util'
import {
  addressToBuffer,
  describeLocation,
  divCeil,
  getDataSlice,
  jumpIsValid,
  jumpSubIsValid,
  maxCallGas,
  setLengthLeftStorage,
  subMemUsage,
  trap,
  writeCallOutput,
  updateSstoreGas,
  mod,
  fromTwos,
  toTwos,
  abs,
} from './util'
import { updateSstoreGasEIP1283 } from './EIP1283'
import { updateSstoreGasEIP2200 } from './EIP2200'
import { accessAddressEIP2929, accessStorageEIP2929 } from './EIP2929'
import { ERROR } from '../../exceptions'
import { RunState } from './../interpreter'

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
      const r = mod(a + b, TWO_POW256_BIGINT)
      runState.stack.push(r)
    },
  ],
  // 0x02: MUL
  [
    0x02,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = mod(a * b, TWO_POW256_BIGINT)
      runState.stack.push(r)
    },
  ],
  // 0x03: SUB
  [
    0x03,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = mod(a - b, TWO_POW256_BIGINT)
      runState.stack.push(r)
    },
  ],
  // 0x04: DIV
  [
    0x04,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      let r
      if (b === 0n) {
        r = 0n
      } else {
        r = mod(a / b, TWO_POW256_BIGINT)
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
      if (b === 0n) {
        r = 0n
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
      if (b === 0n) {
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
      if (b === 0n) {
        r = b
      } else {
        r = mod(abs(fromTwos(a)), abs(fromTwos(b)))
        if (r < 0) {
          r ^= -1n
        }
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
      if (c === 0n) {
        r = 0n
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
      if (c === 0n) {
        r = 0n
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
      if (exponent === 0n) {
        runState.stack.push(1n)
        return
      }
      const byteLength = exponent.toString(2).length
      if (byteLength < 1 || byteLength > 32) {
        trap(ERROR.OUT_OF_RANGE)
      }
      const gasPrice = common.param('gasPrices', 'expByte')
      const amount = byteLength * gasPrice
      runState.eei.useGas(BigInt(amount), 'EXP opcode')

      if (base === 0n) {
        runState.stack.push(base)
        return
      }
      const r = base ** exponent
      runState.stack.push(r)
    },
  ],
  // 0x0b: SIGNEXTEND
  [
    0x0b,
    function (runState) {
      /* eslint-disable-next-line prefer-const */
      let [k, val] = runState.stack.popN(2)
      if (k > 31n) {
        const signBit = k * 8n + 7n
        const mask = (1n << signBit) - 1n
        if (val.toString(2)[Number(signBit)] === '1') {
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
      const r = a < b ? 1n : 0n
      runState.stack.push(r)
    },
  ],
  // 0x11: GT
  [
    0x11,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a > b ? 1n : 0n
      runState.stack.push(r)
    },
  ],
  // 0x12: SLT
  [
    0x12,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) < fromTwos(b) ? 1n : 0n
      runState.stack.push(r)
    },
  ],
  // 0x13: SGT
  [
    0x13,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) > fromTwos(b) ? 1n : 0n
      runState.stack.push(r)
    },
  ],
  // 0x14: EQ
  [
    0x14,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a === b ? 1n : 0n
      runState.stack.push(r)
    },
  ],
  // 0x15: ISZERO
  [
    0x15,
    function (runState) {
      const a = runState.stack.pop()
      const r = a === 0n ? 1n : 0n
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
      if (pos > 32n) {
        runState.stack.push(0n)
        return
      }

      const r = (word >> ((31n - pos) * 8n)) & BigInt(0xff)
      runState.stack.push(r)
    },
  ],
  // 0x1b: SHL
  [
    0x1b,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      if (a > 256n) {
        runState.stack.push(0n)
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
        runState.stack.push(0n)
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
      const isSigned = b.toString(2)[255] === '1'
      if (a > 256) {
        if (isSigned) {
          r = MAX_INTEGER_BIGINT
        } else {
          r = 0n
        }
        runState.stack.push(r)
        return
      }

      const c = b >> a
      if (isSigned) {
        const shiftedOutWidth = 255n - a
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
    function (runState, common) {
      const [offset, length] = runState.stack.popN(2)
      subMemUsage(runState, offset, length, common)
      let data = Buffer.alloc(0)
      if (!(length === 0n)) {
        data = runState.memory.read(Number(offset), Number(length))
      }
      // copy fee
      runState.eei.useGas(
        BigInt(common.param('gasPrices', 'sha3Word') * divCeil(length, 32n)),
        'SHA3 opcode'
      )
      const r = BigInt(keccak256(data).toString('hex'))
      runState.stack.push(r)
    },
  ],
  // 0x30 range - closure state
  // 0x30: ADDRESS
  [
    0x30,
    function (runState) {
      const address = BigInt(runState.eei.getAddress().buf.toString('hex'))
      runState.stack.push(address)
    },
  ],
  // 0x31: BALANCE
  [
    0x31,
    async function (runState, common) {
      const addressBigInt = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBigInt))
      accessAddressEIP2929(runState, address, common)
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
        runState.stack.push(0n)
        return
      }

      const i = Number(pos)
      let loaded = runState.eei.getCallData().slice(i, i + 32)
      loaded = loaded.length ? loaded : Buffer.from([0])
      const r = BigInt.asUintN(256, BigInt(bufferToHex(loaded)))
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
    function (runState, common) {
      const [memOffset, dataOffset, dataLength] = runState.stack.popN(3)

      subMemUsage(runState, memOffset, dataLength, common)

      if (!(dataLength === 0n)) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'copy')) * divCeil(dataLength, 32n),
          'CALLDATACOPY opcode'
        )

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
    function (runState, common) {
      const [memOffset, codeOffset, dataLength] = runState.stack.popN(3)

      subMemUsage(runState, memOffset, dataLength, common)

      if (!(dataLength === 0n)) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'copy')) * divCeil(dataLength, 32n),
          'CODECOPY opcode'
        )

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
    async function (runState, common) {
      const addressBigInt = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBigInt))
      accessAddressEIP2929(runState, address, common)
      const size = await runState.eei.getExternalCodeSize(addressBigInt)
      runState.stack.push(size)
    },
  ],
  // 0x3c: EXTCODECOPY
  [
    0x3c,
    async function (runState, common) {
      const [addressBigInt, memOffset, codeOffset, dataLength] = runState.stack.popN(4)

      // FIXME: for some reason this must come before subGas
      subMemUsage(runState, memOffset, dataLength, common)
      const address = new Address(addressToBuffer(addressBigInt))
      accessAddressEIP2929(runState, address, common)

      if (!(dataLength === 0n)) {
        // copy fee
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'copy')) * divCeil(dataLength, 32n),
          'EXTCODECOPY opcode'
        )

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
    async function (runState, common) {
      const addressBigInt = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBigInt))
      accessAddressEIP2929(runState, address, common)
      const empty = await runState.eei.isAccountEmpty(address)
      if (empty) {
        runState.stack.push(0n)
        return
      }

      const code = await runState.eei.getExternalCode(addressBigInt)
      if (code.length === 0) {
        runState.stack.push(BigInt(bufferToHex(KECCAK256_NULL)))
        return
      }

      runState.stack.push(BigInt(bufferToHex(keccak256(code))))
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
    function (runState, common) {
      const [memOffset, returnDataOffset, dataLength] = runState.stack.popN(3)

      if (returnDataOffset + dataLength > runState.eei.getReturnDataSize()) {
        trap(ERROR.OUT_OF_GAS)
      }

      subMemUsage(runState, memOffset, dataLength, common)

      if (!(dataLength === 0n)) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'copy')) * divCeil(dataLength, 32n),
          'RETURNDATACOPY opcode'
        )

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
      if (diff > 256n || diff <= 0n) {
        runState.stack.push(0n)
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
  // 0x44: DIFFICULTY
  [
    0x44,
    function (runState) {
      runState.stack.push(runState.eei.getBlockDifficulty())
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
    function (runState, common) {
      const pos = runState.stack.pop()
      subMemUsage(runState, pos, 32n, common)
      const word = runState.memory.read(Number(pos), 32)
      runState.stack.push(BigInt(bufferToHex(word)))
    },
  ],
  // 0x52: MSTORE
  [
    0x52,
    function (runState, common) {
      const [offset, word] = runState.stack.popN(2)
      const buf = setLengthLeft(toBuffer('0x' + word.toString(16)), 32)
      subMemUsage(runState, offset, 32n, common)
      const offsetNum = Number(offset)
      runState.memory.extend(offsetNum, 32)
      runState.memory.write(offsetNum, 32, buf)
    },
  ],
  // 0x53: MSTORE8
  [
    0x53,
    function (runState, common) {
      const [offset, byte] = runState.stack.popN(2)

      // Convert bigint to hex string and then take the least significant byte (i.e. the last character of the string)
      const byteHex = byte.toString(16)
      const buf = toBuffer(byteHex[byteHex.length - 1])
      subMemUsage(runState, offset, 1n, common)
      const offsetNum = Number(offset)
      runState.memory.extend(offsetNum, 1)
      runState.memory.write(offsetNum, 1, buf)
    },
  ],
  // 0x54: SLOAD
  [
    0x54,
    async function (runState, common) {
      const key = runState.stack.pop()
      const keyBuf = setLengthLeft(toBuffer('0x' + key.toString(16)), 32)
      accessStorageEIP2929(runState, keyBuf, false, common)
      const value = await runState.eei.storageLoad(keyBuf)
      const valueBigInt = value.length ? BigInt(bufferToHex(value)) : 0n
      runState.stack.push(valueBigInt)
    },
  ],
  // 0x55: SSTORE
  [
    0x55,
    async function (runState, common) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [key, val] = runState.stack.popN(2)

      const keyBuf = setLengthLeft(toBuffer('0x' + key.toString(16)), 32)
      // NOTE: this should be the shortest representation
      let value
      if (val === 0n) {
        value = Buffer.from([])
      } else {
        value = toBuffer('0x' + val.toString(16))
      }

      const currentStorage = setLengthLeftStorage(await runState.eei.storageLoad(keyBuf))
      if (common.hardfork() === 'constantinople' || common.gteHardfork('istanbul')) {
        const originalStorage = setLengthLeftStorage(await runState.eei.storageLoad(keyBuf, true))
        if (common.hardfork() === 'constantinople') {
          updateSstoreGasEIP1283(
            runState,
            currentStorage,
            originalStorage,
            setLengthLeftStorage(value),
            common
          )
        } else {
          updateSstoreGasEIP2200(
            runState,
            currentStorage,
            originalStorage,
            setLengthLeftStorage(value),
            keyBuf,
            common
          )
        }
      } else {
        updateSstoreGas(runState, currentStorage, setLengthLeftStorage(value), keyBuf, common)
      }

      // We have to do this after the Istanbul (EIP2200) checks.
      // Otherwise, we might run out of gas, due to "sentry check" of 2300 gas, if we deduct extra gas first.
      accessStorageEIP2929(runState, keyBuf, true, common)

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
      if (!(cond === 0n)) {
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
      runState.stack.push(runState.memoryWordCount * 32n)
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
      runState.stack.push(0n)
    },
  ],
  // 0x60: PUSH
  [
    0x60,
    function (runState) {
      const numToPush = runState.opCode - 0x5f
      const loaded = BigInt(
        bufferToHex(
          runState.eei.getCode().slice(runState.programCounter, runState.programCounter + numToPush)
        )
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
    function (runState, common) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [memOffset, memLength] = runState.stack.popN(2)

      const topicsCount = runState.opCode - 0xa0
      if (topicsCount < 0 || topicsCount > 4) {
        trap(ERROR.OUT_OF_RANGE)
      }

      const topics = runState.stack.popN(topicsCount)
      const topicsBuf = topics.map(function (a: bigint) {
        return setLengthLeft(toBuffer('0x' + a.toString(16)), 32)
      })

      subMemUsage(runState, memOffset, memLength, common)
      let mem = Buffer.alloc(0)
      if (!(memLength === 0n)) {
        mem = runState.memory.read(Number(memOffset), Number(memLength))
      }
      runState.eei.useGas(
        BigInt(common.param('gasPrices', 'logTopic')) * BigInt(topicsCount) +
        memLength * BigInt(common.param('gasPrices', 'logData')),
        'LOG opcode'
      )

      runState.eei.log(mem, topicsCount, topicsBuf)
    },
  ],

  // '0xf0' range - closures
  // 0xf0: CREATE
  [
    0xf0,
    async function (runState, common) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [value, offset, length] = runState.stack.popN(3)

      accessAddressEIP2929(runState, runState.eei.getAddress(), common, false)

      subMemUsage(runState, offset, length, common)
      let gasLimit = runState.eei.getGasLeft()
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState, common)

      let data = Buffer.alloc(0)
      if (!(length === 0n)) {
        data = runState.memory.read(Number(offset), Number(length))
      }

      const ret = await runState.eei.create(gasLimit, value, data)
      runState.stack.push(ret)
    },
  ],
  // 0xf5: CREATE2
  [
    0xf5,
    async function (runState, common) {
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const [value, offset, length, salt] = runState.stack.popN(4)

      subMemUsage(runState, offset, length, common)
      accessAddressEIP2929(runState, runState.eei.getAddress(), common, false)

      // Deduct gas costs for hashing
      runState.eei.useGas(
        BigInt(common.param('gasPrices', 'sha3Word')) * divCeil(length, 32n),
        'CREATE2 opcode'
      )
      let gasLimit = runState.eei.getGasLeft()
      gasLimit = maxCallGas(gasLimit, runState.eei.getGasLeft(), runState, common) // CREATE2 is only available after TangerineWhistle (Constantinople introduced this opcode)

      let data = Buffer.alloc(0)
      if (!(length === 0n)) {
        data = runState.memory.read(Number(offset), Number(length))
      }

      const ret = await runState.eei.create2(
        gasLimit,
        value,
        data,
        setLengthLeft(toBuffer('0x' + salt.toString(16)), 32)
      )
      runState.stack.push(ret)
    },
  ],
  // 0xf1: CALL
  [
    0xf1,
    async function (runState, common) {
      const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      if (runState.eei.isStatic() && !(value === 0n)) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }
      subMemUsage(runState, inOffset, inLength, common)
      subMemUsage(runState, outOffset, outLength, common)
      accessAddressEIP2929(runState, toAddress, common)

      if (!(value === 0n)) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'callValueTransfer')),
          'CALL opcode -> callValueTransfer'
        )
      }

      let data = Buffer.alloc(0)
      if (!(inLength === 0n)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      if (common.gteHardfork('spuriousDragon')) {
        // We are at or after Spurious Dragon
        // Call new account gas: account is DEAD and we transfer nonzero value
        if ((await runState.eei.isAccountEmpty(toAddress)) && !(value === 0n)) {
          runState.eei.useGas(
            BigInt(common.param('gasPrices', 'callNewAccount')),
            'CALL opcode -> callNewAccount (>= SpuriousDragon)'
          )
        }
      } else if (!(await runState.eei.accountExists(toAddress))) {
        // We are before Spurious Dragon and the account does not exist.
        // Call new account gas: account does not exist (it is not in the state trie, not even as an "empty" account)
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'callNewAccount')),
          'CALL opcode -> callNewAccount (< SpuriousDragon)'
        )
      }

      let gasLimit = maxCallGas(currentGasLimit, runState.eei.getGasLeft(), runState, common)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit > runState.eei.getGasLeft()) {
        trap(ERROR.OUT_OF_GAS)
      }

      if (!(value === 0n)) {
        const callStipend = BigInt(common.param('gasPrices', 'callStipend'))
        runState.eei.addStipend(callStipend)
        gasLimit += callStipend
      }

      const ret = await runState.eei.call(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf2: CALLCODE
  [
    0xf2,
    async function (runState, common) {
      const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      subMemUsage(runState, inOffset, inLength, common)
      subMemUsage(runState, outOffset, outLength, common)
      accessAddressEIP2929(runState, toAddress, common)

      if (!(value === 0n)) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'callValueTransfer')),
          'CALLCODE opcode -> callValueTransfer'
        )
      }
      let gasLimit = maxCallGas(currentGasLimit, runState.eei.getGasLeft(), runState, common)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit > runState.eei.getGasLeft()) {
        trap(ERROR.OUT_OF_GAS)
      }
      if (!(value === 0n)) {
        const callStipend = BigInt(common.param('gasPrices', 'callStipend'))
        runState.eei.addStipend(callStipend)
        gasLimit += callStipend
      }

      let data = Buffer.alloc(0)
      if (!(inLength === 0n)) {
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
    async function (runState, common) {
      const value = runState.eei.getCallValue()
      const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      subMemUsage(runState, inOffset, inLength, common)
      subMemUsage(runState, outOffset, outLength, common)
      accessAddressEIP2929(runState, toAddress, common)
      const gasLimit = maxCallGas(currentGasLimit, runState.eei.getGasLeft(), runState, common)
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit > runState.eei.getGasLeft()) {
        trap(ERROR.OUT_OF_GAS)
      }

      let data = Buffer.alloc(0)
      if (!(inLength === 0n)) {
        data = runState.memory.read(Number(inOffset), Number(inLength))
      }

      const ret = await runState.eei.callDelegate(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0x06: STATICCALL
  [
    0xfa,
    async function (runState, common) {
      const value = 0n
      const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      subMemUsage(runState, inOffset, inLength, common)
      subMemUsage(runState, outOffset, outLength, common)
      accessAddressEIP2929(runState, toAddress, common)
      const gasLimit = maxCallGas(currentGasLimit, runState.eei.getGasLeft(), runState, common) // we set TangerineWhistle or later to true here, as STATICCALL was available from Byzantium (which is after TangerineWhistle)

      let data = Buffer.alloc(0)
      if (!(inLength === 0n)) {
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
    function (runState, common) {
      const [offset, length] = runState.stack.popN(2)
      subMemUsage(runState, offset, length, common)
      let returnData = Buffer.alloc(0)
      if (!(length === 0n)) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.eei.finish(returnData)
    },
  ],
  // 0xfd: REVERT
  [
    0xfd,
    function (runState, common) {
      const [offset, length] = runState.stack.popN(2)
      subMemUsage(runState, offset, length, common)
      let returnData = Buffer.alloc(0)
      if (!(length === 0n)) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.eei.revert(returnData)
    },
  ],
  // '0x70', range - other
  // 0xff: SELFDESTRUCT
  [
    0xff,
    async function (runState, common) {
      const selfdestructToAddressBN = runState.stack.pop()
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const selfdestructToAddress = new Address(addressToBuffer(selfdestructToAddressBN))
      let deductGas = false
      if (common.gteHardfork('spuriousDragon')) {
        // EIP-161: State Trie Clearing
        const balance = await runState.eei.getExternalBalance(runState.eei.getAddress())
        if (balance > 0n) {
          // This technically checks if account is empty or non-existent
          // TODO: improve on the API here (EEI and StateManager)
          const empty = await runState.eei.isAccountEmpty(selfdestructToAddress)
          if (empty) {
            deductGas = true
          }
        }
      } else if (common.gteHardfork('tangerineWhistle')) {
        // Pre EIP-150 (Tangerine Whistle) gas semantics
        const exists = await runState.stateManager.accountExists(selfdestructToAddress)
        if (!exists) {
          deductGas = true
        }
      }
      if (deductGas) {
        runState.eei.useGas(
          BigInt(common.param('gasPrices', 'callNewAccount')),
          'SELFDESTRUCT opcode -> callNewAccount'
        )
      }

      accessAddressEIP2929(runState, selfdestructToAddress, common, true, true)
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
