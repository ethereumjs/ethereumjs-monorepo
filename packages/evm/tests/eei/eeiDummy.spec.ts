import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { EEIDummy } from '../../src/eei/eeiDummy'
import { ripemdPrecompileAddress } from '../../src/precompiles'

const dummyAddress = Address.fromString('0x' + 'aa'.repeat(20))
const dummyAddress2 = Address.fromString('0x' + 'bb'.repeat(20))
const ripemdAddress = Address.fromString('0x' + ripemdPrecompileAddress)
const storageSlot = Buffer.from('aa'.repeat(32), 'hex')
const storageSlot2 = Buffer.from('bb'.repeat(32), 'hex')
const key1 = Buffer.from('01', 'hex')

tape('eeiDummy', (t) => {
  t.test('should set and retrieve code', async (st) => {
    const dummy = new EEIDummy()
    const code = Buffer.from('80', 'hex')
    await dummy.putContractCode(dummyAddress, code)
    const retrievedCode = await dummy.getContractCode(dummyAddress)
    st.ok(retrievedCode.equals(code), 'code of address equals expected')
    st.ok(
      (await dummy.getContractCode(dummyAddress2)).equals(Buffer.from('')),
      'code of address is empty'
    )
  })

  // Cache tests
  // TODO: verify we can also update existing slots

  t.test('verify touched accounts checkpoint/commit/revert', async (st) => {
    const dummy = new EEIDummy()
    await dummy.checkpoint()
    dummy.touchAccount(dummyAddress)
    st.ok(dummy.stateCache.isTouchedAddress(dummyAddress), 'account is touched')
    st.ok(!dummy.stateCache.isTouchedAddress(ripemdAddress), 'ripemd is not touched')
    dummy.touchAccount(ripemdAddress)
    await dummy.revert()
    st.ok(!dummy.stateCache.isTouchedAddress(dummyAddress), 'account is not touched')
    st.ok(dummy.stateCache.isTouchedAddress(ripemdAddress), 'ripemd is touched')
    await dummy.checkpoint()
    st.ok(dummy.stateCache.isTouchedAddress(ripemdAddress), 'account is still touched')
    st.ok(dummy.stateCache._touchedAccounts.length === 2, 'cache length ok')
    dummy.touchAccount(dummyAddress)
    await dummy.commit()
    st.ok(dummy.stateCache._touchedAccounts.length === 1, 'cache length ok')
    st.ok(dummy.stateCache.isTouchedAddress(dummyAddress), 'account is still touched')
  })

  t.test('verify warm address checkpoint/commit/revert', async (st) => {
    const dummy = new EEIDummy()
    await dummy.checkpoint()
    dummy.addWarmedAddress(dummyAddress.buf)
    st.ok(dummy.stateCache.isWarmedAddress(dummyAddress), 'account is warm')
    st.ok(!dummy.stateCache.isWarmedAddress(dummyAddress2), 'account is not warm')
    await dummy.revert()
    st.ok(!dummy.stateCache.isWarmedAddress(dummyAddress), 'account is not touched')
    await dummy.checkpoint()
    dummy.addWarmedAddress(dummyAddress.buf)
    st.ok(dummy.stateCache._warmAddresses.length === 2, 'cache length ok')
    await dummy.commit()
    st.ok(dummy.stateCache._warmAddresses.length === 1, 'cache length ok')
    st.ok(dummy.stateCache.isWarmedAddress(dummyAddress), 'account is still touched')
  })

  t.test('verify warm slots checkpoint/commit/revert', async (st) => {
    const dummy = new EEIDummy()
    await dummy.checkpoint()
    dummy.addWarmedStorage(dummyAddress.buf, storageSlot)
    st.ok(dummy.stateCache.isWarmedStorage(dummyAddress, storageSlot), 'slot is warm on address 1')
    st.ok(
      !dummy.stateCache.isWarmedStorage(dummyAddress2, storageSlot),
      'slot is not warm on address 2'
    )
    st.ok(
      !dummy.stateCache.isWarmedStorage(dummyAddress, storageSlot2),
      'slot 2 is not warm on address 1'
    )
    await dummy.revert()
    st.ok(
      !dummy.stateCache.isWarmedStorage(dummyAddress, storageSlot),
      'slot is not warm on address 1'
    )
    await dummy.checkpoint()
    dummy.addWarmedStorage(dummyAddress.buf, storageSlot)
    st.ok(dummy.stateCache._warmSlots.length === 2, 'cache length ok')
    await dummy.commit()
    st.ok(dummy.stateCache._warmSlots.length === 1, 'cache length ok')
    st.ok(dummy.stateCache.isWarmedStorage(dummyAddress, storageSlot), 'slot is warm on address 1')
  })

  t.test('verify slots checkpoint/commit/revert', async (st) => {
    const dummy = new EEIDummy()
    await dummy.checkpoint()
    await dummy.storageStore(dummyAddress, key1, storageSlot)
    st.ok(
      (await dummy.storageLoad(dummyAddress, key1, false)).equals(storageSlot),
      'slot is OK on address 1'
    )
    st.ok(
      (await dummy.storageLoad(dummyAddress2, key1, false)).equals(Buffer.from('')),
      'slot is OK on address 2'
    )
    st.ok(
      (await dummy.storageLoad(dummyAddress, storageSlot2, false)).equals(Buffer.from('')),
      'slot 2 is OK address 1'
    )
    await dummy.revert()
    st.ok(
      (await dummy.storageLoad(dummyAddress, key1, false)).equals(Buffer.from('')),
      'slot is OK on address 1'
    )
    await dummy.checkpoint()
    await dummy.storageStore(dummyAddress, key1, storageSlot)
    st.ok(dummy.stateCache._storage.length === 2, 'cache length ok')
    await dummy.commit()
    st.ok(dummy.stateCache._storage.length === 1, 'cache length ok')
    st.ok(
      (await dummy.storageLoad(dummyAddress, key1, false)).equals(storageSlot),
      'slot is OK on address 1'
    )
  })

  t.test('verify account checkpoint/commit/revert', async (st) => {
    const account1 = new Account(BigInt(1))
    const empty = new Account()
    const dummy = new EEIDummy()
    await dummy.checkpoint()
    await dummy.putAccount(dummyAddress, account1)
    st.ok(
      (await dummy.getAccount(dummyAddress)).serialize().equals(account1.serialize()),
      'account1 is OK on address 1'
    )
    st.ok(
      (await dummy.getAccount(dummyAddress2)).serialize().equals(empty.serialize()),
      'account is OK on address 2'
    )
    await dummy.revert()
    st.ok(
      (await dummy.getAccount(dummyAddress)).serialize().equals(empty.serialize()),
      'account is OK on address 1'
    )
    await dummy.checkpoint()
    await dummy.putAccount(dummyAddress, account1)
    st.ok(dummy.stateCache._accounts.length === 2, 'cache length ok')
    await dummy.commit()
    st.ok(dummy.stateCache._accounts.length === 1, 'cache length ok')
    st.ok(
      (await dummy.getAccount(dummyAddress)).serialize().equals(account1.serialize()),
      'account1 is OK on address 1'
    )
  })

  // end of cache tests
  t.test('should set and retrieve code', async (st) => {
    const dummy = new EEIDummy()
  })
})
