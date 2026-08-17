import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Sepolia } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  createAddressFromString,
  getBlobs,
  hexToBytes,
  privateToAddress,
  randomBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import { buildBlock, createVM } from '../../../src/index.ts'
import { setBalance } from '../utils.ts'

const pk = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = bytesToHex(privateToAddress(pk))

describe('EIP-7892 BPO tests', () => {
  const kzg = new microEthKZG(trustedSetup)

  it('should accept block with BPO1 blob parameters', async () => {
    // Sepolia BPO1 timestamp: 1761017184
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo1,
      customCrypto: { kzg },
    })
    // Override getHardforkBy to avoid genesis block validation conflict
    common.getHardforkBy = () => Hardfork.Bpo1

    const blobGasPerBlob = BigInt(131072)
    const numBlobs = 12 // Within BPO1 cap
    const expectedBlobGas = blobGasPerBlob * BigInt(numBlobs)

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 300000, // High enough to accommodate 12 transactions
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(1761017184 - 100),
        },
      },
      { common, skipConsensusFormatValidation: true },
    )

    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
      hardforkByHeadBlockNumber: false, // Disable automatic HF detection to avoid conflict
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, BigInt('10000000000000000000'))

    const transactions = []
    for (let i = 0; i < numBlobs; i++) {
      const blobs = getBlobs(`blob data ${i}`)
      const commitments = blobsToCommitments(kzg, blobs)
      const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
      const proofs = blobsToProofs(kzg, blobs, commitments)
      const tx = createBlob4844Tx(
        {
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
          maxFeePerGas: BigInt('10000000000'),
          maxFeePerBlobGas: BigInt('100000000'),
          gasLimit: BigInt('21000'),
          to: randomBytes(20),
          nonce: BigInt(i),
        },
        { common },
      ).sign(pk)
      transactions.push(tx)
    }

    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: BigInt(300000), // Same as genesis for simplicity
        timestamp: BigInt(1761017184 + 12),
      },
    })

    for (const tx of transactions) {
      await blockBuilder.addTransaction(tx)
    }

    const { block } = await blockBuilder.build()
    assert.strictEqual(
      block.header.blobGasUsed,
      expectedBlobGas,
      'should have correct blob gas used',
    )

    // Block has already been executed by build(), just verify it's valid
    assert.isTrue(block.header.gasUsed > 0n, 'block should execute successfully')
  }, 120000)

  it('should accept block with BPO2 blob parameters', async () => {
    // Sepolia BPO2 timestamp: 1761607008
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo2,
      customCrypto: { kzg },
    })
    // Override getHardforkBy to avoid genesis block validation conflict
    common.getHardforkBy = () => Hardfork.Bpo2

    const blobGasPerBlob = BigInt(131072)
    const numBlobs = 18 // Within BPO2 cap
    const expectedBlobGas = blobGasPerBlob * BigInt(numBlobs)

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 400000, // High enough to accommodate 18 transactions
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(1761607008 - 100),
        },
      },
      { common, skipConsensusFormatValidation: true },
    )

    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
      hardforkByHeadBlockNumber: false, // Disable automatic HF detection to avoid conflict
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, BigInt('10000000000000000000'))

    const transactions = []
    for (let i = 0; i < numBlobs; i++) {
      const blobs = getBlobs(`blob data ${i}`)
      const commitments = blobsToCommitments(kzg, blobs)
      const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
      const proofs = blobsToProofs(kzg, blobs, commitments)
      const tx = createBlob4844Tx(
        {
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
          maxFeePerGas: BigInt('10000000000'),
          maxFeePerBlobGas: BigInt('100000000'),
          gasLimit: BigInt('21000'),
          to: randomBytes(20),
          nonce: BigInt(i),
        },
        { common },
      ).sign(pk)
      transactions.push(tx)
    }

    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: BigInt(400000), // Same as genesis for simplicity
        timestamp: BigInt(1761607008 + 12),
      },
    })

    for (const tx of transactions) {
      await blockBuilder.addTransaction(tx)
    }

    const { block } = await blockBuilder.build()
    assert.strictEqual(
      block.header.blobGasUsed,
      expectedBlobGas,
      'should have correct blob gas used',
    )

    // Block has already been executed by build(), just verify it's valid
    assert.isTrue(block.header.gasUsed > 0n, 'block should execute successfully')
  }, 120000)
})
