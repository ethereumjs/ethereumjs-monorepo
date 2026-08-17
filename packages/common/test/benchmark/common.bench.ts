import { bench, describe } from 'vitest'
import { Mainnet } from '../../src/chains.ts'
import { Common } from '../../src/common.ts'
import { Hardfork } from '../../src/enums.ts'

describe('Common _buildParamsCache Benchmark', () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })

  bench('_buildParamsCache', () => {
    // @ts-expect-error - accessing protected method for benchmarking
    common._buildParamsCache()
  })
})
