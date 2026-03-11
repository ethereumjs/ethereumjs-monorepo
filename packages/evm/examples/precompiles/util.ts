import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import type { PrefixedHexString } from '@ethereumjs/util'

/**
 * Generic utility function to run any precompile
 * @param name - Descriptive name for console output
 * @param precompile - The `0x`-prefixed hex address for the precompile (e.g., '0xb' for BLS12_G1ADD)
 * @param data - The `0x`-prefixed hex input data for the precompile
 * @param hardfork - The hardfork to use (defaults to Osaka)
 * @returns The precompile execution result
 */
export async function runPrecompile(
  name: string,
  precompile: PrefixedHexString,
  data: PrefixedHexString,
  hardfork: Hardfork = Hardfork.Osaka,
) {
  const common = new Common({ chain: Mainnet, hardfork })
  const evm = await createEVM({ common })

  const precompileFunction = evm.getPrecompile(precompile)

  if (!precompileFunction) {
    throw new Error(`Precompile ${precompile} not found for hardfork ${hardfork}`)
  }

  const callData = {
    data: hexToBytes(data),
    gasLimit: BigInt(5000000),
    common,
    _EVM: evm,
  }

  const res = await precompileFunction(callData)
  console.log('--------------------------------')
  console.log(`Running precompile ${name} on hardfork ${hardfork}:`)
  console.log(`Result   : ${bytesToHex(res.returnValue)}`)
  console.log(`Gas used : ${res.executionGasUsed}`)
  console.log('--------------------------------')
}
