import Common from '@ethereumjs/common'
import tape from 'tape'
import {
  SignedEIP2930Transaction,
  SignedLegacyTransaction,
  TransactionFactory,
  UnsignedEIP2930Transaction,
  UnsignedLegacyTransaction,
} from '../src'

const EIP2930Common = new Common({
  eips: [2718, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const simpleUnsignedEIP2930Transaction = UnsignedEIP2930Transaction.fromTxData(
  {},
  { common: EIP2930Common }
)

tape('[TransactionFactory]: Basic functions', function (t) {
  t.test('should return the right type', function (st) {
    const serialized = simpleUnsignedEIP2930Transaction.serialize()
    const factoryTx = TransactionFactory.fromRawData(serialized, { common: EIP2930Common })
    st.equals(factoryTx.constructor.name, UnsignedEIP2930Transaction.name)

    const legacyTx = UnsignedLegacyTransaction.fromTxData({})
    const serializedLegacyTx = legacyTx.serialize()
    const factoryLegacyTx = TransactionFactory.fromRawData(serializedLegacyTx, {})
    st.equals(factoryLegacyTx.constructor.name, UnsignedLegacyTransaction.name)

    st.end()
  })

  t.test(
    'should throw when trying to create EIP-2718 typed transactions when not allowed in Common',
    function (st) {
      st.throws(() => {
        TransactionFactory.fromRawData(simpleUnsignedEIP2930Transaction.serialize(), {})
      })
      st.end()
    }
  )

  t.test(
    'should throw when trying to create EIP-2718 typed transactions when not allowed in Common',
    function (st) {
      st.throws(() => {
        const serialized = simpleUnsignedEIP2930Transaction.serialize()
        serialized[0] = 2 // edit the transaction type
        TransactionFactory.fromRawData(serialized, { common: EIP2930Common })
      })
      st.end()
    }
  )

  t.test('should give me the right classes in getTransactionClass', function (st) {
    let legacyTx = TransactionFactory.getTransactionClass()
    st.equals(legacyTx.name, UnsignedLegacyTransaction.name)

    legacyTx = TransactionFactory.getTransactionClass(undefined, true)
    st.equals(legacyTx.name, SignedLegacyTransaction.name)

    let eip2930Tx = TransactionFactory.getTransactionClass(1, false, EIP2930Common)
    st.equals(eip2930Tx.name, UnsignedEIP2930Transaction.name)

    eip2930Tx = TransactionFactory.getTransactionClass(1, true, EIP2930Common)
    st.equals(eip2930Tx.name, SignedEIP2930Transaction.name)

    st.end()
  })

  t.test('should throw when getting an invalid transaction type', function (st) {
    st.throws(() => {
      TransactionFactory.getTransactionClass(2, false, EIP2930Common)
    })

    st.end()
  })

  t.test('should throw when getting typed transactions without EIP-2718 activated', function (st) {
    st.throws(() => {
      TransactionFactory.getTransactionClass(1, false)
    })
    st.end()
  })
})
