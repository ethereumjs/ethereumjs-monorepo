import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runBlock, runTx } from '../../../src/index.ts'

/**
 * Minimal repro of EST `create2_address_collision` (tests@v21.0.1):
 * CREATE2 → SSTORE(0)=1 → CREATE2 (same address) → collision.
 *
 * Pinned expectations from fixture header + sender balance delta (gasPrice 10).
 */
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

const factory = createAddressFromString('0x0c2b11f61c9cc421787ab3abe51ad68386c4580f')
const factoryCode = hexToBytes('0x60006000526000600160006000f515156000556000600160006000f5')
const deployedChild = createAddressFromString('0x293961eb3a5c1eeeaf6cee0fcd60d187e695626b')

/** Sender balance delta / gasPrice from fixture `postState`. */
const EXPECTED_TOTAL_GAS_SPENT = 496_422n
/** Fixture block 1 `gasUsed` = max(regular, state) = state dimension here. */
const EXPECTED_TX_STATE_GAS = 281_520n
/** Fixture: remaining dimension (`totalGasSpent` = regular + state). */
const EXPECTED_TX_REGULAR_GAS = 214_902n

const TX_GAS_LIMIT = 499_021n
const GAS_PRICE = 10n

const senderPreBalance = BigInt('0x033b2e3c9fd0803ce8000000')

async function getVM() {
  const vm = await createVM({ common })
  await vm.stateManager.putAccount(sender, new Account(0n, senderPreBalance))
  await vm.stateManager.putAccount(factory, new Account(1n, 0n))
  await vm.stateManager.putCode(factory, factoryCode)
  return vm
}

function block() {
  return createBlock(
    { header: { baseFeePerGas: 7n, gasLimit: 120_000_000n } },
    { common, skipConsensusFormatValidation: true },
  )
}

describe('[VM/EIP-8037]: CREATE2 address collision (EST create2_address_collision)', () => {
  it('matches fixture gas dimensions and post-state', async () => {
    const vm = await getVM()
    const tx = createLegacyTx(
      { to: factory, gasLimit: TX_GAS_LIMIT, gasPrice: GAS_PRICE, value: 0n },
      { common },
    ).sign(senderKey)

    const result = await runTx(vm, { block: block(), tx, skipHardForkValidation: true })

    assert.isUndefined(result.execResult.exceptionError)

    const factoryAfter = await vm.stateManager.getAccount(factory)
    assert.strictEqual(factoryAfter?.nonce, 3n)
    const slot0 = await vm.stateManager.getStorage(factory, setLengthLeft(new Uint8Array(0), 32))
    assert.strictEqual(slot0[slot0.length - 1], 1)

    const child = await vm.stateManager.getAccount(deployedChild)
    assert.isDefined(child)
    assert.strictEqual(child?.nonce, 1n)

    assert.strictEqual(result.totalGasSpent, EXPECTED_TOTAL_GAS_SPENT)
    assert.strictEqual(result.txRegularGas, EXPECTED_TX_REGULAR_GAS)
    assert.strictEqual(result.txStateGas, EXPECTED_TX_STATE_GAS)

    const senderAfter = await vm.stateManager.getAccount(sender)
    assert.strictEqual(
      senderPreBalance - (senderAfter?.balance ?? 0n),
      EXPECTED_TOTAL_GAS_SPENT * GAS_PRICE,
    )
  })
})
