import { Chain } from '@ethereumjs/common'

import { holeskyGenesis } from './genesisStates/holesky.ts'
import { mainnetGenesis } from './genesisStates/mainnet.ts'
import { sepoliaGenesis } from './genesisStates/sepolia.ts'

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
    case Chain.Sepolia:
      return sepoliaGenesis
    case Chain.Holesky:
      return holeskyGenesis

    default:
      return undefined
  }
}
