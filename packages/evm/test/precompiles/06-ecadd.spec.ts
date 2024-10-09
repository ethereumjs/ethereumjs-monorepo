import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.js'

describe('Precompiles: BN254ADD', () => {
  it('BN254ADD', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await createEVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000006'
    const BN254ADD = getActivePrecompiles(common).get(addressStr)!

    const result = await BN254ADD({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })

    assert.deepEqual(result.executionGasUsed, BigInt(500), 'should use petersburg gas costs')
  })
})
