import { Common, CustomChain, Hardfork, _getChainParams, parseGethGenesis } from './index.js'

import type { ChainConfig, CustomCommonOpts, GethConfigOpts } from './index.js'

/**
 * Creates a {@link Common} object for a custom chain, based on a standard one.
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
 * @param chainParamsOrName Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain
 * @param opts Custom chain options to set the {@link CustomCommonOpts.baseChain}, selected {@link CustomCommonOpts.hardfork} and others
 */
export function createCustomCommon(
  chainParamsOrName: Partial<ChainConfig> | CustomChain,
  opts: CustomCommonOpts = {},
): Common {
  const baseChain = opts.baseChain ?? 'mainnet'
  const standardChainParams = { ..._getChainParams(baseChain) }
  standardChainParams['name'] = 'custom-chain'

  if (typeof chainParamsOrName !== 'string') {
    return new Common({
      chain: {
        ...standardChainParams,
        ...chainParamsOrName,
      },
      ...opts,
    })
  } else {
    if (chainParamsOrName === CustomChain.PolygonMainnet) {
      return createCustomCommon(
        {
          name: CustomChain.PolygonMainnet,
          chainId: 137,
        },
        opts,
      )
    }
    if (chainParamsOrName === CustomChain.PolygonMumbai) {
      return createCustomCommon(
        {
          name: CustomChain.PolygonMumbai,
          chainId: 80001,
        },
        opts,
      )
    }
    if (chainParamsOrName === CustomChain.ArbitrumOne) {
      return createCustomCommon(
        {
          name: CustomChain.ArbitrumOne,
          chainId: 42161,
        },
        opts,
      )
    }
    if (chainParamsOrName === CustomChain.xDaiChain) {
      return createCustomCommon(
        {
          name: CustomChain.xDaiChain,
          chainId: 100,
        },
        opts,
      )
    }

    if (chainParamsOrName === CustomChain.OptimisticKovan) {
      return createCustomCommon(
        {
          name: CustomChain.OptimisticKovan,
          chainId: 69,
        },
        opts,
      )
    }

    if (chainParamsOrName === CustomChain.OptimisticEthereum) {
      return createCustomCommon(
        {
          name: CustomChain.OptimisticEthereum,
          chainId: 10,
        },
        // Optimism has not implemented the London hardfork yet (targeting Q1.22)
        { hardfork: Hardfork.Berlin, ...opts },
      )
    }
    throw new Error(`Custom chain ${chainParamsOrName} not supported`)
  }
}

/**
 * Static method to load and set common from a geth genesis json
 * @param genesisJson json of geth configuration
 * @param { chain, eips, genesisHash, hardfork, mergeForkIdPostMerge } to further configure the common instance
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
    chain: genesisParams.name ?? 'custom',
    customChains: [genesisParams],
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
