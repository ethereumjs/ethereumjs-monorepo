import { createBlock } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { create2930AccessListTx, createLegacyTx } from '@ethereumjs/tx'
import { assert, describe, it } from 'vitest'

import type { BlockData } from '@ethereumjs/block'
import type { AccessListEIP2930TxData, TransactionType, TxData } from '@ethereumjs/tx'

describe('[Types]', () => {
  it('should ensure that the actual objects can be safely used as their data types', () => {
    // Dev note:
    // This test was written by @alcuadrado after discovering
    // issues in creating an object from its own data. It will
    // ensure that the classes can be initialized from their own data.

    type RequiredExceptOptionals<TypeT, OptionalFieldsT extends keyof TypeT> = Required<
      Omit<TypeT, OptionalFieldsT>
    > &
      Pick<TypeT, OptionalFieldsT>

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })

    // Block
    const block: Omit<Required<BlockData>, 'withdrawals' | 'executionWitness'> = createBlock(
      {},
      { common },
    )
    assert.ok(block, 'block')

    // Transactions
    type OptionalTxFields = 'to' | 'r' | 's' | 'v'

    // Legacy tx
    const legacyTx: RequiredExceptOptionals<TxData[TransactionType.Legacy], OptionalTxFields> =
      createLegacyTx({}, { common })
    assert.ok(legacyTx, 'legacy tx')

    // Access List tx
    const accessListTx: RequiredExceptOptionals<AccessListEIP2930TxData, OptionalTxFields> =
      create2930AccessListTx({}, { common })
    assert.ok(accessListTx, 'accessList tx')
  })
})
