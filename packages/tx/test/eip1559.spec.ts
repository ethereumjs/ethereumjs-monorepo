import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { TWO_POW256, bytesToHex, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createFeeMarket1559Tx } from '../src/index.ts'

import { eip1559Data } from './testData/eip1559.ts' // Source: Besu

import { secp256k1 } from '@noble/curves/secp256k1.js'
import type { JSONTx } from '../src/index.ts'

const common = createCustomCommon({ chainId: 4 }, Mainnet)
common.setHardfork(Hardfork.London)

const validAddress = hexToBytes(`0x${'01'.repeat(20)}`)
const validSlot = hexToBytes(`0x${'01'.repeat(32)}`)
const chainId = BigInt(4)

describe('[FeeMarket1559Tx]', () => {
  it(`cannot input decimal or negative values`, () => {
    const values = [
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'chainId',
      'nonce',
      'gasLimit',
      'value',
      'v',
      'r',
      's',
    ]
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
            ((typeof testCase === 'number' && isNaN(testCase)) || testCase === false)
          )
        ) {
          txData[value] = testCase
          assert.throws(() => {
            createFeeMarket1559Tx(txData)
          })
        }
      }
    }
  })

  it('getUpfrontCost()', () => {
    const tx = createFeeMarket1559Tx(
      {
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 8,
        gasLimit: 100,
        value: 6,
      },
      { common },
    )
    assert.strictEqual(
      tx.getUpfrontCost(),
      BigInt(806),
      'correct upfront cost with default base fee',
    )
    let baseFee = BigInt(0)
    assert.strictEqual(
      tx.getUpfrontCost(baseFee),
      BigInt(806),
      'correct upfront cost with 0 base fee',
    )
    baseFee = BigInt(4)
    assert.strictEqual(
      tx.getUpfrontCost(baseFee),
      BigInt(1006),
      'correct upfront cost with cost-changing base fee value',
    )
  })

  it('getEffectivePriorityFee()', () => {
    const tx = createFeeMarket1559Tx(
      {
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 8,
      },
      { common },
    )
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(10)), BigInt(0))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(9)), BigInt(1))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(8)), BigInt(2))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(2)), BigInt(8))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(1)), BigInt(8))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(0)), BigInt(8))
    assert.throws(() => tx.getEffectivePriorityFee(BigInt(11)))
  })

  it('sign() - deterministic', () => {
    for (let index = 0; index < eip1559Data.length; index++) {
      const data = eip1559Data[index]
      const pkey = hexToBytes(data.privateKey)
      const txn = createFeeMarket1559Tx(data, { common })
      const signed = txn.sign(pkey, false)
      const rlpSerialized = RLP.encode(Uint8Array.from(signed.serialize()))
      assert.isTrue(
        equalsBytes(rlpSerialized, hexToBytes(data.signedTransactionRLP)),
        'Should sign txs correctly',
      )
    }
  })

  it('sign() - should create non-deterministic to hedged signatures if `extraEntropy=true` when signing', () => {
    const privKey = hexToBytes(eip1559Data[0].privateKey)
    const txn = createFeeMarket1559Tx({}, { common })
    // Verify 1000 signatures to ensure these have unique hashes (hedged signatures test)
    const hashSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const hash = bytesToHex(txn.sign(privKey, true).hash())
      if (hashSet.has(hash)) {
        assert.fail('should not reuse the same hash (hedged signature test)')
      }
      hashSet.add(hash)
    }
  })

  it('addSignature() -> correctly adds correct signature values', () => {
    const privKey = hexToBytes(eip1559Data[0].privateKey)
    const tx = createFeeMarket1559Tx({})
    const signedTx = tx.sign(privKey)
    const addSignatureTx = tx.addSignature(signedTx.v!, signedTx.r!, signedTx.s!)

    assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON())
  })

  it('addSignature() -> correctly converts raw ecrecover values', () => {
    const privKey = hexToBytes(eip1559Data[0].privateKey)
    const tx = createFeeMarket1559Tx({})

    const msgHash = tx.getHashedMessageToSign()
    // Use same options as Legacy.sign internally uses
    const signatureBytes = secp256k1.sign(msgHash, privKey, {
      extraEntropy: false,
      format: 'recovered',
      prehash: false,
    })
    const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

    if (recovery === undefined) {
      throw new Error('Invalid signature recovery')
    }

    const addSignatureTx = tx.addSignature(BigInt(recovery), r, s)
    // Sign separately to get a signed tx to compare with
    const signedTx = tx.sign(privKey)

    assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON())
  })

  it('addSignature() -> throws when adding the wrong v value', () => {
    const privKey = hexToBytes(eip1559Data[0].privateKey)
    const tx = createFeeMarket1559Tx({})

    const msgHash = tx.getHashedMessageToSign()
    // Must use format: 'recovered' to get 65-byte signature with recovery byte
    const signatureBytes = secp256k1.sign(msgHash, privKey, {
      format: 'recovered',
      prehash: false,
    })
    const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

    if (recovery === undefined) {
      throw new Error('Invalid signature recovery')
    }

    assert.throws(() => {
      // This will throw, since we now try to set either v=27 or v=28
      tx.addSignature(BigInt(recovery) + BigInt(27), r, s)
    })
  })

  it('hash()', () => {
    const data = eip1559Data[0]
    const pkey = hexToBytes(data.privateKey)
    let txn = createFeeMarket1559Tx(data, { common })
    let signed = txn.sign(pkey)
    const expectedHash = hexToBytes(
      '0x2e564c87eb4b40e7f469b2eec5aa5d18b0b46a24e8bf0919439cfb0e8fcae446',
    )
    assert.isTrue(
      equalsBytes(signed.hash(), expectedHash),
      'Should provide the correct hash when frozen',
    )
    txn = createFeeMarket1559Tx(data, {
      common,
      freeze: false,
    })
    signed = txn.sign(pkey)
    assert.isTrue(
      equalsBytes(signed.hash(), expectedHash),
      'Should provide the correct hash when not frozen',
    )
  })

  it('freeze property propagates from unsigned tx to signed tx', () => {
    const data = eip1559Data[0]
    const pkey = hexToBytes(data.privateKey)
    const txn = createFeeMarket1559Tx(data, {
      common,
      freeze: false,
    })
    assert.isNotFrozen(txn, 'tx object is not frozen')
    const signedTxn = txn.sign(pkey)
    assert.isNotFrozen(signedTxn, 'tx object is not frozen')
  })

  it('common propagates from the common of tx, not the common in TxOptions', () => {
    const data = eip1559Data[0]
    const pkey = hexToBytes(data.privateKey)
    const txn = createFeeMarket1559Tx(data, {
      common,
      freeze: false,
    })

    const newCommon = createCustomCommon({ chainId: 4 }, Mainnet)
    newCommon.setHardfork(Hardfork.Paris)

    assert.notDeepEqual(newCommon, common, 'new common is different than original common')
    Object.defineProperty(txn, 'common', {
      get() {
        return newCommon
      },
    })
    const signedTxn = txn.sign(pkey)
    assert.strictEqual(
      signedTxn.common.hardfork(),
      Hardfork.Paris,
      'signed tx common is taken from tx.common',
    )
  })

  it('unsigned tx -> getMessageToSign()/getHashedMessageToSign()', () => {
    const unsignedTx = createFeeMarket1559Tx(
      {
        data: hexToBytes('0x010200'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common },
    )
    const expectedHash = hexToBytes(
      '0xfa81814f7dd57bad435657a05eabdba2815f41e3f15ddd6139027e7db56b0dea',
    )
    assert.deepEqual(unsignedTx.getHashedMessageToSign(), expectedHash), 'correct hashed version'

    const expectedSerialization = hexToBytes(
      '0x02f85904808080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
    )
    assert.deepEqual(
      unsignedTx.getMessageToSign(),
      expectedSerialization,
      'correct serialized unhashed version',
    )
  })

  it('toJSON()', () => {
    const data = eip1559Data[0]
    const pkey = hexToBytes(data.privateKey)
    const txn = createFeeMarket1559Tx(data, { common })
    const signed = txn.sign(pkey)

    const json = signed.toJSON()
    const expectedJSON: JSONTx = {
      type: '0x2',
      chainId: '0x4',
      nonce: '0x333',
      maxPriorityFeePerGas: '0x1284d',
      maxFeePerGas: '0x1d97c',
      gasLimit: '0x8ae0',
      to: '0x000000000000000000000000000000000000aaaa',
      value: '0x2933bc9',
      data: '0x',
      accessList: [],
      v: '0x0',
      r: '0xf924cb68412c8f1cfd74d9b581c71eeaf94fff6abdde3e5b02ca6b2931dcf47',
      s: '0x7dd1c50027c3e31f8b565e25ce68a5072110f61fce5eee81b195dd51273c2f83',
      yParity: '0x0',
    }
    assert.deepEqual(json, expectedJSON, 'Should return expected JSON dict')
  })

  it('Fee validation', () => {
    assert.doesNotThrow(() => {
      createFeeMarket1559Tx(
        {
          maxFeePerGas: TWO_POW256 - BigInt(1),
          maxPriorityFeePerGas: 100,
          gasLimit: 1,
          value: 6,
        },
        { common },
      )
    }, 'fee can be 2^256 - 1')
    assert.throws(
      () => {
        createFeeMarket1559Tx(
          {
            maxFeePerGas: TWO_POW256 - BigInt(1),
            maxPriorityFeePerGas: 100,
            gasLimit: 100,
            value: 6,
          },
          { common },
        )
      },
      undefined,
      undefined,
      'fee must be less than 2^256',
    )
    assert.throws(
      () => {
        createFeeMarket1559Tx(
          {
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 2,
            gasLimit: 100,
            value: 6,
          },
          { common },
        )
      },
      undefined,
      undefined,
      'total fee must be the larger of the two',
    )
  })
})
