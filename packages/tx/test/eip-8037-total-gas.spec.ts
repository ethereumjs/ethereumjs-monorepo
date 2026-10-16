import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createLegacyTx, paramsTx } from '../src/index.ts'

const recipient = createAddressFromString(`0x${'11'.repeat(20)}`)

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Amsterdam,
  params: paramsTx,
})

const maxTotal = common.param('maxTotalTransactionGasLimit')

describe('[Tx/EIP-8037]: total transaction gas limit', () => {
  it('accepts gas limit at TX_MAX_TOTAL_GAS_LIMIT', () => {
    assert.doesNotThrow(() =>
      createLegacyTx({ gasLimit: maxTotal, gasPrice: 1n, to: recipient }, { common }),
    )
  })

  it('rejects gas limit above TX_MAX_TOTAL_GAS_LIMIT', () => {
    assert.throws(() =>
      createLegacyTx({ gasLimit: maxTotal + 1n, gasPrice: 1n, to: recipient }, { common }),
    )
  })
})
