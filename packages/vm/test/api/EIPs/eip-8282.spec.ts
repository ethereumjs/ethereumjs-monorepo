import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bigIntToBytes, bytesToHex, setLengthLeft } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

function paramAddress(
  vm: Awaited<ReturnType<typeof createVM>>,
  name: 'builderDepositContractAddress' | 'builderExitContractAddress',
) {
  return bytesToHex(setLengthLeft(bigIntToBytes(vm.common.param(name)), 20))
}

describe('EIP-8282 builder request addresses (Amsterdam)', () => {
  it('uses the glamsterdam-devnet v7 mined deposit and exit addresses', async () => {
    const vm = await createVM({ common })
    assert.strictEqual(
      paramAddress(vm, 'builderDepositContractAddress').toLowerCase(),
      '0x0000bff46984e3725691fa540a8c7589300d8282',
    )
    assert.strictEqual(
      paramAddress(vm, 'builderExitContractAddress').toLowerCase(),
      '0x000064d678505ad48f8ccb093bc65613800e8282',
    )
  })
})
