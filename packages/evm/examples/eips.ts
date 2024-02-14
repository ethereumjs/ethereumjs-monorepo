import { Chain, Common } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'

const common = new Common({ chain: Chain.Mainnet, eips: [3074] })
const evm = new EVM({ common })
console.log(`EIP 3074 is active - ${evm.common.isActivatedEIP(3074)}`)
