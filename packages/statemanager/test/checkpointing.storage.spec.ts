import { Account, Address, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { DefaultStateManager, SimpleStateManager } from '../src/index.js'

import type { StateManagerInterface } from '@ethereumjs/common'

const storageEval = async (
  sm: StateManagerInterface,
  address: Address,
  key: Uint8Array,
  value: Uint8Array,
  root: Uint8Array,
  rootCheck = true,
) => {
  assert.deepEqual(await sm.getStorage(address, key), value, 'storage value should be equal')
  if (rootCheck) {
    const accountCMP = await sm.getAccount(address)
    assert.deepEqual(accountCMP!.storageRoot, root, 'account storage root should be equal')
  }
}

describe('StateManager -> Storage Checkpointing', () => {
  const address = new Address(hexToBytes(`0x${'11'.repeat(20)}`))

  const stateManagers = [
    {
      SM: DefaultStateManager,
      rootCheck: true,
    },
    {
      SM: SimpleStateManager,
      rootCheck: false,
    },
  ]

  const key = hexToBytes(`0x${'01'.repeat(32)}`)

  const value = hexToBytes('0x01')
  const root = hexToBytes('0x561a011235f3fe8a4d292eba6d462e09015bbef9f8c3373dd70760bbc86f9a6c')

  const value2 = hexToBytes('0x02')
  const root2 = hexToBytes('0x38f95e481a23df7b41934aee346cc960becc5388ad4c67e51f60ac03e8687626')

  const value3 = hexToBytes('0x03')
  const root3 = hexToBytes('0xdedbee161cad6e3afcc99901dfca9122c16ad48af559d78c4a8b5bec2f5f304b')

  const value4 = hexToBytes('0x04')
  const root4 = hexToBytes('0xe5ccf4afccb012ac0900d0f64f6567a1bceb89f16ff5050da2a64427da94b618')

  const value5 = hexToBytes('0x05')
  const root5 = hexToBytes('0xb5b5deaf640a41912217f37f6ee338d49c6a476e0912c81188c2954fd1e959f8')

  const valueEmpty = new Uint8Array(0)
  const rootEmpty = hexToBytes('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421')

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

  for (const SMDict of stateManagers) {
    for (const s of storageSets) {
      it(`No CP -> S1 -> Flush() (-> S1)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        assert.deepEqual(await sm.getStorage(address, key), s.s1.value)
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it(`CP -> S1.1 -> Commit -> Flush() (-> S1.1)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putStorage(address, key, s.s1.value)
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it(`CP -> S1.1 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putStorage(address, key, s.s1.value)

        await sm.revert()
        await sm.flush()
        await storageEval(sm, address, key, valueEmpty, rootEmpty)

        sm.clearCaches()

        await storageEval(sm, address, key, valueEmpty, rootEmpty)
      })

      it(`S1.1 -> CP -> Commit -> Flush() (-> S1.1)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it(`S1.1 -> CP -> Revert -> Flush() (-> S1.1)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.revert()
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it(`S1.1 -> CP -> S1.2 -> Commit -> Flush() (-> S1.2)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)
      })

      it(`S1.1 -> CP -> S1.2 -> Commit -> S1.3 -> Flush() (-> S1.3)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.commit()
        await sm.putStorage(address, key, s.s3.value)
        await sm.flush()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)
      })

      it(`S1.1 -> CP -> S1.2 -> S1.3 -> Commit -> Flush() (-> S1.3)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.putStorage(address, key, s.s3.value)
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)
      })

      it(`CP -> S1.1 -> S1.2 -> Commit -> Flush() (-> S1.2)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putStorage(address, key, s.s1.value)
        await sm.putStorage(address, key, s.s2.value)
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)
      })

      it(`CP -> S1.1 -> S1.2 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putStorage(address, key, s.s1.value)

        await sm.putStorage(address, key, s.s2.value)
        await sm.revert()
        await sm.flush()
        await storageEval(sm, address, key, valueEmpty, rootEmpty)

        sm.clearCaches()
        await storageEval(sm, address, key, valueEmpty, rootEmpty)
      })

      it(`S1.1 -> CP -> S1.2 -> Revert -> Flush() (-> S1.1)`, async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.revert()
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it('S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Commit -> Flush() (-> S1.3)', async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s3.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s3.value, s.s3.root, SMDict.rootCheck)
      })

      it('S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Commit -> Revert -> Flush() (-> S1.1)', async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s3.value)
        await sm.commit()
        await sm.revert()
        await sm.flush()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s1.value, s.s1.root, SMDict.rootCheck)
      })

      it('S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> Commit -> Flush() (-> S1.2)', async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s2.value, s.s2.root, SMDict.rootCheck)
      })

      it('S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> Commit -> Flush() (-> S1.4)', async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.putStorage(address, key, s.s4.value)
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s4.value, s.s4.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s4.value, s.s4.root, SMDict.rootCheck)
      })

      it('S1.1 -> CP -> S1.2 -> CP -> S1.3 -> Revert -> S1.4 -> CP -> S1.5 -> Commit -> Commit -> Flush() (-> S1.5)', async () => {
        const sm = new SMDict.SM()
        await sm.putAccount(address, new Account())

        await sm.putStorage(address, key, s.s1.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s2.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s3.value)
        await sm.revert()
        await sm.putStorage(address, key, s.s4.value)
        await sm.checkpoint()
        await sm.putStorage(address, key, s.s5.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await storageEval(sm, address, key, s.s5.value, s.s5.root, SMDict.rootCheck)

        sm.clearCaches()
        await storageEval(sm, address, key, s.s5.value, s.s5.root, SMDict.rootCheck)
      })
    }
  }
})
