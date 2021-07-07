import { Chain, chainsType } from './../types'
import mainnet from './mainnet.json'
import ropsten from './ropsten.json'
import rinkeby from './rinkeby.json'
import kovan from './kovan.json'
import goerli from './goerli.json'
import calaveras from './calaveras.json'

/**
 * @hidden
 */
export function _getInitializedChains(customChains?: Chain[]) {
  const names: any = {
    '1': 'mainnet',
    '3': 'ropsten',
    '4': 'rinkeby',
    '42': 'kovan',
    '5': 'goerli',
    '123': 'calaveras',
  }
  const chains: any = {
    mainnet,
    ropsten,
    rinkeby,
    kovan,
    goerli,
    calaveras,
  }
  if (customChains) {
    for (const chain of customChains) {
      const name = chain.name
      names[chain.chainId.toString()] = name
      chains[name] = chain
    }
  }

  chains['names'] = names
  return chains
}

/**
 * @deprecated this constant will be internalized (removed)
 * on next major version update
 */
export const chains: chainsType = _getInitializedChains()
