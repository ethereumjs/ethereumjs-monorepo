import { createBlockFromBlockData } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet })

const block = createBlockFromBlockData(
  {
    // Provide your block data here or use default values
  },
  { common },
)

console.log(`Proof-of-Stake (default) block created with hardfork=${block.common.hardfork()}`)
