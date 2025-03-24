import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'
import { createEVM } from '../../src/index.ts'

describe('EIP 6990 tests', async () => {
  it(`evmmax instantiation`, async () => {
    const evm = await createEVM({
      common: new Common({
        hardfork: Hardfork.Prague,
        eips: [6990],
        chain: Mainnet,
      }),
    })
    console.log(evm)
  })
})
