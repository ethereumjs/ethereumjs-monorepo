import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import {
  Address,
  MAX_INTEGER,
  MAX_UINT64,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  createAccessList2930Tx,
  createAccessList2930TxFromBytesArray,
  paramsTx,
} from '../src/index.ts'

import type { TxData } from '../src/2930/tx.ts'
import type { AccessListBytesItem, JSONTx } from '../src/index.ts'

const pKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.London,
  params: paramsTx,
})

const validAddress = hexToBytes(`0x${'01'.repeat(20)}`)
const validSlot = hexToBytes(`0x${'01'.repeat(32)}`)
const chainId = 1

describe('[AccessList2930Tx]', () => {
  it('Initialization', () => {
    const tx = createAccessList2930Tx({}, { common })
    assert.isDefined(
      createAccessList2930Tx(tx, { common }),
      'should initialize correctly from its own data',
    )

    const validAddress = hexToBytes(`0x${'01'.repeat(20)}`)
    const validSlot = hexToBytes(`0x${'01'.repeat(32)}`)
    const chainId = BigInt(1)
    try {
      createAccessList2930Tx(
        {
          data: hexToBytes('0x010200'),
          to: validAddress,
          accessList: [[validAddress, [validSlot]]],
          chainId,
          gasLimit: MAX_UINT64,
          gasPrice: MAX_INTEGER,
        },
        { common },
      )
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('gasLimit * gasPrice cannot exceed MAX_INTEGER') === true,
        'throws when gasLimit * gasPrice exceeds MAX_INTEGER',
      )
    }
  })

  it('createAccessList2930TxFromBytesArray() rejects wrong length', () => {
    assert.throws(
      () => {
        const bytes = new Uint8Array(0)
        const address = new Uint8Array(0)
        const storageKeys = [new Uint8Array(0), new Uint8Array(0)]
        const aclBytes: AccessListBytesItem = [address, storageKeys]
        createAccessList2930TxFromBytesArray(
          [bytes, bytes, bytes, bytes, bytes, bytes, bytes, [aclBytes], bytes],
          {},
        )
      },
      undefined,
      undefined,
      'should throw with values array with length different than 8 or 11',
    )
  })

  it('should return right upfront cost', () => {
    let tx = createAccessList2930Tx(
      {
        data: hexToBytes('0x010200'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common },
    )
    const txDataZero: number = Number(common.param('txDataZeroGas'))
    const txDataNonZero: number = Number(common.param('txDataNonZeroGas'))
    const accessListStorageKeyCost: number = Number(common.param('accessListStorageKeyGas'))
    const accessListAddressCost: number = Number(common.param('accessListAddressGas'))
    const baseFee: number = Number(common.param('txGas'))
    const creationFee: number = Number(common.param('txCreationGas'))

    assert.strictEqual(
      tx.getIntrinsicGas(),
      BigInt(
        txDataNonZero * 2 + txDataZero + baseFee + accessListAddressCost + accessListStorageKeyCost,
      ),
    )

    tx = createAccessList2930Tx(
      {
        data: hexToBytes('0x010200'),
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common },
    )

    assert.strictEqual(
      tx.getIntrinsicGas(),
      BigInt(
        txDataNonZero * 2 +
          txDataZero +
          creationFee +
          baseFee +
          accessListAddressCost +
          accessListStorageKeyCost,
      ),
    )

    tx = createAccessList2930Tx(
      {
        to: validAddress,
        accessList: [
          [validAddress, [validSlot]],
          [validAddress, [validSlot, validSlot]],
        ],
        chainId,
      },
      { common },
    )

    assert.strictEqual(
      tx.getIntrinsicGas(),
      BigInt(baseFee + accessListAddressCost * 2 + accessListStorageKeyCost * 3),
    )
  })

  it('getEffectivePriorityFee() -> should return correct values', () => {
    const tx = createAccessList2930Tx({
      gasPrice: BigInt(100),
    })

    assert.strictEqual(tx.getEffectivePriorityFee(), BigInt(100))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(20)), BigInt(80))
    assert.strictEqual(tx.getEffectivePriorityFee(BigInt(100)), BigInt(0))
    assert.throws(() => tx.getEffectivePriorityFee(BigInt(101)))
  })

  it('getUpfrontCost() -> should return upfront cost', () => {
    const tx = createAccessList2930Tx(
      {
        gasPrice: 1000,
        gasLimit: 10000000,
        value: 42,
      },
      { common },
    )
    assert.strictEqual(tx.getUpfrontCost(), BigInt(10000000042))
  })

  it('unsigned tx -> getHashedMessageToSign()/getMessageToSign()', () => {
    const unsignedTx = createAccessList2930Tx(
      {
        data: hexToBytes('0x010200'),
        to: validAddress,
        accessList: [[validAddress, [validSlot]]],
        chainId,
      },
      { common },
    )
    const expectedHash = hexToBytes(
      '0x78528e2724aa359c58c13e43a7c467eb721ce8d410c2a12ee62943a3aaefb60b',
    )
    assert.deepEqual(unsignedTx.getHashedMessageToSign(), expectedHash, 'correct hashed version')

    const expectedSerialization = hexToBytes(
      '0x01f858018080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
    )
    assert.deepEqual(
      unsignedTx.getMessageToSign(),
      expectedSerialization,
      'correct serialized unhashed version',
    )
  })

  it('should sign transaction correctly and return expected JSON', () => {
    const address = hexToBytes('0x0000000000000000000000000000000000001337')
    const slot1 = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')
    const txData: TxData = {
      data: hexToBytes('0x'),
      gasLimit: 0x62d4,
      gasPrice: 0x3b9aca00,
      nonce: 0x00,
      to: new Address(hexToBytes('0xdf0a88b2b68c673713a8ec826003676f272e3573')),
      value: 0x01,
      chainId: bytesToBigInt(hexToBytes('0x796f6c6f763378')),
      accessList: [[address, [slot1]]],
    }

    const customChainParams = {
      name: 'custom',
      chainId: txData.chainId!.toString(),
      eips: [2718, 2929, 2930],
    }
    const usedCommon = createCustomCommon(customChainParams, Mainnet, {
      hardfork: Hardfork.Berlin,
    })
    usedCommon.setEIPs([2718, 2929, 2930])

    const expectedUnsignedRaw = hexToBytes(
      '0x01f86587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a00000000000000000000000000000000000000000000000000000000000000000808080',
    )
    const pkey = hexToBytes('0xfad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19')
    const expectedSigned = hexToBytes(
      '0x01f8a587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a0000000000000000000000000000000000000000000000000000000000000000080a0294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938da00be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
    )
    const expectedHash = hexToBytes(
      '0xbbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec',
    )
    const v = BigInt(0)
    const r = bytesToBigInt(
      hexToBytes('0x294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d'),
    )
    const s = bytesToBigInt(
      hexToBytes('0x0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d'),
    )

    const unsignedTx = createAccessList2930Tx(txData, { common: usedCommon })

    const serializedMessageRaw = unsignedTx.serialize()

    assert.isTrue(
      equalsBytes(expectedUnsignedRaw, serializedMessageRaw),
      'serialized unsigned message correct',
    )

    const signed = unsignedTx.sign(pkey)

    assert.strictEqual(v, signed.v, 'v correct')
    assert.strictEqual(r, signed.r, 'r correct')
    assert.strictEqual(s, signed.s, 's correct')
    assert.isTrue(
      equalsBytes(expectedSigned, signed.serialize()),
      'serialized signed message correct',
    )
    assert.isTrue(equalsBytes(expectedHash, signed.hash()), 'hash correct')

    const expectedJSON: JSONTx = {
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
      yParity: '0x0',
    }

    assert.deepEqual(signed.toJSON(), expectedJSON)
  })

  it('sign() -> hedged signatures have unique hashes', () => {
    const tx = createAccessList2930Tx({}, { common })
    const hashSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const hash = bytesToHex(tx.sign(pKey, true).hash())
      if (hashSet.has(hash)) {
        assert.fail('should not reuse the same hash (hedged signature test)')
      }
      hashSet.add(hash)
    }
  })

  it('addSignature() -> correctly adds correct signature values', () => {
    const privateKey = pKey
    const tx = createAccessList2930Tx({})
    const signedTx = tx.sign(privateKey)
    const addSignatureTx = tx.addSignature(signedTx.v!, signedTx.r!, signedTx.s!)

    assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON())
  })

  it('addSignature() -> correctly converts raw ecrecover values', () => {
    const privKey = pKey
    const tx = createAccessList2930Tx({})

    const msgHash = tx.getHashedMessageToSign()
    const signatureBytes = secp256k1.sign(msgHash, privKey, {
      format: 'recovered',
      prehash: false,
    })
    const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

    const signedTx = tx.sign(privKey)
    const addSignatureTx = tx.addSignature(BigInt(recovery!), r, s)

    assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON())
  })

  it('addSignature() -> throws when adding the wrong v value', () => {
    const privKey = pKey
    const tx = createAccessList2930Tx({})

    const msgHash = tx.getHashedMessageToSign()
    const signatureBytes = secp256k1.sign(msgHash, privKey, {
      format: 'recovered',
      prehash: false,
    })

    const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

    assert.throws(() => {
      tx.addSignature(BigInt(recovery!) + BigInt(27), r, s)
    })
  })

  it('freeze property propagates from unsigned tx to signed tx', () => {
    const tx = createAccessList2930Tx({}, { freeze: false })
    assert.isNotFrozen(tx, 'tx object is not frozen')
    const signedTxn = tx.sign(pKey)
    assert.isNotFrozen(signedTxn, 'tx object is not frozen')
  })

  it('common propagates from the common of tx, not the common in TxOptions', () => {
    const txn = createAccessList2930Tx({}, { common, freeze: false })
    const newCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Paris })
    assert.notDeepEqual(newCommon, common, 'new common is different than original common')
    Object.defineProperty(txn, 'common', {
      get() {
        return newCommon
      },
    })
    const signedTxn = txn.sign(pKey)
    assert.strictEqual(
      signedTxn.common.hardfork(),
      Hardfork.Paris,
      'signed tx common is taken from tx.common',
    )
  })
})
