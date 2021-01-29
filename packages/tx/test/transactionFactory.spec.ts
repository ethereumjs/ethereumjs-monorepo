import Common from '@ethereumjs/common'
import { BN, rlp } from 'ethereumjs-util'
import tape from 'tape'
import { EIP2930Transaction, TransactionFactory, LegacyTransaction } from '../src'

const EIP2930Common = new Common({
  eips: [2718, 2929, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const simpleUnsignedEIP2930Transaction = EIP2930Transaction.fromTxData(
  { chainId: new BN(1) },
  { common: EIP2930Common }
)

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
    st.equals(legacyTx.name, LegacyTransaction.name)

    const eip2930Tx = TransactionFactory.getTransactionClass(1, EIP2930Common)
    st.equals(eip2930Tx.name, EIP2930Transaction.name)

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

  // TestData from https://github.com/ethereum/go-ethereum/tree/ac8e5900e6d38f7577251e7e36da9b371b2e5488/core/testdata
  // This tries to decode the transaction from the block.
  // It checks afterwards if the created transaction is of the right type.
  t.test('should succesfully decode block transactions', function (t) {
    const testCommon = Common.forCustomChain('mainnet', { chainId: 133519467574834 }, 'berlin')
    testCommon.setEIPs([2718, 2929, 2930])

    for (let i = 0; i <= 9; i++) {
      const blockData = require(`./json/eip2930/acl_block_${i}.json`)
      const decodedBlock = rlp.decode(Buffer.from(blockData.rlp, 'hex'))
      const transactionList: any = decodedBlock[1]
      for (let transaction = 0; transaction < transactionList.length; transaction++) {
        const tx = TransactionFactory.fromBlockBodyData(transactionList[transaction], {
          common: testCommon,
        })
        const type = tx.constructor.name
        const txData = blockData.json.transactions[transaction]
        const txType = parseInt(txData.type.slice(2), 16)
        const expected = TransactionFactory.getTransactionClass(txType, testCommon)
        t.equals(type, expected.name)
      }
    }

    t.end()
  })
})
