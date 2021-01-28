import Common from '@ethereumjs/common'
import { Address, BN, privateToAddress } from 'ethereumjs-util'
import tape from 'tape'
import { EIP2930Transaction } from '../src'

const pKey = Buffer.from('4646464646464646464646464646464646464646464646464646464646464646', 'hex')
const address = privateToAddress(pKey)

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const validAddress = Buffer.from('01'.repeat(20), 'hex')
const validSlot = Buffer.from('01'.repeat(32), 'hex')

// tests from https://github.com/ethereum/go-ethereum/blob/ac8e5900e6d38f7577251e7e36da9b371b2e5488/core/types/transaction_test.go#L56
const GethUnsignedEIP2930Transaction = EIP2930Transaction.fromTxData(
  {
    chainId: new BN(1),
    nonce: new BN(3),
    to: new Address(Buffer.from('b94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')),
    value: new BN(10),
    gasLimit: new BN(25000),
    gasPrice: new BN(1),
    data: Buffer.from('5544', 'hex'),
    accessList: [],
  },
  { common }
)

const chainId = new BN(1)

tape('[EIP2930 transactions]: Basic functions', function (t) {
  t.test('should throw on invalid access list data', function (st) {
    let accessList: any[] = [
      [
        Buffer.from('01'.repeat(21), 'hex'), // Address of 21 bytes instead of 20
        [],
      ],
    ]

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [
      [
        validAddress,
        [
          Buffer.from('01'.repeat(31), 'hex'), // Slot of 31 bytes instead of 32
        ],
      ],
    ]

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[]] // Address does not exist

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress]] // Slots does not exist

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress, validSlot]] // Slots is not an array

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress, [], []]] // 3 items where 2 are expected

    st.throws(() => {
      EIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    st.end()
  })

  t.test('should return right upfront cost', (st) => {
    let tx = EIP2930Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )
    // Cost should be:
    // Base fee + 2*TxDataNonZero + TxDataZero + AccessListAddressCost + AccessListSlotCost
    const txDataZero = common.param('gasPrices', 'txDataZero')
    const txDataNonZero = common.param('gasPrices', 'txDataNonZero')
    const accessListStorageKeyCost = common.param('gasPrices', 'accessListStorageKeyCost')
    const accessListAddressCost = common.param('gasPrices', 'accessListAddressCost')
    const baseFee = common.param('gasPrices', 'tx')
    const creationFee = common.param('gasPrices', 'txCreation')

    st.ok(
      tx
        .getBaseFee()
        .eqn(
          txDataNonZero * 2 +
            txDataZero +
            baseFee +
            accessListAddressCost +
            accessListStorageKeyCost
        )
    )

    // In this Tx, `to` is `undefined`, so we should charge homestead creation gas.
    tx = EIP2930Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )

    st.ok(
      tx
        .getBaseFee()
        .eqn(
          txDataNonZero * 2 +
            txDataZero +
            creationFee +
            baseFee +
            accessListAddressCost +
            accessListStorageKeyCost
        )
    )

    // Explicilty check that even if we have duplicates in our list, we still charge for those
    tx = EIP2930Transaction.fromTxData(
      {
        to: validAddress,
        accessList: [
          [validAddress, [validSlot]],
          [validAddress, [validSlot, validSlot]],
        ],
        chainId,
      },
      { common }
    )

    st.ok(tx.getBaseFee().eqn(baseFee + accessListAddressCost * 2 + accessListStorageKeyCost * 3))

    st.end()
  })

  t.test('should sign a transaction', function (t) {
    const tx = EIP2930Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )
    const signed = tx.sign(pKey)
    const signedAddress = signed.getSenderAddress()

    t.ok(signedAddress.buf.equals(address))

    signed.verifySignature() // If this throws, test will not end.

    t.end()
  })

  t.test('should reject transactions with wrong chain ID', function (t) {
    t.throws(() => {
      EIP2930Transaction.fromTxData(
        {
          chainId: chainId.addn(1),
        },
        { common }
      )
    })
    t.end()
  })

  t.test('should produce right hash-to-sign values', function (t) {
    const hash = GethUnsignedEIP2930Transaction.getMessageToSign()
    const expected = Buffer.from(
      'c44faa8f50803df8edd97e72c4dbae32343b2986c91e382fc3e329e6c9a36f31',
      'hex'
    )
    t.ok(hash.equals(expected))
    t.end()
  })
})
