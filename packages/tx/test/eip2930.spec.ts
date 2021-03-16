import Common from '@ethereumjs/common'
import { Address, BN, bufferToHex, privateToAddress } from 'ethereumjs-util'
import tape from 'tape'
import { AccessList, AccessListEIP2930Transaction } from '../src'

const pKey = Buffer.from('4646464646464646464646464646464646464646464646464646464646464646', 'hex')
const address = privateToAddress(pKey)

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: 'mainnet',
  hardfork: 'berlin',
})

const validAddress = Buffer.from('01'.repeat(20), 'hex')
const validSlot = Buffer.from('01'.repeat(32), 'hex')

const chainId = new BN(1)

tape('[AccessListEIP2930Transaction]', function (t) {
  t.test('Initialization / Getter', function (t) {
    t.ok(AccessListEIP2930Transaction.fromTxData({}, { common }), 'should initialize correctly')

    const nonEIP2930Common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
    t.throws(() => {
      AccessListEIP2930Transaction.fromTxData({}, { common: nonEIP2930Common })
    }, 'should throw on a pre-Berlin Harfork (EIP-2930 not activated)')

    t.throws(() => {
      AccessListEIP2930Transaction.fromTxData(
        {
          chainId: chainId.addn(1),
        },
        { common }
      )
    }, 'should reject transactions with wrong chain ID')

    t.throws(() => {
      AccessListEIP2930Transaction.fromTxData(
        {
          v: 2,
        },
        { common }
      )
    }, 'should reject transactions with invalid yParity (v) values')
    t.end()
  })

  t.test('should allow json-typed access lists', function (st) {
    const access: AccessList = [
      {
        address: bufferToHex(validAddress),
        storageKeys: [bufferToHex(validSlot)],
      },
    ]
    const txn = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: access,
        chainId: 1,
      },
      { common }
    )

    // Check if everything is converted

    const BufferArray = txn.accessList
    const JSON = txn.AccessListJSON

    st.ok(BufferArray[0][0].equals(validAddress))
    st.ok(BufferArray[0][1][0].equals(validSlot))

    st.deepEqual(JSON, access)

    // also verify that we can always get the json access list, even if we don't provide one.

    const txnRaw = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: BufferArray,
        chainId: 1,
      },
      { common }
    )

    const JSONRaw = txnRaw.AccessListJSON

    st.deepEqual(JSONRaw, access)

    st.end()
  })

  t.test('should throw on invalid access list data', function (st) {
    let accessList: any[] = [
      [
        Buffer.from('01'.repeat(21), 'hex'), // Address of 21 bytes instead of 20
        [],
      ],
    ]

    st.throws(() => {
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
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
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[]] // Address does not exist

    st.throws(() => {
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress]] // Slots does not exist

    st.throws(() => {
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress, validSlot]] // Slots is not an array

    st.throws(() => {
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    accessList = [[validAddress, [], []]] // 3 items where 2 are expected

    st.throws(() => {
      AccessListEIP2930Transaction.fromTxData({ chainId, accessList }, { common })
    })

    st.end()
  })

  t.test('should return right upfront cost', (st) => {
    let tx = AccessListEIP2930Transaction.fromTxData(
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
    const txDataZero: number = common.param('gasPrices', 'txDataZero')
    const txDataNonZero: number = common.param('gasPrices', 'txDataNonZero')
    const accessListStorageKeyCost: number = common.param('gasPrices', 'accessListStorageKeyCost')
    const accessListAddressCost: number = common.param('gasPrices', 'accessListAddressCost')
    const baseFee: number = common.param('gasPrices', 'tx')
    const creationFee: number = common.param('gasPrices', 'txCreation')

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
    tx = AccessListEIP2930Transaction.fromTxData(
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
    tx = AccessListEIP2930Transaction.fromTxData(
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
    const tx = AccessListEIP2930Transaction.fromTxData(
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

  // Data from
  // https://github.com/INFURA/go-ethlibs/blob/75b2a52a39d353ed8206cffaf68d09bd1b154aae/eth/transaction_signing_test.go#L87

  t.test('should sign transaction correctly and return expected JSON', function (t) {
    const address = Buffer.from('0000000000000000000000000000000000001337', 'hex')
    const slot1 = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
    const txData = {
      data: Buffer.from('', 'hex'),
      gasLimit: 0x62d4,
      gasPrice: 0x3b9aca00,
      nonce: 0x00,
      to: new Address(Buffer.from('df0a88b2b68c673713a8ec826003676f272e3573', 'hex')),
      value: 0x01,
      chainId: new BN(Buffer.from('796f6c6f763378', 'hex')),
      accessList: <any>[[address, [slot1]]],
    }

    const customChainParams = {
      name: 'custom',
      chainId: txData.chainId,
      eips: [2718, 2929, 2930],
    }
    const usedCommon = Common.forCustomChain('mainnet', customChainParams, 'berlin')
    usedCommon.setEIPs([2718, 2929, 2930])

    const expectedUnsignedRaw = Buffer.from(
      '01f86587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a00000000000000000000000000000000000000000000000000000000000000000808080',
      'hex'
    )
    const pkey = Buffer.from(
      'fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19',
      'hex'
    )
    const expectedSigned = Buffer.from(
      '01f8a587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a0000000000000000000000000000000000000000000000000000000000000000080a0294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938da00be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
      'hex'
    )
    const expectedHash = Buffer.from(
      'bbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec',
      'hex'
    )
    const v = new BN(0)
    const r = new BN(
      Buffer.from('294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d', 'hex')
    )
    const s = new BN(
      Buffer.from('0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d', 'hex')
    )

    const unsignedTx = AccessListEIP2930Transaction.fromTxData(txData, { common: usedCommon })

    const serializedMessageRaw = unsignedTx.serialize()

    t.ok(expectedUnsignedRaw.equals(serializedMessageRaw), 'serialized unsigned message correct')

    const signed = unsignedTx.sign(pkey)

    t.ok(v.eq(signed.v!), 'v correct')
    t.ok(r.eq(signed.r!), 'r correct')
    t.ok(s.eq(signed.s!), 's correct')
    t.ok(expectedSigned.equals(signed.serialize()), 'serialized signed message correct')
    t.ok(expectedHash.equals(signed.hash()), 'hash correct')

    const expectedJSON = {
      chainId: '0x796f6c6f763378',
      nonce: '0x0',
      gasPrice: '0x3b9aca00',
      gasLimit: '0x62d4',
      to: '0xdf0a88b2b68c673713a8ec826003676f272e3573',
      value: '0x1',
      data: '0x',
      accessList: [
        {
          address: '0x0000000000000000000000000000000000001337',
          storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        },
      ],
    }

    t.deepEqual(signed.toJSON(), expectedJSON)

    t.end()
  })
})
