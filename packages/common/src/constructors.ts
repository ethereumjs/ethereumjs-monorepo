import { Common, parseGethGenesis } from './index.ts'

import type { GethGenesis } from './gethGenesis.ts'
import type { BaseOpts, ChainConfig, GethConfigOpts } from './index.ts'

/**
 * Creates a {@link Common} object for a custom chain, based on a standard one.
 *
 * It uses all the {@link Chain} parameters from the {@link baseChain} option except the ones overridden
 * in a provided {@link chainParamsOrName} dictionary. Some usage example:
 *
 * ```javascript
 * import { createCustomCommon, Mainnet } from '@ethereumjs/common'
 *
 * createCustomCommon({chainId: 123}, Mainnet)
 * ``
 *
 * @param partialConfig Custom parameter dict
 * @param baseChain `ChainConfig` chain configuration taken as a base chain, e.g. `Mainnet` (exported at root level)
 * @param opts Custom chain options to set various {@link BaseOpts}
 */
export function createCustomCommon(
  partialConfig: Partial<ChainConfig>,
  baseChain: ChainConfig,
  opts: BaseOpts = {},
): Common {
  return new Common({
    chain: {
      ...baseChain,
      ...partialConfig,
    },
    ...opts,
  })
}

/**
 * Static method to load and set common from a geth genesis object
 * @param gethGenesis GethGenesis object
 * @param  opts additional {@link GethConfigOpts} for configuring common
 * @returns Common
 */
export function createCommonFromGethGenesis(
  genesisJSON: GethGenesis,
  { chain, eips, genesisHash, hardfork, params, customCrypto }: GethConfigOpts,
): Common {
  const genesisParams = parseGethGenesis(genesisJSON, chain)
  const common = new Common({
    chain: {
      ...genesisParams,
      name: genesisParams.name ?? 'Custom chain',
    } as ChainConfig, // Typecasting because of `string` -> `PrefixedHexString` mismatches
    eips,
    params,
    hardfork: hardfork ?? genesisParams.hardfork,
    customCrypto,
  })
  if (genesisHash !== undefined) {
    common.setForkHashes(genesisHash)
  }
  return common
}
