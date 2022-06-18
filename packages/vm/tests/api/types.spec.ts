import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import {
  AccessListEIP2930Transaction,
  AccessListEIP2930TxData,
  Transaction,
  TxData,
} from '@ethereumjs/tx'
import { Block, BlockData } from '@ethereumjs/block'

tape('[Types]', function (t) {
  t.test('should ensure that the actual objects can be safely used as their data types', (st) => {
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
    const block: Required<BlockData> = Block.fromBlockData({}, { common })
    st.ok(block, 'block')

    // Transactions
    type OptionalTxFields = 'to' | 'r' | 's' | 'v'

    // Legacy tx
    const legacyTx: RequiredExceptOptionals<TxData, OptionalTxFields> = Transaction.fromTxData(
      {},
      { common }
    )
    st.ok(legacyTx, 'legacy tx')

    // Access List tx
    const accessListTx: RequiredExceptOptionals<AccessListEIP2930TxData, OptionalTxFields> =
      AccessListEIP2930Transaction.fromTxData({}, { common })
    st.ok(accessListTx, 'accessList tx')

    st.end()
  })
})
