import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAccessList2930Tx, createLegacyTx } from '@ethereumjs/tx'
import { assert, describe, it } from 'vitest'

import type { BlockData } from '@ethereumjs/block'
import type { AccessList2930TxData, TransactionType, TxData } from '@ethereumjs/tx'

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

    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })

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
    const accessListTx: RequiredExceptOptionals<AccessList2930TxData, OptionalTxFields> =
      createAccessList2930Tx({}, { common })
    assert.ok(accessListTx, 'accessList tx')
  })
})
