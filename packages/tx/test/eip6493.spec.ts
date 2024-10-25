import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { bytesToHex, hexToBytes, ssz } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import {
  AccessListEIP2930Transaction,
  BlobEIP4844Transaction,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
  toPayloadJson,
} from '../src/index.js'
import { createTx, createTxFromExecutionPayloadTx } from '../src/transactionFactory.js'

import type { Kzg } from '@ethereumjs/util'
function getLegacyTestCaseData() {
  const txData = {
    type: '0x0',
    nonce: '0x0',
    to: null,
    gasLimit: '0x3d090',
    gasPrice: '0xe8d4a51000',
    maxPriorityFeePerGas: null,
    maxFeePerGas: null,
    value: '0x0',
    data: '0x60608060095f395ff33373fffffffffffffffffffffffffffffffffffffffe1460575767ffffffffffffffff5f3511605357600143035f3511604b575f35612000014311604b57611fff5f3516545f5260205ff35b5f5f5260205ff35b5f5ffd5b5f35600143035500',
    v: '0x1b',
    r: '0x539',
    s: '0x1b9b6eb1f0',
  }

  return [
    txData,
    // hash
    '0xe43ec833884324f31c2e8314534d5b15233d84f32f05a05ea2a45649b587a9df',
    // sender
    '0x72eed28860ac985f1ec32306564b5926ea7c0b70',
    // no special common required
    undefined,
  ]
}

function get2930TestCaseData() {
  const txData = {
    type: '0x01',
    data: '0x',
    gasLimit: 0x62d4,
    gasPrice: 0x3b9aca00,
    nonce: 0x00,
    to: '0xdf0a88b2b68c673713a8ec826003676f272e3573',
    value: 0x01,
    chainId: '0x796f6c6f763378',
    accessList: <any>[
      [
        hexToBytes('0x0000000000000000000000000000000000001337'),
        [hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')],
      ],
    ],
    v: '0x0',
    r: '0x294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d',
    s: '0x0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
  }

  const customChainParams = {
    name: 'custom',
    chainId: txData.chainId,
    eips: [2930],
  }
  const usedCommon = createCustomCommon(customChainParams, Mainnet, {
    hardfork: Hardfork.Berlin,
  })
  usedCommon.setEIPs([2930])

  return [
    txData,
    // hash
    '0xbbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec',
    // sender
    '0x96216849c49358b10257cb55b28ea603c874b05e',
    // 2930 common
    usedCommon,
  ]
}

function get1559TestCaseData() {
  const txData = {
    type: '0x02',
    data: '0x',
    gasLimit: 0x62d4,
    maxFeesPerGas: 0x3b9aca00,
    maxPriorityFeesPerGas: 0x1b9aca00,
    nonce: 0x00,
    to: '0xdf0a88b2b68c673713a8ec826003676f272e3573',
    value: 0x01,
    chainId: '0x796f6c6f763378',
    accessList: <any>[
      [
        hexToBytes('0x0000000000000000000000000000000000001337'),
        [hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')],
      ],
    ],
    v: '0x0',
    r: '0x294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d',
    s: '0x0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
  }

  const customChainParams = {
    name: 'custom',
    chainId: txData.chainId,
    eips: [1559],
  }
  const usedCommon = createCustomCommon(customChainParams, Mainnet, {
    hardfork: Hardfork.Berlin,
  })
  usedCommon.setEIPs([1559])

  return [
    txData,
    // hash
    '0x1390bffdfec7959c976754e55b1849dd7cbbdca78068cc544f2c8e8e8fe3bd8e',
    // sender
    '0xdcf0e8f6d5c3876912db8e06e2a690b99004b798',
    // 1559 common
    usedCommon,
  ]
}

function get4844TestCaseData(kzg: Kzg) {
  const txData = {
    type: '0x3',
    nonce: '0x0',
    gasPrice: null,
    maxPriorityFeePerGas: '0x12a05f200',
    maxFeePerGas: '0x12a05f200',
    gasLimit: '0x33450',
    value: '0xbc614e',
    data: '0x',
    v: '0x0',
    r: '0x8a83833ec07806485a4ded33f24f5cea4b8d4d24dc8f357e6d446bcdae5e58a7',
    s: '0x68a2ba422a50cf84c0b5fcbda32ee142196910c97198ffd99035d920c2b557f8',
    to: '0xffb38a7a99e3e2335be83fc74b7faa19d5531243',
    chainId: '0x28757b3',
    accessList: null,
    maxFeePerBlobGas: '0xb2d05e00',
    blobVersionedHashes: ['0x01b0a4cdd5f55589f5c5b4d46c76704bb6ce95c0a8c09f77f197a57808dded28'],
  }

  const customChainParams = {
    name: 'custom',
    chainId: txData.chainId,
    eips: [4844],
  }
  const usedCommon = createCustomCommon(customChainParams, Mainnet, {
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })
  usedCommon.setEIPs([4844])

  return [
    txData,
    // hash
    '0xe5e02be0667b6d31895d1b5a8b916a6761cbc9865225c6144a3e2c50936d173e',
    // sender
    '0xa95d8b63835662e0d6fb0fb096994e2897072e2a',
    // 4844 common
    usedCommon,
  ]
}

describe('ssz <> rlp converstion', async () => {
  const kzg = await loadKZG()

  const testCases = [
    ['LegacyTransaction', LegacyTransaction, ssz.ReplayableTransaction, ...getLegacyTestCaseData()],
    [
      'AccessListEIP2930Transaction',
      AccessListEIP2930Transaction,
      ssz.Eip2930Transaction,
      ...get2930TestCaseData(),
    ],
    [
      'FeeMarketEIP1559Transaction',
      FeeMarketEIP1559Transaction,
      ssz.Eip1559Transaction,
      ...get1559TestCaseData(),
    ],
    [
      'BlobEIP4844Transaction',
      BlobEIP4844Transaction,
      ssz.Eip4844Transaction,
      ...get4844TestCaseData(kzg),
    ],
  ]

  for (const [txTypeName, _txType, sszType, txData, txHash, txSender, common] of testCases) {
    it(`${txTypeName}`, () => {
      const origTx = createTx(txData, { common })
      const calTxHash = bytesToHex(origTx.hash())
      assert.equal(calTxHash, txHash, 'transaction should be correctly loaded')

      const sszTx = origTx.sszRaw()
      const sszJson = sszType.toJson(origTx.sszRaw())
      assert.equal(sszJson.signature.from, txSender, 'ssz format should be correct')

      const payloadJson = toPayloadJson(sszTx)
      const payloadTx = createTxFromExecutionPayloadTx(payloadJson, { common })
      const payloadTxHash = bytesToHex(payloadTx.hash())
      assert.equal(payloadTxHash, txHash, 'transaction should be correctly loaded')

      const payloadSszJson = sszType.toJson(payloadTx.sszRaw())
      assert.equal(payloadSszJson.signature.from, txSender, 'ssz format should be correct')
    })
  }

  it(`hashTree root of different transactions`, () => {
    const transactions = testCases.map(
      ([_txTypeName, _txType, _sszType, txData, _txHash, _txSender, common]) => {
        const origTx = createTx(txData, { common })
        return origTx.sszRaw()
      },
    )

    const transactionsRoot = ssz.Transactions.hashTreeRoot(transactions)
    assert.equal(
      bytesToHex(transactionsRoot),
      '0xe15ff0a75fc9889f4ce89afd2ae65ec570881a7ac6bf78ca664b1d04d0419e34',
      'transactions root should match',
    )
  })
})
