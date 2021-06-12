import { genesisStatesType } from './../types'

const genesisStates: genesisStatesType = {
  names: {
    '1': 'mainnet',
    '3': 'ropsten',
    '4': 'rinkeby',
    '42': 'kovan',
    '5': 'goerli',
    '123': 'calaveras',
  },
  mainnet: require('./mainnet.json'),
  ropsten: require('./ropsten.json'),
  rinkeby: require('./rinkeby.json'),
  kovan: require('./kovan.json'),
  goerli: require('./goerli.json'),
  calaveras: require('./calaveras.json'),
}

/**
 * Returns the genesis state by network ID
 * @param id ID of the network (e.g. 1)
 * @returns Dictionary with genesis accounts
 */
export function genesisStateById(id: number): any {
  return genesisStates[genesisStates['names'][id]]
}

/**
 * Returns the genesis state by network name
 * @param name Name of the network (e.g. 'mainnet')
 * @returns Dictionary with genesis accounts
 */
export function genesisStateByName(name: string): any {
  return genesisStates[name]
}
