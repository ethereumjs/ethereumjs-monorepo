import { Chain } from '@ethereumjs/common'

import type { GenesisState } from '@ethereumjs/util'

import mainnetJSON from './genesisStates/mainnet.json'
import ropstenJSON from './genesisStates/ropsten.json'
import rinkebyJSON from './genesisStates/rinkeby.json'
import goerliJSON from './genesisStates/goerli.json'
import sepoliaJSON from './genesisStates/sepolia.json'

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
      return mainnetJSON
    case Chain.Ropsten:
      return ropstenJSON
    case Chain.Rinkeby:
      return rinkebyJSON
    case Chain.Goerli:
      return goerliJSON
    case Chain.Sepolia:
      return sepoliaJSON

    default:
      return null
  }
}
