import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EOACodeEIP7702Transaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

const ones32 = `0x${'01'.repeat(32)}` as PrefixedHexString

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
const tx = EOACodeEIP7702Transaction.fromTxData(
  {
    authorizationList: [
      {
        chainId: '0x2',
        address: `0x${'20'.repeat(20)}`,
        nonce: ['0x1'],
        yParity: '0x1',
        r: ones32,
        s: ones32,
      },
    ],
  },
  { common }
)

console.log(
  `EIP-7702 EOA code tx created with ${tx.authorizationList.length} authorization list item(s).`
)
