import BN = require('bn.js')
import { PrecompileInput } from './types'
import { VmErrorResult, ExecResult, OOGResult } from '../evm'
import { ERROR, VmError } from '../../exceptions'
const assert = require('assert')
const {
  BLS12_381_ToG2Point,
  BLS12_381_ToFrPoint,
  BLS12_381_FromG2Point,
} = require('./util/bls12_381')

export default async function (opts: PrecompileInput): Promise<ExecResult> {
  assert(opts.data)

  const mcl = opts._VM._mcl

  let inputData = opts.data

  if (inputData.length == 0) {
    return VmErrorResult(new VmError(ERROR.BLS_12_381_INPUT_EMPTY), new BN(0)) // follow Geths implementation
  }

  const numPairs = inputData.length / 288

  let gasUsedPerPair = new BN(opts._common.param('gasPrices', 'Bls12381G2MulGas'))
  let gasDiscountArray = opts._common.param('gasPrices', 'Bls12381MultiExpGasDiscount')
  let gasDiscountMax = gasDiscountArray[gasDiscountArray.length - 1][1]
  let gasDiscountMultiplier = new BN(gasDiscountArray[numPairs - 1] || gasDiscountMax)

  let gasUsed = gasUsedPerPair.imul(new BN(numPairs)).imul(gasDiscountMultiplier).idivn(1000)

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length % 288 != 0) {
    return VmErrorResult(new VmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), gasUsed)
  }

  // prepare pairing list and check for mandatory zero bytes

  const zeroBytes16 = Buffer.alloc(16, 0)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
  ]

  let G2Array = []
  let FrArray = []

  for (let k = 0; k < inputData.length / 288; k++) {
    // zero bytes check
    let pairStart = 288 * k
    for (let index in zeroByteCheck) {
      let slicedBuffer = opts.data.slice(
        zeroByteCheck[index][0] + pairStart,
        zeroByteCheck[index][1] + pairStart,
      )
      if (!slicedBuffer.equals(zeroBytes16)) {
        return VmErrorResult(new VmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), gasUsed)
      }
    }
    let G2
    try {
      G2 = BLS12_381_ToG2Point(opts.data.slice(pairStart, pairStart + 256), mcl)
    } catch (e) {
      return VmErrorResult(e, gasUsed)
    }
    let Fr = BLS12_381_ToFrPoint(opts.data.slice(pairStart + 256, pairStart + 288), mcl)

    G2Array.push(G2)
    FrArray.push(Fr)
  }

  const result = mcl.mulVec(G2Array, FrArray)

  const returnValue = BLS12_381_FromG2Point(result)

  return {
    gasUsed,
    returnValue: returnValue,
  }
}
