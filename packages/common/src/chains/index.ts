import { Chain, chainsType } from './../types'
import mainnet from './mainnet.json'
import ropsten from './ropsten.json'
import rinkeby from './rinkeby.json'
import kovan from './kovan.json'
import goerli from './goerli.json'
import sepolia from './sepolia.json'

const names: Record<string, string> = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
  '5': 'goerli',
  '137': 'matic',
  '11155111': 'sepolia',
}
const chainsMapping: any = {
  mainnet,
  ropsten,
  rinkeby,
  kovan,
  goerli,
  sepolia,
}

export function _getInitializedChains(customChains?: Chain[]) {
  if (customChains) {
    for (const chain of customChains) {
      const name = chain.name
      names[chain.chainId.toString()] = name
      chainsMapping[name] = chain
    }
  }

  chainsMapping['names'] = names
  return chainsMapping
}

/**
 - * @deprecated this constant will be internalized (removed)
 - * on next major version update
 - */
export const chains: chainsType = _getInitializedChains()
