import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

import type { LogEvent } from '@ethereumjs/evm'

/**
 * Init code: CREATE an inner contract whose init is ADDRESS; SELFDESTRUCT (to self),
 * then CALL that address with 5 wei. The balance that arrives after selfdestruct is
 * burned when the same-transaction account is deleted (EIP-6780). That path needs
 * EIP-7708 without EIP-8246.
 *
 * Memory: MSTORE of 0x30ff leaves those two bytes at offset 30.
 * After CREATE the address sits under the CALL arguments; DUP6 copies it back
 * so the top of the stack is the gas stipend.
 */
const FINALIZATION_INIT = hexToBytes('0x6130ff6000526002601e6001f0600060006000600060058561fffff100')

function blockFor(common: Common) {
  return createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
}

describe('[VM/EIP-7708]: log tracing events', () => {
  it('emits callTransfer on a simple value transfer tx', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const vm = await createVM({ common })

    const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        value: 1_000_000_000_000_000n,
        to: createZeroAddress(),
      },
      { common },
    ).sign(senderKey)

    const events: LogEvent[] = []
    vm.evm.events!.on('log', (event) => {
      events.push(event)
    })

    await runTx(vm, { tx, block: blockFor(common) })

    assert.strictEqual(events.length, 1)
    assert.strictEqual(events[0].origin, 'callTransfer')
    assert.strictEqual(events[0].depth, 0)
  })

  it('does not emit burn origins for an Amsterdam self-selfdestruct', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const vm = await createVM({ common })

    const senderKey = hexToBytes(`0x${'31'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    // Init code runs in the new account context: ADDRESS; SELFDESTRUCT (to self).
    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        value: 1_000n,
        data: hexToBytes('0x30ff'),
      },
      { common },
    ).sign(senderKey)

    const origins: string[] = []
    vm.evm.events!.on('log', (event) => {
      origins.push(event.origin)
    })

    const result = await runTx(vm, { tx, block: blockFor(common) })

    assert.deepEqual(origins, ['createTransfer'])
    assert.strictEqual(result.receipt.logs.length, 1)
  })

  it('emits finalizationBurn when a same-tx selfdestruct keeps a later balance', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka, eips: [7708] })
    const vm = await createVM({ common })

    const senderKey = hexToBytes(`0x${'32'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        value: 1_000n,
        data: FINALIZATION_INIT,
      },
      { common },
    ).sign(senderKey)

    const origins: string[] = []
    vm.evm.events!.on('log', (event) => {
      origins.push(event.origin)
    })

    const result = await runTx(vm, { tx, block: blockFor(common) })

    assert.deepEqual(origins, [
      'createTransfer',
      'createTransfer',
      'selfdestructBurn',
      'callTransfer',
      'finalizationBurn',
    ])
    assert.strictEqual(result.receipt.logs.length, origins.length)
  })
})
