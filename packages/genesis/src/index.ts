import { Chain } from '@ethereumjs/common'

import { holeskyGenesis } from './genesisStates/holesky.ts'
import { hoodiGenesis } from './genesisStates/hoodi.ts'
import { mainnetGenesis } from './genesisStates/mainnet.ts'
import { sepoliaGenesis } from './genesisStates/sepolia.ts'

import type { GenesisState } from '@ethereumjs/common'

/**
 * Returns the genesis state for a well-known Ethereum network.
 *
 * @param chainId Numeric chain identifier (see {@link Chain} in `@ethereumjs/common`)
 * @returns Genesis state map keyed by address, or `undefined` if the chain is not supported
 */
export function getGenesis(chainId: number): GenesisState | undefined {
  switch (chainId) {
    case Chain.Mainnet:
      return mainnetGenesis
    case Chain.Sepolia:
      return sepoliaGenesis
    case Chain.Holesky:
      return holeskyGenesis
    case Chain.Hoodi:
      return hoodiGenesis

    default:
      return undefined
  }
}
