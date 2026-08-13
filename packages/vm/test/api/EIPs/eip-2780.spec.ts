import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)
const recipient = createZeroAddress()

function txCommon() {
  return createLegacyTx({ gasLimit: 21_000n, gasPrice: 10n, to: recipient }, { common }).common
}

function extra2780Regular(c: Common, txValue: bigint, selfTransfer: boolean) {
  if (selfTransfer) return 0n
  let extra = c.param('txRecipientAccessGas')
  if (txValue > 0n) {
    extra += c.param('txValueCost') + c.param('transferLogCost')
  }
  return extra
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

describe('EIP-2780 top-frame gas (Amsterdam)', () => {
  it('rejects below state-independent intrinsic (txGas) only', async () => {
    const vm = await getVM()
    const txGas = txCommon().param('txGas')
    const tx = createLegacyTx(
      {
        to: recipient,
        value: 1n,
        gasLimit: txGas - 1n,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    await expect(runTx(vm, { block: block(), tx, skipHardForkValidation: true })).rejects.toThrow(
      /INTRINSIC_GAS_TOO_LOW/,
    )
  })

  it('does not reject at intrinsic for a gasLimit between txGas and the old 21k bundle', async () => {
    const vm = await getVM()
    await vm.stateManager.putAccount(recipient, new Account(0n, 1n))
    const txGas = txCommon().param('txGas')
    const tx = createLegacyTx(
      {
        to: recipient,
        value: 1n,
        gasLimit: txGas + 1n,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isDefined(result.execResult.exceptionError)
  })

  it('intrinsic reject is independent of whether the recipient exists', async () => {
    const c = txCommon()
    const mid = c.param('txGas') + extra2780Regular(c, 1n, false) / 2n
    const makeTx = () =>
      createLegacyTx({ to: recipient, value: 1n, gasLimit: mid, gasPrice: 10n }, { common }).sign(
        senderKey,
      )

    const vmEmpty = await getVM()
    const emptyResult = await runTx(vmEmpty, {
      block: block(),
      tx: makeTx(),
      skipHardForkValidation: true,
    })

    const vmExisting = await getVM()
    await vmExisting.stateManager.putAccount(recipient, new Account(0n, 1n))
    const existingResult = await runTx(vmExisting, {
      block: block(),
      tx: makeTx(),
      skipHardForkValidation: true,
    })

    // Both pass the intrinsic check (would have thrown INTRINSIC_GAS_TOO_LOW
    // when 2780 extras were still in the splitter). Runtime OOG is expected.
    assert.isDefined(emptyResult.execResult.exceptionError)
    assert.isDefined(existingResult.execResult.exceptionError)
  })

  it('charges recipient/value/log at the frame, not in minGasLimit, for an existing recipient', async () => {
    const vm = await getVM()
    await vm.stateManager.putAccount(recipient, new Account(0n, 1n))
    const c = txCommon()
    const gasLimit = c.param('txGas') + extra2780Regular(c, 1n, false)
    const tx = createLegacyTx(
      { to: recipient, value: 1n, gasLimit: 1_000_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.strictEqual(result.totalGasSpent, gasLimit)
  })

  it('self-transfer skips recipient and value charges', async () => {
    const vm = await getVM()
    const tx = createLegacyTx(
      { to: sender, value: 1n, gasLimit: 1_000_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.strictEqual(result.totalGasSpent, txCommon().param('txGas'))
  })
})
