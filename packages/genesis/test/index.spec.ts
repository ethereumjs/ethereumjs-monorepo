import { Chain, ChainGenesis } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { getGenesis } from '../src/index.js'

describe('genesis test', () => {
  it('tests getGenesis', async () => {
    const chainIds = Object.keys(ChainGenesis)
    for (const chainId of chainIds) {
      // Kaustinen can have an empty genesis state since verkle blocks contain their pre-state
      if (Number(chainId) === Chain.Kaustinen6) continue

      const { name } = ChainGenesis[chainId as unknown as Chain]

      const genesisState = getGenesis(Number(chainId))
      assert.ok(
        genesisState !== undefined,
        `network=${name} chainId=${chainId} genesis should be found`,
      )
    }
  })
})
