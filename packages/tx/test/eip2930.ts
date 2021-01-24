import Common from '@ethereumjs/common'
import { Address } from 'ethereumjs-util'
import tape from 'tape'
import { UnsignedEIP2930Transaction } from '../src'

const common = new Common({
  eips: [2718, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const validAddress = Buffer.from('01'.repeat(20), 'hex')
const validSlot = Buffer.from('01'.repeat(32), 'hex')

tape('[EIP2930 transactions]: Basic functions', function (t) {
  t.test('should throw on invalid access list data', function (st) {
    let accessList: any[] = [
      [
        Buffer.from('01'.repeat(21), 'hex'), // Address of 21 bytes instead of 20
        [],
      ],
    ]

    st.throws(() => {
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
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
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
    })

    accessList = [[]] // Address does not exist

    st.throws(() => {
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
    })

    accessList = [[validAddress]] // Slots does not exist

    st.throws(() => {
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
    })

    accessList = [[validAddress, validSlot]] // Slots is not an array

    st.throws(() => {
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
    })

    accessList = [[validAddress, [], []]] // 3 items where 2 are expected

    st.throws(() => {
      UnsignedEIP2930Transaction.fromTxData({ accessList }, { common })
    })

    st.end()
  })

  t.test('should return right upfront cost', (st) => {
    let tx = UnsignedEIP2930Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
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
    tx = UnsignedEIP2930Transaction.fromTxData(
      {
        data: Buffer.from('010200', 'hex'),
        accessList: [[validAddress, [validSlot]]],
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
    tx = UnsignedEIP2930Transaction.fromTxData(
      {
        to: validAddress,
        accessList: [
          [validAddress, [validSlot]],
          [validAddress, [validSlot, validSlot]],
        ],
      },
      { common }
    )

    st.ok(tx.getBaseFee().eqn(baseFee + accessListAddressCost * 2 + accessListStorageKeyCost * 3))

    st.end()
  })
})
