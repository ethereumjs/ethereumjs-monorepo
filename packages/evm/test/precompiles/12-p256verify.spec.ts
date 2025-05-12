import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { BIGINT_0, bytesToBigInt, concatBytes, hexToBytes, unpadBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { PrecompileInput } from '../../src/index.ts'

describe('Precompiles: p256 verify', () => {
  it('should work', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [7212] })
    const evm = await createEVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000012'
    const p256Verify = getActivePrecompiles(common).get(addressStr)!

    // Random inputs
    const testCase = {
      hash: '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' as PrefixedHexString,
      r: '0x0000000000000000000000000000000000000000000000000000000000000002' as PrefixedHexString,
      s: '0x0000000000000000000000000000000000000000000000000000000000000001' as PrefixedHexString,
      x: '0x0000000000000000000000000000000000000000000000000000000000000002' as PrefixedHexString,
      y: '0x0000000000000000000000000000000000000000000000000000000000000003' as PrefixedHexString,
    }

    const opts: PrecompileInput = {
      data: concatBytes(
        hexToBytes(testCase.hash),
        hexToBytes(testCase.r),
        hexToBytes(testCase.s),
        hexToBytes(testCase.x),
        hexToBytes(testCase.y),
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      common,
    }

    const res = await p256Verify(opts)
    assert.strictEqual(
      bytesToBigInt(unpadBytes(res.returnValue.slice(32))),
      BIGINT_0,
      'p256 verify precompile fails to verify nonsense inputs',
    )
  })
})
