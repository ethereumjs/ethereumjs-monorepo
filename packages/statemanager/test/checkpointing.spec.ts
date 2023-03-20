import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

tape('StateManager -> Checkpointing', (t) => {
  t.test('No CP -> A1 -> Flush() (-> A1)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })
    await sm.putAccount(address, account)
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('CP -> A1.1 -> Commit -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.checkpoint()
    await sm.putAccount(address, account)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('CP -> A1.1 -> Revert -> Flush() (-> Empty)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.checkpoint()
    await sm.putAccount(address, account)
    await sm.revert()
    await sm.flush()
    st.ok((await sm.getAccount(address))!.isEmpty())

    st.end()
  })

  t.test('A1.1 -> CP -> Commit -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('A1.1 -> CP -> Revert -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    await sm.revert()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    account.nonce = 2n
    await sm.putAccount(address, account)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Commit -> A1.3 -> Flush() (-> A1.3)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    account.nonce = 2n
    await sm.putAccount(address, account)
    await sm.commit()
    account.nonce = 3n
    await sm.putAccount(address, account)
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> A1.3 -> Commit -> Flush() (-> A1.3)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    account.nonce = 2n
    await sm.putAccount(address, account)
    account.nonce = 3n
    await sm.putAccount(address, account)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 3n)

    st.end()
  })

  t.test('CP -> A1.1 -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.checkpoint()
    await sm.putAccount(address, account)

    account.nonce = 2n
    await sm.putAccount(address, account)
    await sm.commit()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 2n)

    st.end()
  })

  t.test('CP -> A1.1 -> A1.2 -> Revert -> Flush() (-> Empty)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.checkpoint()
    await sm.putAccount(address, account)

    account.nonce = 2n
    await sm.putAccount(address, account)
    await sm.revert()
    await sm.flush()
    st.ok((await sm.getAccount(address))!.isEmpty())

    st.end()
  })

  t.test('A1.1 -> CP -> A1.2 -> Revert -> Flush() (-> A1.1)', async (st) => {
    const sm = new DefaultStateManager()
    const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const account = Account.fromAccountData({
      nonce: 1,
    })

    await sm.putAccount(address, account)
    await sm.checkpoint()
    account.nonce = 2n
    await sm.putAccount(address, account)
    await sm.revert()
    await sm.flush()
    st.equal((await sm.getAccount(address))!.nonce, 1n)

    st.end()
  })

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Commit -> Flush() (-> A1.3)',
    async (st) => {
      const sm = new DefaultStateManager()
      const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
      const account = Account.fromAccountData({
        nonce: 1,
      })

      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 2n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 3n
      await sm.putAccount(address, account)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 3n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Revert -> Flush() (-> A1.1)',
    async (st) => {
      const sm = new DefaultStateManager()
      const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
      const account = Account.fromAccountData({
        nonce: 1,
      })

      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 2n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 3n
      await sm.putAccount(address, account)
      await sm.commit()
      await sm.revert()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 1n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> Commit -> Flush() (-> A1.2)',
    async (st) => {
      const sm = new DefaultStateManager()
      const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
      const account = Account.fromAccountData({
        nonce: 1,
      })

      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 2n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 3n
      await sm.putAccount(address, account)
      await sm.revert()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 2n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> Commit -> Flush() (-> A1.4)',
    async (st) => {
      const sm = new DefaultStateManager()
      const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
      const account = Account.fromAccountData({
        nonce: 1,
      })

      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 2n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 3n
      await sm.putAccount(address, account)
      await sm.revert()
      account.nonce = 4n
      await sm.putAccount(address, account)
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 4n)

      st.end()
    }
  )

  t.test(
    'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> CP -> A1.5 -> Commit -> Commit -> Flush() (-> A1.5)',
    async (st) => {
      const sm = new DefaultStateManager()
      const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
      const account = Account.fromAccountData({
        nonce: 1,
      })

      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 2n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 3n
      await sm.putAccount(address, account)
      await sm.revert()
      account.nonce = 4n
      await sm.putAccount(address, account)
      await sm.checkpoint()
      account.nonce = 5n
      await sm.putAccount(address, account)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.equal((await sm.getAccount(address))!.nonce, 5n)

      st.end()
    }
  )
})
