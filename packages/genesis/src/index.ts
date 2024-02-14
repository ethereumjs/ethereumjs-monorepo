import { Chain } from '@ethereumjs/common'

import { goerliGenesis } from './genesisStates/goerli.js'
import { holeskyGenesis } from './genesisStates/holesky.js'
import { mainnetGenesis } from './genesisStates/mainnet.js'
import { sepoliaGenesis } from './genesisStates/sepolia.js'

import type { GenesisState } from '@ethereumjs/util'

/**
 * Utility to get the genesisState of a well known network
 * @param: chainId of the network
 * @returns genesisState of the chain
 */
export function getGenesis(chainId: number): GenesisState | undefined {
  switch (chainId) {
    case Chain.Mainnet:
      return mainnetGenesis
    case Chain.Goerli:
      return goerliGenesis
    case Chain.Sepolia:
      return sepoliaGenesis
    case Chain.Holesky:
      return holeskyGenesis

    default:
      return undefined
  }
}
