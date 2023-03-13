import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

tape('StateManager -> Account Checkpointing', (t) => {
  const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
  const account = Account.fromAccountData({
    nonce: 1,
  })
  const account2 = Account.fromAccountData({
    nonce: 2,
  })
  const account3 = Account.fromAccountData({
    nonce: 3,
  })
  const account4 = Account.fromAccountData({
    nonce: 4,
  })
  const account5 = Account.fromAccountData({
    nonce: 5,
  })

  t.test('No CP -> A1 -> Flush() (-> A1)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('CP -> A1.1 -> Commit -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.checkpoint()
    await sm.putAccount(address, account)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('CP -> A1.1 -> Revert -> Flush() (-> Undefined)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.checkpoint()
    await sm.putAccount(address, account)
    await sm.revert()
    await sm.flush()
    st.equal(await sm.getAccount(address), undefined)

    sm.clearCaches()
    st.equal(await sm.getAccount(address), undefined)

    st.end()
  })

  t.test('A1.1 -> CP -> Commit -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('A1.1 -> CP -> Revert -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.revert()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.putAccount(address, account2)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Commit -> A1.3 -> Flush() (-> A1.3)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.putAccount(address, account2)
    await sm.commit()
    await sm.putAccount(address, account3)
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> A1.3 -> Commit -> Flush() (-> A1.3)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.putAccount(address, account2)
    await sm.putAccount(address, account3)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    st.end()
  })

  t.test('CP -> A1.1 -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.checkpoint()
    await sm.putAccount(address, account)
    await sm.putAccount(address, account2)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    st.end()
  })

  t.test('CP -> A1.1 -> A1.2 -> Revert -> Flush() (-> Undefined)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.checkpoint()
    await sm.putAccount(address, account)

    await sm.putAccount(address, account2)
    await sm.revert()
    await sm.flush()
    st.equal(await sm.getAccount(address), undefined)

    sm.clearCaches()
    st.equal(await sm.getAccount(address), undefined)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Revert -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.putAccount(address, account2)
    await sm.revert()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    sm.clearCaches()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Commit -> Flush() (-> A1.3)',
    async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, account)
      await sm.checkpoint()
      await sm.putAccount(address, account2)
      await sm.checkpoint()
      await sm.putAccount(address, account3)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 3n)

      sm.clearCaches()
      st.equal((await sm.getAccount(address))!.nonce, 3n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Revert -> Flush() (-> A1.1)',
    async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, account)
      await sm.checkpoint()
      await sm.putAccount(address, account2)
      await sm.checkpoint()
      await sm.putAccount(address, account3)
      await sm.commit()
      await sm.revert()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 1n)

      sm.clearCaches()
      st.equal((await sm.getAccount(address))!.nonce, 1n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> Commit -> Flush() (-> A1.2)',
    async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, account)
      await sm.checkpoint()
      await sm.putAccount(address, account2)
      await sm.checkpoint()
      await sm.putAccount(address, account3)
      await sm.revert()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 2n)

      sm.clearCaches()
      st.equal((await sm.getAccount(address))!.nonce, 2n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> Commit -> Flush() (-> A1.4)',
    async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, account)
      await sm.checkpoint()
      await sm.putAccount(address, account2)
      await sm.checkpoint()
      await sm.putAccount(address, account3)
      await sm.revert()
      await sm.putAccount(address, account4)
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 4n)

      sm.clearCaches()
      st.equal((await sm.getAccount(address))!.nonce, 4n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> CP -> A1.5 -> Commit -> Commit -> Flush() (-> A1.5)',
    async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, account)
      await sm.checkpoint()
      await sm.putAccount(address, account2)
      await sm.checkpoint()
      await sm.putAccount(address, account3)
      await sm.revert()
      await sm.putAccount(address, account4)
      await sm.checkpoint()
      await sm.putAccount(address, account5)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 5n)

      sm.clearCaches()
      st.equal((await sm.getAccount(address))!.nonce, 5n)

      st.end()
    }
  )
})
