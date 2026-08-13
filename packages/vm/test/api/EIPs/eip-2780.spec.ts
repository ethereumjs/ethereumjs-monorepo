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

describe('EIP-2780 intrinsic gas (Amsterdam)', () => {
  it('rejects below txGas + recipient/value extras', async () => {
    const vm = await getVM()
    const c = txCommon()
    const min = c.param('txGas') + extra2780Regular(c, 1n, false)
    const tx = createLegacyTx(
      {
        to: recipient,
        value: 1n,
        gasLimit: min - 1n,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    await expect(runTx(vm, { block: block(), tx, skipHardForkValidation: true })).rejects.toThrow(
      /INTRINSIC_GAS_TOO_LOW/,
    )
  })

  it('accepts a value transfer at the decomposed 21k intrinsic (existing recipient)', async () => {
    const vm = await getVM()
    await vm.stateManager.putAccount(recipient, new Account(0n, 1n))
    const c = txCommon()
    const min = c.param('txGas') + extra2780Regular(c, 1n, false)
    const tx = createLegacyTx(
      {
        to: recipient,
        value: 1n,
        gasLimit: min,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.strictEqual(result.totalGasSpent, min)
  })

  it('intrinsic reject does not depend on whether the recipient exists', async () => {
    const c = txCommon()
    const mid = c.param('txGas') + extra2780Regular(c, 1n, false) / 2n
    const makeTx = () =>
      createLegacyTx({ to: recipient, value: 1n, gasLimit: mid, gasPrice: 10n }, { common }).sign(
        senderKey,
      )

    const vmEmpty = await getVM()
    await expect(
      runTx(vmEmpty, { block: block(), tx: makeTx(), skipHardForkValidation: true }),
    ).rejects.toThrow(/INTRINSIC_GAS_TOO_LOW/)

    const vmExisting = await getVM()
    await vmExisting.stateManager.putAccount(recipient, new Account(0n, 1n))
    await expect(
      runTx(vmExisting, { block: block(), tx: makeTx(), skipHardForkValidation: true }),
    ).rejects.toThrow(/INTRINSIC_GAS_TOO_LOW/)
  })

  it('self-transfer skips recipient and value extras', async () => {
    const vm = await getVM()
    const tx = createLegacyTx(
      { to: sender, value: 1n, gasLimit: txCommon().param('txGas'), gasPrice: 10n },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.strictEqual(result.totalGasSpent, txCommon().param('txGas'))
  })

  it('calldata floor is anchored on TX_BASE + recipient extras, not txGas alone', async () => {
    const vm = await getVM()
    await vm.stateManager.putAccount(recipient, new Account(0n, 1n))
    const c = txCommon()
    const data = new Uint8Array(100).fill(1)
    const floorTokens = BigInt(data.length) * 4n
    const oldFloor = c.param('txGas') + c.param('totalCostFloorPerToken') * floorTokens
    const newFloor = oldFloor + extra2780Regular(c, 0n, false)
    // Between the pre-3120 floor (txGas only) and the v7 floor (txGas + recipient).
    const gasLimit = (oldFloor + newFloor) / 2n
    assert.isTrue(gasLimit > oldFloor)
    assert.isTrue(gasLimit < newFloor)

    const tx = createLegacyTx({ to: recipient, data, gasLimit, gasPrice: 10n }, { common }).sign(
      senderKey,
    )

    await expect(runTx(vm, { block: block(), tx, skipHardForkValidation: true })).rejects.toThrow(
      /is lower than the minimum gas limit of/,
    )
  })
})
