import { createBlock } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { Address, hexToBytes } from '@ethereumjs/util'

import type { WithdrawalData } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet })

const withdrawal = <WithdrawalData>{
  index: BigInt(0),
  validatorIndex: BigInt(0),
  address: new Address(hexToBytes(`0x${'20'.repeat(20)}`)),
  amount: BigInt(1000),
}

const block = createBlock(
  {
    header: {
      withdrawalsRoot: hexToBytes(
        '0x69f28913c562b0d38f8dc81e72eb0d99052444d301bf8158dc1f3f94a4526357',
      ),
    },
    withdrawals: [withdrawal],
  },
  {
    common,
  },
)

console.log(`Block with ${block.withdrawals!.length} withdrawal(s) created`)
