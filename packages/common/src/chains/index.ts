import { Chain, chainsType } from './../types.js'
import mainnet = require('./mainnet.json')
import ropsten = require('./ropsten.json')
import rinkeby = require('./rinkeby.json')
import kovan = require('./kovan.json')
import goerli = require('./goerli.json')
import sepolia = require('./sepolia.json')

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
    '11155111': 'sepolia',
  }
  const chains: any = {
    mainnet,
    ropsten,
    rinkeby,
    kovan,
    goerli,
    sepolia,
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
