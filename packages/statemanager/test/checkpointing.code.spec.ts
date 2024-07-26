import { type StateManagerInterface } from '@ethereumjs/common'
import { Account, Address, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { DefaultStateManager, SimpleStateManager } from '../src/index.js'

const codeEval = async (
  sm: StateManagerInterface,
  address: Address,
  value: Uint8Array,
  root: Uint8Array,
) => {
  assert.deepEqual(await sm.getCode(address), value, 'contract code value should be equal')
  const accountCMP = await sm.getAccount(address)
  assert.deepEqual(accountCMP!.codeHash, root, 'account code root should be equal')
}

describe('StateManager -> Code Checkpointing', () => {
  const address = new Address(hexToBytes(`0x${'11'.repeat(20)}`))

  const stateManagers = [DefaultStateManager, SimpleStateManager]

  const value = hexToBytes('0x01')
  const root = hexToBytes('0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2')

  const value2 = hexToBytes('0x02')
  const root2 = hexToBytes('0xf2ee15ea639b73fa3db9b34a245bdfa015c260c598b211bf05a1ecc4b3e3b4f2')

  const value3 = hexToBytes('0x03')
  const root3 = hexToBytes('0x69c322e3248a5dfc29d73c5b0553b0185a35cd5bb6386747517ef7e53b15e287')

  const value4 = hexToBytes('0x04')
  const root4 = hexToBytes('0xf343681465b9efe82c933c3e8748c70cb8aa06539c361de20f72eac04e766393')

  const value5 = hexToBytes('0x05')
  const root5 = hexToBytes('0xdbb8d0f4c497851a5043c6363657698cb1387682cac2f786c731f8936109d795')

  const valueEmpty = new Uint8Array(0)
  const rootEmpty = hexToBytes('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')

  const codeSets = [
    {
      c1: { value, root },
      c2: { value: value2, root: root2 },
      c3: { value: value3, root: root3 },
      c4: { value: value4, root: root4 },
      c5: { value: value5, root: root5 },
    },
    {
      c1: { value: valueEmpty, root: rootEmpty },
      c2: { value: value2, root: root2 },
      c3: { value: value3, root: root3 },
      c4: { value: value4, root: root4 },
      c5: { value: value5, root: root5 },
    },
    {
      c1: { value: valueEmpty, root: rootEmpty },
      c2: { value: value2, root: root2 },
      c3: { value: valueEmpty, root: rootEmpty },
      c4: { value: value4, root: root4 },
      c5: { value: value5, root: root5 },
    },
    {
      c1: { value: valueEmpty, root: rootEmpty },
      c2: { value: value2, root: root2 },
      c3: { value: value3, root: root3 },
      c4: { value: valueEmpty, root: rootEmpty },
      c5: { value: value5, root: root5 },
    },
    {
      c1: { value, root },
      c2: { value: valueEmpty, root: rootEmpty },
      c3: { value: value3, root: root3 },
      c4: { value: valueEmpty, root: rootEmpty },
      c5: { value: value5, root: root5 },
    },
    {
      c1: { value, root },
      c2: { value: valueEmpty, root: rootEmpty },
      c3: { value: value3, root: root3 },
      c4: { value: value4, root: root4 },
      c5: { value: valueEmpty, root: rootEmpty },
    },
    {
      c1: { value, root },
      c2: { value: value2, root: root2 },
      c3: { value: valueEmpty, root: rootEmpty },
      c4: { value: value4, root: root4 },
      c5: { value: valueEmpty, root: rootEmpty },
    },
  ]

  for (const SM of stateManagers) {
    for (const c of codeSets) {
      it(`No CP -> C1 -> Flush() (-> C1)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)

        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        assert.deepEqual(await sm.getCode(address), c.c1.value)
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it(`CP -> C1.1 -> Commit -> Flush() (-> C1.1)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putCode(address, c.c1.value)
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it(`CP -> C1.1 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putCode(address, c.c1.value)

        await sm.revert()
        await sm.flush()
        await codeEval(sm, address, valueEmpty, rootEmpty)

        sm.clearCaches()

        await codeEval(sm, address, valueEmpty, rootEmpty)
      })

      it(`C1.1 -> CP -> Commit -> Flush() (-> C1.1)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it(`C1.1 -> CP -> Revert -> Flush() (-> C1.1)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.revert()
        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it(`C1.1 -> CP -> C1.2 -> Commit -> Flush() (-> C1.2)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c2.value, c.c2.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c2.value, c.c2.root)
      })

      it(`C1.1 -> CP -> C1.2 -> Commit -> C1.3 -> Flush() (-> C1.3)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.commit()
        await sm.putCode(address, c.c3.value)
        await sm.flush()
        await codeEval(sm, address, c.c3.value, c.c3.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c3.value, c.c3.root)
      })

      it(`C1.1 -> CP -> C1.2 -> C1.3 -> Commit -> Flush() (-> C1.3)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.putCode(address, c.c3.value)
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c3.value, c.c3.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c3.value, c.c3.root)
      })

      it(`CP -> C1.1 -> C1.2 -> Commit -> Flush() (-> C1.2)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putCode(address, c.c1.value)
        await sm.putCode(address, c.c2.value)
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c2.value, c.c2.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c2.value, c.c2.root)
      })

      it(`CP -> C1.1 -> C1.2 -> Revert -> Flush() (-> Undefined)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.checkpoint()
        await sm.putCode(address, c.c1.value)

        await sm.putCode(address, c.c2.value)
        await sm.revert()
        await sm.flush()
        await codeEval(sm, address, valueEmpty, rootEmpty)

        sm.clearCaches()
        await codeEval(sm, address, valueEmpty, rootEmpty)
      })

      it(`C1.1 -> CP -> C1.2 -> Revert -> Flush() (-> C1.1)`, async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.revert()
        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it('C1.1 -> CP -> C1.2 -> CP -> C1.3 -> Commit -> Commit -> Flush() (-> C1.3)', async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c3.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c3.value, c.c3.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c3.value, c.c3.root)
      })

      it('C1.1 -> CP -> C1.2 -> CP -> C1.3 -> Commit -> Revert -> Flush() (-> C1.1)', async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c3.value)
        await sm.commit()
        await sm.revert()
        await sm.flush()
        await codeEval(sm, address, c.c1.value, c.c1.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c1.value, c.c1.root)
      })

      it('C1.1 -> CP -> C1.2 -> CP -> C1.3 -> Revert -> Commit -> Flush() (-> C1.2)', async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c3.value)
        await sm.revert()
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c2.value, c.c2.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c2.value, c.c2.root)
      })

      it('C1.1 -> CP -> C1.2 -> CP -> C1.3 -> Revert -> C1.4 -> Commit -> Flush() (-> C1.4)', async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c3.value)
        await sm.revert()
        await sm.putCode(address, c.c4.value)
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c4.value, c.c4.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c4.value, c.c4.root)
      })

      it('C1.1 -> CP -> C1.2 -> CP -> C1.3 -> Revert -> C1.4 -> CP -> C1.5 -> Commit -> Commit -> Flush() (-> C1.5)', async () => {
        const sm = new SM()
        await sm.putAccount(address, new Account())

        await sm.putCode(address, c.c1.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c2.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c3.value)
        await sm.revert()
        await sm.putCode(address, c.c4.value)
        await sm.checkpoint()
        await sm.putCode(address, c.c5.value)
        await sm.commit()
        await sm.commit()
        await sm.flush()
        await codeEval(sm, address, c.c5.value, c.c5.root)

        sm.clearCaches()
        await codeEval(sm, address, c.c5.value, c.c5.root)
      })
    }
  }
})
