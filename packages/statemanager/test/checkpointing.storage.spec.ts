import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

tape('StateManager -> Storage Checkpointing', (t) => {
  const address = new Address(Buffer.from('11'.repeat(20), 'hex'))
  const account = new Account()
  const key = Buffer.from('01'.repeat(32), 'hex')
  const value = Buffer.from('01', 'hex')
  const value2 = Buffer.from('02', 'hex')
  const value3 = Buffer.from('03', 'hex')
  const value4 = Buffer.from('04', 'hex')
  const value5 = Buffer.from('05', 'hex')

  t.test('No CP -> S1 -> Flush() (-> S1)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    st.end()
  })

  t.test('CP -> S1.1 -> Commit -> Flush() (-> S1.1)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.checkpoint()
    await sm.putContractStorage(address, key, value)
    await sm.commit()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    st.end()
  })

  t.test('CP -> S1.1 -> Revert -> Flush() (-> Undefined)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.checkpoint()
    await sm.putContractStorage(address, key, value)
    await sm.revert()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), Buffer.alloc(0))

    sm.clearCaches()

    st.deepEqual(await sm.getContractStorage(address, key), Buffer.alloc(0))

    st.end()
  })

  t.test('S1.1 -> CP -> Commit -> Flush() (-> S1.1)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.commit()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    st.end()
  })

  t.test('S1.1 -> CP -> Revert -> Flush() (-> S1.1)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.revert()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    st.end()
  })

  t.test('S1.1 -> CP -> S1.2 -> Commit -> Flush() (-> S1.2)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.putContractStorage(address, key, value2)
    await sm.commit()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value2)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value2)

    st.end()
  })

  t.test('S1.1 -> CP -> S1.2 -> Commit -> S1.3 -> Flush() (-> S1.3)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.putContractStorage(address, key, value2)
    await sm.commit()
    await sm.putContractStorage(address, key, value3)
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value3)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value3)

    st.end()
  })

  t.test('S1.1 -> CP -> S1.2 -> S1.3 -> Commit -> Flush() (-> S1.3)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.putContractStorage(address, key, value2)
    await sm.putContractStorage(address, key, value3)
    await sm.commit()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value3)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value3)

    st.end()
  })

  t.test('CP -> S1.1 -> S1.2 -> Commit -> Flush() (-> S1.2)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.checkpoint()
    await sm.putContractStorage(address, key, value)
    await sm.putContractStorage(address, key, value2)
    await sm.commit()
    await sm.flush()
    st.ok((await sm.getContractStorage(address, key))!.equals(value2))

    sm.clearCaches()
    st.ok((await sm.getContractStorage(address, key))!.equals(value2))

    st.end()
  })

  t.test('CP -> S1.1 -> S1.2 -> Revert -> Flush() (-> Undefined)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.checkpoint()
    await sm.putContractStorage(address, key, value)

    await sm.putContractStorage(address, key, value2)
    await sm.revert()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), Buffer.alloc(0))

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), Buffer.alloc(0))

    st.end()
  })

  t.test('S1.1 -> CP -> S1.2 -> Revert -> Flush() (-> S1.1)', async (st) => {
    const sm = new DefaultStateManager()
    await sm.putAccount(address, account)

    await sm.putContractStorage(address, key, value)
    await sm.checkpoint()
    await sm.putContractStorage(address, key, value2)
    await sm.revert()
    await sm.flush()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    sm.clearCaches()
    st.deepEqual(await sm.getContractStorage(address, key), value)

    st.end()
  })

  t.test(
    'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Commit -> Flush() (-> S1.3)',
    async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value2)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value3)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.deepEqual(await sm.getContractStorage(address, key), value3)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), value3)

      st.end()
    }
  )

  t.test(
    'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Revert -> Flush() (-> S1.1)',
    async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value2)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value3)
      await sm.commit()
      await sm.revert()
      await sm.flush()
      st.deepEqual(await sm.getContractStorage(address, key), value)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), value)

      st.end()
    }
  )

  t.test(
    'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> Commit -> Flush() (-> S1.2)',
    async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value2)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value3)
      await sm.revert()
      await sm.commit()
      await sm.flush()
      st.deepEqual(await sm.getContractStorage(address, key), value2)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), value2)

      st.end()
    }
  )

  t.test(
    'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> Commit -> Flush() (-> S1.4)',
    async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value2)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value3)
      await sm.revert()
      await sm.putContractStorage(address, key, value4)
      await sm.commit()
      await sm.flush()
      st.deepEqual(await sm.getContractStorage(address, key), value4)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), value4)

      st.end()
    }
  )

  t.test(
    'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> CP -> S1.5 -> Commit -> Commit -> Flush() (-> S1.5)',
    async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value2)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value3)
      await sm.revert()
      await sm.putContractStorage(address, key, value4)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, value5)
      await sm.commit()
      await sm.commit()
      await sm.flush()
      st.deepEqual(await sm.getContractStorage(address, key), value5)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), value5)

      st.end()
    }
  )
})
