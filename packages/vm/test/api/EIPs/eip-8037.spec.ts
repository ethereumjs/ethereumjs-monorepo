import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

function txCommon() {
  return createLegacyTx({ gasLimit: 21_000n, gasPrice: 10n, to: sender }, { common }).common
}

async function getVM() {
  const vm = await createVM({ common })
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
  return vm
}

function block() {
  return createBlock(
    { header: { baseFeePerGas: 1n, gasLimit: 30_000_000n } },
    { common, skipConsensusFormatValidation: true },
  )
}

describe('EIP-8037 create-tx state gas at access (Amsterdam)', () => {
  it('does not fold new-account state gas into the intrinsic reject', async () => {
    const vm = await getVM()
    const c = txCommon()
    const txGas = c.param('txGas')
    const txCreationGas = c.param('txCreationGas')
    // Independent intrinsic only — would have included 120 * costPerStateByte before v7.
    // Empty initcode: independent intrinsic is txGas + txCreationGas only
    // (a 1-byte payload would also add calldata + EIP-3860 word cost).
    const tx = createLegacyTx(
      {
        gasLimit: txGas + txCreationGas,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    // Runs past intrinsic; likely OOG on new-account state at access.
    assert.isDefined(result.execResult.exceptionError)
    // EELS increments sender nonce before prepare_dispatch; prep OOG must not
    // roll it back (no contract is created).
    const senderAfter = await vm.stateManager.getAccount(sender)
    assert.strictEqual(senderAfter?.nonce, 1n)
  })

  it('still rejects below the calldata floor', async () => {
    const vm = await getVM()
    const tx = createLegacyTx(
      {
        to: sender,
        data: new Uint8Array(100).fill(1),
        gasLimit: txCommon().param('txGas') + 100n * 4n,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    await expect(runTx(vm, { block: block(), tx, skipHardForkValidation: true })).rejects.toThrow(
      /is lower than the minimum gas limit of/,
    )
  })

  it('charges new-account state gas when a create tx succeeds', async () => {
    const vm = await getVM()
    const newAccountState =
      vm.common.param('stateBytesPerNewAccount') * vm.common.param('costPerStateByte')
    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        data: hexToBytes('0x00'),
      },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.isDefined(result.txStateGas)
    assert.isTrue((result.txStateGas ?? 0n) >= newAccountState)
    const senderAfter = await vm.stateManager.getAccount(sender)
    assert.strictEqual(senderAfter?.nonce, 1n)
  })
})
