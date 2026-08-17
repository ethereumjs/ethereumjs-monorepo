import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

import type { ExecResult, PrecompileInput } from '@ethereumjs/evm'

// Custom precompile that adds two 32-byte big-endian unsigned integers (mod 2^256).
const ADDITION_GAS = 15n

function additionPrecompile(input: PrecompileInput): ExecResult {
  const a = bytesToBigInt(input.data.subarray(0, 32))
  const b = bytesToBigInt(input.data.subarray(32, 64))
  const sum = (a + b) % 2n ** 256n
  return {
    executionGasUsed: ADDITION_GAS,
    returnValue: setLengthLeft(bigIntToBytes(sum), 32),
  }
}

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const ADDRESS = '0x000000000000000000000000000000000000ff01'

  // Register the custom precompile with a hex string address
  const evm = await createEVM({
    common,
    customPrecompiles: [{ address: ADDRESS, function: additionPrecompile }],
  })

  // Verify it is registered
  const fn = evm.getPrecompile(ADDRESS)
  console.log(`Precompile registered at ${ADDRESS}: ${fn !== undefined}`)

  // Build call data: two 32-byte values (7 + 35)
  const a = setLengthLeft(bigIntToBytes(7n), 32)
  const b = setLengthLeft(bigIntToBytes(35n), 32)
  const callData = new Uint8Array(64)
  callData.set(a, 0)
  callData.set(b, 32)

  // Execute via runCall
  const result = await evm.runCall({
    to: createAddressFromString(ADDRESS),
    gasLimit: BigInt(30000),
    data: callData,
  })

  console.log('--------------------------------')
  console.log('Custom Addition Precompile')
  console.log(`Input    : 7 + 35`)
  console.log(
    `Result   : ${bytesToBigInt(result.execResult.returnValue)} (${bytesToHex(result.execResult.returnValue)})`,
  )
  console.log(`Gas used : ${result.execResult.executionGasUsed}`)
  console.log('--------------------------------')
}

void main()
