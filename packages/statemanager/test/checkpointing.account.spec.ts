import { Account, Address, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

/**
 * Compares account read to none or undefined
 */
const accountEval = async (
  sm: DefaultStateManager,
  address: Address,
  compare: bigint | undefined
) => {
  const account = await sm.getAccount(address)
  if (compare === undefined) {
    return account === undefined
  } else {
    if (account === undefined) {
      return false
    } else {
      return account.nonce === compare
    }
  }
}

type CompareList = [Account | undefined, bigint | undefined]

tape('StateManager -> Account Checkpointing', (t) => {
  const address = new Address(hexStringToBytes('11'.repeat(20)))

  const accountN1: CompareList = [
    Account.fromAccountData({
      nonce: 1,
    }),
    1n,
  ]
  const accountN2: CompareList = [
    Account.fromAccountData({
      nonce: 2,
    }),
    2n,
  ]
  const accountN3: CompareList = [
    Account.fromAccountData({
      nonce: 3,
    }),
    3n,
  ]
  const accountN4: CompareList = [
    Account.fromAccountData({
      nonce: 4,
    }),
    4n,
  ]
  const accountN5: CompareList = [
    Account.fromAccountData({
      nonce: 5,
    }),
    5n,
  ]
  const accountUndefined: CompareList = [undefined, undefined]

  const accountSets = [
    {
      a1: accountN1,
      a2: accountN2,
      a3: accountN3,
      a4: accountN4,
      a5: accountN5,
    },
    {
      a1: accountUndefined,
      a2: accountN2,
      a3: accountN3,
      a4: accountN4,
      a5: accountN5,
    },
    {
      a1: accountUndefined,
      a2: accountN2,
      a3: accountUndefined,
      a4: accountN4,
      a5: accountN5,
    },
    {
      a1: accountUndefined,
      a2: accountN2,
      a3: accountN3,
      a4: accountUndefined,
      a5: accountN5,
    },
    {
      a1: accountN1,
      a2: accountUndefined,
      a3: accountN3,
      a4: accountUndefined,
      a5: accountN5,
    },
    {
      a1: accountN1,
      a2: accountUndefined,
      a3: accountN3,
      a4: accountN4,
      a5: accountUndefined,
    },
    {
      a1: accountN1,
      a2: accountN2,
      a3: accountUndefined,
      a4: accountN4,
      a5: accountUndefined,
    },
  ]

  for (const as of accountSets) {
    t.test('No CP -> A1 -> Flush() (-> A1)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.flush()
      st.ok(accountEval(sm, address, as.a1[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a1[1]))

      st.end()
    })

    t.test('CP -> A1.1 -> Commit -> Flush() (-> A1.1)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.checkpoint()
      await sm.putAccount(address, as.a1[0])
      await sm.commit()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a1[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a1[1]))

      st.end()
    })

    t.test('CP -> A1.1 -> Revert -> Flush() (-> Undefined)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.checkpoint()
      await sm.putAccount(address, as.a1[0])
      await sm.revert()
      await sm.flush()
      st.ok(accountEval(sm, address, undefined))

      sm.clearCaches()
      st.ok(accountEval(sm, address, undefined))

      st.end()
    })

    t.test('A1.1 -> CP -> Commit -> Flush() (-> A1.1)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.commit()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a1[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a1[1]))

      st.end()
    })

    t.test('A1.1 -> CP -> Revert -> Flush() (-> A1.1)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.revert()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a1[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a1[1]))

      st.end()
    })

    t.test('A1.1 -> CP -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.putAccount(address, as.a2[0])
      await sm.commit()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a2[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a2[1]))

      st.end()
    })

    t.test('A1.1 -> CP -> A1.2 -> Commit -> A1.3 -> Flush() (-> A1.3)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.putAccount(address, as.a2[0])
      await sm.commit()
      await sm.putAccount(address, as.a3[0])
      await sm.flush()
      st.ok(accountEval(sm, address, as.a3[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a3[1]))

      st.end()
    })

    t.test('A1.1 -> CP -> A1.2 -> A1.3 -> Commit -> Flush() (-> A1.3)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.putAccount(address, as.a2[0])
      await sm.putAccount(address, as.a3[0])
      await sm.commit()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a3[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a3[1]))

      st.end()
    })

    t.test('CP -> A1.1 -> A1.2 -> Commit -> Flush() (-> A1.2)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.checkpoint()
      await sm.putAccount(address, as.a1[0])
      await sm.putAccount(address, as.a2[0])
      await sm.commit()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a2[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a2[1]))

      st.end()
    })

    t.test('CP -> A1.1 -> A1.2 -> Revert -> Flush() (-> Undefined)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.checkpoint()
      await sm.putAccount(address, as.a1[0])

      await sm.putAccount(address, as.a2[0])
      await sm.revert()
      await sm.flush()
      st.ok(accountEval(sm, address, undefined))

      sm.clearCaches()
      st.ok(accountEval(sm, address, undefined))

      st.end()
    })

    t.test('A1.1 -> CP -> A1.2 -> Revert -> Flush() (-> A1.1)', async (st) => {
      const sm = new DefaultStateManager()

      await sm.putAccount(address, as.a1[0])
      await sm.checkpoint()
      await sm.putAccount(address, as.a2[0])
      await sm.revert()
      await sm.flush()
      st.ok(accountEval(sm, address, as.a1[1]))

      sm.clearCaches()
      st.ok(accountEval(sm, address, as.a1[1]))

      st.end()
    })

    t.test(
      'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Commit -> Flush() (-> A1.3)',
      async (st) => {
        const sm = new DefaultStateManager()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.commit()
        await sm.commit()
        await sm.flush()
        st.ok(accountEval(sm, address, as.a3[1]))

        sm.clearCaches()
        st.ok(accountEval(sm, address, as.a3[1]))

        st.end()
      }
    )

    t.test(
      'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Revert -> Flush() (-> A1.1)',
      async (st) => {
        const sm = new DefaultStateManager()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.commit()
        await sm.revert()
        await sm.flush()
        st.ok(accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        st.ok(accountEval(sm, address, as.a1[1]))

        st.end()
      }
    )

    t.test(
      'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> Commit -> Flush() (-> A1.2)',
      async (st) => {
        const sm = new DefaultStateManager()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.revert()
        await sm.commit()
        await sm.flush()
        st.ok(accountEval(sm, address, as.a2[1]))

        sm.clearCaches()
        st.ok(accountEval(sm, address, as.a2[1]))

        st.end()
      }
    )

    t.test(
      'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> Commit -> Flush() (-> A1.4)',
      async (st) => {
        const sm = new DefaultStateManager()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.revert()
        await sm.putAccount(address, as.a4[0])
        await sm.commit()
        await sm.flush()
        st.ok(accountEval(sm, address, as.a4[1]))

        sm.clearCaches()
        st.ok(accountEval(sm, address, as.a4[1]))

        st.end()
      }
    )

    t.test(
      'A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> CP -> A1.5 -> Commit -> Commit -> Flush() (-> A1.5)',
      async (st) => {
        const sm = new DefaultStateManager()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.revert()
        await sm.putAccount(address, as.a4[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a5[0])
        await sm.commit()
        await sm.commit()
        await sm.flush()
        st.ok(accountEval(sm, address, as.a5[1]))

        sm.clearCaches()
        st.ok(accountEval(sm, address, as.a5[1]))

        st.end()
      }
    )
  }
})
