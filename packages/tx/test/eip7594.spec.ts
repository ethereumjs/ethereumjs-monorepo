import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import {
  blobsToCellsAndProofs,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  concatBytes,
  createZeroAddress,
  equalsBytes,
  getBlobs,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import {
  NetworkWrapperType,
  blobTxNetworkWrapperToJSON,
  createBlob4844Tx,
  createBlob4844TxFromRLP,
  createBlob4844TxFromSerializedNetworkWrapper,
  createMinimal4844TxFromNetworkWrapper,
  createTx,
  paramsTx,
} from '../src/index.ts'

import { osakaGethGenesis } from '@ethereumjs/testdata'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { BlobEIP4844TxData } from '../src/index.ts'

import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const kzg = new microEthKZG(trustedSetup)
const pk = randomBytes(32)

describe('EIP4844 non network wrapper constructor tests - valid scenarios', () => {
  const common = createCommonFromGethGenesis(osakaGethGenesis.osakaGenesis, {
    chain: 'customChain',
    hardfork: Hardfork.Osaka,
    customCrypto: { kzg },
  })

  it('should work', () => {
    const txData = {
      type: 0x03,
      blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
      maxFeePerBlobGas: 1n,
      to: createZeroAddress(),
    }
    const tx = createBlob4844Tx(txData, { common })
    assert.equal(tx.type, 3, 'successfully instantiated a blob transaction from txData')
    const factoryTx = createTx(txData, { common })
    assert.equal(factoryTx.type, 3, 'instantiated a blob transaction from the tx factory')

    const serializedTx = tx.serialize()
    assert.equal(serializedTx[0], 3, 'successfully serialized a blob tx')
    const deserializedTx = createBlob4844TxFromRLP(serializedTx, { common })
    assert.equal(deserializedTx.type, 3, 'deserialized a blob tx')

    const signedTx = tx.sign(pk)
    const sender = signedTx.getSenderAddress().toString()
    const decodedTx = createBlob4844TxFromRLP(signedTx.serialize(), { common })
    assert.equal(
      decodedTx.getSenderAddress().toString(),
      sender,
      'signature and sender were deserialized correctly',
    )

    // Verify 1000 signatures to ensure these have unique hashes (hedged signatures test)
    const hashSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const hash = bytesToHex(tx.sign(pk, true).hash())
      if (hashSet.has(hash)) {
        assert.fail('should not reuse the same hash (hedged signature test)')
      }
      hashSet.add(hash)
    }
  })
})

describe('fromTxData using from a json', () => {
  const common = createCommonFromGethGenesis(osakaGethGenesis.osakaGenesis, {
    chain: 'customChain',
    hardfork: Hardfork.Osaka,
    customCrypto: { kzg },
  })

  it('should work', () => {
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
      yParity: '0x0',
    }
    const txMeta = {
      hash: '0xe5e02be0667b6d31895d1b5a8b916a6761cbc9865225c6144a3e2c50936d173e',
      serialized:
        '0x03f89b84028757b38085012a05f20085012a05f2008303345094ffb38a7a99e3e2335be83fc74b7faa19d553124383bc614e80c084b2d05e00e1a001b0a4cdd5f55589f5c5b4d46c76704bb6ce95c0a8c09f77f197a57808dded2880a08a83833ec07806485a4ded33f24f5cea4b8d4d24dc8f357e6d446bcdae5e58a7a068a2ba422a50cf84c0b5fcbda32ee142196910c97198ffd99035d920c2b557f8',
    }

    const c = common.copy()
    c['_chainParams'] = Object.assign({}, common['_chainParams'], {
      chainId: Number(txData.chainId),
    })
    try {
      const tx = createBlob4844Tx(txData as BlobEIP4844TxData, { common: c })
      assert.isTrue(true, 'Should be able to parse a json data and hash it')

      assert.equal(typeof tx.maxFeePerBlobGas, 'bigint', 'should be able to parse correctly')
      assert.equal(bytesToHex(tx.serialize()), txMeta.serialized, 'serialization should match')
      // TODO: fix the hash
      assert.equal(bytesToHex(tx.hash()), txMeta.hash, 'hash should match')

      const jsonData = tx.toJSON()
      // override few fields with equivalent values to have a match
      assert.deepEqual(
        { ...txData, accessList: [] },
        { gasPrice: null, ...jsonData },
        'toJSON should give correct json',
      )

      const fromSerializedTx = createBlob4844TxFromRLP(
        hexToBytes(txMeta.serialized as PrefixedHexString),
        { common: c },
      )
      assert.equal(
        bytesToHex(fromSerializedTx.hash()),
        txMeta.hash,
        'fromSerializedTx hash should match',
      )
    } catch {
      assert.fail('failed to parse json data')
    }
  })
})

describe('Network wrapper tests', () => {
  const common = createCommonFromGethGenesis(osakaGethGenesis.osakaGenesis, {
    chain: 'customChain',
    hardfork: Hardfork.Osaka,
    params: paramsTx,
    customCrypto: { kzg },
  })

  it('eip7594 wrapper should not work instead of 4844', async () => {
    const blobs = [...getBlobs('hello world'), ...getBlobs('hello world')]
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const blobProofs = blobsToProofs(kzg, blobs, commitments)

    const [_cells, cellProofs, _indices] = blobsToCellsAndProofs(kzg, blobs)

    expect(() =>
      createBlob4844Tx(
        {
          networkWrapperVersion: 0,
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: blobProofs,
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common },
      ),
    ).toThrowError(/EIP-7594 is active on Common for EIP4844 network wrapper version/)

    const unsignedTx = createBlob4844Tx(
      {
        networkWrapperVersion: 1,
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: cellProofs,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common },
    )
    assert(unsignedTx.networkWrapperVersion === NetworkWrapperType.EIP7594)

    const signedTx = unsignedTx.sign(pk)
    const sender = signedTx.getSenderAddress().toString()
    const wrapper = signedTx.serializeNetworkWrapper()

    const jsonData = blobTxNetworkWrapperToJSON(wrapper, { common })
    assert.equal(Number(jsonData.networkWrapperVersion), NetworkWrapperType.EIP7594)

    assert.equal(jsonData.blobs?.length, blobs.length, 'contains the correct number of blobs')
    for (let i = 0; i < jsonData.blobs.length; i++) {
      const b1 = jsonData.blobs[i]
      const b2 = signedTx.blobs![i]
      assert.equal(b1, b2, 'contains the same blobs')
    }
    assert.equal(
      jsonData.kzgCommitments.length,
      signedTx.kzgCommitments!.length,
      'contains the correct number of commitments',
    )
    for (let i = 0; i < jsonData.kzgCommitments.length; i++) {
      const c1 = jsonData.kzgCommitments[i]
      const c2 = signedTx.kzgCommitments![i]
      assert.equal(c1, c2, 'contains the same commitments')
    }
    assert.equal(
      jsonData.kzgProofs?.length,
      signedTx.kzgProofs!.length,
      'contains the correct number of proofs',
    )
    for (let i = 0; i < jsonData.kzgProofs.length; i++) {
      const p1 = jsonData.kzgProofs[i]
      const p2 = signedTx.kzgProofs![i]
      assert.equal(p1, p2, 'contains the same proofs')
    }

    const deserializedTx = createBlob4844TxFromSerializedNetworkWrapper(wrapper, {
      common,
    })

    assert.equal(
      deserializedTx.type,
      0x03,
      'successfully deserialized a blob transaction network wrapper',
    )
    assert.equal(
      deserializedTx.networkWrapperVersion,
      NetworkWrapperType.EIP7594,
      'eip7594 network wrapper tx',
    )
    assert.equal(deserializedTx.blobs?.length, blobs.length, 'contains the correct number of blobs')
    assert.equal(
      deserializedTx.kzgCommitments?.length,
      commitments.length,
      'contains the correct number of commitments',
    )
    assert.equal(
      deserializedTx.kzgProofs?.length,
      cellProofs.length,
      'contains the correct number of proofs',
    )
    assert.equal(
      deserializedTx.getSenderAddress().toString(),
      sender,
      'decoded sender address correctly',
    )

    const minimalTx = createMinimal4844TxFromNetworkWrapper(deserializedTx, { common })
    assert.isUndefined(minimalTx.blobs, 'minimal representation contains no blobs')
    assert.isUndefined(
      minimalTx.networkWrapperVersion,
      'minimal representation contains no network wrapper',
    )
    assert.isTrue(
      equalsBytes(minimalTx.hash(), deserializedTx.hash()),
      'has the same hash as the network wrapper version',
    )

    const txWithMissingBlob = createBlob4844Tx(
      {
        networkWrapperVersion: 1,
        blobVersionedHashes,
        blobs: blobs.slice(1),
        kzgCommitments: commitments,
        kzgProofs: cellProofs,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common },
    )

    const serializedWithMissingBlob = txWithMissingBlob.serializeNetworkWrapper()

    assert.throws(
      () =>
        createBlob4844TxFromSerializedNetworkWrapper(serializedWithMissingBlob, {
          common,
        }),
      'Number of blobVersionedHashes, blobs, and commitments not all equal',
      undefined,
      'throws when blobs/commitments/hashes mismatch',
    )

    const otherBlob = getBlobs('abc')
    const otherCommitments = blobsToCommitments(kzg, otherBlob)
    commitments[0] = otherCommitments[0]

    const txWithInvalidCommitment = createBlob4844Tx(
      {
        networkWrapperVersion: 1,
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: cellProofs,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common },
    )

    const serializedWithInvalidCommitment = txWithInvalidCommitment.serializeNetworkWrapper()

    assert.throws(
      () =>
        createBlob4844TxFromSerializedNetworkWrapper(serializedWithInvalidCommitment, {
          common,
        }),
      'KZG proof cannot be verified from blobs/commitments',
      undefined,
      'throws when kzg proof cant be verified',
    )
  }, 40_000)
})
