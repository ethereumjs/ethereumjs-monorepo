import { Common, parseGethGenesis } from './index.js'

import type { BaseOpts, ChainConfig, GethConfigOpts } from './index.js'

/**
 * Creates a {@link Common} object for a custom Mainnet, based on a standard one.
 *
 * It uses all the {@link Chain} parameters from the {@link baseChain} option except the ones overridden
 * in a provided {@link chainParamsOrName} dictionary. Some usage example:
 *
 * ```javascript
 * createCustomCommon({chainId: 123})
 * ```
 *
 * There are also selected supported custom chains which can be initialized by using one of the
 * {@link CustomChains} for {@link chainParamsOrName}, e.g.:
 *
 * ```javascript
 * createCustomCommon(CustomChains.MaticMumbai)
 * ```
 *
 * Note that these supported custom chains only provide some base parameters (usually the chain and
 * network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
 * the `@ethereumjs/tx` library to a Layer-2 chain).
 *
 * @param partialConfig Custom parameter dict
 * @param baseChain `ChainConfig` chain configuration taken as a base chain, e.g. `Mainnet` (exported at root level)
 * @param opts Custom chain options to set the {@link CustomCommonOpts.baseChain}, selected {@link CustomCommonOpts.hardfork} and others
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
 * Static method to load and set common from a geth genesis json
 * @param genesisJson json of geth configuration
 * @param { Mainnet, eips, genesisHash, hardfork, mergeForkIdPostMerge } to further configure the common instance
 * @returns Common
 */
export function createCommonFromGethGenesis(
  genesisJson: any,
  {
    chain,
    eips,
    genesisHash,
    hardfork,
    params,
    mergeForkIdPostMerge,
    customCrypto,
  }: GethConfigOpts,
): Common {
  const genesisParams = parseGethGenesis(genesisJson, chain, mergeForkIdPostMerge)
  const common = new Common({
    chain: genesisParams,
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
