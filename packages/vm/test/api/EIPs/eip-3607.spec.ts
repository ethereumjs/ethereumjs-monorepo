import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

describe('EIP-3607 tests', () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [3607] })
  const commonNoEIP3607 = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [] })
  const precompileAddr = Address.fromString('0x0000000000000000000000000000000000000001')

  it('should reject txs from senders with deployed code when EIP is enabled', async () => {
    const vm = await VM.create({ common })
    await vm.stateManager.putContractCode(precompileAddr, new Uint8Array(32).fill(1))
    const tx = LegacyTransaction.fromTxData({ gasLimit: 100000 }, { freeze: false })
    tx.getSenderAddress = () => precompileAddr
    try {
      await vm.runTx({ tx, skipHardForkValidation: true })
      assert.fail('runTx should have thrown')
    } catch (error: any) {
      if ((error.message as string).includes('EIP-3607')) {
        assert.ok(true, 'threw correct error')
      } else {
        assert.fail('did not throw correct error')
      }
    }
  })

  it('should not reject txs from senders with deployed code when EIP is not enabled', async () => {
    const vm = await VM.create({ common: commonNoEIP3607 })
    await vm.stateManager.putContractCode(precompileAddr, new Uint8Array(32).fill(1))
    const tx = LegacyTransaction.fromTxData({ gasLimit: 100000 }, { freeze: false })
    tx.getSenderAddress = () => precompileAddr
    try {
      await vm.runTx({ tx, skipHardForkValidation: true })
      assert.ok('runTx successfully ran')
    } catch (error: any) {
      assert.fail('threw an unexpected error')
    }
  })
})
