import { Chain, ChainGenesis } from '@ethereumjs/common'
import { genesisStateRoot as genGenesisStateRoot } from '@ethereumjs/trie'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { getGenesis } from '../src/index.js'

describe('genesis test', () => {
  it('tests getGenesis', async () => {
    const chainIds = Object.keys(ChainGenesis)
    for (const chainId of chainIds) {
      // Kaustinen can have an empty genesis state since verkle blocks contain their pre-state
      if (Number(chainId) === Chain.Kaustinen4) continue

      const { name, stateRoot: expectedRoot } = ChainGenesis[chainId as unknown as Chain]

      const genesisState = getGenesis(Number(chainId))
      assert.ok(
        genesisState !== undefined,
        `network=${name} chainId=${chainId} genesis should be found`
      )

      const stateRoot = await genGenesisStateRoot(genesisState!)
      assert.ok(
        equalsBytes(expectedRoot, stateRoot),
        `network=${name} chainId=${chainId} stateRoot should match expected=${bytesToHex(
          expectedRoot
        )} actual=${bytesToHex(stateRoot)}`
      )
    }
  })
})
