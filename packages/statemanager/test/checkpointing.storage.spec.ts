import { Account, Address, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

const storageEval = async (
  st: tape.Test,
  sm: DefaultStateManager,
  address: Address,
  key: Uint8Array,
  value: Uint8Array,
  root: Uint8Array
) => {
  st.deepEqual(await sm.getContractStorage(address, key), value, 'storage value should be equal')
  const accountCMP = await sm.getAccount(address)
  st.deepEqual(accountCMP!.storageRoot, root, 'account storage root should be equal')
}

tape('StateManager -> Storage Checkpointing', (t) => {
  const address = new Address(hexStringToBytes('11'.repeat(20)))
  const account = new Account()

  const key = hexStringToBytes('01'.repeat(32))

  const value = hexStringToBytes('01')
  const root = hexStringToBytes('561a011235f3fe8a4d292eba6d462e09015bbef9f8c3373dd70760bbc86f9a6c')

  const value2 = hexStringToBytes('02')
  const root2 = hexStringToBytes('38f95e481a23df7b41934aee346cc960becc5388ad4c67e51f60ac03e8687626')

  const value3 = hexStringToBytes('03')
  const root3 = hexStringToBytes('dedbee161cad6e3afcc99901dfca9122c16ad48af559d78c4a8b5bec2f5f304b')

  const value4 = hexStringToBytes('04')
  const root4 = hexStringToBytes('e5ccf4afccb012ac0900d0f64f6567a1bceb89f16ff5050da2a64427da94b618')

  const value5 = hexStringToBytes('05')
  const root5 = hexStringToBytes('b5b5deaf640a41912217f37f6ee338d49c6a476e0912c81188c2954fd1e959f8')

  const valueEmpty = new Uint8Array(0)
  const rootEmpty = hexStringToBytes(
    '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
  )

  const storageSets = [
    {
      s1: { value, root },
      s2: { value: value2, root: root2 },
      s3: { value: value3, root: root3 },
      s4: { value: value4, root: root4 },
      s5: { value: value5, root: root5 },
    },
    {
      s1: { value: valueEmpty, root: rootEmpty },
      s2: { value: value2, root: root2 },
      s3: { value: value3, root: root3 },
      s4: { value: value4, root: root4 },
      s5: { value: value5, root: root5 },
    },
    {
      s1: { value: valueEmpty, root: rootEmpty },
      s2: { value: value2, root: root2 },
      s3: { value: valueEmpty, root: rootEmpty },
      s4: { value: value4, root: root4 },
      s5: { value: value5, root: root5 },
    },
    {
      s1: { value: valueEmpty, root: rootEmpty },
      s2: { value: value2, root: root2 },
      s3: { value: value3, root: root3 },
      s4: { value: valueEmpty, root: rootEmpty },
      s5: { value: value5, root: root5 },
    },
    {
      s1: { value, root },
      s2: { value: valueEmpty, root: rootEmpty },
      s3: { value: value3, root: root3 },
      s4: { value: valueEmpty, root: rootEmpty },
      s5: { value: value5, root: root5 },
    },
    {
      s1: { value, root },
      s2: { value: valueEmpty, root: rootEmpty },
      s3: { value: value3, root: root3 },
      s4: { value: value4, root: root4 },
      s5: { value: valueEmpty, root: rootEmpty },
    },
    {
      s1: { value, root },
      s2: { value: value2, root: root2 },
      s3: { value: valueEmpty, root: rootEmpty },
      s4: { value: value4, root: root4 },
      s5: { value: valueEmpty, root: rootEmpty },
    },
  ]

  for (const s of storageSets) {
    t.test('No CP -> S1 -> Flush() (-> S1)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.flush()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      sm.clearCaches()
      st.deepEqual(await sm.getContractStorage(address, key), s.s1.value)
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      st.end()
    })

    t.test('CP -> S1.1 -> Commit -> Flush() (-> S1.1)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s1.value)
      await sm.commit()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      st.end()
    })

    t.test('CP -> S1.1 -> Revert -> Flush() (-> Undefined)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s1.value)

      await sm.revert()
      await sm.flush()
      await storageEval(st, sm, address, key, valueEmpty, rootEmpty)

      sm.clearCaches()

      await storageEval(st, sm, address, key, valueEmpty, rootEmpty)

      st.end()
    })

    t.test('S1.1 -> CP -> Commit -> Flush() (-> S1.1)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.commit()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      st.end()
    })

    t.test('S1.1 -> CP -> Revert -> Flush() (-> S1.1)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.revert()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      st.end()
    })

    t.test('S1.1 -> CP -> S1.2 -> Commit -> Flush() (-> S1.2)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s2.value)
      await sm.commit()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

      st.end()
    })

    t.test('S1.1 -> CP -> S1.2 -> Commit -> S1.3 -> Flush() (-> S1.3)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s2.value)
      await sm.commit()
      await sm.putContractStorage(address, key, s.s3.value)
      await sm.flush()
      await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

      st.end()
    })

    t.test('S1.1 -> CP -> S1.2 -> S1.3 -> Commit -> Flush() (-> S1.3)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s2.value)
      await sm.putContractStorage(address, key, s.s3.value)
      await sm.commit()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

      st.end()
    })

    t.test('CP -> S1.1 -> S1.2 -> Commit -> Flush() (-> S1.2)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s1.value)
      await sm.putContractStorage(address, key, s.s2.value)
      await sm.commit()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

      st.end()
    })

    t.test('CP -> S1.1 -> S1.2 -> Revert -> Flush() (-> Undefined)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s1.value)

      await sm.putContractStorage(address, key, s.s2.value)
      await sm.revert()
      await sm.flush()
      await storageEval(st, sm, address, key, valueEmpty, rootEmpty)

      sm.clearCaches()
      await storageEval(st, sm, address, key, valueEmpty, rootEmpty)

      st.end()
    })

    t.test('S1.1 -> CP -> S1.2 -> Revert -> Flush() (-> S1.1)', async (st) => {
      const sm = new DefaultStateManager()
      await sm.putAccount(address, account)

      await sm.putContractStorage(address, key, s.s1.value)
      await sm.checkpoint()
      await sm.putContractStorage(address, key, s.s2.value)
      await sm.revert()
      await sm.flush()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      sm.clearCaches()
      await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

      st.end()
    })

    t.test(
      'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Commit -> Flush() (-> S1.3)',
      async (st) => {
        const sm = new DefaultStateManager()
        await sm.putAccount(address, account)

        await sm.putContractStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s3.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

        sm.clearCaches()
        await storageEval(st, sm, address, key, s.s3.value, s.s3.root)

        st.end()
      }
    )

    t.test(
      'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Revert -> Flush() (-> S1.1)',
      async (st) => {
        const sm = new DefaultStateManager()
        await sm.putAccount(address, account)

        await sm.putContractStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s3.value)
        await sm.commit()
        await sm.revert()
        await sm.flush()
        await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

        sm.clearCaches()
        await storageEval(st, sm, address, key, s.s1.value, s.s1.root)

        st.end()
      }
    )

    t.test(
      'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> Commit -> Flush() (-> S1.2)',
      async (st) => {
        const sm = new DefaultStateManager()
        await sm.putAccount(address, account)

        await sm.putContractStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.commit()
        await sm.flush()
        await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

        sm.clearCaches()
        await storageEval(st, sm, address, key, s.s2.value, s.s2.root)

        st.end()
      }
    )

    t.test(
      'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> Commit -> Flush() (-> S1.4)',
      async (st) => {
        const sm = new DefaultStateManager()
        await sm.putAccount(address, account)

        await sm.putContractStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.putContractStorage(address, key, s.s4.value)
        await sm.commit()
        await sm.flush()
        await storageEval(st, sm, address, key, s.s4.value, s.s4.root)

        sm.clearCaches()
        await storageEval(st, sm, address, key, s.s4.value, s.s4.root)

        st.end()
      }
    )

    t.test(
      'S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> CP -> S1.5 -> Commit -> Commit -> Flush() (-> S1.5)',
      async (st) => {
        const sm = new DefaultStateManager()
        await sm.putAccount(address, account)

        await sm.putContractStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.putContractStorage(address, key, s.s4.value)
        await sm.checkpoint()
        await sm.putContractStorage(address, key, s.s5.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await storageEval(st, sm, address, key, s.s5.value, s.s5.root)

        sm.clearCaches()
        await storageEval(st, sm, address, key, s.s5.value, s.s5.root)

        st.end()
      }
    )
  }
})
