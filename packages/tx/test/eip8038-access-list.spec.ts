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
  it('charges cold − WARM_ACCESS per address (2900) and storage key (2000)', () => {
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

    const perAddress = common.param('accessListAddressGas')
    const perStorageKey = common.param('accessListStorageKeyGas')
    assert.strictEqual(perAddress, 2900n)
    assert.strictEqual(perStorageKey, 2000n)

    const floorBytes = (20n + 32n) * 4n
    const floorCost = common.param('totalCostFloorPerToken') * floorBytes
    const expected =
      common.param('txGas') +
      common.param('txRecipientAccessGas') +
      perAddress +
      perStorageKey +
      floorCost
    assert.strictEqual(tx.getIntrinsicGas(), expected)
  })
})
