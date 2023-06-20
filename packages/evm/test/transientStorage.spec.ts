import { Address } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { TransientStorage } from '../src/transientStorage.js'

describe('Transient Storage', () => {
  it('should set and get storage', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value = new Uint8Array(32).fill(0x99)

    transientStorage.put(address, key, value)
    const got = transientStorage.get(address, key)
    assert.strictEqual(value, got)
  })

  it('should return bytes32(0) if there is no key set', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value = new Uint8Array(32).fill(0x11)

    // No address set
    const got = transientStorage.get(address, key)
    assert.deepEqual(new Uint8Array(32).fill(0x00), got)

    // Address set, no key set
    transientStorage.put(address, key, value)
    const got2 = transientStorage.get(address, new Uint8Array(32).fill(0x22))
    assert.deepEqual(new Uint8Array(32).fill(0x00), got2)
  })

  it('should revert', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value = new Uint8Array(32).fill(0x99)

    transientStorage.put(address, key, value)

    transientStorage.checkpoint()

    const value2 = new Uint8Array(32).fill(0x22)
    transientStorage.put(address, key, value2)
    const got = transientStorage.get(address, key)
    assert.deepEqual(got, value2)

    transientStorage.revert()

    const got2 = transientStorage.get(address, key)
    assert.deepEqual(got2, value)
  })

  it('should commit', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value = new Uint8Array(32).fill(0x99)

    transientStorage.put(address, key, value)

    transientStorage.checkpoint()
    transientStorage.commit()

    const got = transientStorage.get(address, key)
    assert.deepEqual(got, value)
  })

  it('should fail with wrong size key/value', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')

    assert.throws(() => {
      transientStorage.put(address, new Uint8Array(10), new Uint8Array(1))
    }, /Transient storage key must be 32 bytes long/)

    assert.throws(() => {
      transientStorage.put(address, new Uint8Array(32), new Uint8Array(33))
    }, /Transient storage value cannot be longer than 32 bytes/)
  })

  it('keys are stringified', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value = new Uint8Array(32).fill(0x99)

    transientStorage.put(address, key, value)
    assert.deepEqual(
      transientStorage.get(
        Address.fromString('0xff00000000000000000000000000000000000002'),
        new Uint8Array(32).fill(0xff)
      ),
      value
    )
  })

  it('revert applies changes in correct order', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value1 = new Uint8Array(32).fill(0x01)
    const value2 = new Uint8Array(32).fill(0x02)
    const value3 = new Uint8Array(32).fill(0x03)

    transientStorage.put(address, key, value1)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.put(address, key, value3)
    transientStorage.revert()

    assert.deepEqual(transientStorage.get(address, key), value1)
  })

  it('nested reverts', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value0 = new Uint8Array(32).fill(0x00)
    const value1 = new Uint8Array(32).fill(0x01)
    const value2 = new Uint8Array(32).fill(0x02)
    const value3 = new Uint8Array(32).fill(0x03)

    transientStorage.put(address, key, value1)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.put(address, key, value3)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.checkpoint()

    assert.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    // not changed since nothing happened after latest checkpoint
    assert.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    assert.deepEqual(transientStorage.get(address, key), value3)
    transientStorage.revert()
    assert.deepEqual(transientStorage.get(address, key), value1)
    transientStorage.revert()
    assert.deepEqual(transientStorage.get(address, key), value0)
  })

  it('commit batches changes into next revert', () => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = new Uint8Array(32).fill(0xff)
    const value1 = new Uint8Array(32).fill(0x01)
    const value2 = new Uint8Array(32).fill(0x02)
    const value3 = new Uint8Array(32).fill(0x03)

    transientStorage.put(address, key, value1)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.put(address, key, value3)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.checkpoint()

    // clears empty checkpoint
    transientStorage.commit()
    // now revert should go all the way to 1
    transientStorage.commit()

    assert.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    assert.deepEqual(transientStorage.get(address, key), value1)
  })
})
