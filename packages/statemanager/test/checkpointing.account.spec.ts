import { Address, createAccount, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { DefaultStateManager, SimpleStateManager } from '../src/index.js'

import type { StateManagerInterface } from '@ethereumjs/common'
import type { Account } from '@ethereumjs/util'

/**
 * Compares account read to none or undefined
 */
const accountEval = async (
  sm: StateManagerInterface,
  address: Address,
  compare: bigint | undefined,
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

describe('StateManager -> Account Checkpointing', () => {
  const address = new Address(hexToBytes(`0x${'11'.repeat(20)}`))

  const stateManagers = [DefaultStateManager, SimpleStateManager]

  const accountN1: CompareList = [
    createAccount({
      nonce: 1,
    }),
    1n,
  ]
  const accountN2: CompareList = [
    createAccount({
      nonce: 2,
    }),
    2n,
  ]
  const accountN3: CompareList = [
    createAccount({
      nonce: 3,
    }),
    3n,
  ]
  const accountN4: CompareList = [
    createAccount({
      nonce: 4,
    }),
    4n,
  ]
  const accountN5: CompareList = [
    createAccount({
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

  for (const SM of stateManagers) {
    for (const as of accountSets) {
      it(`No CP -> A1 -> Flush() (-> A1)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it(`CP -> A1.1 -> Commit -> Flush() (-> A1.1)`, async () => {
        const sm = new SM()

        await sm.checkpoint()
        await sm.putAccount(address, as.a1[0])
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it(`CP -> A1.1 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SM()

        await sm.checkpoint()
        await sm.putAccount(address, as.a1[0])
        await sm.revert()
        await sm.flush()
        assert.ok(await accountEval(sm, address, undefined))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, undefined))
      })

      it(`A1.1 -> CP -> Commit -> Flush() (-> A1.1)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it(`A1.1 -> CP -> Revert -> Flush() (-> A1.1)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.revert()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it(`A1.1 -> CP -> A1.2 -> Commit -> Flush() (-> A1.2)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a2[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a2[1]))
      })

      it(`A1.1 -> CP -> A1.2 -> Commit -> A1.3 -> Flush() (-> A1.3)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.commit()
        await sm.putAccount(address, as.a3[0])
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a3[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a3[1]))
      })

      it(`A1.1 -> CP -> A1.2 -> A1.3 -> Commit -> Flush() (-> A1.3)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.putAccount(address, as.a3[0])
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a3[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a3[1]))
      })

      it(`CP -> A1.1 -> A1.2 -> Commit -> Flush() (-> A1.2)`, async () => {
        const sm = new SM()

        await sm.checkpoint()
        await sm.putAccount(address, as.a1[0])
        await sm.putAccount(address, as.a2[0])
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a2[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a2[1]))
      })

      it(`CP -> A1.1 -> A1.2 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SM()

        await sm.checkpoint()
        await sm.putAccount(address, as.a1[0])

        await sm.putAccount(address, as.a2[0])
        await sm.revert()
        await sm.flush()
        assert.ok(await accountEval(sm, address, undefined))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, undefined))
      })

      it(`A1.1 -> CP -> A1.2 -> Revert -> Flush() (-> A1.1)`, async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.revert()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it('A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Commit -> Flush() (-> A1.3)', async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.commit()
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a3[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a3[1]))
      })

      it('A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Commit -> Revert -> Flush() (-> A1.1)', async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.commit()
        await sm.revert()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a1[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a1[1]))
      })

      it('A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> Commit -> Flush() (-> A1.2)', async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.revert()
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a2[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a2[1]))
      })

      it('A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> Commit -> Flush() (-> A1.4)', async () => {
        const sm = new SM()

        await sm.putAccount(address, as.a1[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a2[0])
        await sm.checkpoint()
        await sm.putAccount(address, as.a3[0])
        await sm.revert()
        await sm.putAccount(address, as.a4[0])
        await sm.commit()
        await sm.flush()
        assert.ok(await accountEval(sm, address, as.a4[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a4[1]))
      })

      it('A1.1 -> CP -> A1.2 -> CP -> A1.3 -> Revert -> A1.4 -> CP -> A1.5 -> Commit -> Commit -> Flush() (-> A1.5)', async () => {
        const sm = new SM()

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
        assert.ok(await accountEval(sm, address, as.a5[1]))

        sm.clearCaches()
        assert.ok(await accountEval(sm, address, as.a5[1]))
      })
    }
  }
})
