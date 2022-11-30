import { freeTrustedSetup, loadTrustedSetup } from 'c-kzg'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { BlobEIP4844Transaction, TransactionFactory } from '../src'

import { blobsToCommitments, commitmentsToVersionedHashes, getBlobs } from './utils/blobHelpers'

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

  const blobs = getBlobs('hello world')
  const commitments = blobsToCommitments(blobs)
  const versionedHashes = commitmentsToVersionedHashes(commitments)

  const bufferedHashes = versionedHashes.map((el) => Buffer.from(el))

  const pkey = randomBytes(32)
  const unsignedTx = BlobEIP4844Transaction.fromTxData({
    versionedHashes: bufferedHashes,
    blobs,
    kzgCommitments: commitments,
    maxFeePerDataGas: 100000000n,
  })
  const signedTx = unsignedTx.sign(pkey)

  const wrapper = signedTx.serializeNetworkWrapper()

  const fullTx = Buffer.concat([Uint8Array.from([0x05]), wrapper])
  freeTrustedSetup()
  // Cleanup KZG environment (i.e. remove trusted setup)

  const deserializedTx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(fullTx)
  t.equal(deserializedTx.type, 0x05, 'successfully deserialized a blob transaction network wrapper')
  t.equal(deserializedTx.blobs?.length, blobs.length, 'contains the correct number of blobs')

  const minimalTx = BlobEIP4844Transaction.minimalFromNetworkWrapper(deserializedTx)
  t.ok(minimalTx.blobs === undefined, 'minimal representation contains no blobs')
  t.ok(
    minimalTx.hash().equals(deserializedTx.hash()),
    'has the same hash as the network wrapper version'
  )

  t.end()
})
