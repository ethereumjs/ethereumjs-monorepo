import { chainsType } from './../types'

export const chains: chainsType = {
  names: {
    '1': 'mainnet',
    '3': 'ropsten',
    '4': 'rinkeby',
    '42': 'kovan',
    '5': 'goerli',
    '73799': 'volta',
    '246': 'energyWebChain',
  },
  mainnet: require('./mainnet.json'),
  ropsten: require('./ropsten.json'),
  rinkeby: require('./rinkeby.json'),
  kovan: require('./kovan.json'),
  goerli: require('./goerli.json'),
  volta: require('./volta.json'),
  energyWebChain: require('./energyWebChain.json'),
}
