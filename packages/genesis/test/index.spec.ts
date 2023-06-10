import { Chain } from '@ethereumjs/common'
import * as tape from 'tape'

import { getGenesis } from '../src/index'

const chainToName: Record<Chain, string> = {
  [Chain.Mainnet]: 'mainnet',
  [Chain.Ropsten]: 'ropsten',
  [Chain.Rinkeby]: 'rinkeby',
  [Chain.Goerli]: 'goerli',
  [Chain.Sepolia]: 'sepolia',
}

tape('genesis test', (t) => {
  const chainIds = Object.keys(chainToName)
  for (const chainId of chainIds) {
    const name = chainToName[chainId as unknown as Chain]

    t.ok(getGenesis(Number(chainId)) !== null, `${name} genesis found`)
  }

  t.ok(getGenesis(2) === null, `genesis for chainId 2 not found`)
  t.end()
})
