import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
