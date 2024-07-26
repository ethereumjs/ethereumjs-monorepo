import { Chain } from '@ethereumjs/common' // or directly use chain ID
import { getGenesis } from '@ethereumjs/genesis'

const mainnetGenesis = getGenesis(Chain.Mainnet)
console.log(
  `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${parseInt(
    mainnetGenesis!['0x000d836201318ec6899a67540690382780743280'] as string,
  )}`,
)
