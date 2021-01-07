import { chainsType } from './../types'
import mainnet from './mainnet.json'
import ropsten from './ropsten.json'
import rinkeby from './rinkeby.json'
import kovan from './kovan.json'
import goerli from './goerli.json'

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
    mainnet,
    ropsten,
    rinkeby,
    kovan,
    goerli,
  }
  return chains
}

/**
 * @deprecated this constant will be internalized (removed)
 * on next major version update
 */
export const chains: chainsType = _getInitializedChains()
