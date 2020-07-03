import BN = require('bn.js')
import { PrecompileInput } from './types'
import { VmErrorResult, ExecResult, OOGResult } from '../evm'
import { ERROR, VmError } from '../../exceptions'
const assert = require('assert')
const {
  BLS12_381_ToG1Point,
  BLS12_381_ToFrPoint,
  BLS12_381_FromG1Point,
} = require('./util/bls12_381')

export default async function (opts: PrecompileInput): Promise<ExecResult> {
  assert(opts.data)

  const mcl = opts._VM._mcl

  let inputData = opts.data

  if (inputData.length == 0) {
    return VmErrorResult(new VmError(ERROR.BLS_12_381_INPUT_EMPTY), new BN(0)) // follow Geths implementation
  }

  const numPairs = inputData.length / 160

  let gasUsedPerPair = new BN(opts._common.param('gasPrices', 'Bls12381G1MulGas'))
  let gasDiscountArray = opts._common.param('gasPrices', 'Bls12381MultiExpGasDiscount')
  let gasDiscountMax = gasDiscountArray[gasDiscountArray.length - 1][1]
  let gasDiscountMultiplier = new BN(gasDiscountArray[numPairs - 1] || gasDiscountMax)

  let gasUsed = gasUsedPerPair.imul(new BN(numPairs)).imul(gasDiscountMultiplier).idivn(1000)

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length % 160 != 0) {
    return VmErrorResult(new VmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), gasUsed)
  }

  // prepare pairing list and check for mandatory zero bytes

  const zeroBytes16 = Buffer.alloc(16, 0)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
  ]

  let G1Array = []
  let FrArray = []

  for (let k = 0; k < inputData.length / 160; k++) {
    // zero bytes check
    let pairStart = 160 * k
    for (let index in zeroByteCheck) {
      let slicedBuffer = opts.data.slice(
        zeroByteCheck[index][0] + pairStart,
        zeroByteCheck[index][1] + pairStart,
      )
      if (!slicedBuffer.equals(zeroBytes16)) {
        return VmErrorResult(new VmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), gasUsed)
      }
    }
    let G1
    try {
      G1 = BLS12_381_ToG1Point(opts.data.slice(pairStart, pairStart + 128), mcl)
    } catch (e) {
      return VmErrorResult(e, gasUsed)
    }
    let Fr = BLS12_381_ToFrPoint(opts.data.slice(pairStart + 128, pairStart + 160), mcl)

    G1Array.push(G1)
    FrArray.push(Fr)
  }

  const result = mcl.mulVec(G1Array, FrArray)

  const returnValue = BLS12_381_FromG1Point(result)

  return {
    gasUsed,
    returnValue: returnValue,
  }
}
