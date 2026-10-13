import { Chain } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { getGenesis } from '../src/index.ts'

describe('[Genesis]: getGenesis', () => {
  it('getGenesis() returns state for supported chains', () => {
    for (const chainId of [Chain.Mainnet, Chain.Sepolia, Chain.Holesky, Chain.Hoodi]) {
      assert.isDefined(getGenesis(chainId), `chainId=${chainId} should have genesis state`)
    }
  })

  it('getGenesis() returns undefined for unknown chainId', () => {
    assert.isUndefined(getGenesis(999999))
  })
})
