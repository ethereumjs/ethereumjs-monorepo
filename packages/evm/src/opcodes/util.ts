import { Hardfork } from '@ethereumjs/common'
import {
  BIGINT_0,
  BIGINT_1,
  BIGINT_160,
  BIGINT_2,
  BIGINT_273,
  BIGINT_3,
  BIGINT_32,
  BIGINT_512,
  BIGINT_64,
  BIGINT_NEG1,
  bigIntToBytes,
  bytesToHex,
  equalsBytes,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { EvmError } from '../exceptions.js'

import type { ERROR } from '../exceptions.js'
import type { RunState } from '../interpreter.js'
import type { Common } from '@ethereumjs/common'

const MASK_160 = (BIGINT_1 << BIGINT_160) - BIGINT_1

/**
 * Proxy function for @ethereumjs/util's setLengthLeft, except it returns a zero
 * length Uint8Array in case the Uint8Array is full of zeros.
 * @param value Uint8Array which we want to pad
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
 * Wraps error message as EvmError
 */
export function trap(err: string) {
  // TODO: facilitate extra data along with errors
  throw new EvmError(err as ERROR)
}

/**
 * Converts bigint address (they're stored like this on the stack) to Uint8Array address
 */
export function addresstoBytes(address: bigint | Uint8Array) {
  if (address instanceof Uint8Array) return address
  return setLengthLeft(bigIntToBytes(address & MASK_160), 20)
}

/**
 * Error message helper - generates location string
 */
export function describeLocation(runState: RunState): string {
  const hash = bytesToHex(keccak256(runState.interpreter.getCode()))
  const address = runState.interpreter.getAddress().toString()
  const pc = runState.programCounter - 1
  return `${hash}/${address}:${pc}`
}

/**
 * Find Ceil(a / b)
 *
 * @param {bigint} a
 * @param {bigint} b
 * @return {bigint}
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
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
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
 * Get full opcode name from its name and code.
 *
 * @param code Integer code of opcode.
 * @param name Short name of the opcode.
 * @returns Full opcode name
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
 * Checks if a jump is valid given a destination (defined as a 1 in the validJumps array)
 */
export function jumpIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps[dest] === 1
}

/**
 * Checks if a jumpsub is valid given a destination (defined as a 2 in the validJumps array)
 */
export function jumpSubIsValid(runState: RunState, dest: number): boolean {
  return runState.validJumps[dest] === 2
}

/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 * @param gasLimit requested gas Limit
 * @param gasLeft current gas left
 * @param runState the current runState
 * @param common the common
 */
export function maxCallGas(
  gasLimit: bigint,
  gasLeft: bigint,
  runState: RunState,
  common: Common
): bigint {
  if (common.gteHardfork(Hardfork.TangerineWhistle)) {
    const gasAllowed = gasLeft - gasLeft / BIGINT_64
    return gasLimit > gasAllowed ? gasAllowed : gasLimit
  } else {
    return gasLimit
  }
}

/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 */
export function subMemUsage(runState: RunState, offset: bigint, length: bigint, common: Common) {
  // YP (225): access with zero length will not extend the memory
  if (length === BIGINT_0) return BIGINT_0

  const newMemoryWordCount = divCeil(offset + length, BIGINT_32)
  if (newMemoryWordCount <= runState.memoryWordCount) return BIGINT_0
  const words = newMemoryWordCount

  let cost: bigint
  const fee = common.param('gasPrices', 'memory')
  const quadCoeff = common.param('gasPrices', 'quadCoeffDiv')

  // Optimization for mainnet-compatible networks
  if (fee === BIGINT_3 && quadCoeff === BIGINT_512 && words <= BIGINT_273) {
    cost = SUB_MEM_USAGE_COST_PRECALC_CONSTS[Number(words)]
  } else {
    // words * 3 + words ^2 / 512
    cost = words * fee + (words * words) / quadCoeff
  }

  if (cost > runState.highestMemCost) {
    const currentHighestMemCost = runState.highestMemCost
    runState.highestMemCost = cost
    cost -= currentHighestMemCost
  }

  runState.memoryWordCount = newMemoryWordCount

  return cost
}

/**
 * Writes data returned by evm.call* methods to memory
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
 * The first rule set of SSTORE rules, which are the rules pre-Constantinople and in Petersburg
 */
export function updateSstoreGas(
  runState: RunState,
  currentStorage: Uint8Array,
  value: Uint8Array,
  common: Common
): bigint {
  if (
    (value.length === 0 && currentStorage.length === 0) ||
    (value.length > 0 && currentStorage.length > 0)
  ) {
    const gas = common.param('gasPrices', 'sstoreReset')
    return gas
  } else if (value.length === 0 && currentStorage.length > 0) {
    const gas = common.param('gasPrices', 'sstoreReset')
    runState.interpreter.refundGas(common.param('gasPrices', 'sstoreRefund'), 'updateSstoreGas')
    return gas
  } else {
    /*
      The situations checked above are:
      -> Value/Slot are both 0
      -> Value/Slot are both nonzero
      -> Value is zero, but slot is nonzero
      Thus, the remaining case is where value is nonzero, but slot is zero, which is this clause
    */
    return common.param('gasPrices', 'sstoreSet')
  }
}

export function mod(a: bigint, b: bigint) {
  let r = a % b
  if (r < BIGINT_0) {
    r = b + r
  }
  return r
}

export function fromTwos(a: bigint) {
  return BigInt.asIntN(256, a)
}

export function toTwos(a: bigint) {
  return BigInt.asUintN(256, a)
}

export function abs(a: bigint) {
  if (a > 0) {
    return a
  }
  return a * BIGINT_NEG1
}

const N = BigInt(115792089237316195423570985008687907853269984665640564039457584007913129639936)
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

const SUB_MEM_USAGE_COST_PRECALC_CONSTS = [
  BigInt(0),
  BigInt(3),
  BigInt(6),
  BigInt(9),
  BigInt(12),
  BigInt(15),
  BigInt(18),
  BigInt(21),
  BigInt(24),
  BigInt(27),
  BigInt(30),
  BigInt(33),
  BigInt(36),
  BigInt(39),
  BigInt(42),
  BigInt(45),
  BigInt(48),
  BigInt(51),
  BigInt(54),
  BigInt(57),
  BigInt(60),
  BigInt(63),
  BigInt(66),
  BigInt(70),
  BigInt(73),
  BigInt(76),
  BigInt(79),
  BigInt(82),
  BigInt(85),
  BigInt(88),
  BigInt(91),
  BigInt(94),
  BigInt(98),
  BigInt(101),
  BigInt(104),
  BigInt(107),
  BigInt(110),
  BigInt(113),
  BigInt(116),
  BigInt(119),
  BigInt(123),
  BigInt(126),
  BigInt(129),
  BigInt(132),
  BigInt(135),
  BigInt(138),
  BigInt(142),
  BigInt(145),
  BigInt(148),
  BigInt(151),
  BigInt(154),
  BigInt(158),
  BigInt(161),
  BigInt(164),
  BigInt(167),
  BigInt(170),
  BigInt(174),
  BigInt(177),
  BigInt(180),
  BigInt(183),
  BigInt(187),
  BigInt(190),
  BigInt(193),
  BigInt(196),
  BigInt(200),
  BigInt(203),
  BigInt(206),
  BigInt(209),
  BigInt(213),
  BigInt(216),
  BigInt(219),
  BigInt(222),
  BigInt(226),
  BigInt(229),
  BigInt(232),
  BigInt(235),
  BigInt(239),
  BigInt(242),
  BigInt(245),
  BigInt(249),
  BigInt(252),
  BigInt(255),
  BigInt(259),
  BigInt(262),
  BigInt(265),
  BigInt(269),
  BigInt(272),
  BigInt(275),
  BigInt(279),
  BigInt(282),
  BigInt(285),
  BigInt(289),
  BigInt(292),
  BigInt(295),
  BigInt(299),
  BigInt(302),
  BigInt(306),
  BigInt(309),
  BigInt(312),
  BigInt(316),
  BigInt(319),
  BigInt(322),
  BigInt(326),
  BigInt(329),
  BigInt(333),
  BigInt(336),
  BigInt(339),
  BigInt(343),
  BigInt(346),
  BigInt(350),
  BigInt(353),
  BigInt(357),
  BigInt(360),
  BigInt(363),
  BigInt(367),
  BigInt(370),
  BigInt(374),
  BigInt(377),
  BigInt(381),
  BigInt(384),
  BigInt(388),
  BigInt(391),
  BigInt(395),
  BigInt(398),
  BigInt(402),
  BigInt(405),
  BigInt(409),
  BigInt(412),
  BigInt(416),
  BigInt(419),
  BigInt(423),
  BigInt(426),
  BigInt(430),
  BigInt(433),
  BigInt(437),
  BigInt(440),
  BigInt(444),
  BigInt(447),
  BigInt(451),
  BigInt(454),
  BigInt(458),
  BigInt(461),
  BigInt(465),
  BigInt(468),
  BigInt(472),
  BigInt(476),
  BigInt(479),
  BigInt(483),
  BigInt(486),
  BigInt(490),
  BigInt(493),
  BigInt(497),
  BigInt(501),
  BigInt(504),
  BigInt(508),
  BigInt(511),
  BigInt(515),
  BigInt(519),
  BigInt(522),
  BigInt(526),
  BigInt(530),
  BigInt(533),
  BigInt(537),
  BigInt(540),
  BigInt(544),
  BigInt(548),
  BigInt(551),
  BigInt(555),
  BigInt(559),
  BigInt(562),
  BigInt(566),
  BigInt(570),
  BigInt(573),
  BigInt(577),
  BigInt(581),
  BigInt(584),
  BigInt(588),
  BigInt(592),
  BigInt(595),
  BigInt(599),
  BigInt(603),
  BigInt(606),
  BigInt(610),
  BigInt(614),
  BigInt(618),
  BigInt(621),
  BigInt(625),
  BigInt(629),
  BigInt(633),
  BigInt(636),
  BigInt(640),
  BigInt(644),
  BigInt(648),
  BigInt(651),
  BigInt(655),
  BigInt(659),
  BigInt(663),
  BigInt(666),
  BigInt(670),
  BigInt(674),
  BigInt(678),
  BigInt(681),
  BigInt(685),
  BigInt(689),
  BigInt(693),
  BigInt(697),
  BigInt(700),
  BigInt(704),
  BigInt(708),
  BigInt(712),
  BigInt(716),
  BigInt(719),
  BigInt(723),
  BigInt(727),
  BigInt(731),
  BigInt(735),
  BigInt(739),
  BigInt(742),
  BigInt(746),
  BigInt(750),
  BigInt(754),
  BigInt(758),
  BigInt(762),
  BigInt(766),
  BigInt(770),
  BigInt(773),
  BigInt(777),
  BigInt(781),
  BigInt(785),
  BigInt(789),
  BigInt(793),
  BigInt(797),
  BigInt(801),
  BigInt(805),
  BigInt(808),
  BigInt(812),
  BigInt(816),
  BigInt(820),
  BigInt(824),
  BigInt(828),
  BigInt(832),
  BigInt(836),
  BigInt(840),
  BigInt(844),
  BigInt(848),
  BigInt(852),
  BigInt(856),
  BigInt(860),
  BigInt(864),
  BigInt(868),
  BigInt(872),
  BigInt(876),
  BigInt(880),
  BigInt(884),
  BigInt(888),
  BigInt(892),
  BigInt(896),
  BigInt(900),
  BigInt(904),
  BigInt(908),
  BigInt(912),
  BigInt(916),
  BigInt(920),
  BigInt(924),
  BigInt(928),
  BigInt(932),
  BigInt(936),
  BigInt(940),
  BigInt(944),
  BigInt(948),
  BigInt(952),
  BigInt(956),
  BigInt(960),
  BigInt(964),
]
