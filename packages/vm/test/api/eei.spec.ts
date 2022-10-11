import { Blockchain } from '@ethereumjs/blockchain'
import { Common } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { DefaultStateManager as StateManager } from '@ethereumjs/statemanager'
import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { VM } from '../../src'
import { EEI } from '../../src/eei/eei'

const ZeroAddress = Address.zero()

tape('EEI', (t) => {
  t.test('should return false on non-existing accounts', async (st) => {
    const eei = new EEI(
      new StateManager(),
      new Common({ chain: 'mainnet' }),
      await Blockchain.create()
    ) // create a dummy EEI (no VM, no EVM, etc.)
    st.notOk(await eei.accountExists(ZeroAddress))
    st.ok(await eei.accountIsEmpty(ZeroAddress))
    st.end()
  })

  t.test(
    'should return false on non-existing accounts which once existed in state but are now gone',
    async (st) => {
      const eei = new EEI(
        new StateManager(),
        new Common({ chain: 'mainnet' }),
        await Blockchain.create()
      ) // create a dummy EEI (no VM, no EVM, etc.)
      // create empty account
      await eei.putAccount(ZeroAddress, new Account())
      st.ok(await eei.accountExists(ZeroAddress))
      st.ok(await eei.accountIsEmpty(ZeroAddress))
      // now put a non-empty account
      const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
      await eei.putAccount(ZeroAddress, nonEmptyAccount)
      st.ok(await eei.accountExists(ZeroAddress))
      st.notOk(await eei.accountIsEmpty(ZeroAddress))
      st.end()
    }
  )

  t.test('should return true on existing accounts', async (st) => {
    const eei = new EEI(
      new StateManager(),
      new Common({ chain: 'mainnet' }),
      await Blockchain.create()
    ) // create a dummy EEI (no VM, no EVM, etc.)
    // create empty account
    await eei.putAccount(ZeroAddress, new Account())
    st.ok(await eei.accountExists(ZeroAddress)) // sanity check: account exists before we delete it
    st.ok(await eei.accountIsEmpty(ZeroAddress)) // it is obviously empty
    await eei.deleteAccount(ZeroAddress) // delete the account
    st.notOk(await eei.accountExists(ZeroAddress)) // account should not exist
    st.ok(await eei.accountIsEmpty(ZeroAddress)) // account is empty
    st.end()
  })

  t.test('eei should return consistent values in vm/evm', async (st) => {
    const eei = new EEI(
      new StateManager(),
      new Common({ chain: 'mainnet' }),
      await Blockchain.create()
    )
    const evm = new EVM({ eei })
    try {
      await VM.create({ eei, evm })
      st.fail('should have thrown')
    } catch (err: any) {
      st.equal(
        err.message,
        'cannot specify EEI if EVM opt provided',
        'throws when EEI and EVM opts are provided'
      )
    }

    const address = new Address(Buffer.from('02E815899482f27C899fB266319dE7cc97F72E87', 'hex'))
    void eei.putAccount(address, Account.fromAccountData({ nonce: 5, balance: '0x123' }))
    const vm = await VM.create({ evm })
    const accountFromEEI = await vm.eei.getAccount(address)
    const accountFromEVM = await vm.evm.eei.getAccount(address)
    st.equal(
      accountFromEEI.balance,
      accountFromEVM.balance,
      'vm.eei and evm.eei produce the same accounts'
    )
  })
})
