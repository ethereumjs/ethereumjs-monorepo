import BN = require('bn.js')
import { PrecompileInput } from './types'
import { VmErrorResult, ExecResult } from '../evm'
import { ERROR, VmError } from '../../exceptions'
const assert = require('assert')
const { BLS12_381_ToG2Point, BLS12_381_FromG2Point } = require('./util/bls12_381')

export default async function (opts: PrecompileInput): Promise<ExecResult> {
  assert(opts.data)

  const mcl = opts._VM._mcl

  let inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  let gasUsed = new BN(opts._common.param('gasPrices', 'Bls12381G2AddGas'))

  if (inputData.length != 512) {
    return VmErrorResult(new VmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), gasUsed)
  }

  // check if some parts of input are zero bytes.
  const zeroBytes16 = Buffer.alloc(16, 0)
  const zeroByteCheck = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
    [256, 272],
    [320, 336],
    [384, 400],
    [448, 464],
  ]

  for (let index in zeroByteCheck) {
    let slicedBuffer = opts.data.slice(zeroByteCheck[index][0], zeroByteCheck[index][1])
    if (!slicedBuffer.equals(zeroBytes16)) {
      return VmErrorResult(new VmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), gasUsed)
    }
  }

  // TODO: verify that point is on G2

  // convert input to mcl G2 points, add them, and convert the output to a Buffer.

  let mclPoint1 = BLS12_381_ToG2Point(opts.data.slice(0, 256), mcl)
  let mclPoint2 = BLS12_381_ToG2Point(opts.data.slice(256, 512), mcl)

  const result = mcl.add(mclPoint1, mclPoint2)

  const returnValue = BLS12_381_FromG2Point(result)

  return {
    gasUsed,
    returnValue: returnValue,
  }
}
