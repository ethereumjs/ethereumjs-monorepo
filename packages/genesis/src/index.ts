import { Chain } from '@ethereumjs/common'

import type { GenesisState } from '@ethereumjs/common'

/**
 * Utility to get the genesisState of a well known network
 *
 * The (potentially large) genesis allocation for each chain is loaded lazily
 * via a dynamic `import()`, so consumers only pull in the state data for the
 * chain(s) they actually request instead of bundling every known chain's
 * allocation. This keeps the package entry point tiny for bundled consumers.
 *
 * @param chainId chainId of the network
 * @returns genesisState of the chain, or `undefined` for an unknown chain
 */
export async function getGenesis(chainId: number): Promise<GenesisState | undefined> {
  switch (chainId) {
    case Chain.Mainnet:
      return (await import('./genesisStates/mainnet.ts')).mainnetGenesis
    case Chain.Sepolia:
      return (await import('./genesisStates/sepolia.ts')).sepoliaGenesis
    case Chain.Holesky:
      return (await import('./genesisStates/holesky.ts')).holeskyGenesis
    case Chain.Hoodi:
      return (await import('./genesisStates/hoodi.ts')).hoodiGenesis

    default:
      return undefined
  }
}
