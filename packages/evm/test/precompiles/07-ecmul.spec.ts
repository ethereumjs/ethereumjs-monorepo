import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.js'

describe('Precompiles: BN254MUL', () => {
  it('BN254MUL', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await createEVM({
      common,
    })
    const BN254MUL = getActivePrecompiles(common).get('0000000000000000000000000000000000000007')!

    const result = await BN254MUL({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })

    assert.deepEqual(result.executionGasUsed, BigInt(40000), 'should use petersburg gas costs')
  })
})
