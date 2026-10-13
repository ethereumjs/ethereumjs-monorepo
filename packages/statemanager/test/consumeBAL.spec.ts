import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList, PrefixedHexString } from '@ethereumjs/util'
import {
  createAccount,
  createAddressFromString,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerkleStateManager, SimpleStateManager, consumeBAL } from '../src/index.ts'

describe('[StateManager/consumeBAL]: apply block access list', () => {
  it('consumeBAL() applies balance and storage changes from balSimpleJSON', async () => {
    const sm = new MerkleStateManager()
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList

    await consumeBAL(sm, bal)

    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const balanceAccount = await sm.getAccount(balanceAddr)
    assert.strictEqual(balanceAccount?.balance, hexToBigInt('0x01ec30'))

    const storageAddr = createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935')
    const storage = await sm.getStorage(storageAddr, setLengthLeft(hexToBytes('0x00'), 32))
    const expectedStorage = setLengthLeft(
      hexToBytes('0x372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21'),
      32,
    )
    assert.isTrue(equalsBytes(storage, expectedStorage))
  })

  it('consumeBAL() deletes empty EIP-161 accounts on SimpleStateManager', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x000000000000000000000000000000000000dead')
    await sm.putAccount(address, createAccount({ balance: 1n }))

    await consumeBAL(sm, [
      {
        address: address.toString() as PrefixedHexString,
        nonceChanges: [],
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x00' }],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])

    assert.isUndefined(await sm.getAccount(address))
  })

  it('MerkleStateManager.consumeBAL() throws when expected state root does not match', async () => {
    const sm = new MerkleStateManager()
    const wrongRoot = hexToBytes(('0x' + '11'.repeat(32)) as PrefixedHexString)

    try {
      await sm.consumeBAL([], wrongRoot)
      assert.fail('should throw on state root mismatch')
    } catch (e: unknown) {
      assert.match((e as Error).message, /Expected state root/)
    }
  })
})
