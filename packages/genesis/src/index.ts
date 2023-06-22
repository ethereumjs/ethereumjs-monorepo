import { Chain } from '@ethereumjs/common'

import type { GenesisState } from '@ethereumjs/util'

import { mainnetGenesis } from './genesisStates/mainnet.js'
import { ropstenGenesis } from './genesisStates/ropsten.js'
import { rinkebyGenesis } from './genesisStates/rinkeby.js'
import { goerliGenesis } from './genesisStates/goerli.js'
import { sepoliaGenesis } from './genesisStates/sepolia.js'

/**
 * Utility to get the genesisState of a well known network
 * @param: chainId of the network
 * @returns genesisState of the chain
 */
export function getGenesis(chainId: number): GenesisState | null {
  // Use require statements here in favor of import statements
  // to load json files on demand
  // (high memory usage by large mainnet.json genesis state file)
  switch (chainId) {
    case Chain.Mainnet:
      return mainnetGenesis
    case Chain.Ropsten:
      return ropstenGenesis
    case Chain.Rinkeby:
      return rinkebyGenesis
    case Chain.Goerli:
      return goerliGenesis
    case Chain.Sepolia:
      return sepoliaGenesis

    default:
      return null
  }
}
