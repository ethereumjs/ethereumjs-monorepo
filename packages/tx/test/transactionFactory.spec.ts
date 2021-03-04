import Common from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import tape from 'tape'
import { EIP2930Transaction, TransactionFactory, LegacyTransaction } from '../src'

const EIP2930Common = new Common({
  eips: [2718, 2929, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const pKey = Buffer.from('4646464646464646464646464646464646464646464646464646464646464646', 'hex')

const simpleUnsignedEIP2930Transaction = EIP2930Transaction.fromTxData(
  { chainId: new BN(1) },
  { common: EIP2930Common }
)

const simpleUnsignedLegacyTransaction = LegacyTransaction.fromTxData({})

const simpleSignedEIP2930Transaction = simpleUnsignedEIP2930Transaction.sign(pKey)
const simpleSignedLegacyTransaction = simpleUnsignedLegacyTransaction.sign(pKey)

tape('[TransactionFactory]: Basic functions', function (t) {
  t.test('should return the right type', function (st) {
    const serialized = simpleUnsignedEIP2930Transaction.serialize()
    const factoryTx = TransactionFactory.fromRawData(serialized, { common: EIP2930Common })
    st.equals(factoryTx.constructor.name, EIP2930Transaction.name)

    const legacyTx = LegacyTransaction.fromTxData({})
    const serializedLegacyTx = legacyTx.serialize()
    const factoryLegacyTx = TransactionFactory.fromRawData(serializedLegacyTx, {})
    st.equals(factoryLegacyTx.constructor.name, LegacyTransaction.name)

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
    const legacyTx = TransactionFactory.getTransactionClass()
    st.equals(legacyTx!.name, LegacyTransaction.name)

    const eip2930Tx = TransactionFactory.getTransactionClass(1, EIP2930Common)
    st.equals(eip2930Tx!.name, EIP2930Transaction.name)

    st.end()
  })

  t.test('should throw when getting an invalid transaction type', function (st) {
    st.throws(() => {
      TransactionFactory.getTransactionClass(2, EIP2930Common)
    })

    st.end()
  })

  t.test('should throw when getting typed transactions without EIP-2718 activated', function (st) {
    st.throws(() => {
      TransactionFactory.getTransactionClass(1)
    })
    st.end()
  })

  t.test('should decode raw block body data', function (st) {
    const rawLegacy = simpleSignedLegacyTransaction.raw()
    const rawEIP2930 = simpleSignedEIP2930Transaction.raw()

    const legacyTx = TransactionFactory.fromBlockBodyData(rawLegacy)
    const eip2930Tx = TransactionFactory.fromBlockBodyData(rawEIP2930, { common: EIP2930Common })

    st.equals(legacyTx.constructor.name, LegacyTransaction.name)
    st.equals(eip2930Tx.constructor.name, EIP2930Transaction.name)
    st.end()
  })

  t.test('should create the right transaction types from tx data', function (st) {
    const legacyTx = TransactionFactory.fromTxData({ type: 0 })
    const legacyTx2 = TransactionFactory.fromTxData({})
    const eip2930Tx = TransactionFactory.fromTxData({ type: 1 }, { common: EIP2930Common })
    st.throws(() => {
      TransactionFactory.fromTxData({ type: 1 })
    })

    st.equals(legacyTx.constructor.name, LegacyTransaction.name)
    st.equals(legacyTx2.constructor.name, LegacyTransaction.name)
    st.equals(eip2930Tx.constructor.name, EIP2930Transaction.name)
    st.end()
  })

  t.test('if eip2718 is not activated, always return that the eip is not activated', function (st) {
    const newCommon = new Common({ chain: 'mainnet', hardfork: 'istanbul' })

    const eip2930Active = TransactionFactory.eipSupport(newCommon, 2930)
    st.ok(!eip2930Active)
    st.end()
  })
})
