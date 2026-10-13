import { Account, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { modifyAccountFields } from '../src/util.ts'

import type { StateManagerInterface } from '@ethereumjs/common'

describe('[StateManager/Util]: modifyAccountFields', () => {
  it('modifyAccountFields() updates existing account fields', async () => {
    const address = createAddressFromString('0x' + '11'.repeat(20))
    const account = new Account(1n, 100n)
    let stored: Account | undefined = account

    const sm = {
      getAccount: async () => stored,
      putAccount: async (_addr: typeof address, acc?: Account) => {
        stored = acc
      },
    } as unknown as StateManagerInterface

    await modifyAccountFields(sm, address, { nonce: 2n, balance: 200n })
    assert.strictEqual(stored?.nonce, 2n)
    assert.strictEqual(stored?.balance, 200n)
  })

  it('modifyAccountFields() creates account when none exists', async () => {
    const address = createAddressFromString('0x' + '22'.repeat(20))
    let stored: Account | undefined

    const sm = {
      getAccount: async () => stored,
      putAccount: async (_addr: typeof address, acc?: Account) => {
        stored = acc
      },
    } as unknown as StateManagerInterface

    await modifyAccountFields(sm, address, { balance: 50n })
    assert.strictEqual(stored?.balance, 50n)
  })

  it('modifyAccountFields() calls _debug when present', async () => {
    const address = createAddressFromString('0x' + '33'.repeat(20))
    const debugLines: string[] = []

    const sm = {
      getAccount: async () => undefined,
      putAccount: async () => {},
      _debug: (msg: string) => debugLines.push(msg),
    } as unknown as StateManagerInterface

    await modifyAccountFields(sm, address, {
      storageRoot: hexToBytes(`0x${'aa'.repeat(32)}`),
    })
    assert.isTrue(debugLines.some((line) => line.includes('modifyAccountFields')))
    assert.isTrue(debugLines.some((line) => line.includes('storageRoot=')))
  })
})
