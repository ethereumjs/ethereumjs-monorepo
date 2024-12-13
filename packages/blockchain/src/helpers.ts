import { ChainGenesis } from '@ethereumjs/common'
import { genesisMPTStateRoot } from '@ethereumjs/mpt'
import { type GenesisState, hexToBytes } from '@ethereumjs/util'

import type { Chain, Common } from '@ethereumjs/common'

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
    timestamp: genCommon.genesis().timestamp,
  })
  if (genCommon.isActivatedEIP(6800)) {
    throw Error(`Verkle tree state not yet supported`)
  } else {
    return genesisMPTStateRoot(genesisState)
  }
}

/**
 * Returns the genesis state root if chain is well known or an empty state's root otherwise
 */
export async function getGenesisStateRoot(chainId: Chain, common: Common): Promise<Uint8Array> {
  const chainGenesis = ChainGenesis[chainId]
  return chainGenesis !== undefined ? chainGenesis.stateRoot : genGenesisStateRoot({}, common)
}

/* 
The code below calculates the empty requests hash as of devnet-4 for EIP 7685
Note: it is not possible to calculate this directly in the blockchain package,
this introduces the `ethereum-cryptography` dependency.

// Used to calculate the empty requests hash
const z0 = sha256(new Uint8Array([0]))
const z1 = sha256(new Uint8Array([1]))
const z2 = sha256(new Uint8Array([2]))

export const SHA256_EMPTY_RH = sha256(concatBytes(z0, z1, z2))

*/

export const SHA256_EMPTY_RH = hexToBytes(
  '0x6036c41849da9c076ed79654d434017387a88fb833c2856b32e18218b3341c5f',
)
