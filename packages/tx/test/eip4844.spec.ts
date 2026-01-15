import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import {
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
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
//import { loadKZG } from 'kzg-wasm'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, beforeAll, describe, it } from 'vitest'

import {
  blobTxNetworkWrapperToJSON,
  createBlob4844Tx,
  createBlob4844TxFromRLP,
  createBlob4844TxFromSerializedNetworkWrapper,
  createMinimal4844TxFromNetworkWrapper,
  createTx,
  paramsTx,
} from '../src/index.ts'

import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { serialized4844TxData } from './testData/serialized4844tx.ts'

import type { KZG, PrefixedHexString } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import type { BlobEIP4844TxData } from '../src/index.ts'

const pk = randomBytes(32)
let kzgs: Array<{ lib: KZG; label: string; common: any }> = []

beforeAll(async () => {
  const jsKzg = new microEthKZG(trustedSetup) as KZG
  //const wasmKzg = (await loadKZG()) as KZG

  const jsKzgSetup = {
    lib: jsKzg,
    label: 'JS',
    common: createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg: jsKzg },
    }),
  }
  // Only activate on demand, otherwise too costly for now
  /*const wasmKzgSetup = {
    lib: wasmKzg,
    label: 'WASM',
    common: createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg: wasmKzg },
    }),
  }*/
  kzgs = [jsKzgSetup]
}, 60000)

describe('EIP4844 addSignature tests', () => {
  it('addSignature() -> correctly adds correct signature values', () => {
    for (const kzg of kzgs) {
      const privateKey = pk
      const tx = createBlob4844Tx(
        {
          to: createZeroAddress(),
          blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
        },
        { common: kzg.common },
      )
      const signedTx = tx.sign(privateKey)
      const addSignatureTx = tx.addSignature(signedTx.v!, signedTx.r!, signedTx.s!)

      assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON(), kzg.label)
    }
  })

  it('addSignature() -> correctly converts raw ecrecover values', () => {
    for (const kzg of kzgs) {
      const privKey = pk
      const tx = createBlob4844Tx(
        {
          to: createZeroAddress(),
          blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
        },
        { common: kzg.common },
      )

      const msgHash = tx.getHashedMessageToSign()
      // Use same options as Legacy.sign internally uses
      const signatureBytes = secp256k1.sign(msgHash, privKey, {
        format: 'recovered',
        prehash: false,
      })
      const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

      if (recovery === undefined) {
        throw new Error('Invalid signature recovery')
      }

      const signedTx = tx.sign(privKey)
      const addSignatureTx = tx.addSignature(BigInt(recovery), r, s)

      assert.deepEqual(signedTx.toJSON(), addSignatureTx.toJSON(), kzg.label)
    }
  })

  it('addSignature() -> throws when adding the wrong v value', () => {
    for (const kzg of kzgs) {
      const privKey = pk
      const tx = createBlob4844Tx(
        {
          to: createZeroAddress(),
          blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
        },
        { common: kzg.common },
      )

      const msgHash = tx.getHashedMessageToSign()
      // Use same options as Legacy.sign internally uses
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
    }
  })
})

describe('EIP4844 constructor tests - valid scenarios', () => {
  it('should work', () => {
    for (const kzg of kzgs) {
      const txData = {
        type: 0x03,
        blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
        maxFeePerBlobGas: 1n,
        to: createZeroAddress(),
      }
      const tx = createBlob4844Tx(txData, { common: kzg.common })
      assert.throws(() => {
        tx.toCreationAddress()
      }, 'Blob4844Tx cannot create contracts')
      assert.strictEqual(
        tx.type,
        3,
        `successfully instantiated a blob transaction from txData (${kzg.label})`,
      )
      const factoryTx = createTx(txData, { common: kzg.common })
      assert.strictEqual(
        factoryTx.type,
        3,
        `instantiated a blob transaction from the tx factory (${kzg.label})`,
      )

      const serializedTx = tx.serialize()
      assert.strictEqual(serializedTx[0], 3, `successfully serialized a blob tx (${kzg.label})`)
      const deserializedTx = createBlob4844TxFromRLP(serializedTx, { common: kzg.common })
      assert.strictEqual(deserializedTx.type, 3, `deserialized a blob tx (${kzg.label})`)

      const signedTx = tx.sign(pk)
      const sender = signedTx.getSenderAddress().toString()
      const decodedTx = createBlob4844TxFromRLP(signedTx.serialize(), { common: kzg.common })
      assert.strictEqual(
        decodedTx.getSenderAddress().toString(),
        sender,
        `signature and sender were deserialized correctly (${kzg.label})`,
      )

      // Verify 1000 signatures to ensure these have unique hashes (hedged signatures test)
      const hashSet = new Set<string>()
      for (let i = 0; i < 1000; i++) {
        const hash = bytesToHex(tx.sign(pk, true).hash())
        if (hashSet.has(hash)) {
          assert.fail(`should not reuse the same hash (hedged signature test) (${kzg.label})`)
        }
        hashSet.add(hash)
      }
    }
  })
})

describe('fromTxData using from a json', () => {
  it('should work', () => {
    for (const kzg of kzgs) {
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

      const c = kzg.common.copy()
      c['_chainParams'] = Object.assign({}, kzg.common['_chainParams'], {
        chainId: Number(txData.chainId),
      })
      try {
        const tx = createBlob4844Tx(txData as BlobEIP4844TxData, { common: c })
        assert.isTrue(true, `Should be able to parse a json data and hash it (${kzg.label})`)

        assert.strictEqual(
          typeof tx.maxFeePerBlobGas,
          'bigint',
          `should be able to parse correctly (${kzg.label})`,
        )
        assert.strictEqual(
          bytesToHex(tx.serialize()),
          txMeta.serialized,
          `serialization should match (${kzg.label})`,
        )
        // TODO: fix the hash
        assert.strictEqual(bytesToHex(tx.hash()), txMeta.hash, `hash should match (${kzg.label})`)

        const jsonData = tx.toJSON()
        // override few fields with equivalent values to have a match
        assert.deepEqual(
          { ...txData, accessList: [] },
          { gasPrice: null, ...jsonData },
          `toJSON should give correct json (${kzg.label})`,
        )

        const fromSerializedTx = createBlob4844TxFromRLP(
          hexToBytes(txMeta.serialized as PrefixedHexString),
          { common: c },
        )
        assert.strictEqual(
          bytesToHex(fromSerializedTx.hash()),
          txMeta.hash,
          `fromSerializedTx hash should match (${kzg.label})`,
        )
      } catch {
        assert.fail(`failed to parse json data (${kzg.label})`)
      }
    }
  })
})

describe('EIP4844 constructor tests - invalid scenarios', () => {
  it('should work', () => {
    for (const kzg of kzgs) {
      const baseTxData = {
        type: 0x03,
        maxFeePerBlobGas: 1n,
        to: createZeroAddress(),
      }
      const shortVersionHash = {
        blobVersionedHashes: [concatBytes(new Uint8Array([3]), randomBytes(3))],
      }
      const invalidVersionHash = {
        blobVersionedHashes: [concatBytes(new Uint8Array([3]), randomBytes(31))],
      }
      const tooManyBlobs7 = {
        blobVersionedHashes: [
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
          concatBytes(new Uint8Array([1]), randomBytes(31)),
        ],
      }
      try {
        createBlob4844Tx({ ...baseTxData, ...shortVersionHash }, { common: kzg.common })
      } catch (err: any) {
        assert.isTrue(
          err.message.includes('versioned hash is invalid length'),
          `throws on invalid versioned hash length (${kzg.label})`,
        )
      }
      try {
        createBlob4844Tx({ ...baseTxData, ...invalidVersionHash }, { common: kzg.common })
      } catch (err: any) {
        assert.isTrue(
          err.message.includes('does not start with KZG commitment'),
          `throws on invalid commitment version (${kzg.label})`,
        )
      }
      try {
        createBlob4844Tx({ ...baseTxData, ...tooManyBlobs7 }, { common: kzg.common })
      } catch (err: any) {
        assert.match(
          err.message,
          /tx causes total blob gas of \d+ to exceed maximum blob gas per block of \d+/,
          `throws on too many versioned hashes (${kzg.label})`,
        )
      }

      const commonWithEIP7594 = new Common({
        chain: Mainnet,
        hardfork: Hardfork.Osaka,
        customCrypto: { kzg: kzg.lib },
      })
      assert.isTrue(commonWithEIP7594.isActivatedEIP(7594), 'EIP-7594 should be activated')
      try {
        createBlob4844Tx({ ...baseTxData, ...tooManyBlobs7 }, { common: commonWithEIP7594 })
      } catch (err: any) {
        assert.isTrue(
          err.message.includes('7 blobs exceeds max 6 blobs per tx (EIP-7594)'),
          `throws on too many versioned hashes (${kzg.label}): ${err.message}`,
        )
      }
    }
  })
})

describe('Network wrapper tests', () => {
  it('should work', async () => {
    for (const kzg of kzgs) {
      const common = createCommonFromGethGenesis(eip4844GethGenesis, {
        chain: 'customChain',
        hardfork: Hardfork.Cancun,
        params: paramsTx,
        customCrypto: { kzg: kzg.lib },
      })
      const blobs = getBlobs('hello world')
      const commitments = blobsToCommitments(kzg.lib, blobs)
      const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
      const proofs = blobsToProofs(kzg.lib, blobs, commitments)
      const unsignedTx = createBlob4844Tx(
        {
          networkWrapperVersion: 0,
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common },
      )

      const signedTx = unsignedTx.sign(pk)
      const sender = signedTx.getSenderAddress().toString()
      const wrapper = signedTx.serializeNetworkWrapper()

      const jsonData = blobTxNetworkWrapperToJSON(wrapper, { common })
      assert.strictEqual(
        jsonData.blobs?.length,
        blobs.length,
        `contains the correct number of blobs (${kzg.label})`,
      )
      for (let i = 0; i < jsonData.blobs.length; i++) {
        const b1 = jsonData.blobs[i]
        const b2 = signedTx.blobs![i]
        assert.strictEqual(b1, b2, `contains the same blobs (${kzg.label})`)
      }
      assert.strictEqual(
        jsonData.kzgCommitments.length,
        signedTx.kzgCommitments!.length,
        `contains the correct number of commitments (${kzg.label})`,
      )
      for (let i = 0; i < jsonData.kzgCommitments.length; i++) {
        const c1 = jsonData.kzgCommitments[i]
        const c2 = signedTx.kzgCommitments![i]
        assert.strictEqual(c1, c2, `contains the same commitments (${kzg.label})`)
      }
      assert.strictEqual(
        jsonData.kzgProofs?.length,
        signedTx.kzgProofs!.length,
        `contains the correct number of proofs (${kzg.label})`,
      )
      for (let i = 0; i < jsonData.kzgProofs.length; i++) {
        const p1 = jsonData.kzgProofs[i]
        const p2 = signedTx.kzgProofs![i]
        assert.strictEqual(p1, p2, `contains the same proofs (${kzg.label})`)
      }

      const deserializedTx = createBlob4844TxFromSerializedNetworkWrapper(wrapper, {
        common,
      })

      assert.strictEqual(
        deserializedTx.type,
        0x03,
        `successfully deserialized a blob transaction network wrapper (${kzg.label})`,
      )
      assert.strictEqual(
        deserializedTx.blobs?.length,
        blobs.length,
        `contains the correct number of blobs (${kzg.label})`,
      )
      assert.strictEqual(
        deserializedTx.getSenderAddress().toString(),
        sender,
        `decoded sender address correctly (${kzg.label})`,
      )
      const minimalTx = createMinimal4844TxFromNetworkWrapper(deserializedTx, { common })
      assert.isUndefined(minimalTx.blobs, `minimal representation contains no blobs (${kzg.label})`)
      assert.isTrue(
        equalsBytes(minimalTx.hash(), deserializedTx.hash()),
        `has the same hash as the network wrapper version (${kzg.label})`,
      )

      const simpleBlobTx = createBlob4844Tx(
        {
          blobsData: ['hello world'],
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common },
      )

      assert.strictEqual(
        unsignedTx.blobVersionedHashes[0],
        simpleBlobTx.blobVersionedHashes[0],
        `tx versioned hash for simplified blob txData constructor matches fully specified versioned hashes (${kzg.label})`,
      )

      assert.throws(
        () =>
          createBlob4844Tx(
            {
              blobsData: ['hello world'],
              blobs: ['hello world' as any],
              maxFeePerBlobGas: 100000000n,
              gasLimit: 0xffffffn,
              to: randomBytes(20),
            },
            { common },
          ),
        'encoded blobs',
        undefined,
        `throws on blobsData and blobs in txData (${kzg.label})`,
      )

      assert.throws(
        () => {
          createBlob4844Tx(
            {
              blobVersionedHashes: [],
              blobs: [],
              kzgCommitments: [],
              kzgProofs: [],
              maxFeePerBlobGas: 100000000n,
              gasLimit: 0xffffffn,
              to: randomBytes(20),
            },
            { common },
          )
        },
        'tx should contain at least one blob',
        undefined,
        `throws a transaction with no blobs (${kzg.label})`,
      )

      const txWithMissingBlob = createBlob4844Tx(
        {
          networkWrapperVersion: 0,
          blobVersionedHashes,
          blobs: blobs.slice(1),
          kzgCommitments: commitments,
          kzgProofs: proofs,
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
        `throws when blobs/commitments/hashes mismatch (${kzg.label})`,
      )

      const originalValue = commitments[0]
      commitments[0] = (originalValue.slice(0, 31) + 'c') as PrefixedHexString

      const txWithInvalidCommitment = createBlob4844Tx(
        {
          networkWrapperVersion: 0,
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
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
        `throws when kzg proof cant be verified (${kzg.label})`,
      )

      blobVersionedHashes[0] = ('0x0102' + blobVersionedHashes[0].slice(6)) as PrefixedHexString
      commitments[0] = originalValue

      const txWithInvalidVersionedHashes = createBlob4844Tx(
        {
          networkWrapperVersion: 0,
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common },
      )

      const serializedWithInvalidVersionedHashes =
        txWithInvalidVersionedHashes.serializeNetworkWrapper()
      assert.throws(
        () =>
          createBlob4844TxFromSerializedNetworkWrapper(serializedWithInvalidVersionedHashes, {
            common,
          }),
        'commitment for blob at index 0 does not match versionedHash',
        undefined,
        `throws when versioned hashes don't match kzg commitments (${kzg.label})`,
      )
    }
  }, 20_000)
})

describe('hash() and signature verification', () => {
  it('should work', async () => {
    for (const kzg of kzgs) {
      const common = createCommonFromGethGenesis(eip4844GethGenesis, {
        chain: 'customChain',
        hardfork: Hardfork.Cancun,
        customCrypto: { kzg: kzg.lib },
      })

      const unsignedTx = createBlob4844Tx(
        {
          chainId: 1,
          nonce: 1,
          blobVersionedHashes: [
            hexToBytes('0x01624652859a6e98ffc1608e2af0147ca4e86e1ce27672d8d3f3c9d4ffd6ef7e'),
          ],
          maxFeePerBlobGas: 10000000n,
          gasLimit: 123457n,
          maxFeePerGas: 42n,
          maxPriorityFeePerGas: 10n,
          accessList: [
            {
              address: '0x0000000000000000000000000000000000000001',
              storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            },
          ],
          to: createZeroAddress(),
        },
        { common },
      )
      assert.strictEqual(
        bytesToHex(unsignedTx.getHashedMessageToSign()),
        '0x02560c5173b0d793ce019cfa515ece6a04a4b3f3d67eab67fbca78dd92d4ed76',
        `produced the correct transaction hash (${kzg.label})`,
      )
      const signedTx = unsignedTx.sign(
        hexToBytes('0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8'),
      )

      assert.strictEqual(
        signedTx.getSenderAddress().toString(),
        '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
        `was able to recover sender address (${kzg.label})`,
      )
      assert.isTrue(signedTx.verifySignature(), `signature is valid (${kzg.label})`)
    }
  })
})

it('getEffectivePriorityFee()', () => {
  for (const kzg of kzgs) {
    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg: kzg.lib },
    })
    const tx = createBlob4844Tx(
      {
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 8,
        to: createZeroAddress(),
        blobVersionedHashes: [concatBytes(new Uint8Array([1]), randomBytes(31))],
      },
      { common },
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(10)),
      BigInt(0),
      `getEffectivePriorityFee with baseFee=10 (${kzg.label})`,
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(9)),
      BigInt(1),
      `getEffectivePriorityFee with baseFee=9 (${kzg.label})`,
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(8)),
      BigInt(2),
      `getEffectivePriorityFee with baseFee=8 (${kzg.label})`,
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(2)),
      BigInt(8),
      `getEffectivePriorityFee with baseFee=2 (${kzg.label})`,
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(1)),
      BigInt(8),
      `getEffectivePriorityFee with baseFee=1 (${kzg.label})`,
    )
    assert.strictEqual(
      tx.getEffectivePriorityFee(BigInt(0)),
      BigInt(8),
      `getEffectivePriorityFee with baseFee=0 (${kzg.label})`,
    )
    assert.throws(() => tx.getEffectivePriorityFee(BigInt(11)))
  }
})

describe('Network wrapper deserialization test', () => {
  it('should work', async () => {
    for (const kzg of kzgs) {
      const common = createCommonFromGethGenesis(eip4844GethGenesis, {
        chain: 'customChain',
        hardfork: Hardfork.Cancun,
        params: paramsTx,
        customCrypto: {
          kzg: kzg.lib,
        },
      })

      const txData = {
        type: '0x3',
        nonce: '0x0',
        maxPriorityFeePerGas: '0x0',
        maxFeePerGas: '0x0',
        gasLimit: '0xffffff',
        value: '0x0',
        data: '0x',
        v: '0x0',
        r: '0x3d8cacf503f773c3ae4eed2b38ba68859063bc5ad253a4fb456b1295061f1e0b',
        s: '0x616727b04ef78f58d2f521774c6261396fc21eac725ba2a2d89758eae171effb',
        to: '0x1f738d535998ba73b31f38f1ecf6a6ad013eaa20',
        chainId: '0x1',
        accessList: [],
        maxFeePerBlobGas: '0x5f5e100',
        blobVersionedHashes: ['0x0172ff1d4f354eebdb3cd0cb64e41ac584359094373fd5f979bcccbd6072d936'],
        yParity: '0x0',
      }
      const txMeta = {
        sender: '0x652a2b04934d96c26c4710853021779fb9f525d2',
        unsignedHash: '0x3103e9d2b39b26082a6e36fa0364e5b14502efa0041ad29d485737a10e03431a',
        hash: '0x0118d156c8b40c92dd6ef10a09ab967904e1c25fb42ec799e80e0a6271013e46',
        // 131325 bytes long i.e. ~128KB
        networkSerializedHexLength: 262652, // 0x included
        serialized:
          '0x03f88a0180808083ffffff941f738d535998ba73b31f38f1ecf6a6ad013eaa208080c08405f5e100e1a00172ff1d4f354eebdb3cd0cb64e41ac584359094373fd5f979bcccbd6072d93680a03d8cacf503f773c3ae4eed2b38ba68859063bc5ad253a4fb456b1295061f1e0ba0616727b04ef78f58d2f521774c6261396fc21eac725ba2a2d89758eae171effb',
      }

      const blobs = getBlobs('hello world')

      const commitments = blobsToCommitments(kzg.lib, blobs)
      const proofs = blobsToProofs(kzg.lib, blobs, commitments)

      const wrapper = hexToBytes(serialized4844TxData.tx as PrefixedHexString)
      const deserializedTx = createBlob4844TxFromSerializedNetworkWrapper(wrapper, {
        common,
      })
      const jsonData = deserializedTx.toJSON()
      assert.deepEqual(txData, jsonData as any, `toJSON should give correct json (${kzg.label})`)

      assert.strictEqual(
        deserializedTx.blobs?.length,
        1,
        `contains the correct number of blobs (${kzg.label})`,
      )
      assert.strictEqual(deserializedTx.blobs![0], blobs[0], `blobs should match (${kzg.label})`)
      assert.strictEqual(
        deserializedTx.kzgCommitments![0],
        commitments[0],
        `commitments should match (${kzg.label})`,
      )
      assert.strictEqual(
        deserializedTx.kzgProofs![0],
        proofs[0],
        `proofs should match (${kzg.label})`,
      )

      const unsignedHash = bytesToHex(deserializedTx.getHashedMessageToSign())
      const hash = bytesToHex(deserializedTx.hash())
      const networkSerialized = bytesToHex(deserializedTx.serializeNetworkWrapper())
      const serialized = bytesToHex(deserializedTx.serialize())
      const sender = deserializedTx.getSenderAddress().toString()
      assert.strictEqual(
        networkSerialized,
        serialized4844TxData.tx,
        `network serialization should match (${kzg.label})`,
      )

      assert.deepEqual(
        txMeta,
        {
          unsignedHash,
          hash,
          serialized,
          sender,
          networkSerializedHexLength: networkSerialized.length,
        },
        `txMeta should match (${kzg.label})`,
      )
    }
  })
})
