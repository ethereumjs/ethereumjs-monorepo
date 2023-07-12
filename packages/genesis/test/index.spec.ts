import { Chain } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { getGenesis } from '../src/index.js'

const chainToName: Record<Chain, string> = {
  [Chain.Mainnet]: 'mainnet',
  [Chain.Goerli]: 'goerli',
  [Chain.Sepolia]: 'sepolia',
}

describe('genesis test', () => {
  it('tests getGenesis', async () => {
    const chainIds = Object.keys(chainToName)
    for (const chainId of chainIds) {
      const name = chainToName[chainId as unknown as Chain]

      assert.ok(getGenesis(Number(chainId)) !== null, `${name} genesis found`)
    }

    assert.ok(getGenesis(2) === null, `genesis for chainId 2 not found`)
  })
})
