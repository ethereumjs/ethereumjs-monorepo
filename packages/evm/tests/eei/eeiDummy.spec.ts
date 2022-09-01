import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { EEIDummy } from '../../src/eei/eeiDummy'
import { ripemdPrecompileAddress } from '../../src/precompiles'

const dummyAddress = Address.fromString('0x' + 'aa'.repeat(20))
const dummyAddress2 = Address.fromString('0x' + 'bb'.repeat(20))
const ripemdAddress = Address.fromString('0x' + ripemdPrecompileAddress)

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
    dummy.touchAccount(dummyAddress)
    await dummy.commit()
    st.ok(dummy.stateCache.isTouchedAddress(dummyAddress), 'account is still touched')
  })

  t.test('should set and retrieve code', async (st) => {
    const dummy = new EEIDummy()
  })
})
