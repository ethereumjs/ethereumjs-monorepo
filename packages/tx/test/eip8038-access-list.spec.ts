import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createAccessList2930Tx, paramsTx } from '../src/index.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Amsterdam,
  params: paramsTx,
})

const address = hexToBytes(`0x${'11'.repeat(20)}`)
const slot = hexToBytes(`0x${'22'.repeat(32)}`)

describe('EIP-8038 access-list intrinsic (Amsterdam)', () => {
  it('charges cold − WARM_ACCESS per address and storage key', () => {
    const tx = createAccessList2930Tx(
      {
        chainId: 1n,
        gasLimit: 100_000n,
        gasPrice: 10n,
        to: address,
        accessList: [[address, [slot]]],
      },
      { common },
    )

    const perItem = common.param('accessListAddressGas')
    assert.strictEqual(perItem, 2900n)
    assert.strictEqual(common.param('accessListStorageKeyGas'), 2900n)

    const floorBytes = (20n + 32n) * 4n
    const floorCost = common.param('totalCostFloorPerToken') * floorBytes
    const expected =
      common.param('txGas') + common.param('txRecipientAccessGas') + perItem + perItem + floorCost
    assert.strictEqual(tx.getIntrinsicGas(), expected)
  })
})
