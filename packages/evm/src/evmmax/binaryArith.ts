import { bigIntToBEBytes, limbsToInt, placeBEBytesInOutput } from './index.js'

// binary arithmetic preset functions

export function mulModBinary(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  const result = (X * Y) % M
  const resultBytes = bigIntToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}

export function addModBinary(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  const result = (X + Y) % M
  const resultBytes = bigIntToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}

export function subModBinary(z: bigint[], x: bigint[], y: bigint[], modulus: bigint[]) {
  const X = limbsToInt(x)
  const Y = limbsToInt(y)
  const M = limbsToInt(modulus)

  let result = (X - Y) % M
  if (result < 0n) {
    result += M
  }
  const resultBytes = bigIntToBEBytes(result)
  placeBEBytesInOutput(z, resultBytes)
}
