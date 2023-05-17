import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  Address,
  MAX_INTEGER,
  MAX_UINT64,
  SECP256K1_ORDER_DIV_2,
  bytesToBigInt,
  bytesToPrefixedHexString,
  concatBytes,
  equalsBytes,
  hexStringToBytes,
  privateToAddress,
} from '@ethereumjs/util'
import * as tape from 'tape'

import { AccessListEIP2930Transaction, FeeMarketEIP1559Transaction } from '../src'

import type { AccessList, AccessListBytesItem } from '../src'

const pKey = hexStringToBytes('4646464646464646464646464646464646464646464646464646464646464646')
const address = privateToAddress(pKey)

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
})

const txTypes = [
  {
    class: AccessListEIP2930Transaction,
    name: 'AccessListEIP2930Transaction',
    type: 1,
  },
  {
    class: FeeMarketEIP1559Transaction,
    name: 'FeeMarketEIP1559Transaction',
    type: 2,
  },
]

const validAddress = hexStringToBytes('01'.repeat(20))
const validSlot = hexStringToBytes('01'.repeat(32))
const chainId = BigInt(1)

tape(
  '[AccessListEIP2930Transaction / FeeMarketEIP1559Transaction] -> EIP-2930 Compatibility',
  function (t) {
    t.test('Initialization / Getter -> fromTxData()', function (t) {
      for (const txType of txTypes) {
        let tx = txType.class.fromTxData({}, { common })
        t.ok(tx, `should initialize correctly (${txType.name})`)

        tx = txType.class.fromTxData({
          chainId: 5,
        })
        t.ok(
          tx.common.chainId() === BigInt(5),
          'should initialize Common with chain ID provided (supported chain ID)'
        )

        tx = txType.class.fromTxData({
          chainId: 99999,
        })
        t.ok(
          tx.common.chainId() === BigInt(99999),
          'should initialize Common with chain ID provided (unsupported chain ID)'
        )

        const nonEIP2930Common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
        t.throws(() => {
          txType.class.fromTxData({}, { common: nonEIP2930Common })
        }, `should throw on a pre-Berlin Hardfork (EIP-2930 not activated) (${txType.name})`)

        t.throws(() => {
          txType.class.fromTxData(
            {
              chainId: chainId + BigInt(1),
            },
            { common }
          )
        }, `should reject transactions with wrong chain ID (${txType.name})`)

        t.throws(() => {
          txType.class.fromTxData(
            {
              v: 2,
            },
            { common }
          )
        }, `should reject transactions with invalid yParity (v) values (${txType.name})`)
      }
      t.end()
    })

    t.test('cannot input decimal values', (st) => {
      const values = ['chainId', 'nonce', 'gasPrice', 'gasLimit', 'value', 'v', 'r', 's']
      const cases = [
        10.1,
        '10.1',
        '0xaa.1',
        -10.1,
        -1,
        BigInt(-10),
        '-100',
        '-10.1',
        '-0xaa',
        Infinity,
        -Infinity,
        NaN,
        {},
        true,
        false,
        () => {},
        Number.MAX_SAFE_INTEGER + 1,
      ]
      for (const value of values) {
        const txData: any = {}
        for (const testCase of cases) {
          if (
            !(
              value === 'chainId' &&
              ((typeof testCase === 'number' && isNaN(<number>testCase)) || testCase === false)
            )
          ) {
            txData[value] = testCase
            st.throws(() => {
              AccessListEIP2930Transaction.fromTxData(txData)
            })
          }
        }
      }
      st.end()
    })

    t.test('Initialization / Getter -> fromSerializedTx()', function (t) {
      for (const txType of txTypes) {
        try {
          txType.class.fromSerializedTx(new Uint8Array([99]), {})
        } catch (e: any) {
          t.ok(
            e.message.includes('wrong tx type'),
            `should throw on wrong tx type (${txType.name})`
          )
        }

        try {
          // Correct tx type + RLP-encoded 5
          const serialized = concatBytes(new Uint8Array([txType.type]), new Uint8Array([5]))
          txType.class.fromSerializedTx(serialized, {})
        } catch (e: any) {
          t.ok(
            e.message.includes('must be array'),
            `should throw when RLP payload not an array (${txType.name})`
          )
        }

        try {
          // Correct tx type + RLP-encoded empty list
          const serialized = concatBytes(new Uint8Array([txType.type]), hexStringToBytes('c0'))
          txType.class.fromSerializedTx(serialized, {})
        } catch (e: any) {
          t.ok(
            e.message.includes('values (for unsigned tx)'),
            `should throw with invalid number of values (${txType.name})`
          )
        }
      }
      t.end()
    })

    t.test('Access Lists -> success cases', function (st) {
      for (const txType of txTypes) {
        const access: AccessList = [
          {
            address: bytesToPrefixedHexString(validAddress),
            storageKeys: [bytesToPrefixedHexString(validSlot)],
          },
        ]
        const txn = txType.class.fromTxData(
          {
            accessList: access,
            chainId: 1,
          },
          { common }
        )

        // Check if everything is converted

        const bytes = txn.accessList
        const JSON = txn.AccessListJSON

        st.ok(equalsBytes(bytes[0][0], validAddress))
        st.ok(equalsBytes(bytes[0][1][0], validSlot))

        st.deepEqual(JSON, access, `should allow json-typed access lists (${txType.name})`)

        // also verify that we can always get the json access list, even if we don't provide one.

        const txnRaw = txType.class.fromTxData(
          {
            accessList: bytes,
            chainId: 1,
          },
          { common }
        )

        const JSONRaw = txnRaw.AccessListJSON

        st.deepEqual(JSONRaw, access, `should allow json-typed access lists (${txType.name})`)
      }
      st.end()
    })

    t.test('Access Lists -> error cases', function (st) {
      for (const txType of txTypes) {
        let accessList: any[] = [
          [
            hexStringToBytes('01'.repeat(21)), // Address of 21 bytes instead of 20
            [],
          ],
        ]

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)

        accessList = [
          [
            validAddress,
            [
              hexStringToBytes('01'.repeat(31)), // Slot of 31 bytes instead of 32
            ],
          ],
        ]

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)

        accessList = [[]] // Address does not exist

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)

        accessList = [[validAddress]] // Slots does not exist

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)

        accessList = [[validAddress, validSlot]] // Slots is not an array

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)

        accessList = [[validAddress, [], []]] // 3 items where 2 are expected

        st.throws(() => {
          txType.class.fromTxData({ chainId, accessList }, { common })
        }, txType.name)
      }
      st.end()
    })

    t.test('sign()', function (t) {
      for (const txType of txTypes) {
        let tx = txType.class.fromTxData(
          {
            data: hexStringToBytes('010200'),
            to: validAddress,
            accessList: [[validAddress, [validSlot]]],
            chainId,
          },
          { common }
        )
        let signed = tx.sign(pKey)
        const signedAddress = signed.getSenderAddress()
        t.ok(
          equalsBytes(signedAddress.bytes, address),
          `should sign a transaction (${txType.name})`
        )
        signed.verifySignature() // If this throws, test will not end.

        tx = txType.class.fromTxData({}, { common })
        signed = tx.sign(pKey)

        t.deepEqual(
          tx.accessList,
          [],
          `should create and sign transactions without passing access list value (${txType.name})`
        )
        t.deepEqual(signed.accessList, [])

        tx = txType.class.fromTxData({}, { common })

        t.throws(() => {
          tx.hash()
        }, `should throw calling hash with unsigned tx (${txType.name})`)

        t.throws(() => {
          tx.getSenderPublicKey()
        })

        t.throws(() => {
          const high = SECP256K1_ORDER_DIV_2 + BigInt(1)
          const tx = txType.class.fromTxData({ s: high, r: 1, v: 1 }, { common })
          const signed = tx.sign(pKey)
          signed.getSenderPublicKey()
        }, `should throw with invalid s value (${txType.name})`)
      }
      t.end()
    })

    t.test('getDataFee()', function (st) {
      for (const txType of txTypes) {
        let tx = txType.class.fromTxData({}, { common })
        st.equal(tx.getDataFee(), BigInt(0), 'Should return data fee when frozen')

        tx = txType.class.fromTxData({}, { common, freeze: false })
        st.equal(tx.getDataFee(), BigInt(0), 'Should return data fee when not frozen')

        const mutableCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
        tx = txType.class.fromTxData({}, { common: mutableCommon })
        tx.common.setHardfork(Hardfork.Istanbul)
        st.equal(tx.getDataFee(), BigInt(0), 'Should invalidate cached value on hardfork change')
      }
      st.end()
    })
  }
)

tape('[AccessListEIP2930Transaction] -> Class Specific Tests', function (t) {
  t.test('Initialization', (st) => {
    const tx = AccessListEIP2930Transaction.fromTxData({}, { common })
    t.ok(
      AccessListEIP2930Transaction.fromTxData(tx, { common }),
      'should initialize correctly from its own data'
    )

    const validAddress = hexStringToBytes('01'.repeat(20))
    const validSlot = hexStringToBytes('01'.repeat(32))
    const chainId = BigInt(1)
    try {
      AccessListEIP2930Transaction.fromTxData(
        {
          data: hexStringToBytes('010200'),
          to: validAddress,
          accessList: [[validAddress, [validSlot]]],
          chainId,
          gasLimit: MAX_UINT64,
          gasPrice: MAX_INTEGER,
        },
        { common }
      )
    } catch (err: any) {
      st.ok(
        err.message.includes('gasLimit * gasPrice cannot exceed MAX_INTEGER'),
        'throws when gasLimit * gasPrice exceeds MAX_INTEGER'
      )
    }
    st.end()
  })

  t.throws(() => {
    const bytes = new Uint8Array(0)
    const address = new Uint8Array(0)
    const storageKeys = [new Uint8Array(0), new Uint8Array(0)]
    const aclBytes: AccessListBytesItem = [address, storageKeys]
    AccessListEIP2930Transaction.fromValuesArray(
      [bytes, bytes, bytes, bytes, bytes, bytes, bytes, [aclBytes], bytes],
      {}
    )
  }, 'should throw with values array with length different than 8 or 11')

  t.test('should return right upfront cost', (st) => {
    let tx = AccessListEIP2930Transaction.fromTxData(
      {
        data: hexStringToBytes('010200'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )
    // Cost should be:
    // Base fee + 2*TxDataNonZero + TxDataZero + AccessListAddressCost + AccessListSlotCost
    const txDataZero: number = Number(common.param('gasPrices', 'txDataZero'))
    const txDataNonZero: number = Number(common.param('gasPrices', 'txDataNonZero'))
    const accessListStorageKeyCost: number = Number(
      common.param('gasPrices', 'accessListStorageKeyCost')
    )
    const accessListAddressCost: number = Number(common.param('gasPrices', 'accessListAddressCost'))
    const baseFee: number = Number(common.param('gasPrices', 'tx'))
    const creationFee: number = Number(common.param('gasPrices', 'txCreation'))

    st.ok(
      tx.getBaseFee() ===
        BigInt(
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
        data: hexStringToBytes('010200'),
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )

    st.ok(
      tx.getBaseFee() ===
        BigInt(
          txDataNonZero * 2 +
            txDataZero +
            creationFee +
            baseFee +
            accessListAddressCost +
            accessListStorageKeyCost
        )
    )

    // Explicitly check that even if we have duplicates in our list, we still charge for those
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

    st.ok(
      tx.getBaseFee() === BigInt(baseFee + accessListAddressCost * 2 + accessListStorageKeyCost * 3)
    )

    st.end()
  })

  t.test('getUpfrontCost() -> should return upfront cost', function (st) {
    const tx = AccessListEIP2930Transaction.fromTxData(
      {
        gasPrice: 1000,
        gasLimit: 10000000,
        value: 42,
      },
      { common }
    )
    st.equal(tx.getUpfrontCost(), BigInt(10000000042))
    st.end()
  })

  t.test('unsigned tx -> getMessageToSign()', function (t) {
    const unsignedTx = AccessListEIP2930Transaction.fromTxData(
      {
        data: hexStringToBytes('010200'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common }
    )
    const expectedHash = hexStringToBytes(
      '78528e2724aa359c58c13e43a7c467eb721ce8d410c2a12ee62943a3aaefb60b'
    )
    t.deepEqual(unsignedTx.getMessageToSign(true), expectedHash), 'correct hashed version'

    const expectedSerialization = hexStringToBytes(
      '01f858018080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101'
    )
    t.deepEqual(
      unsignedTx.getMessageToSign(false),
      expectedSerialization,
      'correct serialized unhashed version'
    )

    t.end()
  })

  // Data from
  // https://github.com/INFURA/go-ethlibs/blob/75b2a52a39d353ed8206cffaf68d09bd1b154aae/eth/transaction_signing_test.go#L87

  t.test('should sign transaction correctly and return expected JSON', function (t) {
    const address = hexStringToBytes('0000000000000000000000000000000000001337')
    const slot1 = hexStringToBytes(
      '0000000000000000000000000000000000000000000000000000000000000000'
    )
    const txData = {
      data: hexStringToBytes(''),
      gasLimit: 0x62d4,
      gasPrice: 0x3b9aca00,
      nonce: 0x00,
      to: new Address(hexStringToBytes('df0a88b2b68c673713a8ec826003676f272e3573')),
      value: 0x01,
      chainId: bytesToBigInt(hexStringToBytes('796f6c6f763378')),
      accessList: <any>[[address, [slot1]]],
    }

    const customChainParams = {
      name: 'custom',
      chainId: txData.chainId,
      eips: [2718, 2929, 2930],
    }
    const usedCommon = Common.custom(customChainParams, {
      baseChain: Chain.Mainnet,
      hardfork: Hardfork.Berlin,
    })
    usedCommon.setEIPs([2718, 2929, 2930])

    const expectedUnsignedRaw = hexStringToBytes(
      '01f86587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a00000000000000000000000000000000000000000000000000000000000000000808080'
    )
    const pkey = hexStringToBytes(
      'fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19'
    )
    const expectedSigned = hexStringToBytes(
      '01f8a587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a0000000000000000000000000000000000000000000000000000000000000000080a0294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938da00be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d'
    )
    const expectedHash = hexStringToBytes(
      'bbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec'
    )
    const v = BigInt(0)
    const r = bytesToBigInt(
      hexStringToBytes('294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d')
    )
    const s = bytesToBigInt(
      hexStringToBytes('0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d')
    )

    const unsignedTx = AccessListEIP2930Transaction.fromTxData(txData, { common: usedCommon })

    const serializedMessageRaw = unsignedTx.serialize()

    t.ok(
      equalsBytes(expectedUnsignedRaw, serializedMessageRaw),
      'serialized unsigned message correct'
    )

    const signed = unsignedTx.sign(pkey)

    t.ok(v === signed.v!, 'v correct')
    t.ok(r === signed.r!, 'r correct')
    t.ok(s === signed.s!, 's correct')
    t.ok(equalsBytes(expectedSigned, signed.serialize()), 'serialized signed message correct')
    t.ok(equalsBytes(expectedHash, signed.hash()), 'hash correct')

    const expectedJSON = {
      type: '0x1',
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
      v: '0x0',
      r: '0x294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d',
      s: '0xbe950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
    }

    t.deepEqual(signed.toJSON(), expectedJSON)

    t.end()
  })

  t.test('freeze property propagates from unsigned tx to signed tx', function (st) {
    const tx = AccessListEIP2930Transaction.fromTxData({}, { freeze: false })
    st.notOk(Object.isFrozen(tx), 'tx object is not frozen')
    const signedTxn = tx.sign(pKey)
    st.notOk(Object.isFrozen(signedTxn), 'tx object is not frozen')
    st.end()
  })

  t.test('common propagates from the common of tx, not the common in TxOptions', function (st) {
    const txn = AccessListEIP2930Transaction.fromTxData({}, { common, freeze: false })
    const newCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [2537] })
    st.notDeepEqual(newCommon, common, 'new common is different than original common')
    Object.defineProperty(txn, 'common', {
      get() {
        return newCommon
      },
    })
    const signedTxn = txn.sign(pKey)
    st.ok(signedTxn.common.eips().includes(2537), 'signed tx common is taken from tx.common')
    st.end()
  })
})
