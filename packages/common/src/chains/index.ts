import { chainsType } from './../types'

/**
 * @hidden
 */
export function _getInitializedChains() {
  const chains = {
    names: {
      '1': 'mainnet',
      '3': 'ropsten',
      '4': 'rinkeby',
      '42': 'kovan',
      '5': 'goerli',
    },
    mainnet: require('./mainnet.json'),
    ropsten: require('./ropsten.json'),
    rinkeby: require('./rinkeby.json'),
    kovan: require('./kovan.json'),
    goerli: require('./goerli.json'),
  }
  return chains
}

/**
 * @deprecated this constant will be internalized (removed)
 * on next major version update
 */
export const chains: chainsType = _getInitializedChains()
