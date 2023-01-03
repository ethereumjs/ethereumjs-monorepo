import * as kzg from 'c-kzg'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { BlobEIP4844Transaction, TransactionFactory } from '../src'

import { blobsToCommitments, commitmentsToVersionedHashes, getBlobs } from './utils/blobHelpers'

const pk = randomBytes(32)

tape('EIP4844 constructor tests - valid scenarios', (t) => {
  const txData = {
    type: 0x05,
    versionedHashes: [Buffer.concat([Buffer.from([1]), randomBytes(31)])],
    maxFeePerDataGas: 1n,
  }
  const tx = BlobEIP4844Transaction.fromTxData(txData, { kzg })
  t.equal(tx.type, 5, 'successfully instantiated a blob transaction from txData')
  const factoryTx = TransactionFactory.fromTxData(txData, { kzg })
  t.equal(factoryTx.type, 5, 'instantiated a blob transaction from the tx factory')

  const serializedTx = tx.serialize()
  t.equal(serializedTx[0], 5, 'successfully serialized a blob tx')
  const deserializedTx = BlobEIP4844Transaction.fromSerializedTx(serializedTx, { kzg })
  t.equal(deserializedTx.type, 5, 'deserialized a blob tx')

  const signedTx = tx.sign(pk)
  const sender = signedTx.getSenderAddress().toString()
  const decodedTx = BlobEIP4844Transaction.fromSerializedTx(signedTx.serialize(), { kzg })
  t.equal(
    decodedTx.getSenderAddress().toString(),
    sender,
    'signature and sender were deserialized correctly'
  )

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
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...shortVersionHash }, { kzg })
  } catch (err: any) {
    t.ok(
      err.message.includes('versioned hash is invalid length'),
      'throws on invalid versioned hash length'
    )
  }
  try {
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...invalidVersionHash }, { kzg })
  } catch (err: any) {
    t.ok(
      err.message.includes('does not start with KZG commitment'),
      'throws on invalid commitment version'
    )
  }
  try {
    BlobEIP4844Transaction.fromTxData({ ...baseTxData, ...tooManyBlobs }, { kzg })
  } catch (err: any) {
    t.ok(err.message.includes('tx can contain at most'), 'throws on too many versioned hashes')
  }
  t.end()
})

tape('Network wrapper tests', async (t) => {
  // Initialize KZG environment (i.e. trusted setup)
  kzg.loadTrustedSetup(await kzg.transformTrustedSetupJSON('./src/kzg/trusted_setup.json'))

  const blobs = getBlobs('hello world')
  const commitments = blobsToCommitments(blobs)
  const versionedHashes = commitmentsToVersionedHashes(commitments)

  kzg.freeTrustedSetup()
  // Cleanup KZG environment (i.e. remove trusted setup)

  const bufferedHashes = versionedHashes.map((el) => Buffer.from(el))

  const unsignedTx = BlobEIP4844Transaction.fromTxData(
    {
      versionedHashes: bufferedHashes,
      blobs,
      kzgCommitments: commitments,
      maxFeePerDataGas: 100000000n,
      gasLimit: 0xffffffn,
      to: randomBytes(20),
    },
    { kzg }
  )
  const signedTx = unsignedTx.sign(pk)
  const sender = signedTx.getSenderAddress().toString()
  const wrapper = signedTx.serializeNetworkWrapper()
  const deserializedTx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(wrapper, { kzg })

  t.equal(deserializedTx.type, 0x05, 'successfully deserialized a blob transaction network wrapper')
  t.equal(deserializedTx.blobs?.length, blobs.length, 'contains the correct number of blobs')
  t.equal(deserializedTx.getSenderAddress().toString(), sender, 'decoded sender address correctly')
  const minimalTx = BlobEIP4844Transaction.minimalFromNetworkWrapper(deserializedTx, { kzg })
  t.ok(minimalTx.blobs === undefined, 'minimal representation contains no blobs')
  t.ok(
    minimalTx.hash().equals(deserializedTx.hash()),
    'has the same hash as the network wrapper version'
  )

  t.end()
})

tape('hash() and signature verification', async (t) => {
  const unsignedTx = BlobEIP4844Transaction.fromTxData(
    {
      chainId: 1,
      nonce: 1,
      versionedHashes: [
        Buffer.from('01624652859a6e98ffc1608e2af0147ca4e86e1ce27672d8d3f3c9d4ffd6ef7e', 'hex'),
      ],
      maxFeePerDataGas: 10000000n,
      gasLimit: 123457n,
      maxFeePerGas: 42n,
      maxPriorityFeePerGas: 10n,
      accessList: [
        {
          address: '0x0000000000000000000000000000000000000001',
          storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        },
      ],
    },
    { kzg }
  )
  t.equal(
    unsignedTx.hash().toString('hex'),
    '4a4451b77bf251d626009dc9c6179c9fe088eb362a1d94eab257fb6f0f9fe95e',
    'produced the correct transaction hash'
  )
  const signedTx = unsignedTx.sign(
    Buffer.from('45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8', 'hex')
  )

  t.equal(
    signedTx.getSenderAddress().toString(),
    '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    'was able to recover sender address'
  )
  t.ok(signedTx.verifySignature(), 'signature is valid')
  t.end()
})
