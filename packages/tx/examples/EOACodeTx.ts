import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Capability, createEOACode7702Tx } from '@ethereumjs/tx'
import {
  type EOACode7702AuthorizationListItem,
  type PrefixedHexString,
  createAddressFromPrivateKey,
  randomBytes,
} from '@ethereumjs/util'

const ones32: PrefixedHexString = `0x${'01'.repeat(32)}`
const authorizationListItem: EOACode7702AuthorizationListItem = {
  chainId: '0x2',
  address: `0x${'20'.repeat(20)}`,
  nonce: '0x1',
  yParity: '0x1',
  r: ones32,
  s: ones32,
}

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const tx = createEOACode7702Tx(
  {
    authorizationList: [authorizationListItem],
    to: createAddressFromPrivateKey(randomBytes(32)),
  },
  { common },
)

console.log(
  `EIP-7702 EOA code tx created with ${tx.authorizationList.length} authorization list item(s).`,
)
console.log('Tx supports EIP-7702? ', tx.supports(Capability.EIP7702EOACode))
