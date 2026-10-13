import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, estimateTxGasDimensions, runTx } from '../../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

describe('[VM/estimateTxGasDimensions]: first-touch state gas', () => {
  it('adds new-account state gas for a value transfer to an empty recipient', async () => {
    const vm = await createVM({ common })
    await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))

    const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
    const tx = createLegacyTx(
      { gasLimit: 300_000n, gasPrice: 10n, value: 1n, to: recipient },
      { common },
    ).sign(senderKey)

    const estimate = await estimateTxGasDimensions(vm, tx)
    const newAccountState =
      vm.common.param('stateBytesPerNewAccount') * vm.common.param('costPerStateByte')
    assert.strictEqual(estimate.estimatedStateGas, newAccountState)
    assert.strictEqual(estimate.recommendedGasLimit, estimate.minimumGasLimit + newAccountState)

    const result = await runTx(vm, {
      tx,
      block: createBlock(
        { header: { baseFeePerGas: 1n, gasLimit: 30_000_000n } },
        { common, skipConsensusFormatValidation: true },
      ),
      skipHardForkValidation: true,
    })
    assert.isUndefined(result.execResult.exceptionError)
    assert.strictEqual(result.txStateGas, estimate.estimatedStateGas)
  })

  it('reports zero state gas when the recipient already exists', async () => {
    const vm = await createVM({ common })
    await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
    const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
    await vm.stateManager.putAccount(recipient, new Account(0n, 1n))

    const tx = createLegacyTx(
      { gasLimit: 21_000n, gasPrice: 10n, value: 1n, to: recipient },
      { common },
    ).sign(senderKey)

    const estimate = await estimateTxGasDimensions(vm, tx)
    assert.strictEqual(estimate.estimatedStateGas, 0n)
    assert.strictEqual(estimate.recommendedGasLimit, estimate.minimumGasLimit)
  })
})
