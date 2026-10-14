import {
  Address,
  BIGINT_0,
  BIGINT_1,
  BIGINT_2,
  BIGINT_2EXP96,
  BIGINT_2EXP160,
  BIGINT_2EXP224,
  BIGINT_7,
  BIGINT_8,
  BIGINT_31,
  BIGINT_32,
  BIGINT_96,
  BIGINT_160,
  BIGINT_224,
  BIGINT_255,
  BIGINT_256,
  MAX_INTEGER_BIGINT,
  TWO_POW256,
  bigIntToAddressBytes,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  bytesToInt,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { activeCostPerStateByte } from '../eip8037.ts'
import { EVMError } from '../errors.ts'

import {
  createAddressFromStackBigInt,
  describeLocation,
  exponentiation,
  fromTwos,
  getDataSlice,
  jumpIsValid,
  mod,
  toTwos,
  trap,
  writeCallOutput,
} from './util.ts'

import type { Common } from '@ethereumjs/common'
import type { RunState } from '../interpreter.ts'

/** Synchronous opcode implementation invoked from the interpreter loop. */
export interface SyncOpHandler {
  (runState: RunState, common: Common): void
}

/** Async opcode implementation (state reads, nested calls). */
export interface AsyncOpHandler {
  (runState: RunState, common: Common): Promise<void>
}

/** Union of sync and async opcode handlers keyed by opcode byte. */
export type OpHandler = SyncOpHandler | AsyncOpHandler

/** Default opcode logic handlers indexed by opcode byte. */
export const handlers: Map<number, OpHandler> = new Map<number, OpHandler>([
  // 0x00: STOP
  [
    0x00,
    function () {
      trap(EVMError.errorMessages.STOP)
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
      if (b === BIGINT_0) {
        r = BIGINT_0
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
      if (b === BIGINT_0) {
        r = BIGINT_0
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
      if (b === BIGINT_0) {
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
      if (b === BIGINT_0) {
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
      if (c === BIGINT_0) {
        r = BIGINT_0
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
      if (c === BIGINT_0) {
        r = BIGINT_0
      } else {
        r = mod(a * b, c)
      }
      runState.stack.push(r)
    },
  ],
  // 0x0a: EXP
  [
    0x0a,
    function (runState) {
      const [base, exponent] = runState.stack.popN(2)
      if (base === BIGINT_2) {
        switch (exponent) {
          case BIGINT_96:
            runState.stack.push(BIGINT_2EXP96)
            return
          case BIGINT_160:
            runState.stack.push(BIGINT_2EXP160)
            return
          case BIGINT_224:
            runState.stack.push(BIGINT_2EXP224)
            return
        }
      }
      if (exponent === BIGINT_0) {
        runState.stack.push(BIGINT_1)
        return
      }

      if (base === BIGINT_0) {
        runState.stack.push(base)
        return
      }
      const r = exponentiation(base, exponent)
      runState.stack.push(r)
    },
  ],
  // 0x0b: SIGNEXTEND
  [
    0x0b,
    function (runState) {
      /* eslint-disable-next-line prefer-const */
      let [k, val] = runState.stack.popN(2)
      if (k < BIGINT_31) {
        const signBit = k * BIGINT_8 + BIGINT_7
        const mask = (BIGINT_1 << signBit) - BIGINT_1
        if ((val >> signBit) & BIGINT_1) {
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
      const r = a < b ? BIGINT_1 : BIGINT_0
      runState.stack.push(r)
    },
  ],
  // 0x11: GT
  [
    0x11,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a > b ? BIGINT_1 : BIGINT_0
      runState.stack.push(r)
    },
  ],
  // 0x12: SLT
  [
    0x12,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) < fromTwos(b) ? BIGINT_1 : BIGINT_0
      runState.stack.push(r)
    },
  ],
  // 0x13: SGT
  [
    0x13,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = fromTwos(a) > fromTwos(b) ? BIGINT_1 : BIGINT_0
      runState.stack.push(r)
    },
  ],
  // 0x14: EQ
  [
    0x14,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      const r = a === b ? BIGINT_1 : BIGINT_0
      runState.stack.push(r)
    },
  ],
  // 0x15: ISZERO
  [
    0x15,
    function (runState) {
      const a = runState.stack.pop()
      const r = a === BIGINT_0 ? BIGINT_1 : BIGINT_0
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
      if (pos > BIGINT_32) {
        runState.stack.push(BIGINT_0)
        return
      }

      const r = (word >> ((BIGINT_31 - pos) * BIGINT_8)) & BIGINT_255
      runState.stack.push(r)
    },
  ],
  // 0x1b: SHL
  [
    0x1b,
    function (runState) {
      const [a, b] = runState.stack.popN(2)
      if (a > BIGINT_256) {
        runState.stack.push(BIGINT_0)
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
        runState.stack.push(BIGINT_0)
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
          r = BIGINT_0
        }
        runState.stack.push(r)
        return
      }

      const c = b >> a
      if (isSigned) {
        const shiftedOutWidth = BIGINT_255 - a
        const mask = (MAX_INTEGER_BIGINT >> shiftedOutWidth) << shiftedOutWidth
        r = c | mask
      } else {
        r = c
      }
      runState.stack.push(r)
    },
  ],
  // 0x20 range - crypto
  // 0x20: KECCAK256
  [
    0x20,
    function (runState, common) {
      const [offset, length] = runState.stack.popN(2)
      let data = new Uint8Array(0)
      if (length !== BIGINT_0) {
        data = runState.memory.read(Number(offset), Number(length))
      }
      const r = BigInt(bytesToHex((common.customCrypto.keccak256 ?? keccak_256)(data)))
      runState.stack.push(r)
    },
  ],
  // 0x30 range - closure state
  // 0x30: ADDRESS
  [
    0x30,
    function (runState) {
      const address = bytesToBigInt(runState.interpreter.getAddress().bytes)
      runState.stack.push(address)
    },
  ],
  // 0x31: BALANCE
  [
    0x31,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const address = createAddressFromStackBigInt(addressBigInt)
      const balance = await runState.interpreter.getExternalBalance(address)
      runState.stack.push(balance)
    },
  ],
  // 0x32: ORIGIN
  [
    0x32,
    function (runState) {
      runState.stack.push(runState.interpreter.getTxOrigin())
    },
  ],
  // 0x33: CALLER
  [
    0x33,
    function (runState) {
      runState.stack.push(runState.interpreter.getCaller())
    },
  ],
  // 0x34: CALLVALUE
  [
    0x34,
    function (runState) {
      runState.stack.push(runState.interpreter.getCallValue())
    },
  ],
  // 0x35: CALLDATALOAD
  [
    0x35,
    function (runState) {
      const pos = runState.stack.pop()
      if (pos > runState.interpreter.getCallDataSize()) {
        runState.stack.push(BIGINT_0)
        return
      }

      const i = Number(pos)
      let loaded = runState.interpreter.getCallData().subarray(i, i + 32)
      loaded = loaded.length ? loaded : Uint8Array.from([0])
      let r = bytesToBigInt(loaded)
      if (loaded.length < 32) {
        r = r << (BIGINT_8 * BigInt(32 - loaded.length))
      }
      runState.stack.push(r)
    },
  ],
  // 0x36: CALLDATASIZE
  [
    0x36,
    function (runState) {
      const r = runState.interpreter.getCallDataSize()
      runState.stack.push(r)
    },
  ],
  // 0x37: CALLDATACOPY
  [
    0x37,
    function (runState) {
      const [memOffset, dataOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BIGINT_0) {
        const data = getDataSlice(runState.interpreter.getCallData(), dataOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const dataLengthNum = Number(dataLength)
        runState.memory.write(memOffsetNum, dataLengthNum, data)
      }
    },
  ],
  // 0x38: CODESIZE
  [
    0x38,
    function (runState) {
      runState.stack.push(runState.interpreter.getCodeSize())
    },
  ],
  // 0x39: CODECOPY
  [
    0x39,
    function (runState) {
      const [memOffset, codeOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BIGINT_0) {
        const data = getDataSlice(runState.interpreter.getCode(), codeOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3b: EXTCODESIZE
  [
    0x3b,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const address = createAddressFromStackBigInt(addressBigInt)
      // EIP-7928: Track address access in BAL
      if (runState.interpreter._evm.common.isActivatedEIP(7928)) {
        runState.interpreter._evm.blockLevelAccessList?.addAddress(address.toString())
      }
      const code = await runState.stateManager.getCode(address)
      const size = BigInt(code.length)

      runState.stack.push(size)
    },
  ],
  // 0x3c: EXTCODECOPY
  [
    0x3c,
    async function (runState) {
      const [addressBigInt, memOffset, codeOffset, dataLength] = runState.stack.popN(4)
      const address = createAddressFromStackBigInt(addressBigInt)
      // EIP-7928: Track address access in BAL
      if (runState.interpreter._evm.common.isActivatedEIP(7928)) {
        runState.interpreter._evm.blockLevelAccessList?.addAddress(address.toString())
      }

      if (dataLength !== BIGINT_0) {
        const code = await runState.stateManager.getCode(address)
        const data = getDataSlice(code, codeOffset, dataLength)
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3f: EXTCODEHASH
  [
    0x3f,
    async function (runState) {
      const addressBigInt = runState.stack.pop()
      const address = createAddressFromStackBigInt(addressBigInt)
      // EIP-7928: Track address access in BAL
      if (runState.interpreter._evm.common.isActivatedEIP(7928)) {
        runState.interpreter._evm.blockLevelAccessList?.addAddress(address.toString())
      }

      const code = await runState.stateManager.getCode(address)
      const account = await runState.stateManager.getAccount(address)
      if (!account || account.isEmpty()) {
        runState.stack.push(BIGINT_0)
        return
      }

      runState.stack.push(BigInt(bytesToHex(account.codeHash)))
    },
  ],
  // 0x3d: RETURNDATASIZE
  [
    0x3d,
    function (runState) {
      runState.stack.push(runState.interpreter.getReturnDataSize())
    },
  ],
  // 0x3e: RETURNDATACOPY
  [
    0x3e,
    function (runState) {
      const [memOffset, returnDataOffset, dataLength] = runState.stack.popN(3)

      if (dataLength !== BIGINT_0) {
        const data = getDataSlice(
          runState.interpreter.getReturnData(),
          returnDataOffset,
          dataLength,
        )
        const memOffsetNum = Number(memOffset)
        const lengthNum = Number(dataLength)
        runState.memory.write(memOffsetNum, lengthNum, data)
      }
    },
  ],
  // 0x3a: GASPRICE
  [
    0x3a,
    function (runState) {
      runState.stack.push(runState.interpreter.getTxGasPrice())
    },
  ],
  // '0x40' range - block operations
  // 0x40: BLOCKHASH
  [
    0x40,
    async function (runState, common) {
      const number = runState.stack.pop()

      if (common.isActivatedEIP(7709)) {
        if (number >= runState.interpreter.getBlockNumber()) {
          runState.stack.push(BIGINT_0)
          return
        }

        const diff = runState.interpreter.getBlockNumber() - number
        // block lookups must be within the original window even if historyStorageAddress's
        // historyServeWindow is much greater than 256
        if (diff > BIGINT_256 || diff <= BIGINT_0) {
          runState.stack.push(BIGINT_0)
          return
        }

        const historyAddress = new Address(
          bigIntToAddressBytes(common.param('historyStorageAddress')),
        )
        const historyServeWindow = common.param('historyServeWindow')
        const key = setLengthLeft(bigIntToBytes(number % historyServeWindow), 32)

        if (common.isActivatedEIP(6800) || common.isActivatedEIP(7864)) {
          // create witnesses and charge gas
          const statelessGas = runState.env.accessWitness!.readAccountStorage(
            historyAddress,
            number,
          )
          runState.interpreter.useGas(statelessGas, `BLOCKHASH`)
        }
        const storage = await runState.stateManager.getStorage(historyAddress, key)

        runState.stack.push(bytesToBigInt(storage))
      } else {
        const diff = runState.interpreter.getBlockNumber() - number
        // block lookups must be within the past 256 blocks
        if (diff > BIGINT_256 || diff <= BIGINT_0) {
          runState.stack.push(BIGINT_0)
          return
        }

        const block = await runState.blockchain.getBlock(Number(number))

        runState.stack.push(bytesToBigInt(block.hash()))
      }
    },
  ],
  // 0x41: COINBASE
  [
    0x41,
    function (runState) {
      runState.stack.push(runState.interpreter.getBlockCoinbase())
    },
  ],
  // 0x42: TIMESTAMP
  [
    0x42,
    function (runState) {
      runState.stack.push(runState.interpreter.getBlockTimestamp())
    },
  ],
  // 0x43: NUMBER
  [
    0x43,
    function (runState) {
      runState.stack.push(runState.interpreter.getBlockNumber())
    },
  ],
  // 0x44: DIFFICULTY (EIP-4399: supplanted as PREVRANDAO)
  [
    0x44,
    function (runState, common) {
      if (common.isActivatedEIP(4399)) {
        runState.stack.push(runState.interpreter.getBlockPrevRandao())
      } else {
        runState.stack.push(runState.interpreter.getBlockDifficulty())
      }
    },
  ],
  // 0x45: GASLIMIT
  [
    0x45,
    function (runState) {
      runState.stack.push(runState.interpreter.getBlockGasLimit())
    },
  ],
  // 0x46: CHAINID
  [
    0x46,
    function (runState) {
      runState.stack.push(runState.interpreter.getChainId())
    },
  ],
  // 0x47: SELFBALANCE
  [
    0x47,
    function (runState) {
      runState.stack.push(runState.interpreter.getSelfBalance())
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
      const word = runState.memory.read(Number(pos), 32, true)
      runState.stack.push(bytesToBigInt(word))
    },
  ],
  // 0x52: MSTORE
  [
    0x52,
    function (runState) {
      const [offset, word] = runState.stack.popN(2)
      const buf = setLengthLeft(bigIntToBytes(word), 32)
      const offsetNum = Number(offset)
      runState.memory.write(offsetNum, 32, buf)
    },
  ],
  // 0x53: MSTORE8
  [
    0x53,
    function (runState) {
      const [offset, byte] = runState.stack.popN(2)

      const buf = bigIntToBytes(byte & BIGINT_255)
      const offsetNum = Number(offset)
      runState.memory.write(offsetNum, 1, buf)
    },
  ],
  // 0x54: SLOAD
  [
    0x54,
    async function (runState) {
      const key = runState.stack.pop()
      const keyBuf = setLengthLeft(bigIntToBytes(key), 32)
      const value = await runState.interpreter.storageLoad(keyBuf)
      const valueBigInt = value.length ? bytesToBigInt(value) : BIGINT_0
      runState.stack.push(valueBigInt)
    },
  ],
  // 0x55: SSTORE
  [
    0x55,
    async function (runState) {
      const [key, val] = runState.stack.popN(2)

      const keyBuf = setLengthLeft(bigIntToBytes(key), 32)
      // NOTE: this should be the shortest representation
      let value
      if (val === BIGINT_0) {
        value = Uint8Array.from([])
      } else {
        value = bigIntToBytes(val)
      }

      // EIP-8037: state-gas accounting at the end of SSTORE (per the spec
      // table). State-gas adjustments only happen when the slot was zero at
      // the start of the transaction:
      //   original=0, current=0, new!=0  -> charge stateBytesPerStorageSet * costPerStateByte
      //   original=0, current!=0, new=0  -> refill stateBytesPerStorageSet * costPerStateByte
      //   all other (original, current, new) triplets: no adjustment
      // NB: the regular-gas `sstoreSetGas` (2900 under 8037, was 20000) is
      // still charged in the dynamic gas function above; this only meters
      // the state-gas dimension.
      const common = runState.interpreter._evm.common
      let originalIsZero = false
      let currentIsZero = false
      const newIsZero = val === BIGINT_0
      if (common.isActivatedEIP(8037)) {
        const current = await runState.interpreter.storageLoad(keyBuf, false, false)
        const original = await runState.interpreter.storageLoad(keyBuf, true, false)
        currentIsZero = current.length === 0
        originalIsZero = original.length === 0
      }

      await runState.interpreter.storageStore(keyBuf, value)

      if (common.isActivatedEIP(8037) && originalIsZero) {
        const stateBytes = common.param('stateBytesPerStorageSet')
        const costPerStateByte = activeCostPerStateByte(common, runState.env.block.header.gasLimit)
        const amount = stateBytes * costPerStateByte
        if (currentIsZero && !newIsZero) {
          // 0 -> 0 -> nonzero: new slot, charge state gas
          runState.interpreter.chargeStateGas(amount, 'SSTORE')
          // Track per-address state-gas spent on storage so a same-tx
          // SELFDESTRUCT can refund it (account/code already tracked at CREATE).
          const addrKey = runState.interpreter.getAddress().toString()
          const evm = runState.interpreter._evm
          const prior = evm.createdAccountStateGas.get(addrKey) ?? BIGINT_0
          evm.createdAccountStateGas.set(addrKey, prior + amount)
        } else if (!currentIsZero && newIsZero) {
          // 0 -> nonzero -> 0: clearing a slot created in this tx, credit the
          // state-gas refund in LIFO order (gasLeft first up to the frame's
          // spilled amount, then the reservoir)
          runState.interpreter.creditStateGasRefund(amount, 'SSTORE clear')
          // Symmetric: subtract from the per-address tracker so we don't
          // double-refund storage that was already cleared inside the tx.
          const addrKey = runState.interpreter.getAddress().toString()
          const evm = runState.interpreter._evm
          const prior = evm.createdAccountStateGas.get(addrKey) ?? BIGINT_0
          const next = prior > amount ? prior - amount : BIGINT_0
          evm.createdAccountStateGas.set(addrKey, next)
        }
      }
    },
  ],
  // 0x56: JUMP
  [
    0x56,
    function (runState) {
      const dest = runState.stack.pop()
      if (dest > runState.interpreter.getCodeSize()) {
        trap(EVMError.errorMessages.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      const destNum = Number(dest)

      if (!jumpIsValid(runState, destNum)) {
        trap(EVMError.errorMessages.INVALID_JUMP + ' at ' + describeLocation(runState))
      }

      runState.programCounter = destNum
    },
  ],
  // 0x57: JUMPI
  [
    0x57,
    function (runState) {
      const [dest, cond] = runState.stack.popN(2)
      if (cond !== BIGINT_0) {
        if (dest > runState.interpreter.getCodeSize()) {
          trap(EVMError.errorMessages.INVALID_JUMP + ' at ' + describeLocation(runState))
        }

        const destNum = Number(dest)

        if (!jumpIsValid(runState, destNum)) {
          trap(EVMError.errorMessages.INVALID_JUMP + ' at ' + describeLocation(runState))
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
      runState.stack.push(runState.memoryWordCount * BIGINT_32)
    },
  ],
  // 0x5a: GAS
  [
    0x5a,
    function (runState) {
      runState.stack.push(runState.interpreter.getGasLeft())
    },
  ],
  // 0x5b: JUMPDEST
  [0x5b, function () {}],
  // 0x60: PUSH
  [
    0x60,
    function (runState, common) {
      const numToPush = runState.opCode - 0x5f

      if (
        (common.isActivatedEIP(6800) || common.isActivatedEIP(7864)) &&
        runState.env.chargeCodeAccesses === true
      ) {
        const contract = runState.interpreter.getAddress()
        const startOffset = Math.min(runState.code.length, runState.programCounter + 1)
        const endOffset = Math.min(runState.code.length, startOffset + numToPush - 1)
        const statelessGas = runState.env.accessWitness!.readAccountCodeChunks(
          contract,
          startOffset,
          endOffset,
        )
        runState.interpreter.useGas(statelessGas, `PUSH`)
      }

      if (!runState.shouldDoJumpAnalysis) {
        runState.stack.push(runState.cachedPushes[runState.programCounter])
        runState.programCounter += numToPush
      } else {
        let loadedBytes = runState.code.subarray(
          runState.programCounter,
          runState.programCounter + numToPush,
        )
        if (loadedBytes.length < numToPush) {
          loadedBytes = setLengthRight(loadedBytes, numToPush)
        }

        runState.programCounter += numToPush
        runState.stack.push(bytesToBigInt(loadedBytes))
      }
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
        return setLengthLeft(bigIntToBytes(a), 32)
      })

      let mem = new Uint8Array(0)
      if (memLength !== BIGINT_0) {
        mem = runState.memory.read(Number(memOffset), Number(memLength))
      }

      runState.interpreter.log(mem, topicsCount, topicsBuf)
    },
  ],
  // '0xf0' range - closures
  // 0xf0: CREATE
  [
    0xf0,
    async function (runState, common) {
      const [value, offset, length] = runState.stack.popN(3)

      if (
        common.isActivatedEIP(3860) &&
        length > Number(common.param('maxInitCodeSize')) &&
        !runState.interpreter._evm.allowUnlimitedInitCodeSize
      ) {
        trap(EVMError.errorMessages.INITCODE_SIZE_VIOLATION)
      }

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      if (runState.eip7928PostTargetCreateOog === true) {
        runState.eip7928PostTargetCreateOog = false
        runState.stack.push(BIGINT_0)
        return
      }

      let data = new Uint8Array(0)
      if (length !== BIGINT_0) {
        data = runState.memory.read(Number(offset), Number(length), true)
      }

      const ret = await runState.interpreter.create(gasLimit, value, data)
      runState.stack.push(ret)
    },
  ],
  // 0xf5: CREATE2
  [
    0xf5,
    async function (runState, common) {
      if (runState.interpreter.isStatic()) {
        trap(EVMError.errorMessages.STATIC_STATE_CHANGE)
      }

      const [value, offset, length, salt] = runState.stack.popN(4)

      if (
        common.isActivatedEIP(3860) &&
        length > Number(common.param('maxInitCodeSize')) &&
        !runState.interpreter._evm.allowUnlimitedInitCodeSize
      ) {
        trap(EVMError.errorMessages.INITCODE_SIZE_VIOLATION)
      }

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      if (runState.eip7928PostTargetCreateOog === true) {
        runState.eip7928PostTargetCreateOog = false
        runState.stack.push(BIGINT_0)
        return
      }

      let data = new Uint8Array(0)
      if (length !== BIGINT_0) {
        data = runState.memory.read(Number(offset), Number(length), true)
      }

      const ret = await runState.interpreter.create2(
        gasLimit,
        value,
        data,
        setLengthLeft(bigIntToBytes(salt), 32),
      )
      runState.stack.push(ret)
    },
  ],
  // 0xf1: CALL
  [
    0xf1,
    async function (runState: RunState, common: Common) {
      const [_currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = createAddressFromStackBigInt(toAddr)

      let data = new Uint8Array(0)
      if (inLength !== BIGINT_0) {
        data = runState.memory.read(Number(inOffset), Number(inLength), true)
      }

      let gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      if (value !== BIGINT_0) {
        const callStipend = common.param('callStipendGas')
        runState.interpreter.addStipend(callStipend)
        gasLimit += callStipend
      }

      const ret = await runState.interpreter.call(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf2: CALLCODE
  [
    0xf2,
    async function (runState: RunState, common: Common) {
      const [_currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(7)
      const toAddress = createAddressFromStackBigInt(toAddr)

      let gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      if (value !== BIGINT_0) {
        const callStipend = common.param('callStipendGas')
        runState.interpreter.addStipend(callStipend)
        gasLimit += callStipend
      }

      let data = new Uint8Array(0)
      if (inLength !== BIGINT_0) {
        data = runState.memory.read(Number(inOffset), Number(inLength), true)
      }

      const ret = await runState.interpreter.callCode(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xf4: DELEGATECALL
  [
    0xf4,
    async function (runState) {
      const value = runState.interpreter.getCallValue()
      const [_currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = createAddressFromStackBigInt(toAddr)

      let data = new Uint8Array(0)
      if (inLength !== BIGINT_0) {
        data = runState.memory.read(Number(inOffset), Number(inLength), true)
      }

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      const ret = await runState.interpreter.callDelegate(gasLimit, toAddress, value, data)
      // Write return data to memory
      writeCallOutput(runState, outOffset, outLength)
      runState.stack.push(ret)
    },
  ],
  // 0xfa: STATICCALL
  [
    0xfa,
    async function (runState) {
      const value = BIGINT_0
      const [_currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.popN(6)
      const toAddress = createAddressFromStackBigInt(toAddr)

      const gasLimit = runState.messageGasLimit!
      runState.messageGasLimit = undefined

      let data = new Uint8Array(0)
      if (inLength !== BIGINT_0) {
        data = runState.memory.read(Number(inOffset), Number(inLength), true)
      }

      const ret = await runState.interpreter.callStatic(gasLimit, toAddress, value, data)
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
      let returnData = new Uint8Array(0)
      if (length !== BIGINT_0) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.interpreter.finish(returnData)
    },
  ],
  // 0xfd: REVERT
  [
    0xfd,
    function (runState) {
      const [offset, length] = runState.stack.popN(2)
      let returnData = new Uint8Array(0)
      if (length !== BIGINT_0) {
        returnData = runState.memory.read(Number(offset), Number(length))
      }
      runState.interpreter.revert(returnData)
    },
  ],
  // '0x70', range - other
  // 0xff: SELFDESTRUCT
  [
    0xff,
    async function (runState) {
      const selfdestructToAddressBigInt = runState.stack.pop()
      const selfdestructToAddress = createAddressFromStackBigInt(selfdestructToAddressBigInt)
      return runState.interpreter.selfDestruct(selfdestructToAddress)
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
