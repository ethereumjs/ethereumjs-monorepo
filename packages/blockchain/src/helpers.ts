import { ChainGenesis } from '@ethereumjs/common'
import { genesisStateRoot as genMerkleGenesisStateRoot } from '@ethereumjs/trie'

import type { Chain, Common } from '@ethereumjs/common'
import type { GenesisState } from '@ethereumjs/util'

/**
 * Safe creation of a new Blockchain object awaiting the initialization function,
 * encouraged method to use when creating a blockchain object.
 *
 * @param opts Constructor options, see {@link BlockchainOptions}
 */

/**
 * Verkle or Merkle genesis root
 * @param genesisState
 * @param common
 * @returns
 */
export async function genGenesisStateRoot(
  genesisState: GenesisState,
  common: Common,
): Promise<Uint8Array> {
  const genCommon = common.copy()
  genCommon.setHardforkBy({
    blockNumber: 0,
    td: BigInt(genCommon.genesis().difficulty),
    timestamp: genCommon.genesis().timestamp,
  })
  if (genCommon.isActivatedEIP(6800)) {
    throw Error(`Verkle tree state not yet supported`)
  } else {
    return genMerkleGenesisStateRoot(genesisState)
  }
}

/**
 * Returns the genesis state root if chain is well known or an empty state's root otherwise
 */
export async function getGenesisStateRoot(chainId: Chain, common: Common): Promise<Uint8Array> {
  const chainGenesis = ChainGenesis[chainId]
  return chainGenesis !== undefined ? chainGenesis.stateRoot : genGenesisStateRoot({}, common)
}
