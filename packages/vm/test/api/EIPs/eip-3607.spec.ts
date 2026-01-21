import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

describe('EIP-3607 tests', () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })
  const precompileAddr = createAddressFromString('0x0000000000000000000000000000000000000001')

  it('should reject txs from senders with deployed code', async () => {
    const vm = await createVM({ common })
    await vm.stateManager.putCode(precompileAddr, new Uint8Array(32).fill(1))
    const tx = createLegacyTx({ gasLimit: 100000 }, { freeze: false })
    tx.getSenderAddress = () => precompileAddr
    try {
      await runTx(vm, { tx, skipHardForkValidation: true })
      assert.fail('runTx should have thrown')
    } catch (error: any) {
      if ((error.message as string).includes('EIP-3607')) {
        assert.isTrue(true, 'threw correct error')
      } else {
        assert.fail('did not throw correct error')
      }
    }
  })
})
