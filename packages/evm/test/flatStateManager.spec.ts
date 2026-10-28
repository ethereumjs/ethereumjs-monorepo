import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  Address,
  createAccount,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

describe('[EVM/FlatStateManager]: runCall', () => {
  it('SLOAD and SSTORE use snap-seeded storage', async () => {
    const sm = createFlatStateManager()
    const addr = createAddressFromString('0x00000000000000000000000000000000000000ff')
    const accountHash = keccak_256(addr.bytes)
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const slotHash = keccak_256(slot)
    sm.putSnapAccountsBatch([
      { accountHash, account: createAccount({ nonce: 1n, balance: 0n }), address: addr },
    ])
    sm.putSnapStorageBatch(accountHash, [
      { slotHash, value: setLengthLeft(hexToBytes('0x01'), 32) },
    ])
    const seeded = await sm.getStorage(addr, slot)
    assert.isAbove(seeded.length, 0)
    assert.strictEqual(seeded[seeded.length - 1], 1)
    const code = hexToBytes('0x600154600260015500')
    await sm.putCode(addr, code)

    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const evm = await createEVM({ common, stateManager: sm })
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    await evm.stateManager.putAccount(caller, createAccount({ balance: 10n ** 18n }))

    const result = await evm.runCall({
      caller,
      to: addr,
      gasLimit: 1_000_000n,
      skipNonceIncrement: true,
    })
    assert.isUndefined(result.execResult.exceptionError)
    const stored = await sm.getStorage(addr, slot)
    assert.isAbove(stored.length, 0)
    assert.strictEqual(stored[stored.length - 1], 2)
  })

  it('reverted nested CALL leaves parent storage unchanged', async () => {
    const sm = createFlatStateManager()
    const parent = createAddressFromString('0x00000000000000000000000000000000000000ff')
    const child = createAddressFromString('0x00000000000000000000000000000000000000ee')
    const slot = setLengthLeft(hexToBytes('0x01'), 32)
    const slotHash = keccak_256(slot)
    for (const [addr, balance] of [
      [parent, 0n],
      [child, 0n],
    ] as const) {
      const accountHash = keccak_256(addr.bytes)
      sm.putSnapAccountsBatch([
        { accountHash, account: createAccount({ nonce: 1n, balance }), address: addr },
      ])
    }
    sm.putSnapStorageBatch(keccak_256(parent.bytes), [
      { slotHash, value: setLengthLeft(hexToBytes('0x01'), 32) },
    ])
    await sm.putCode(child, hexToBytes('0x6008600155fd'))
    const childHex = child.toString().slice(2).padStart(40, '0')
    await sm.putCode(
      parent,
      hexToBytes(`0x600760015560006000600073${childHex}6000600063fffffffff100`),
    )

    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const evm = await createEVM({ common, stateManager: sm })
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000dd'))
    await evm.stateManager.putAccount(caller, createAccount({ balance: 10n ** 18n }))

    const result = await evm.runCall({
      caller,
      to: parent,
      gasLimit: 1_000_000n,
      skipNonceIncrement: true,
    })
    assert.isUndefined(result.execResult.exceptionError)
    const stored = await sm.getStorage(parent, slot)
    assert.isAbove(stored.length, 0)
    assert.strictEqual(stored[stored.length - 1], 7)
  })
})
