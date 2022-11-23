import { computeVersionedHash } from '@ethereumjs/util'
import {
  blobToKzgCommitment,
  computeAggregateKzgProof,
  freeTrustedSetup,
  loadTrustedSetup,
} from 'c-kzg'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { BlobEIP4844Transaction, BlobNetworkTransactionWrapper, TransactionFactory } from '../src'

import { get_blobs } from './utils/blobHelpers'

tape('EIP4844 constructor tests - valid scenarios', (t) => {
  const txData = {
    type: 0x05,
    versionedHashes: [Buffer.concat([Buffer.from([1]), randomBytes(31)])],
    maxFeePerDataGas: 1n,
  }
  const tx = BlobEIP4844Transaction.fromTxData(txData)
  t.equal(tx.type, 5, 'successfully instantiated a blob transaction from txData')
  const factoryTx = TransactionFactory.fromTxData(txData)
  t.equal(factoryTx.type, 5, 'instantiated a blob transaction from the tx factory')

  const serializedTx = tx.serialize()
  t.equal(serializedTx[0], 5, 'successfully serialized a blob tx')
  const deserializedTx = BlobEIP4844Transaction.fromSerializedTx(serializedTx)
  t.equal(deserializedTx.type, 5, 'deserialized a blob tx')
  t.end()
})

tape('EIP4844 constructor tests - invalid scenarios', (t) => {
  const baseTxData = {
    type: 0x05,
    maxFeePerDataGas: 1n,
  }
  const shortVersionHash = {
    versionedHashes: [Buffer.concat([Buffer.from([3]), randomBytes(3)])],
  }
  const invalidVersionHash = {
    versionedHashes: [Buffer.concat([Buffer.from([3]), randomBytes(31)])],
  }
  const tooManyBlobs = {
    versionedHashes: [
      Buffer.concat([Buffer.from([1]), randomBytes(31)]),
      Buffer.concat([Buffer.from([1]), randomBytes(31)]),
      Buffer.concat([Buffer.from([1]), randomBytes(31)]),
    ],
  }
  try {
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...shortVersionHash })
  } catch (err: any) {
    t.ok(
      err.message.includes('versioned hash is invalid length'),
      'throws on invalid versioned hash length'
    )
  }
  try {
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...invalidVersionHash })
  } catch (err: any) {
    t.ok(
      err.message.includes('does not start with KZG commitment'),
      'throws on invalid commitment version'
    )
  }
  try {
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...tooManyBlobs })
  } catch (err: any) {
    t.ok(err.message.includes('tx can contain at most'), 'throws on too many versioned hashes')
  }
  t.end()
})

tape('Network wrapper tests', (t) => {
  // Initialize KZG environment (i.e. trusted setup)
  loadTrustedSetup('./src/kzg/trusted_setup.txt')

  const commitments = []
  const versionedHashes = []
  const blobs = get_blobs('hello world')
  for (let x = 0; x < blobs.length; x++) {
    commitments.push(blobToKzgCommitment(blobs[x]))
    versionedHashes.push(computeVersionedHash(commitments[x]))
  }

  const buffedHashes = versionedHashes.map((el) => Buffer.from(el))
  const proof = computeAggregateKzgProof(blobs)

  const pkey = randomBytes(32)
  const unsignedTx = BlobEIP4844Transaction.fromTxData({
    versionedHashes: buffedHashes,
    maxFeePerDataGas: 100000000n,
  })
  const signedTx = unsignedTx.sign(pkey)

  const serializedNetworkWrapper = BlobNetworkTransactionWrapper.serialize({
    blobs,
    blobKzgs: commitments,
    tx: signedTx.txData(),
    kzgAggregatedProof: proof,
  })

  const fullTx = Buffer.concat([Uint8Array.from([0x05]), serializedNetworkWrapper])
  freeTrustedSetup()
  // Cleanup KZG environment (i.e. remove trusted setup)

  const deserializedTx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(fullTx)
  t.equal(deserializedTx.type, 0x05, 'successfully deserialized a blob transaction network wrapper')
  t.end()
})
