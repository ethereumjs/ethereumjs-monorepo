import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  MAX_INTEGER,
  MAX_UINT64,
  SECP256K1_ORDER,
  bytesToBigInt,
  equalsBytes,
  hexStringToBytes,
  privateToPublic,
  toBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  AccessListEIP2930Transaction,
  Capability,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
  TransactionType,
} from '../src/index.js'

import eip1559Fixtures from './json/eip1559txs.json'
import eip2930Fixtures from './json/eip2930txs.json'
import legacyFixtures from './json/txs.json'

import type { BaseTransaction } from '../src/baseTransaction.js'

describe('[BaseTransaction]', () => {
  // EIP-2930 is not enabled in Common by default (2021-03-06)
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

  const legacyTxs: BaseTransaction<TransactionType.Legacy>[] = []
  for (const tx of legacyFixtures.slice(0, 4)) {
    legacyTxs.push(LegacyTransaction.fromTxData(tx.data, { common }))
  }

  const eip2930Txs: BaseTransaction<TransactionType.AccessListEIP2930>[] = []
  for (const tx of eip2930Fixtures) {
    eip2930Txs.push(AccessListEIP2930Transaction.fromTxData(tx.data, { common }))
  }

  const eip1559Txs: BaseTransaction<TransactionType.FeeMarketEIP1559>[] = []
  for (const tx of eip1559Fixtures) {
    eip1559Txs.push(FeeMarketEIP1559Transaction.fromTxData(tx.data, { common }))
  }

  const zero = new Uint8Array(0)
  const txTypes = [
    {
      class: LegacyTransaction,
      name: 'LegacyTransaction',
      type: TransactionType.Legacy,
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
      type: TransactionType.AccessListEIP2930,
      values: [new Uint8Array([1])].concat(Array(7).fill(zero)),
      txs: eip2930Txs,
      fixtures: eip2930Fixtures,
      activeCapabilities: [Capability.EIP2718TypedTransaction, Capability.EIP2930AccessLists],
      notActiveCapabilities: [Capability.EIP1559FeeMarket, 9999],
    },
    {
      class: FeeMarketEIP1559Transaction,
      name: 'FeeMarketEIP1559Transaction',
      type: TransactionType.FeeMarketEIP1559,
      values: [new Uint8Array([1])].concat(Array(8).fill(zero)),
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

  it('Initialization', () => {
    for (const txType of txTypes) {
      let tx = txType.class.fromTxData({}, { common })
      assert.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )
      assert.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      const initCommon = new Common({
        chain: Chain.Mainnet,
        hardfork: Hardfork.London,
      })
      tx = txType.class.fromTxData({}, { common: initCommon })
      assert.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )

      initCommon.setHardfork(Hardfork.Byzantium)
      assert.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should stay on correct HF if outer common HF changes`
      )

      tx = txType.class.fromTxData({}, { common, freeze: false })
      assert.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      // Perform the same test as above, but now using a different construction method. This also implies that passing on the
      // options object works as expected.
      tx = txType.class.fromTxData({}, { common, freeze: false })
      const rlpData = tx.serialize()

      tx = txType.class.fromSerializedTx(rlpData, { common })
      assert.equal(
        tx.type,
        txType.type,
        `${txType.name}: fromSerializedTx() -> should initialize correctly`
      )

      assert.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromSerializedTx(rlpData, { common, freeze: false })
      assert.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      tx = txType.class.fromValuesArray(txType.values as any, { common })
      assert.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromValuesArray(txType.values as any, { common, freeze: false })
      assert.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )
    }
  })

  it('fromValuesArray()', () => {
    let rlpData: any = legacyTxs[0].raw()
    rlpData[0] = toBytes('0x0')
    try {
      LegacyTransaction.fromValuesArray(rlpData)
      assert.fail('should have thrown when nonce has leading zeroes')
    } catch (err: any) {
      assert.ok(
        err.message.includes('nonce cannot have leading zeroes'),
        'should throw with nonce with leading zeroes'
      )
    }
    rlpData[0] = toBytes('0x')
    rlpData[6] = toBytes('0x0')
    try {
      LegacyTransaction.fromValuesArray(rlpData)
      assert.fail('should have thrown when v has leading zeroes')
    } catch (err: any) {
      assert.ok(
        err.message.includes('v cannot have leading zeroes'),
        'should throw with v with leading zeroes'
      )
    }
    rlpData = eip2930Txs[0].raw()
    rlpData[3] = toBytes('0x0')
    try {
      AccessListEIP2930Transaction.fromValuesArray(rlpData)
      assert.fail('should have thrown when gasLimit has leading zeroes')
    } catch (err: any) {
      assert.ok(
        err.message.includes('gasLimit cannot have leading zeroes'),
        'should throw with gasLimit with leading zeroes'
      )
    }
    rlpData = eip1559Txs[0].raw()
    rlpData[2] = toBytes('0x0')
    try {
      FeeMarketEIP1559Transaction.fromValuesArray(rlpData)
      assert.fail('should have thrown when maxPriorityFeePerGas has leading zeroes')
    } catch (err: any) {
      assert.ok(
        err.message.includes('maxPriorityFeePerGas cannot have leading zeroes'),
        'should throw with maxPriorityFeePerGas with leading zeroes'
      )
    }
  })

  it('serialize()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
        assert.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
      }
    }
  })

  it('supports()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        for (const activeCapability of txType.activeCapabilities) {
          assert.ok(
            tx.supports(activeCapability),
            `${txType.name}: should recognize all supported capabilities`
          )
        }
        for (const notActiveCapability of txType.notActiveCapabilities) {
          assert.notOk(
            tx.supports(notActiveCapability),
            `${txType.name}: should reject non-active existing and not existing capabilities`
          )
        }
      }
    }
  })

  it('raw()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.ok(
          txType.class.fromValuesArray(tx.raw() as any, { common }),
          `${txType.name}: should do roundtrip raw() -> fromValuesArray()`
        )
      }
    }
  })

  it('verifySignature()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.equal(tx.verifySignature(), true, `${txType.name}: signature should be valid`)
      }
    }
  })

  it('verifySignature() -> invalid', () => {
    for (const txType of txTypes) {
      for (const txFixture of txType.fixtures.slice(0, 4)) {
        // set `s` to a single zero
        txFixture.data.s = '0x' + '0'
        const tx = txType.class.fromTxData((txFixture as any).data, { common })
        assert.equal(tx.verifySignature(), false, `${txType.name}: signature should not be valid`)
        assert.ok(
          (<string[]>tx.validate(true)).includes('Invalid Signature'),
          `${txType.name}: should return an error string about not verifying signatures`
        )
        assert.notOk(tx.validate(), `${txType.name}: should not validate correctly`)
      }
    }
  })

  it('sign()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          assert.ok(tx.sign(hexStringToBytes(privateKey)), `${txType.name}: should sign tx`)
        }

        assert.throws(
          () => tx.sign(utf8ToBytes('invalid')),
          undefined,
          undefined,
          `${txType.name}: should fail with invalid PK`
        )
      }
    }
  })

  it('isSigned() -> returns correct values', () => {
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
        assert.equal(
          tx.isSigned(),
          tx.v !== undefined && tx.r !== undefined && tx.s !== undefined,
          'isSigned() returns correctly'
        )
      }
    }
  })

  it('getSenderAddress()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey, sendersAddress } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexStringToBytes(privateKey))
          assert.equal(
            signedTx.getSenderAddress().toString(),
            `0x${sendersAddress}`,
            `${txType.name}: should get sender's address after signing it`
          )
        }
      }
    }
  })

  it('getSenderPublicKey()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexStringToBytes(privateKey))
          const txPubKey = signedTx.getSenderPublicKey()
          const pubKeyFromPriv = privateToPublic(hexStringToBytes(privateKey))
          assert.ok(
            equalsBytes(txPubKey, pubKeyFromPriv),
            `${txType.name}: should get sender's public key after signing it`
          )
        }
      }
    }
  })

  it('getSenderPublicKey() -> should throw if s-value is greater than secp256k1n/2', () => {
    // EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    // Reasoning: https://ethereum.stackexchange.com/a/55728
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          let signedTx = tx.sign(hexStringToBytes(privateKey))
          signedTx = JSON.parse(JSON.stringify(signedTx)) // deep clone
          ;(signedTx as any).s = SECP256K1_ORDER + BigInt(1)
          assert.throws(
            () => {
              signedTx.getSenderPublicKey()
            },
            undefined,
            undefined,
            'should throw when s-value is greater than secp256k1n/2'
          )
        }
      }
    }
  })

  it('verifySignature()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexStringToBytes(privateKey))
          assert.ok(signedTx.verifySignature(), `${txType.name}: should verify signing it`)
        }
      }
    }
  })

  it('initialization with defaults', () => {
    const bufferZero = toBytes('0x')
    const tx = LegacyTransaction.fromTxData({
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
    assert.equal(tx.v, undefined)
    assert.equal(tx.r, undefined)
    assert.equal(tx.s, undefined)
    assert.deepEqual(tx.to, undefined)
    assert.equal(tx.value, bytesToBigInt(bufferZero))
    assert.deepEqual(tx.data, bufferZero)
    assert.equal(tx.gasPrice, bytesToBigInt(bufferZero))
    assert.equal(tx.gasLimit, bytesToBigInt(bufferZero))
    assert.equal(tx.nonce, bytesToBigInt(bufferZero))
  })

  it('_validateCannotExceedMaxInteger()', () => {
    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559Txs[0])
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER }, 256, true)
    } catch (err: any) {
      assert.ok(
        err.message.includes('equal or exceed MAX_INTEGER'),
        'throws when value equals or exceeds MAX_INTEGER'
      )
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER + BigInt(1) }, 256, false)
    } catch (err: any) {
      assert.ok(err.message.includes('exceed MAX_INTEGER'), 'throws when value exceeds MAX_INTEGER')
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: BigInt(0) }, 100, false)
    } catch (err: any) {
      assert.ok(
        err.message.includes('unimplemented bits value'),
        'throws when bits value other than 64 or 256 provided'
      )
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 + BigInt(1) }, 64, false)
    } catch (err: any) {
      assert.ok(err.message.includes('2^64'), 'throws when 64 bit integer exceeds MAX_UINT64')
    }
    try {
      ;(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 }, 64, true)
    } catch (err: any) {
      assert.ok(
        err.message.includes('2^64'),
        'throws when 64 bit integer equals or exceeds MAX_UINT64'
      )
    }
  })
})
