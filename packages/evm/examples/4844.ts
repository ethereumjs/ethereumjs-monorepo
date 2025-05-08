import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })

console.log('is EIP-4844 active?', common.isActivatedEIP(4844))
