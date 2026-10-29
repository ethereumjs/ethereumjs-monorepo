import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { balSimpleJSON } from '@ethereumjs/testdata'
import { createLegacyTx } from '@ethereumjs/tx'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import {
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../src/index.ts'

describe('[VM/FlatStateManager]: runTx and consumeBAL', () => {
  it('runTx() transfers value between snap-seeded accounts', async () => {
    const sm = createFlatStateManager()
    const to = createAddressFromString('0x00000000000000000000000000000000000000bb')
    const seed = (addr: ReturnType<typeof createAddressFromString>, balance: bigint) => {
      sm.putSnapAccountsBatch([
        {
          accountHash: keccak_256(addr.bytes),
          account: createAccount({ balance, nonce: 0n }),
          address: addr,
        },
      ])
    }
    seed(to, 0n)

    const pk = hexToBytes(`0x${'11'.repeat(32)}`)
    const sender = createAddressFromPrivateKey(pk)
    seed(sender, 10n ** 18n)

    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const vm = await createVM({ common, stateManager: sm })

    const tx = createLegacyTx(
      {
        nonce: 0,
        gasPrice: 10n ** 9n,
        gasLimit: 21000,
        to: to.bytes,
        value: 10n ** 17n,
      },
      { common, freeze: false },
    ).sign(pk)

    const fromBefore = (await sm.getAccount(sender))!.balance
    await runTx(vm, { tx, skipBlockGasLimitValidation: true })
    const toAfter = (await sm.getAccount(to))!.balance
    assert.isTrue(toAfter >= 10n ** 17n)
    assert.isTrue((await sm.getAccount(sender))!.balance < fromBefore)
  })

  it('consumeBAL() applies Amsterdam access list on the same manager', async () => {
    const sm = createFlatStateManager()
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList

    await sm.consumeBAL(bal)

    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const balanceAccount = await sm.getAccount(balanceAddr)
    assert.strictEqual(balanceAccount?.balance, hexToBigInt('0x01ec30'))

    const storageAddr = createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935')
    const storage = await sm.getStorage(storageAddr, setLengthLeft(hexToBytes('0x00'), 32))
    assert.strictEqual(
      storage[31],
      hexToBytes('0x372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21')[31],
    )
  })
})
