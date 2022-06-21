import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import {
  Transaction,
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Capability,
} from '../src'
import { TxsJsonEntry } from './types'
import { BaseTransaction } from '../src/baseTransaction'
import {
  privateToPublic,
  toBuffer,
  MAX_INTEGER,
  MAX_UINT64,
  SECP256K1_ORDER,
  bufferToBigInt,
} from '@ethereumjs/util'

tape('[BaseTransaction]', function (t) {
  // EIP-2930 is not enabled in Common by default (2021-03-06)
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

  const legacyFixtures: TxsJsonEntry[] = require('./json/txs.json')
  const legacyTxs: BaseTransaction<Transaction>[] = []
  legacyFixtures.slice(0, 4).forEach(function (tx: TxsJsonEntry) {
    legacyTxs.push(Transaction.fromTxData(tx.data, { common }))
  })

  const eip2930Fixtures = require('./json/eip2930txs.json')
  const eip2930Txs: BaseTransaction<AccessListEIP2930Transaction>[] = []
  eip2930Fixtures.forEach(function (tx: any) {
    eip2930Txs.push(AccessListEIP2930Transaction.fromTxData(tx.data, { common }))
  })

  const eip1559Fixtures = require('./json/eip1559txs.json')
  const eip1559Txs: BaseTransaction<FeeMarketEIP1559Transaction>[] = []
  eip1559Fixtures.forEach(function (tx: any) {
    eip1559Txs.push(FeeMarketEIP1559Transaction.fromTxData(tx.data, { common }))
  })

  const zero = Buffer.alloc(0)
  const txTypes = [
    {
      class: Transaction,
      name: 'Transaction',
      type: 0,
      values: Array(6).fill(zero),
      txs: legacyTxs,
      fixtures: legacyFixtures,
      activeCapabilities: [],
      notActiveCapabilities: [
        Capability.EIP1559FeeMarket,
        Capability.EIP2718TypedTransaction,
        Capability.EIP2930AccessLists,
        9999,
      ],
    },
    {
      class: AccessListEIP2930Transaction,
      name: 'AccessListEIP2930Transaction',
      type: 1,
      values: [Buffer.from([1])].concat(Array(7).fill(zero)),
      txs: eip2930Txs,
      fixtures: eip2930Fixtures,
      activeCapabilities: [Capability.EIP2718TypedTransaction, Capability.EIP2930AccessLists],
      notActiveCapabilities: [Capability.EIP1559FeeMarket, 9999],
    },
    {
      class: FeeMarketEIP1559Transaction,
      name: 'FeeMarketEIP1559Transaction',
      type: 2,
      values: [Buffer.from([1])].concat(Array(8).fill(zero)),
      txs: eip1559Txs,
      fixtures: eip1559Fixtures,
      activeCapabilities: [
        Capability.EIP1559FeeMarket,
        Capability.EIP2718TypedTransaction,
        Capability.EIP2930AccessLists,
      ],
      notActiveCapabilities: [9999],
    },
  ]

  t.test('Initialization', function (st) {
    for (const txType of txTypes) {
      let tx = txType.class.fromTxData({}, { common })
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      const initCommon = new Common({
        chain: Chain.Mainnet,
        hardfork: Hardfork.London,
      })
      tx = txType.class.fromTxData({}, { common: initCommon })
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )

      initCommon.setHardfork(Hardfork.Byzantium)
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should stay on correct HF if outer common HF changes`
      )

      tx = txType.class.fromTxData({}, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      // Perform the same test as above, but now using a different construction method. This also implies that passing on the
      // options object works as expected.
      tx = txType.class.fromTxData({}, { common, freeze: false })
      const rlpData = tx.serialize()

      tx = txType.class.fromSerializedTx(rlpData, { common })
      st.equal(
        tx.type,
        txType.type,
        `${txType.name}: fromSerializedTx() -> should initialize correctly`
      )

      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromSerializedTx(rlpData, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      tx = txType.class.fromValuesArray(txType.values as any, { common })
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromValuesArray(txType.values as any, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )
    }
    st.end()
  })

  t.test('fromValuesArray()', function (st) {
    let rlpData: any = legacyTxs[0].raw()
    rlpData[0] = toBuffer('0x0')
    try {
      Transaction.fromValuesArray(rlpData)
      st.fail('should have thrown when nonce has leading zeroes')
    } catch (err: any) {
      st.ok(
        err.message.includes('nonce cannot have leading zeroes'),
        'should throw with nonce with leading zeroes'
      )
    }
    rlpData[0] = toBuffer('0x')
    rlpData[6] = toBuffer('0x0')
    try {
      Transaction.fromValuesArray(rlpData)
      st.fail('should have thrown when v has leading zeroes')
    } catch (err: any) {
      st.ok(
        err.message.includes('v cannot have leading zeroes'),
        'should throw with v with leading zeroes'
      )
    }
    rlpData = eip2930Txs[0].raw()
    rlpData[3] = toBuffer('0x0')
    try {
      AccessListEIP2930Transaction.fromValuesArray(rlpData)
      st.fail('should have thrown when gasLimit has leading zeroes')
    } catch (err: any) {
      st.ok(
        err.message.includes('gasLimit cannot have leading zeroes'),
        'should throw with gasLimit with leading zeroes'
      )
    }
    rlpData = eip1559Txs[0].raw()
    rlpData[2] = toBuffer('0x0')
    try {
      FeeMarketEIP1559Transaction.fromValuesArray(rlpData)
      st.fail('should have thrown when maxPriorityFeePerGas has leading zeroes')
    } catch (err: any) {
      st.ok(
        err.message.includes('maxPriorityFeePerGas cannot have leading zeroes'),
        'should throw with maxPriorityFeePerGas with leading zeroes'
      )
    }
    st.end()
  })

  t.test('serialize()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
        st.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
      })
    }
    st.end()
  })

  t.test('supports()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        for (const activeCapability of txType.activeCapabilities) {
          st.ok(
            tx.supports(activeCapability),
            `${txType.name}: should recognize all supported capabilities`
          )
        }
        for (const notActiveCapability of txType.notActiveCapabilities) {
          st.notOk(
            tx.supports(notActiveCapability),
            `${txType.name}: should reject non-active existing and not existing capabilities`
          )
        }
      })
    }
    st.end()
  })

  t.test('raw()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.ok(
          txType.class.fromValuesArray(tx.raw(), { common }),
          `${txType.name}: should do roundtrip raw() -> fromValuesArray()`
        )
      })
    }
    st.end()
  })

  t.test('verifySignature()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.equal(tx.verifySignature(), true, `${txType.name}: signature should be valid`)
      })
    }
    st.end()
  })

  t.test('verifySignature() -> invalid', function (st) {
    for (const txType of txTypes) {
      txType.fixtures.slice(0, 4).forEach(function (txFixture: any) {
        // set `s` to a single zero
        txFixture.data.s = '0x' + '0'
        const tx = txType.class.fromTxData(txFixture.data, { common })
        st.equal(tx.verifySignature(), false, `${txType.name}: signature should not be valid`)
        st.ok(
          (<string[]>tx.validate(true)).includes('Invalid Signature'),
          `${txType.name}: should return an error string about not verifying signatures`
        )
        st.notOk(tx.validate(), `${txType.name}: should not validate correctly`)
      })
    }
    st.end()
  })

  t.test('sign()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          st.ok(tx.sign(Buffer.from(privateKey, 'hex')), `${txType.name}: should sign tx`)
        }

        st.throws(
          () => tx.sign(Buffer.from('invalid')),
          `${txType.name}: should fail with invalid PK`
        )
      })
    }
    st.end()
  })

  t.test('isSigned() -> returns correct values', function (st) {
    for (const txType of txTypes) {
      const txs = [
        ...txType.txs,
        // add unsigned variants
        ...txType.txs.map((tx) =>
          txType.class.fromTxData({
            ...tx,
            v: undefined,
            r: undefined,
            s: undefined,
          })
        ),
      ]
      for (const tx of txs) {
        st.equal(
          tx.isSigned(),
          tx.v !== undefined && tx.r !== undefined && tx.s !== undefined,
          'isSigned() returns correctly'
        )
      }
    }
    st.end()
  })

  t.test('getSenderAddress()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey, sendersAddress } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          st.equal(
            signedTx.getSenderAddress().toString(),
            `0x${sendersAddress}`,
            `${txType.name}: should get sender's address after signing it`
          )
        }
      })
    }
    st.end()
  })

  t.test('getSenderPublicKey()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          const txPubKey = signedTx.getSenderPublicKey()
          const pubKeyFromPriv = privateToPublic(Buffer.from(privateKey, 'hex'))
          st.ok(
            txPubKey.equals(pubKeyFromPriv),
            `${txType.name}: should get sender's public key after signing it`
          )
        }
      })
    }
    st.end()
  })

  t.test(
    'getSenderPublicKey() -> should throw if s-value is greater than secp256k1n/2',
    function (st) {
      // EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
      // Reasoning: https://ethereum.stackexchange.com/a/55728
      for (const txType of txTypes) {
        txType.txs.forEach(function (tx: any, i: number) {
          const { privateKey } = txType.fixtures[i]
          if (privateKey) {
            let signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
            signedTx = JSON.parse(JSON.stringify(signedTx)) // deep clone
            ;(signedTx as any).s = SECP256K1_ORDER + BigInt(1)
            st.throws(() => {
              signedTx.getSenderPublicKey()
            }, 'should throw when s-value is greater than secp256k1n/2')
          }
        })
      }
      st.end()
    }
  )

  t.test('verifySignature()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          st.ok(signedTx.verifySignature(), `${txType.name}: should verify signing it`)
        }
      })
    }
    st.end()
  })

  t.test('initialization with defaults', function (st) {
    const bufferZero = toBuffer('0x')
    const tx = Transaction.fromTxData({
      nonce: '',
      gasLimit: '',
      gasPrice: '',
      to: '',
      value: '',
      data: '',
      v: '',
      r: '',
      s: '',
    })
    st.equal(tx.v, undefined)
    st.equal(tx.r, undefined)
    st.equal(tx.s, undefined)
    st.isEquivalent(tx.to, undefined)
    st.isEquivalent(tx.value, bufferToBigInt(bufferZero))
    st.isEquivalent(tx.data, bufferZero)
    st.isEquivalent(tx.gasPrice, bufferToBigInt(bufferZero))
    st.isEquivalent(tx.gasLimit, bufferToBigInt(bufferZero))
    st.isEquivalent(tx.nonce, bufferToBigInt(bufferZero))

    st.end()
  })

  t.test('_validateCannotExceedMaxInteger()', function (st) {
    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559Txs[0])
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER }, 256, true)
    } catch (err: any) {
      st.ok(
        err.message.includes('equal or exceed MAX_INTEGER'),
        'throws when value equals or exceeds MAX_INTEGER'
      )
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER + BigInt(1) }, 256, false)
    } catch (err: any) {
      st.ok(err.message.includes('exceed MAX_INTEGER'), 'throws when value exceeds MAX_INTEGER')
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: BigInt(0) }, 100, false)
    } catch (err: any) {
      st.ok(
        err.message.includes('unimplemented bits value'),
        'throws when bits value other than 64 or 256 provided'
      )
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 + BigInt(1) }, 64, false)
    } catch (err: any) {
      st.ok(err.message.includes('2^64'), 'throws when 64 bit integer exceeds MAX_UINT64')
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 }, 64, true)
    } catch (err: any) {
      st.ok(err.message.includes('2^64'), 'throws when 64 bit integer equals or exceeds MAX_UINT64')
    }
    st.end()
  })
})
