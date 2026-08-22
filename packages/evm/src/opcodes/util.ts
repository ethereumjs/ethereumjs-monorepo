import { Hardfork } from '@ethereumjs/common'
import {
  BIGINT_0,
  BIGINT_1,
  BIGINT_2,
  BIGINT_32,
  BIGINT_64,
  BIGINT_160,
  BIGINT_NEG1,
  bytesToHex,
  createAddressFromBigInt,
  equalsBytes,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { EVMError } from '../errors.ts'

import type { Common } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import type { EVMErrorType } from '../errors.ts'
import type { RunState } from '../interpreter.ts'

const MASK_160 = (BIGINT_1 << BIGINT_160) - BIGINT_1

/** Non-negative modular reduction (`a mod b`, with `b > 0`). */
export function mod(a: bigint, b: bigint) {
  let r = a % b
  if (r < BIGINT_0) {
    r = b + r
  }
  return r
}

/** Interprets a 256-bit word as a signed two's-complement integer. */
export function fromTwos(a: bigint) {
  return BigInt.asIntN(256, a)
}

/** Wraps a signed integer into an unsigned 256-bit word. */
export function toTwos(a: bigint) {
  return BigInt.asUintN(256, a)
}

/** Absolute value for bigint operands. */
export function abs(a: bigint) {
  if (a > 0) {
    return a
  }
  return a * BIGINT_NEG1
}

const N = BigInt(115792089237316195423570985008687907853269984665640564039457584007913129639936)
/** Modular exponentiation over the EVM 256-bit field. */
export function exponentiation(bas: bigint, exp: bigint) {
  let t = BIGINT_1
  while (exp > BIGINT_0) {
    if (exp % BIGINT_2 !== BIGINT_0) {
      t = (t * bas) % N
    }
    bas = (bas * bas) % N
    exp = exp / BIGINT_2
  }
  return t
}

/**
 * Creates an {@link Address} from a stack word, masking to 160 bits.
 */
export function createAddressFromStackBigInt(value: bigint): Address {
  const maskedValue = value & MASK_160
  return createAddressFromBigInt(maskedValue)
}

/**
 * Left-pads a storage value to 32 bytes, returning an empty buffer when the value is all zeros.
 */
export function setLengthLeftStorage(value: Uint8Array) {
  if (equalsBytes(value, new Uint8Array(value.length))) {
    // return the empty Uint8Array (the value is zero)
    return new Uint8Array(0)
  } else {
    return setLengthLeft(value, 32)
  }
}

/**
 * Throws an {@link EVMError} with the given message (never returns).
 */
export function trap(err: string): never {
  // TODO: facilitate extra data along with errors
  throw new EVMError(err as EVMErrorType)
}

/** Reads the next bytecode byte and advances the program counter (zero when past EOF). */
export function readImmediateByteOrZero(runState: RunState): number {
  const immediate = runState.code[runState.programCounter] ?? 0
  runState.programCounter++
  return immediate
}

/**
 * Builds a `codeHash/address:pc` location string for error messages.
 */
export function describeLocation(runState: RunState): string {
  const keccakFunction = runState.interpreter._evm.common.customCrypto.keccak256 ?? keccak_256
  const hash = bytesToHex(keccakFunction(runState.interpreter.getCode()))
  const address = runState.interpreter.getAddress().toString()
  const pc = runState.programCounter - 1
  return `${hash}/${address}:${pc}`
}

/**
 * Ceiling division for bigint values (`ceil(a / b)`).
 */
export function divCeil(a: bigint, b: bigint): bigint {
  const div = a / b
  const modulus = mod(a, b)

  // Fast case - exact division
  if (modulus === BIGINT_0) return div

  // Round up
  return div < BIGINT_0 ? div - BIGINT_1 : div + BIGINT_1
}

/**
 * Returns an overflow-safe slice of calldata or memory, right-padded with zeros.
 */
export function getDataSlice(data: Uint8Array, offset: bigint, length: bigint): Uint8Array {
  const len = BigInt(data.length)
  if (offset > len) {
    offset = len
  }

  let end = offset + length
  if (end > len) {
    end = len
  }

  data = data.subarray(Number(offset), Number(end))
  // Right-pad with zeros to fill dataLength bytes
  data = setLengthRight(data, Number(length))

  return data
}

/**
 * Expands PUSH/LOG/DUP/SWAP opcode names with their immediate index.
 */
export function getFullname(code: number, name: string): string {
  switch (name) {
    case 'LOG':
      name += code - 0xa0
      break
    case 'PUSH':
      name += code - 0x5f
      break
    case 'DUP':
      name += code - 0x7f
      break
    case 'SWAP':
      name += code - 0x8f
      break
  }
  return name
}

/**
 * Returns true when `dest` is a valid JUMPDEST for the current bytecode.
 */
export function jumpIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps[dest] === 1
}

/**
 * Caps forwarded call gas per EIP-150 (Tangerine Whistle) rules.
 */
export function maxCallGas(
  gasLimit: bigint,
  gasLeft: bigint,
  runState: RunState,
  common: Common,
): bigint {
  if (common.gteHardfork(Hardfork.TangerineWhistle)) {
    const gasAllowed = gasLeft - gasLeft / BIGINT_64
    return gasLimit > gasAllowed ? gasAllowed : gasLimit
  } else {
    return gasLimit
  }
}

/**
 * Charges memory expansion gas and updates the frame's memory word count.
 */
export function subMemUsage(runState: RunState, offset: bigint, length: bigint, common: Common) {
  // YP (225): access with zero length will not extend the memory
  if (length === BIGINT_0) return BIGINT_0

  const newMemoryWordCount = divCeil(offset + length, BIGINT_32)
  if (newMemoryWordCount <= runState.memoryWordCount) return BIGINT_0

  const words = newMemoryWordCount
  const fee = common.param('memoryGas')
  const quadCoefficient = common.param('quadCoefficientDivGas')
  // words * 3 + words ^2 / 512
  let cost = words * fee + (words * words) / quadCoefficient

  if (cost > runState.highestMemCost) {
    const currentHighestMemCost = runState.highestMemCost
    runState.highestMemCost = cost
    cost -= currentHighestMemCost
  }

  runState.memoryWordCount = newMemoryWordCount

  return cost
}

/**
 * Copies child-call return data into the caller's memory buffer.
 */
export function writeCallOutput(runState: RunState, outOffset: bigint, outLength: bigint) {
  const returnData = runState.interpreter.getReturnData()
  if (returnData.length > 0) {
    const memOffset = Number(outOffset)
    let dataLength = Number(outLength)
    if (BigInt(returnData.length) < dataLength) {
      dataLength = returnData.length
    }
    const data = getDataSlice(returnData, BIGINT_0, BigInt(dataLength))
    runState.memory.extend(memOffset, dataLength)
    runState.memory.write(memOffset, dataLength, data)
  }
}

/**
 * Pre-Constantinople SSTORE gas and refund rules (Frontier through Petersburg).
 */
export function updateSstoreGas(
  runState: RunState,
  currentStorage: Uint8Array,
  value: Uint8Array,
  common: Common,
): bigint {
  if (
    (value.length === 0 && currentStorage.length === 0) ||
    (value.length > 0 && currentStorage.length > 0)
  ) {
    const gas = common.param('sstoreResetGas')
    return gas
  } else if (value.length === 0 && currentStorage.length > 0) {
    const gas = common.param('sstoreResetGas')
    runState.interpreter.refundGas(common.param('sstoreRefundGas'), 'updateSstoreGas')
    return gas
  } else {
    /*
      The situations checked above are:
      -> Value/Slot are both 0
      -> Value/Slot are both nonzero
      -> Value is zero, but slot is nonzero
      Thus, the remaining case is where value is nonzero, but slot is zero, which is this clause
    */
    return common.param('sstoreSetGas')
  }
}
