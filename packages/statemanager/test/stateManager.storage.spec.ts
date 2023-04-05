import { Address, toBuffer, unpadBuffer, zeros } from '@ethereumjs/util'
//import { keccak256 } from 'ethereum-cryptography/keccak'
//import { bytesToHex } from 'ethereum-cryptography/utils'
import * as tape from 'tape'
// explicitly import `inherits` to fix karma-typescript issue
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inherits } from 'util'

import { DefaultStateManager } from '../src'

//import { createAccount } from './util'

tape('StateManager -> Storage', (t) => {
  for (const storageCacheOpts of [{ deactivate: false }, { deactivate: true }]) {
    // TODO: fix test
    /**t.test('should dump storage', async (st) => {
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
      const account = createAccount()

      await stateManager.putAccount(address, account)

      const key = toBuffer('0x1234567890123456789012345678901234567890123456789012345678901234')
      const value = toBuffer('0x0a') // We used this value as its RLP encoding is also 0a
      await stateManager.putContractStorage(address, key, value)

      const data = await stateManager.dumpStorage(address)
      const expect = { [bytesToHex(keccak256(key))]: '0a' }
      st.deepEqual(data, expect, 'should dump storage value')

      st.end()
    })*/

    t.test("should validate the key's length when modifying a contract's storage", async (st) => {
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
      try {
        await stateManager.putContractStorage(address, Buffer.alloc(12), toBuffer('0x1231'))
      } catch (e: any) {
        st.equal(e.message, 'Storage key must be 32 bytes long')
        st.end()
        return
      }

      st.fail('Should have failed')
      st.end()
    })

    t.test("should validate the key's length when reading a contract's storage", async (st) => {
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
      try {
        await stateManager.getContractStorage(address, Buffer.alloc(12))
      } catch (e: any) {
        st.equal(e.message, 'Storage key must be 32 bytes long')
        st.end()
        return
      }

      st.fail('Should have failed')
      st.end()
    })

    t.test('should throw on storage values larger than 32 bytes', async (st) => {
      st.plan(1)
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      const address = Address.zero()
      const key = zeros(32)
      const value = Buffer.from('aa'.repeat(33), 'hex')
      try {
        await stateManager.putContractStorage(address, key, value)
        st.fail('did not throw')
      } catch (e: any) {
        st.pass('threw on trying to set storage values larger than 32 bytes')
      }
      st.end()
    })

    t.test('should strip zeros of storage values', async (st) => {
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      const address = Address.zero()

      const key0 = zeros(32)
      const value0 = Buffer.from('00' + 'aa'.repeat(30), 'hex') // put a value of 31-bytes length with a leading zero byte
      const expect0 = unpadBuffer(value0)
      await stateManager.putContractStorage(address, key0, value0)
      const slot0 = await stateManager.getContractStorage(address, key0)
      st.ok(slot0.equals(expect0), 'value of 31 bytes padded correctly')

      const key1 = Buffer.concat([zeros(31), Buffer.from('01', 'hex')])
      const value1 = Buffer.from('0000' + 'aa'.repeat(1), 'hex') // put a value of 1-byte length with two leading zero bytes
      const expect1 = unpadBuffer(value1)
      await stateManager.putContractStorage(address, key1, value1)
      const slot1 = await stateManager.getContractStorage(address, key1)

      st.ok(slot1.equals(expect1), 'value of 1 byte padded correctly')
      st.end()
    })

    t.test('should delete storage values which only consist of zero bytes', async (st) => {
      const address = Address.zero()
      const key = zeros(32)
      const startValue = Buffer.from('01', 'hex')

      const zeroLengths = [0, 1, 31, 32] // checks for arbitrary-length zeros
      st.plan(zeroLengths.length)

      for (const length of zeroLengths) {
        const stateManager = new DefaultStateManager({ storageCacheOpts })
        const value = zeros(length)
        await stateManager.putContractStorage(address, key, startValue)
        const currentValue = await stateManager.getContractStorage(address, key)
        if (!currentValue.equals(startValue)) {
          // sanity check
          st.fail('contract value not set correctly')
        } else {
          // delete the value
          await stateManager.putContractStorage(address, key, value)
          const deleted = await stateManager.getContractStorage(address, key)
          st.ok(deleted.equals(zeros(0)), 'the storage key should be deleted')
        }
      }
      st.end()
    })

    t.test('should not strip trailing zeros', async (st) => {
      const address = Address.zero()
      const key = zeros(32)
      const value = Buffer.from('0000aabb00', 'hex')
      const expect = Buffer.from('aabb00', 'hex')
      const stateManager = new DefaultStateManager({ storageCacheOpts })
      await stateManager.putContractStorage(address, key, value)
      const contractValue = await stateManager.getContractStorage(address, key)
      st.ok(contractValue.equals(expect), 'trailing zeros are not stripped')
      st.end()
    })
  }
})
