import * as tape from 'tape'
import { Address } from '@ethereumjs/util'
import TransientStorage from '../../src/transientStorage'

tape('Transient Storage', (tester) => {
  const it = tester.test
  it('should set and get storage', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value = Buffer.alloc(32, 0x99)

    transientStorage.put(address, key, value)
    const got = transientStorage.get(address, key)
    t.strictEqual(value, got)
    t.end()
  })

  it('should return bytes32(0) if there is no key set', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value = Buffer.alloc(32, 0x11)

    // No address set
    const got = transientStorage.get(address, key)
    t.deepEqual(Buffer.alloc(32, 0x00), got)

    // Address set, no key set
    transientStorage.put(address, key, value)
    const got2 = transientStorage.get(address, Buffer.alloc(32, 0x22))
    t.deepEqual(Buffer.alloc(32, 0x00), got2)
    t.end()
  })

  it('should revert', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value = Buffer.alloc(32, 0x99)

    transientStorage.put(address, key, value)

    transientStorage.checkpoint()

    const value2 = Buffer.alloc(32, 0x22)
    transientStorage.put(address, key, value2)
    const got = transientStorage.get(address, key)
    t.deepEqual(got, value2)

    transientStorage.revert()

    const got2 = transientStorage.get(address, key)
    t.deepEqual(got2, value)
    t.end()
  })

  it('should commit', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value = Buffer.alloc(32, 0x99)

    transientStorage.put(address, key, value)

    transientStorage.checkpoint()
    transientStorage.commit()

    const got = transientStorage.get(address, key)
    t.deepEqual(got, value)
    t.end()
  })

  it('should fail with wrong size key/value', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')

    t.throws(() => {
      transientStorage.put(address, Buffer.alloc(10), Buffer.alloc(1))
    }, /Transient storage key must be 32 bytes long/)

    t.throws(() => {
      transientStorage.put(address, Buffer.alloc(32), Buffer.alloc(33))
    }, /Transient storage value cannot be longer than 32 bytes/)

    t.end()
  })

  it('keys are stringified', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value = Buffer.alloc(32, 0x99)

    transientStorage.put(address, key, value)
    t.deepEqual(
      transientStorage.get(
        Address.fromString('0xff00000000000000000000000000000000000002'),
        Buffer.alloc(32, 0xff)
      ),
      value
    )
    t.end()
  })

  it('revert applies changes in correct order', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value1 = Buffer.alloc(32, 0x01)
    const value2 = Buffer.alloc(32, 0x02)
    const value3 = Buffer.alloc(32, 0x03)

    transientStorage.put(address, key, value1)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.put(address, key, value3)
    transientStorage.revert()

    t.deepEqual(transientStorage.get(address, key), value1)
    t.end()
  })

  it('nested reverts', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value0 = Buffer.alloc(32, 0x00)
    const value1 = Buffer.alloc(32, 0x01)
    const value2 = Buffer.alloc(32, 0x02)
    const value3 = Buffer.alloc(32, 0x03)

    transientStorage.put(address, key, value1)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.put(address, key, value3)
    transientStorage.checkpoint()
    transientStorage.put(address, key, value2)
    transientStorage.checkpoint()

    t.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    // not changed since nothing happened after latest checkpoint
    t.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    t.deepEqual(transientStorage.get(address, key), value3)
    transientStorage.revert()
    t.deepEqual(transientStorage.get(address, key), value1)
    transientStorage.revert()
    t.deepEqual(transientStorage.get(address, key), value0)

    t.end()
  })

  it('commit batches changes into next revert', (t) => {
    const transientStorage = new TransientStorage()

    const address = Address.fromString('0xff00000000000000000000000000000000000002')
    const key = Buffer.alloc(32, 0xff)
    const value1 = Buffer.alloc(32, 0x01)
    const value2 = Buffer.alloc(32, 0x02)
    const value3 = Buffer.alloc(32, 0x03)

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

    t.deepEqual(transientStorage.get(address, key), value2)
    transientStorage.revert()
    t.deepEqual(transientStorage.get(address, key), value1)

    t.end()
  })
})
