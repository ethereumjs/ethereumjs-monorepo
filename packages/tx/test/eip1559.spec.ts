import Common from '@ethereumjs/common'
import { BN, rlp } from 'ethereumjs-util'
import tape from 'tape'
import { FeeMarketEIP1559Transaction } from '../src'

const testdata = require('./json/eip1559.json') // Source: Besu

const common = new Common({
  chain: 'aleut',
  hardfork: 'london',
})

const validAddress = Buffer.from('01'.repeat(20), 'hex')
const validSlot = Buffer.from('01'.repeat(32), 'hex')
const chainId = new BN(7822)

tape('[FeeMarketEIP1559Transaction]', function (t) {
  t.test('getUpfrontCost()', function (st) {
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        maxFeePerGas: 10,
        maxInclusionFeePerGas: 8,
        gasLimit: 100,
        value: 6,
      },
      { common }
    )
    st.equals(tx.getUpfrontCost().toNumber(), 806, 'correct upfront cost with default base fee')
    let baseFee = new BN(0)
    st.equals(tx.getUpfrontCost(baseFee).toNumber(), 806, 'correct upfront cost with 0 base fee')
    baseFee = new BN(4)
    st.equals(
      tx.getUpfrontCost(baseFee).toNumber(),
      1006,
      'correct upfront cost with cost-changing base fee value'
    )
    st.end()
  })

  t.test('sign()', function (st) {
    for (let index = 0; index < testdata.length; index++) {
      const data = testdata[index]
      const pkey = Buffer.from(data.privateKey.slice(2), 'hex')
      const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common })
      const signed = txn.sign(pkey)
      const rlpSerialized = rlp.encode(signed.serialize())
      st.ok(
        rlpSerialized.equals(Buffer.from(data.signedTransactionRLP.slice(2), 'hex')),
        'Should sign txs correctly'
      )
    }
    st.end()
  })

  t.test('hash()', function (st) {
    const data = testdata[0]
    const pkey = Buffer.from(data.privateKey.slice(2), 'hex')
    const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common })
    const signed = txn.sign(pkey)
    const expectedHash = Buffer.from(
      'a3bf78ff247cad934aa5fb13e05f11e59c93511523ff8a622e59c3a34700e5c8',
      'hex'
    )
    st.ok(signed.hash().equals(expectedHash), 'Should provide the correct hash')
    st.end()
  })

  t.test('unsigned tx -> getMessageToSign()', function (t) {
    const unsignedTx = FeeMarketEIP1559Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )
    const expectedHash = Buffer.from(
      '09c32c94e6058d1768f176a1bb9be877cd7289c86c505bc28b7503c67e07c97f',
      'hex'
    )
    t.deepEqual(unsignedTx.getMessageToSign(true), expectedHash), 'correct hashed version'

    const expectedSerialization = Buffer.from(
      '02f85b821e8e808080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
      'hex'
    )
    t.deepEqual(
      unsignedTx.getMessageToSign(false),
      expectedSerialization,
      'correct serialized unhashed version'
    )

    t.end()
  })
})
