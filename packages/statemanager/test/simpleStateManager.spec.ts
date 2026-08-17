import { bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { SimpleStateManager } from '../src/index.ts'

describe('[SimpleStateManager]: clearStorage', () => {
  it('clears the storage of the given address', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x' + '11'.repeat(20))
    const slot = new Uint8Array(32) // slot 0
    const value = hexToBytes('0x63') // 99
    await sm.putStorage(address, slot, value)
    assert.equal(bytesToHex(await sm.getStorage(address, slot)), '0x63')
    await sm.clearStorage(address)
    assert.equal(
      bytesToHex(await sm.getStorage(address, slot)),
      '0x',
      'storage cleared for the address',
    )
  })

  it('does not clear storage belonging to other addresses', async () => {
    const sm = new SimpleStateManager()
    const a = createAddressFromString('0x' + '11'.repeat(20))
    const b = createAddressFromString('0x' + '22'.repeat(20))
    const slot = new Uint8Array(32)
    await sm.putStorage(a, slot, hexToBytes('0x63'))
    await sm.putStorage(b, slot, hexToBytes('0x64'))
    await sm.clearStorage(a)
    assert.equal(bytesToHex(await sm.getStorage(a, slot)), '0x')
    assert.equal(
      bytesToHex(await sm.getStorage(b, slot)),
      '0x64',
      'other address storage untouched',
    )
  })

  it('implements the one-parameter StateManagerInterface signature', () => {
    // Regression guard for the original bug: the method was `async clearStorage() {}`
    // (zero parameters), which silently dropped the address argument and was invisible
    // to the compiler because a zero-parameter method satisfies a one-parameter
    // interface member.
    assert.equal(SimpleStateManager.prototype.clearStorage.length, 1)
  })
})

describe('[SimpleStateManager]: checkpointing', () => {
  it('checkpoint() / revert() restores prior storage', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x' + '11'.repeat(20))
    const slot = new Uint8Array(32)
    await sm.putStorage(address, slot, hexToBytes('0x63'))
    await sm.checkpoint()
    await sm.putStorage(address, slot, hexToBytes('0x64'))
    await sm.revert()
    assert.equal(bytesToHex(await sm.getStorage(address, slot)), '0x63')
  })

  it('checkpoint() / commit() keeps changes', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x' + '11'.repeat(20))
    const slot = new Uint8Array(32)
    await sm.putStorage(address, slot, hexToBytes('0x63'))
    await sm.checkpoint()
    await sm.putStorage(address, slot, hexToBytes('0x64'))
    await sm.commit()
    assert.equal(bytesToHex(await sm.getStorage(address, slot)), '0x64')
  })

  it('shallowCopy() isolates mutations from the original', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x' + '44'.repeat(20))
    const slot = new Uint8Array(32)
    await sm.putStorage(address, slot, hexToBytes('0x63'))
    const copy = sm.shallowCopy() as SimpleStateManager
    await sm.putStorage(address, slot, hexToBytes('0x64'))
    assert.equal(bytesToHex(await copy.getStorage(address, slot)), '0x63')
  })

  it('getStateRoot() throws (not implemented)', () => {
    const sm = new SimpleStateManager()
    assert.throws(() => sm.getStateRoot())
  })
})
