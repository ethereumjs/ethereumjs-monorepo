import { ChainGenesis } from '@ethereumjs/common'
import { genesisMPTStateRoot } from '@ethereumjs/mpt'

import type { Chain, Common, GenesisState } from '@ethereumjs/common'

/**
 * Compute the Merkle Patricia trie root of a custom genesis state.
 */
export async function genGenesisStateRoot(
  genesisState: GenesisState,
  common: Common,
): Promise<Uint8Array> {
  const genCommon = common.copy()
  genCommon.setHardforkBy({
    blockNumber: 0,
    timestamp: genCommon.genesis().timestamp,
  })
  return genesisMPTStateRoot(genesisState)
}

/**
 * Returns the genesis state root if chain is well known or an empty state's root otherwise
 */
export async function getGenesisStateRoot(chainId: Chain, common: Common): Promise<Uint8Array> {
  const chainGenesis = ChainGenesis[chainId]
  return chainGenesis !== undefined ? chainGenesis.stateRoot : genGenesisStateRoot({}, common)
}
