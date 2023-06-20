import { Chain } from '@ethereumjs/common'

import type { GenesisState } from '@ethereumjs/util'

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
      return require('./genesisStates/mainnet.json')
    case Chain.Ropsten:
      return require('./genesisStates/ropsten.json')
    case Chain.Rinkeby:
      return require('./genesisStates/rinkeby.json')
    case Chain.Goerli:
      return require('./genesisStates/goerli.json')
    case Chain.Sepolia:
      return require('./genesisStates/sepolia.json')

    default:
      return null
  }
}
