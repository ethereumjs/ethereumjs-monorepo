import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { EIP7708_TRANSFER_TOPIC } from '@ethereumjs/evm'
import {
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

import type { LogEvent, LogOrigin } from '@ethereumjs/evm'

describe('log tracing events', () => {
  it('emits opcode logs from LOG1 bytecode', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
    const evm = await createEVM({ common })

    const contract = createAddressFromString('0x00000000000000000000000000000000000000c0')
    const topic = hexToBytes(`0x${'11'.repeat(32)}`)
    const dataWord = hexToBytes(`0x${'00'.repeat(31)}42`)
    const code = hexToBytes(
      `0x7f${bytesToHex(dataWord).slice(2)}6000527f${bytesToHex(topic).slice(2)}60206000a100`,
    )
    await evm.stateManager.putCode(contract, code)

    const events: LogEvent[] = []
    evm.events.on('log', (event) => {
      events.push(event)
    })

    await evm.runCode({ code, to: contract, gasLimit: 100_000n })

    assert.strictEqual(events.length, 1)
    assert.strictEqual(events[0].origin, 'opcode')
    assert.strictEqual(events[0].depth, 0)
    assert.isTrue(equalsBytes(events[0].log[0], contract.bytes))
    assert.strictEqual(events[0].log[1].length, 1)
    assert.isTrue(equalsBytes(events[0].log[1][0], topic))
  })

  it('emits callTransfer for EIP-7708 value transfers', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })

    const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
    await evm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const events: LogEvent[] = []
    evm.events.on('log', (event) => {
      events.push(event)
    })

    await evm.runCall({
      caller: sender,
      to: recipient,
      value: 1_000n,
      gasLimit: 100_000n,
    })

    assert.strictEqual(events.length, 1)
    assert.strictEqual(events[0].origin, 'callTransfer')
    assert.strictEqual(events[0].depth, 0)
    assert.isTrue(equalsBytes(events[0].address.bytes, recipient.bytes))
    assert.isTrue(equalsBytes(events[0].log[1][0], EIP7708_TRANSFER_TOPIC))
  })

  it('emits createTransfer and selfdestructBurn for CREATE + SELFDESTRUCT to self', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })

    const senderKey = hexToBytes(`0x${'21'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await evm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    // Init code runs in the new account context: ADDRESS; SELFDESTRUCT (to self).
    const initCode = hexToBytes('0x30ff')

    const origins: LogOrigin[] = []
    evm.events.on('log', (event) => {
      origins.push(event.origin)
    })

    await evm.runCall({
      caller: sender,
      data: initCode,
      value: 1_000n,
      gasLimit: 1_000_000n,
    })

    assert.include(origins, 'createTransfer')
    assert.include(origins, 'selfdestructBurn')
  })

  it('supports async log listeners on synthetic transfer logs', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })

    const senderKey = hexToBytes(`0x${'23'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    const recipient = createAddressFromString('0x00000000000000000000000000000000000000ee')
    await evm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    let didPause = false
    evm.events.on('log', async (_event, next) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50))
      didPause = true
      next?.()
    })

    await evm.runCall({
      caller: sender,
      to: recipient,
      value: 1_000n,
      gasLimit: 100_000n,
    })
    assert.isTrue(didPause)
  })

  it('documents optimistic emission when a reverting frame clears logs', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })

    const senderKey = hexToBytes(`0x${'22'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(senderKey)
    await evm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

    const inner = createAddressFromString('0x00000000000000000000000000000000000000bb')
    const outer = createAddressFromString('0x00000000000000000000000000000000000000cc')
    await evm.stateManager.putCode(inner, hexToBytes('0x00'))
    // CALL inner with 1 wei, then REVERT the outer frame.
    await evm.stateManager.putCode(
      outer,
      hexToBytes(
        '0x6000600060006000600173bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb620f4240f15060006000fd',
      ),
    )

    const events: LogEvent[] = []
    evm.events.on('log', (event) => {
      events.push(event)
    })

    const result = await evm.runCall({
      caller: sender,
      to: outer,
      value: 1n,
      gasLimit: 1_000_000n,
    })

    assert.isTrue(events.some((event) => event.origin === 'callTransfer'))
    assert.strictEqual(result.execResult.logs?.length ?? 0, 0)
  })
})
