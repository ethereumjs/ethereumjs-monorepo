import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { EVMError } from '@ethereumjs/evm'
import { createLegacyTx, getCalldataFloorGas } from '@ethereumjs/tx'
import {
  Account,
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  createAddressFromPrivateKey,
  createAddressFromString,
  generateAddress,
  hexToBytes,
} from '@ethereumjs/util'
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

  it('binds calldata floor to txRegularGas for block accounting', async () => {
    const vm = await getVM()
    const stopCallee = createAddressFromString(`0x${'33'.repeat(20)}`)
    await vm.stateManager.putAccount(stopCallee, new Account(0n, 0n))
    await vm.stateManager.putCode(stopCallee, hexToBytes('0x00'))

    const calldata = new Uint8Array(2000)
    const tx = createLegacyTx(
      {
        to: stopCallee,
        data: calldata,
        gasLimit: 1_000_000n,
        gasPrice: 10n,
      },
      { common },
    ).sign(senderKey)

    const floor = getCalldataFloorGas(tx, sender)
    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    assert.isDefined(result.txRegularGas)
    assert.strictEqual(result.txRegularGas, floor)
    assert.strictEqual(result.txStateGas, 0n)
    assert.isTrue(floor > tx.common.param('txGas') + 5000n)
  })

  it('credits new-account state-gas spill on create-tx REVERT (receipt = floor)', async () => {
    const vm = await getVM()
    // PUSH1 0 PUSH1 0 REVERT — EST value_contract_creation_tx init_reverts
    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        data: hexToBytes('0x60006000fd'),
      },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.strictEqual(result.execResult.exceptionError?.error, EVMError.errorMessages.REVERT)
    assert.strictEqual(result.totalGasSpent, getCalldataFloorGas(tx, sender))
    assert.strictEqual(result.txStateGas, 0n)
    const senderAfter = await vm.stateManager.getAccount(sender)
    assert.strictEqual(senderAfter?.nonce, 1n)
  })
})

const factory = createAddressFromString(`0x${'11'.repeat(20)}`)
const caller = createAddressFromString(`0x${'22'.repeat(20)}`)
const txMax = 16_777_216n
const forwardedGas = 600_000n

function createTarget() {
  return createAddressFromString(bytesToHex(generateAddress(factory.bytes, bigIntToBytes(1n))))
}

function outerCallCode() {
  const gasBytes = hexToBytes(`0x${forwardedGas.toString(16).padStart(6, '0')}`)
  return concatBytes(
    hexToBytes('0x60006000600060006000'),
    hexToBytes('0x73'),
    factory.bytes,
    hexToBytes('0x62'),
    gasBytes,
    hexToBytes('0xf1'),
  )
}

function createFactoryCode(initcode: Uint8Array) {
  const word = new Uint8Array(32)
  word.set(initcode)
  return concatBytes(
    hexToBytes('0x7f'),
    word,
    hexToBytes('0x600052'),
    hexToBytes(`0x60${initcode.length.toString(16).padStart(2, '0')}`),
    hexToBytes('0x60006000f0'),
  )
}

describe('EIP-8037 inner CREATE new-account charge (Amsterdam)', () => {
  it('does not charge new-account state gas for an existing balance-only target (CREATE succeeds)', async () => {
    const vm = await getVM()
    const target = createTarget()
    // Initcode: PUSH1 0 PUSH3 0x070f60 MSTORE RETURN empty — would OOG only if
    // NEW_ACCOUNT state gas were wrongly pre-charged on this EIP-161 non-empty
    // target (balance-only). Matches EST no_account_charge_on_existing_account.
    const initcode = hexToBytes('0x600062070f605260006000f3')
    await vm.stateManager.putAccount(factory, new Account(1n, 0n))
    await vm.stateManager.putCode(factory, createFactoryCode(initcode))
    await vm.stateManager.putAccount(caller, new Account(1n, 0n))
    await vm.stateManager.putCode(caller, outerCallCode())
    await vm.stateManager.putAccount(target, new Account(0n, 1n))

    const tx = createLegacyTx({ to: caller, gasLimit: txMax, gasPrice: 10n }, { common }).sign(
      senderKey,
    )

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })
    assert.isUndefined(result.execResult.exceptionError)
    const targetAfter = await vm.stateManager.getAccount(target)
    assert.strictEqual(targetAfter?.nonce, 1n)
    const factoryAfter = await vm.stateManager.getAccount(factory)
    assert.strictEqual(factoryAfter?.nonce, 2n)
  })

  it('does not charge new-account gas for a nonce collision (burned grant is full 63/64)', async () => {
    const vm = await getVM()
    const target = createTarget()
    await vm.stateManager.putAccount(factory, new Account(1n, 0n))
    await vm.stateManager.putCode(factory, createFactoryCode(hexToBytes('0x00')))
    await vm.stateManager.putAccount(caller, new Account(1n, 0n))
    await vm.stateManager.putCode(caller, outerCallCode())
    await vm.stateManager.putAccount(target, new Account(1n, 0n))

    const collisionTx = createLegacyTx(
      { to: caller, gasLimit: txMax, gasPrice: 10n },
      { common },
    ).sign(senderKey)
    const collision = await runTx(vm, {
      block: block(),
      tx: collisionTx,
      skipHardForkValidation: true,
    })

    const vmSuccess = await getVM()
    await vmSuccess.stateManager.putAccount(factory, new Account(1n, 0n))
    await vmSuccess.stateManager.putCode(factory, createFactoryCode(hexToBytes('0x00')))
    await vmSuccess.stateManager.putAccount(caller, new Account(1n, 0n))
    await vmSuccess.stateManager.putCode(caller, outerCallCode())
    const successTx = createLegacyTx(
      { to: caller, gasLimit: txMax, gasPrice: 10n, nonce: 0n },
      { common },
    ).sign(senderKey)
    const success = await runTx(vmSuccess, {
      block: block(),
      tx: successTx,
      skipHardForkValidation: true,
    })

    const targetAfter = await vm.stateManager.getAccount(target)
    assert.strictEqual(targetAfter?.nonce, 1n)
    const created = await vmSuccess.stateManager.getAccount(createTarget())
    assert.strictEqual(created?.nonce, 1n)
    // Collision burns the withheld 63/64 grant; a successful empty create returns leftover.
    assert.isTrue(collision.totalGasSpent > success.totalGasSpent)
    const na = vm.common.param('stateBytesPerNewAccount') * vm.common.param('costPerStateByte')
    // Wrongly charging NA before 63/64 would shrink the burned grant by ~63/64 of NA.
    assert.isTrue(collision.totalGasSpent - success.totalGasSpent > (na * 63n) / 64n / 4n)
  })
})
