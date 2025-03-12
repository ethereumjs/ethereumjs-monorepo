import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../src/index.ts'

describe('genesis', () => {
  it('should initialize with predefined genesis states', async () => {
    const f = async () => {
      const genesisState = getGenesis(Chain.Mainnet)

      const blockchain = await createBlockchain({ genesisState })
      await createVM({ blockchain })
    }

    assert.doesNotThrow(f, 'should allow for initialization with genesis from genesis package')
  })
})
