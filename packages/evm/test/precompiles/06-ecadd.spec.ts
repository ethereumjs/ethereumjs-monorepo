import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

describe('Precompiles: ECADD', () => {
  it('ECADD', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    const addressStr = '0000000000000000000000000000000000000006'
    const ECADD = getActivePrecompiles(common).get(addressStr)!

    const result = await ECADD({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: evm,
    })

    assert.deepEqual(result.executionGasUsed, BigInt(500), 'should use petersburg gas costs')
  })
})
