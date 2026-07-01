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

describe('EIP-7708 log tracing events (VM)', () => {
  it('emits callTransfer on a simple value transfer tx', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const vm = await createVM({ common })

    const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const block = createBlock(
      { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
      { common, skipConsensusFormatValidation: true },
    )

    const tx = createLegacyTx(
      {
        gasLimit: 100_000n,
        gasPrice: 10n,
        value: 1_000_000_000_000_000n,
        to: createZeroAddress(),
      },
      { common },
    ).sign(senderKey)

    const events: LogEvent[] = []
    vm.evm.events.on('log', (event) => {
      events.push(event)
    })

    await runTx(vm, { tx, block })

    assert.strictEqual(events.length, 1)
    assert.strictEqual(events[0].origin, 'callTransfer')
    assert.strictEqual(events[0].depth, 0)
  })

  it('emits finalizationBurn through the shared EVM event emitter', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const vm = await createVM({ common })

    const senderKey = hexToBytes(`0x${'31'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const block = createBlock(
      { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
      { common, skipConsensusFormatValidation: true },
    )

    // Init code runs in the new account context: ADDRESS; SELFDESTRUCT (to self).
    const initCode = hexToBytes('0x30ff')
    const tx = createLegacyTx(
      {
        gasLimit: 1_000_000n,
        gasPrice: 10n,
        value: 1_000n,
        data: initCode,
      },
      { common },
    ).sign(senderKey)

    const origins: string[] = []
    vm.evm.events.on('log', (event) => {
      origins.push(event.origin)
    })

    const result = await runTx(vm, { tx, block })

    assert.include(origins, 'createTransfer')
    assert.include(origins, 'selfdestructBurn')
    assert.isAtLeast(result.receipt.logs.length, 2)
  })
})
