import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  MAX_INTEGER,
  SECP256K1_ORDER,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  equalsBytes,
  hexToBytes,
  privateToPublic,
  utf8ToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  AccessList2930Tx,
  Blob4844Tx,
  Capability,
  EOACode7702Tx,
  FeeMarket1559Tx,
  LegacyTx,
  TransactionType,
  create1559FeeMarketTxFromBytesArray,
  createAccessList2930Tx,
  createAccessList2930TxFromBytesArray,
  createAccessList2930TxFromRLP,
  createBlob4844Tx,
  createBlob4844TxFromBytesArray,
  createBlob4844TxFromRLP,
  createEOACode7702Tx,
  createEOACode7702TxFromBytesArray,
  createEOACode7702TxFromRLP,
  createFeeMarket1559Tx,
  createFeeMarket1559TxFromRLP,
  createLegacyTx,
  createLegacyTxFromBytesArray,
  createLegacyTxFromRLP,
  paramsTx,
} from '../src/index.ts'

import { eip1559TxsData } from './testData/eip1559txs.ts'
import { eip2930TxsData } from './testData/eip2930txs.ts'
import { txsData } from './testData/txs.ts'
import {
  BLOB_VERSIONED_HASH_BYTES,
  INVALID_NUMERIC_INPUTS,
  MATRIX_PRIVATE_KEY,
  NEGATIVE_FEE_INPUTS,
  TEST_AUTHORIZATION_LIST_BYTES,
  TEST_RECIPIENT_BYTES,
  blobTxDefaults,
  cancunCommon,
  eoaCodeTxDefaults,
  londonCommon,
  pragueCommon,
  stubKzg,
} from './txTypeMatrix.ts'

import type { AccessList } from '../src/index.ts'
import type { AccessList2930TxData, FeeMarketEIP1559TxData, LegacyTxData } from '../src/index.ts'

const privateKeyHex = bytesToHex(MATRIX_PRIVATE_KEY).slice(2)

const blobTxData = {
  ...blobTxDefaults,
  chainId: 1,
  gasLimit: 21000,
  maxFeePerGas: 1,
  maxPriorityFeePerGas: 1,
  maxFeePerBlobGas: 1,
}
const blobSigned = createBlob4844Tx(blobTxData, { common: cancunCommon }).sign(MATRIX_PRIVATE_KEY)

const eoaTxData = {
  ...eoaCodeTxDefaults,
  chainId: 1,
  gasLimit: 21000,
  maxFeePerGas: 1,
  maxPriorityFeePerGas: 1,
}
const eoaSigned = createEOACode7702Tx(eoaTxData, { common: pragueCommon }).sign(MATRIX_PRIVATE_KEY)

const legacyTxs: LegacyTx[] = []
for (const tx of txsData.slice(0, 4)) {
  legacyTxs.push(createLegacyTx(tx.data as LegacyTxData, { common: londonCommon }))
}

const eip2930Txs: AccessList2930Tx[] = []
for (const tx of eip2930TxsData) {
  eip2930Txs.push(createAccessList2930Tx(tx.data as AccessList2930TxData, { common: londonCommon }))
}

const eip1559Txs: FeeMarket1559Tx[] = []
for (const tx of eip1559TxsData) {
  eip1559Txs.push(
    createFeeMarket1559Tx(tx.data as FeeMarketEIP1559TxData, { common: londonCommon }),
  )
}

const zero = new Uint8Array(0)
const validAddress = hexToBytes(`0x${'01'.repeat(20)}`)
const validSlot = hexToBytes(`0x${'01'.repeat(32)}`)

const txTypes = [
  {
    class: LegacyTx,
    name: 'LegacyTx',
    type: TransactionType.Legacy,
    eip2718: false,
    hasAccessList: false,
    common: londonCommon,
    txData: {},
    values: Array(6).fill(zero),
    txs: legacyTxs,
    fixtures: txsData,
    numericFields: ['gasPrice', 'gasLimit', 'nonce', 'value', 'v', 'r', 's'],
    feeFields: ['gasPrice', 'value', 'gasLimit'],
    activeCapabilities: [],
    create: {
      txData: createLegacyTx,
      rlp: createLegacyTxFromRLP,
      bytesArray: createLegacyTxFromBytesArray,
    },
    notActiveCapabilities: [
      Capability.EIP1559FeeMarket,
      Capability.EIP2718TypedTransaction,
      Capability.EIP2930AccessLists,
      Capability.EIP7702EOACode,
      9999,
    ],
  },
  {
    class: AccessList2930Tx,
    name: 'AccessList2930Tx',
    type: TransactionType.AccessListEIP2930,
    eip2718: true,
    hasAccessList: true,
    common: londonCommon,
    txData: {},
    values: [new Uint8Array([1])].concat(Array(7).fill(zero)),
    txs: eip2930Txs,
    fixtures: eip2930TxsData,
    numericFields: ['chainId', 'nonce', 'gasPrice', 'gasLimit', 'value', 'v', 'r', 's'],
    feeFields: ['gasPrice', 'value', 'gasLimit'],
    activeCapabilities: [Capability.EIP2718TypedTransaction, Capability.EIP2930AccessLists],
    create: {
      txData: createAccessList2930Tx,
      rlp: createAccessList2930TxFromRLP,
      bytesArray: createAccessList2930TxFromBytesArray,
    },
    notActiveCapabilities: [Capability.EIP1559FeeMarket, Capability.EIP7702EOACode, 9999],
  },
  {
    class: FeeMarket1559Tx,
    name: 'FeeMarket1559Tx',
    type: TransactionType.FeeMarketEIP1559,
    eip2718: true,
    hasAccessList: true,
    common: londonCommon,
    txData: {},
    values: [new Uint8Array([1])].concat(Array(8).fill(zero)),
    txs: eip1559Txs,
    fixtures: eip1559TxsData,
    numericFields: [
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'chainId',
      'nonce',
      'gasLimit',
      'value',
      'v',
      'r',
      's',
    ],
    feeFields: ['maxFeePerGas', 'maxPriorityFeePerGas', 'value', 'gasLimit'],
    activeCapabilities: [
      Capability.EIP1559FeeMarket,
      Capability.EIP2718TypedTransaction,
      Capability.EIP2930AccessLists,
    ],
    create: {
      txData: createFeeMarket1559Tx,
      rlp: createFeeMarket1559TxFromRLP,
      bytesArray: create1559FeeMarketTxFromBytesArray,
    },
    notActiveCapabilities: [Capability.EIP7702EOACode, 9999],
  },
  {
    class: Blob4844Tx,
    name: 'Blob4844Tx',
    type: TransactionType.BlobEIP4844,
    eip2718: true,
    hasAccessList: true,
    common: cancunCommon,
    txData: blobTxDefaults,
    values: [
      new Uint8Array([1]),
      zero,
      zero,
      zero,
      zero,
      TEST_RECIPIENT_BYTES,
      zero,
      zero,
      [],
      zero,
      [BLOB_VERSIONED_HASH_BYTES],
    ],
    txs: [blobSigned],
    fixtures: [
      {
        data: {
          ...blobTxData,
          v: blobSigned.v,
          r: blobSigned.r,
          s: blobSigned.s,
        },
        privateKey: privateKeyHex,
        sendersAddress: blobSigned.getSenderAddress().toString().slice(2),
      },
    ],
    numericFields: [
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'maxFeePerBlobGas',
      'chainId',
      'nonce',
      'gasLimit',
      'value',
      'v',
      'r',
      's',
    ],
    feeFields: ['maxFeePerGas', 'maxPriorityFeePerGas', 'maxFeePerBlobGas', 'value', 'gasLimit'],
    activeCapabilities: [
      Capability.EIP1559FeeMarket,
      Capability.EIP2718TypedTransaction,
      Capability.EIP2930AccessLists,
    ],
    create: {
      txData: createBlob4844Tx,
      rlp: createBlob4844TxFromRLP,
      bytesArray: createBlob4844TxFromBytesArray,
    },
    notActiveCapabilities: [Capability.EIP7702EOACode, 9999],
  },
  {
    class: EOACode7702Tx,
    name: 'EOACode7702Tx',
    type: TransactionType.EOACodeEIP7702,
    eip2718: true,
    hasAccessList: true,
    common: pragueCommon,
    txData: eoaCodeTxDefaults,
    values: [
      new Uint8Array([1]),
      zero,
      zero,
      zero,
      zero,
      TEST_RECIPIENT_BYTES,
      zero,
      zero,
      [],
      TEST_AUTHORIZATION_LIST_BYTES,
    ],
    txs: [eoaSigned],
    fixtures: [
      {
        data: {
          ...eoaTxData,
          v: eoaSigned.v,
          r: eoaSigned.r,
          s: eoaSigned.s,
        },
        privateKey: privateKeyHex,
        sendersAddress: eoaSigned.getSenderAddress().toString().slice(2),
      },
    ],
    numericFields: [
      'maxFeePerGas',
      'maxPriorityFeePerGas',
      'chainId',
      'nonce',
      'gasLimit',
      'value',
      'v',
      'r',
      's',
    ],
    feeFields: ['maxFeePerGas', 'maxPriorityFeePerGas', 'value', 'gasLimit'],
    activeCapabilities: [
      Capability.EIP1559FeeMarket,
      Capability.EIP2718TypedTransaction,
      Capability.EIP2930AccessLists,
      Capability.EIP7702EOACode,
    ],
    create: {
      txData: createEOACode7702Tx,
      rlp: createEOACode7702TxFromRLP,
      bytesArray: createEOACode7702TxFromBytesArray,
    },
    notActiveCapabilities: [9999],
  },
]

describe('[LegacyTx / AccessList2930Tx / FeeMarket1559Tx / Blob4844Tx / EOACode7702Tx]', () => {
  it('Initialization', () => {
    for (const txType of txTypes) {
      let tx = txType.create.txData(txType.txData, { common: txType.common })
      assert.strictEqual(
        tx.common.hardfork(),
        txType.common.hardfork(),
        `${txType.name}: should initialize with correct HF provided`,
      )
      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      const initCommon = txType.common.copy()
      tx = txType.create.txData(txType.txData, { common: initCommon })
      assert.strictEqual(
        tx.common.hardfork(),
        txType.common.hardfork(),
        `${txType.name}: should initialize with correct HF provided`,
      )

      initCommon.setHardfork(Hardfork.Byzantium)
      assert.strictEqual(
        tx.common.hardfork(),
        txType.common.hardfork(),
        `${txType.name}: should stay on correct HF if outer common HF changes`,
      )

      tx = txType.create.txData(txType.txData, { common: txType.common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )

      const params = JSON.parse(JSON.stringify(paramsTx))
      params['1']['txGas'] = 30000 // 21000
      tx = txType.create.txData(txType.txData, { common: txType.common, params })
      assert.strictEqual(
        tx.common.param('txGas'),
        BigInt(30000),
        'should use custom parameters provided',
      )

      tx = txType.create.txData(txType.txData, { common: txType.common, freeze: false })
      const rlpData = tx.serialize()

      tx = txType.create.rlp(rlpData, { common: txType.common })
      assert.strictEqual(
        tx.type,
        txType.type,
        `${txType.name}: fromSerializedTx() -> should initialize correctly`,
      )

      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      tx = txType.create.rlp(rlpData, { common: txType.common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )

      tx = txType.create.bytesArray(txType.values as any, { common: txType.common })
      assert.isFrozen(tx, `${txType.name}: tx should be frozen by default`)

      tx = txType.create.bytesArray(txType.values as any, { common: txType.common, freeze: false })
      assert.isNotFrozen(
        tx,
        `${txType.name}: tx should not be frozen when freeze deactivated in options`,
      )
    }
  })

  it('create*FromBytesArray() rejects leading zeroes', () => {
    let rlpData: any = legacyTxs[0].raw()
    rlpData[0] = hexToBytes('0x0')
    try {
      createLegacyTxFromBytesArray(rlpData)
      assert.fail('should have thrown when nonce has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('nonce cannot have leading zeroes'),
        'should throw with nonce with leading zeroes',
      )
    }
    rlpData[0] = hexToBytes('0x')
    rlpData[6] = hexToBytes('0x0')
    try {
      createLegacyTxFromBytesArray(rlpData)
      assert.fail('should have thrown when v has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('v cannot have leading zeroes'),
        'should throw with v with leading zeroes',
      )
    }
    rlpData = eip2930Txs[0].raw()
    rlpData[3] = hexToBytes('0x0')
    try {
      createAccessList2930TxFromBytesArray(rlpData)
      assert.fail('should have thrown when gasLimit has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('gasLimit cannot have leading zeroes'),
        'should throw with gasLimit with leading zeroes',
      )
    }
    rlpData = eip1559Txs[0].raw()
    rlpData[2] = hexToBytes('0x0')
    try {
      create1559FeeMarketTxFromBytesArray(rlpData)
      assert.fail('should have thrown when maxPriorityFeePerGas has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('maxPriorityFeePerGas cannot have leading zeroes'),
        'should throw with maxPriorityFeePerGas with leading zeroes',
      )
    }
    rlpData = blobSigned.raw()
    rlpData[9] = hexToBytes('0x0')
    try {
      createBlob4844TxFromBytesArray(rlpData, { common: cancunCommon })
      assert.fail('should have thrown when maxFeePerBlobGas has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('maxFeePerBlobGas cannot have leading zeroes'),
        'should throw with maxFeePerBlobGas with leading zeroes',
      )
    }
    rlpData = eoaSigned.raw()
    rlpData[2] = hexToBytes('0x0')
    try {
      createEOACode7702TxFromBytesArray(rlpData, { common: pragueCommon })
      assert.fail('should have thrown when maxPriorityFeePerGas has leading zeroes')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('maxPriorityFeePerGas cannot have leading zeroes'),
        'should throw with maxPriorityFeePerGas with leading zeroes',
      )
    }
  })

  it('Blob4844Tx rejects maxFeePerBlobGas above MAX_INTEGER', () => {
    try {
      createBlob4844Tx(
        { ...blobTxDefaults, maxFeePerBlobGas: MAX_INTEGER + 1n },
        { common: cancunCommon },
      )
      assert.fail('should have thrown when maxFeePerBlobGas exceeds MAX_INTEGER')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('maxFeePerBlobGas cannot exceed MAX_INTEGER'),
        'throws when maxFeePerBlobGas exceeds MAX_INTEGER',
      )
    }
  })

  it('cannot input decimal or negative values', () => {
    for (const txType of txTypes) {
      for (const field of txType.numericFields) {
        for (const testCase of INVALID_NUMERIC_INPUTS) {
          if (
            field === 'chainId' &&
            ((typeof testCase === 'number' && Number.isNaN(testCase)) || testCase === false)
          ) {
            continue
          }
          const txData: any = { ...txType.txData, [field]: testCase }
          assert.throws(
            () => {
              txType.create.txData(txData, { common: txType.common })
            },
            undefined,
            undefined,
            `${txType.name}: ${field} = ${String(testCase)}`,
          )
        }
      }
    }
  })

  it('rejects negative fee fields (does not wrap to a huge fee)', () => {
    for (const txType of txTypes) {
      for (const field of txType.feeFields) {
        for (const testCase of NEGATIVE_FEE_INPUTS) {
          const txData: any = { ...txType.txData, [field]: testCase }
          assert.throws(
            () => {
              txType.create.txData(txData, { common: txType.common })
            },
            undefined,
            undefined,
            `${txType.name}: ${field} must not accept ${String(testCase)}`,
          )
        }
      }
    }
  })

  it('Initialization / Getter -> typed tx fromTxData() guards', () => {
    for (const txType of txTypes) {
      if (!txType.eip2718) continue

      const unsupportedCommon = new Common({
        chain: Mainnet,
        hardfork: Hardfork.Istanbul,
        customCrypto: { kzg: stubKzg },
      })
      assert.throws(
        () => {
          txType.create.txData(txType.txData, { common: unsupportedCommon })
        },
        undefined,
        undefined,
        `should throw on a pre-Berlin Hardfork (${txType.name})`,
      )

      assert.throws(
        () => {
          txType.create.txData({ ...txType.txData, chainId: 2 }, { common: txType.common })
        },
        undefined,
        undefined,
        `should reject transactions with wrong chain ID (${txType.name})`,
      )

      assert.throws(
        () => {
          txType.create.txData({ ...txType.txData, v: 2 }, { common: txType.common })
        },
        undefined,
        undefined,
        `should reject transactions with invalid yParity (v) values (${txType.name})`,
      )
    }
  })

  it('Initialization / Getter -> fromSerializedTx() error cases', () => {
    for (const txType of txTypes) {
      if (!txType.eip2718) continue

      try {
        txType.create.rlp(new Uint8Array([99]), { common: txType.common })
      } catch (e: any) {
        assert.isTrue(
          e.message.includes('wrong tx type') === true,
          `should throw on wrong tx type (${txType.name})`,
        )
      }

      try {
        const serialized = concatBytes(new Uint8Array([txType.type]), new Uint8Array([5]))
        txType.create.rlp(serialized, { common: txType.common })
      } catch (e: any) {
        assert.isTrue(
          e.message.includes('must be array') === true,
          `should throw when RLP payload not an array (${txType.name})`,
        )
      }

      try {
        const serialized = concatBytes(new Uint8Array([txType.type]), hexToBytes('0xc0'))
        txType.create.rlp(serialized, { common: txType.common })
      } catch (e: any) {
        assert.isTrue(
          e.message.includes('values (for unsigned tx)'),
          `should throw with invalid number of values (${txType.name})`,
        )
      }
    }
  })

  it('Access Lists -> success cases', () => {
    const access: AccessList = [
      {
        address: bytesToHex(validAddress),
        storageKeys: [bytesToHex(validSlot)],
      },
    ]
    for (const txType of txTypes) {
      if (!txType.hasAccessList) continue

      const txn = txType.create.txData(
        {
          ...txType.txData,
          accessList: access,
          chainId: 1,
        },
        { common: txType.common },
      )
      if (!('accessList' in txn)) continue

      const bytes = txn.accessList
      const JSON = txn.toJSON().accessList

      assert.isTrue(equalsBytes(bytes[0][0], validAddress))
      assert.isTrue(equalsBytes(bytes[0][1][0], validSlot))
      assert.deepEqual(JSON, access, `should allow json-typed access lists (${txType.name})`)

      const txnRaw = txType.create.txData(
        {
          ...txType.txData,
          accessList: bytes,
          chainId: 1,
        },
        { common: txType.common },
      )
      assert.deepEqual(
        txnRaw.toJSON().accessList,
        access,
        `should allow bytes-typed access lists (${txType.name})`,
      )
    }
  })

  it('Access Lists -> error cases', () => {
    for (const txType of txTypes) {
      if (!txType.hasAccessList) continue

      const invalidLists: any[] = [
        [[hexToBytes(`0x${'01'.repeat(21)}`), []]],
        [[validAddress, [hexToBytes(`0x${'01'.repeat(31)}`)]]],
        [[]],
        [[validAddress]],
        [[validAddress, validSlot]],
        [[validAddress, [], []]],
      ]
      for (const accessList of invalidLists) {
        assert.throws(
          () => {
            txType.create.txData(
              { ...txType.txData, chainId: 1, accessList },
              { common: txType.common },
            )
          },
          undefined,
          undefined,
          txType.name,
        )
      }
    }
  })

  it('serialize()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.isDefined(
          txType.create.rlp(tx.serialize(), { common: txType.common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`,
        )
      }
    }
  })

  it('supports()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        for (const activeCapability of txType.activeCapabilities) {
          assert.isDefined(
            tx.supports(activeCapability),
            `${txType.name}: should recognize all supported capabilities`,
          )
        }
        for (const notActiveCapability of txType.notActiveCapabilities) {
          assert.isFalse(
            tx.supports(notActiveCapability),
            `${txType.name}: should reject non-active existing and not existing capabilities`,
          )
        }
      }
    }
  })

  it('raw()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.isDefined(
          txType.create.bytesArray(tx.raw() as any, { common: txType.common }),
          `${txType.name}: should do roundtrip raw() -> create*FromBytesArray()`,
        )
      }
    }
  })

  it('verifySignature()', () => {
    for (const txType of txTypes) {
      for (const tx of txType.txs) {
        assert.strictEqual(tx.verifySignature(), true, `${txType.name}: signature should be valid`)
      }
    }
  })

  it('verifySignature() -> invalid', () => {
    for (const txType of txTypes) {
      for (const txFixture of txType.fixtures.slice(0, 4)) {
        const data = { ...txFixture.data, s: '0x0' }
        const tx = txType.create.txData(data as any, { common: txType.common })
        assert.strictEqual(
          tx.verifySignature(),
          false,
          `${txType.name}: signature should not be valid`,
        )
        assert.include(
          tx.getValidationErrors(),
          'Invalid Signature',
          `${txType.name}: should return an error string about not verifying signatures`,
        )
        assert.isFalse(tx.isValid(), `${txType.name}: should not validate correctly`)
      }
    }
  })

  it('sign()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          assert.isDefined(tx.sign(hexToBytes(`0x${privateKey}`)), `${txType.name}: should sign tx`)
        }

        assert.throws(
          () => tx.sign(utf8ToBytes('invalid')),
          undefined,
          undefined,
          `${txType.name}: should fail with invalid PK`,
        )
      }
    }
  })

  it('hash() throws on unsigned tx', () => {
    for (const txType of txTypes) {
      const tx = txType.create.txData(txType.txData, { common: txType.common })
      assert.throws(
        () => {
          tx.hash()
        },
        undefined,
        undefined,
        `should throw calling hash with unsigned tx (${txType.name})`,
      )
      assert.throws(() => {
        tx.getSenderPublicKey()
      })
    }
  })

  it('isSigned() -> returns correct values', () => {
    for (const txType of txTypes) {
      const txs = [
        ...txType.txs,
        ...txType.txs.map((tx) =>
          // Matrix `create.txData` is a union of factories; a live tx spread is TxData at runtime.
          txType.create.txData(
            {
              ...tx,
              v: undefined,
              r: undefined,
              s: undefined,
            } as never,
            { common: txType.common },
          ),
        ),
      ]
      for (const tx of txs) {
        assert.strictEqual(
          tx.isSigned(),
          tx.v !== undefined && tx.r !== undefined && tx.s !== undefined,
          'isSigned() returns correctly',
        )
      }
    }
  })

  it('getSenderAddress()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey, sendersAddress } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          assert.strictEqual(
            signedTx.getSenderAddress().toString(),
            `0x${sendersAddress}`,
            `${txType.name}: should get sender's address after signing it`,
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
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          const txPubKey = signedTx.getSenderPublicKey()
          const pubKeyFromPriv = privateToPublic(hexToBytes(`0x${privateKey}`))
          assert.isTrue(
            equalsBytes(txPubKey, pubKeyFromPriv),
            `${txType.name}: should get sender's public key after signing it`,
          )
        }
      }
    }
  })

  it('getSenderPublicKey() -> should throw if s-value is greater than secp256k1n/2', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          const mutated = Object.assign(Object.create(Object.getPrototypeOf(signedTx)), signedTx, {
            s: SECP256K1_ORDER + BigInt(1),
          })
          assert.throws(
            () => {
              mutated.getSenderPublicKey()
            },
            undefined,
            undefined,
            'should throw when s-value is greater than secp256k1n/2',
          )
        }
      }
    }
  })

  it('verifySignature() after sign()', () => {
    for (const txType of txTypes) {
      for (const [i, tx] of txType.txs.entries()) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey !== undefined) {
          const signedTx = tx.sign(hexToBytes(`0x${privateKey}`))
          assert.isTrue(signedTx.verifySignature(), `${txType.name}: should verify signing it`)
        }
      }
    }
  })

  it('getDataGas()', () => {
    for (const txType of txTypes) {
      const frozen = txType.create.txData(txType.txData, { common: txType.common })
      const unfrozen = txType.create.txData(txType.txData, { common: txType.common, freeze: false })
      assert.strictEqual(
        frozen.getDataGas(),
        unfrozen.getDataGas(),
        `${txType.name}: frozen and unfrozen txs should report the same data gas`,
      )
    }
  })

  it('initialization with defaults', () => {
    const bufferZero = hexToBytes('0x')
    const tx = createLegacyTx({
      nonce: undefined,
      gasLimit: undefined,
      gasPrice: undefined,
      to: undefined,
      value: undefined,
      data: undefined,
      v: undefined,
      r: undefined,
      s: undefined,
    })
    assert.strictEqual(tx.v, undefined)
    assert.strictEqual(tx.r, undefined)
    assert.strictEqual(tx.s, undefined)
    assert.deepEqual(tx.to, undefined)
    assert.strictEqual(tx.value, bytesToBigInt(bufferZero))
    assert.deepEqual(tx.data, bufferZero)
    assert.strictEqual(tx.gasPrice, bytesToBigInt(bufferZero))
    assert.strictEqual(tx.gasLimit, bytesToBigInt(bufferZero))
    assert.strictEqual(tx.nonce, bytesToBigInt(bufferZero))
  })
})
