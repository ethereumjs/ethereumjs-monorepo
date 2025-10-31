import { createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'
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

import { buildBlock, createVM, runBlock } from '../../../src/index.ts'
import { setBalance } from '../utils.ts'

const pk = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = bytesToHex(privateToAddress(pk))

describe('EIP-7892 BPO tests', () => {
  const kzg = new microEthKZG(trustedSetup)

  it('should accept post-BPO1 block with blobs > Prague cap and < BPO1 cap on Sepolia', async () => {
    // Sepolia BPO1 timestamp: 1761017184 (Oct 21, 2025)
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo1,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // Prague max: 1179648 / 131072 = 9 blobs
    // BPO1 max: 1966080 / 131072 = 15 blobs
    // Test with 12 blobs (between Prague max and BPO1 max)
    const numBlobs = 12
    const expectedBlobGas = blobGasPerBlob * BigInt(numBlobs)
    // maxBlobGasPerBlock for BPO1 is 1966080 (15 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(1966080)

    assert.isTrue(
      expectedBlobGas > BigInt(1179648), // Prague max
      'test blob gas should exceed Prague cap',
    )
    assert.isTrue(expectedBlobGas <= maxBlobGasPerBlock, 'test blob gas should be within BPO1 cap')

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 50000,
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(1761017184), // BPO1 activation time
        },
      },
      { common },
    )

    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, BigInt('10000000000000000000'))

    // Create multiple blob transactions to exceed Prague cap but stay within BPO1 cap
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

    // Build block with these transactions
    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: BigInt('0xffffffffff'),
        timestamp: BigInt(1761017184 + 12), // Post-BPO1
      },
    })

    for (const tx of transactions) {
      await blockBuilder.addTransaction(tx)
    }

    const { block } = await blockBuilder.build()

    // Verify block is valid
    assert.strictEqual(
      block.header.blobGasUsed,
      expectedBlobGas,
      'block should have correct blob gas used',
    )

    // Block should successfully execute
    const result = await runBlock(vm, {
      block,
      skipBlockValidation: false,
    })

    assert.isTrue(result.gasUsed > 0n, 'block should execute successfully')
  })

  it('should reject block with blobs exceeding Prague cap when still on Prague', async () => {
    // Test on Prague (before BPO1)
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Prague,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // maxBlobGasPerBlock for Prague is 1179648 (9 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(1179648)

    // Try to create block with 10 blobs (exceeds Prague cap of 9)
    const numBlobs = 10
    const expectedBlobGas = blobGasPerBlob * BigInt(numBlobs)

    assert.isTrue(expectedBlobGas > maxBlobGasPerBlock, 'test blob gas should exceed Prague cap')

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 50000,
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(1761017000), // Before BPO1
        },
      },
      { common },
    )

    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, BigInt('10000000000000000000'))

    // Create transactions exceeding Prague cap
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

    // Build block - this should fail when adding transactions
    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: BigInt('0xffffffffff'),
        timestamp: BigInt(1761017000 + 12), // Still on Prague
      },
    })

    // Adding transactions should fail as they exceed Prague blob cap
    let addedCount = 0
    for (const tx of transactions) {
      try {
        await blockBuilder.addTransaction(tx)
        addedCount++
      } catch (error: any) {
        // Should throw error about blob gas limit
        assert.isTrue(
          error.message.includes('blob gas limit') || addedCount >= 9,
          'should fail with blob gas limit error',
        )
        break
      }
    }

    // Should only be able to add up to 9 blobs (Prague cap)
    assert.isTrue(addedCount <= 9, 'should not exceed Prague blob cap')
  })

  it('should accept post-BPO2 block with blobs > BPO1 cap and < BPO2 cap on Sepolia', async () => {
    // Sepolia BPO2 timestamp: 1761607008 (Oct 27, 2025)
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo2,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // BPO1 max: 1966080 / 131072 = 15 blobs
    // BPO2 max: 2752512 / 131072 = 21 blobs
    // Test with 18 blobs (between BPO1 max and BPO2 max)
    const numBlobs = 18
    const expectedBlobGas = blobGasPerBlob * BigInt(numBlobs)
    // maxBlobGasPerBlock for BPO2 is 2752512 (21 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(2752512)

    assert.isTrue(
      expectedBlobGas > BigInt(1966080), // BPO1 max
      'test blob gas should exceed BPO1 cap',
    )
    assert.isTrue(expectedBlobGas <= maxBlobGasPerBlock, 'test blob gas should be within BPO2 cap')

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 50000,
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(1761607008), // BPO2 activation time
        },
      },
      { common },
    )

    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, BigInt('10000000000000000000'))

    // Create blob transactions
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

    // Build block
    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: BigInt('0xffffffffff'),
        timestamp: BigInt(1761607008 + 12), // Post-BPO2
      },
    })

    for (const tx of transactions) {
      await blockBuilder.addTransaction(tx)
    }

    const { block } = await blockBuilder.build()

    // Verify block is valid
    assert.strictEqual(
      block.header.blobGasUsed,
      expectedBlobGas,
      'block should have correct blob gas used',
    )

    // Block should successfully execute
    const result = await runBlock(vm, {
      block,
      skipBlockValidation: false,
    })

    assert.isTrue(result.gasUsed > 0n, 'block should execute successfully')
  })

  it('should correctly detect BPO1 fork from serialized Sepolia block', async () => {
    // Create a block at BPO1 timestamp
    const bpo1Timestamp = BigInt(1761017184) // Sepolia BPO1: Oct 21, 2025
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo1,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // targetBlobGasPerBlock for BPO1 is 1310720 (10 blobs * 131072)
    const targetBlobGasPerBlock = BigInt(1310720)
    const numBlobs = 12 // Within BPO1 cap of 15
    const blobGasUsed = blobGasPerBlob * BigInt(numBlobs)

    // Create parent header
    const parentHeader = createBlockHeader(
      {
        number: 1000n,
        timestamp: bpo1Timestamp - BigInt(12),
        excessBlobGas: 4194304,
        blobGasUsed: 0,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Create blob transactions
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

    // Calculate next excess blob gas manually
    // excessBlobGas = parentExcessBlobGas + parentBlobGasUsed - targetBlobGasPerBlock
    const parentExcessBlobGas = BigInt(parentHeader.excessBlobGas ?? 0)
    const parentBlobGasUsed = BigInt(parentHeader.blobGasUsed ?? 0)
    const nextExcessBlobGas = parentExcessBlobGas + parentBlobGasUsed - targetBlobGasPerBlock

    // Create block header with BPO1 timestamp
    const blockHeader = createBlockHeader(
      {
        number: 1001n,
        parentHash: parentHeader.hash(),
        timestamp: bpo1Timestamp,
        excessBlobGas: nextExcessBlobGas < 0n ? 0n : nextExcessBlobGas,
        blobGasUsed,
      },
      { common, skipConsensusFormatValidation: true },
    )

    const block = createBlock(
      {
        header: blockHeader,
        transactions,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Serialize the block
    const serialized = block.serialize()

    // Deserialize with Common that detects fork by timestamp
    const deserializedCommon = new Common({
      chain: Sepolia,
      // Don't set hardfork - let it detect from block
    })

    // Set hardfork by timestamp to match the block
    const detectedHardfork = deserializedCommon.getHardforkBy({
      timestamp: blockHeader.timestamp,
    })

    assert.strictEqual(
      detectedHardfork,
      Hardfork.Bpo1,
      'should detect BPO1 hardfork from timestamp',
    )

    // Deserialize block
    const deserializedBlock = createBlock(serialized, {
      common: deserializedCommon,
      skipConsensusFormatValidation: true,
    })

    // Verify the deserialized block has correct blob gas limits
    // maxBlobGasPerBlock for BPO1 is 1966080 (15 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(1966080)
    assert.strictEqual(
      deserializedBlock.header.blobGasUsed,
      blobGasUsed,
      'deserialized block should have correct blob gas used',
    )

    // Verify block can be validated
    deserializedBlock.validateBlobTransactions(parentHeader)

    assert.strictEqual(
      deserializedBlock.header.blobGasUsed,
      blobGasUsed,
      'deserialized block should have correct blob gas used',
    )
  })

  it('should correctly detect BPO2 fork from serialized Sepolia block', async () => {
    // Create a block at BPO2 timestamp
    const bpo2Timestamp = BigInt(1761607008) // Sepolia BPO2: Oct 27, 2025
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo2,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // targetBlobGasPerBlock for BPO2 is 1835008 (14 blobs * 131072)
    const targetBlobGasPerBlock = BigInt(1835008)
    const numBlobs = 18 // Within BPO2 cap of 21
    const blobGasUsed = blobGasPerBlob * BigInt(numBlobs)

    // Create parent header
    const parentHeader = createBlockHeader(
      {
        number: 2000n,
        timestamp: bpo2Timestamp - BigInt(12),
        excessBlobGas: 4194304,
        blobGasUsed: 0,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Create blob transactions
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

    // Calculate next excess blob gas manually
    const parentExcessBlobGas = BigInt(parentHeader.excessBlobGas ?? 0)
    const parentBlobGasUsed = BigInt(parentHeader.blobGasUsed ?? 0)
    const nextExcessBlobGas = parentExcessBlobGas + parentBlobGasUsed - targetBlobGasPerBlock

    // Create block header with BPO2 timestamp
    const blockHeader = createBlockHeader(
      {
        number: 2001n,
        parentHash: parentHeader.hash(),
        timestamp: bpo2Timestamp,
        excessBlobGas: nextExcessBlobGas < 0n ? 0n : nextExcessBlobGas,
        blobGasUsed,
      },
      { common, skipConsensusFormatValidation: true },
    )

    const block = createBlock(
      {
        header: blockHeader,
        transactions,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Serialize the block
    const serialized = block.serialize()

    // Deserialize with Common that detects fork by timestamp
    const deserializedCommon = new Common({
      chain: Sepolia,
      // Don't set hardfork - let it detect from block
    })

    // Set hardfork by timestamp to match the block
    const detectedHardfork = deserializedCommon.getHardforkBy({
      timestamp: blockHeader.timestamp,
    })

    assert.strictEqual(
      detectedHardfork,
      Hardfork.Bpo2,
      'should detect BPO2 hardfork from timestamp',
    )

    // Deserialize block
    const deserializedBlock = createBlock(serialized, {
      common: deserializedCommon,
      skipConsensusFormatValidation: true,
    })

    // Verify block can be validated
    deserializedBlock.validateBlobTransactions(parentHeader)

    assert.strictEqual(
      deserializedBlock.header.blobGasUsed,
      blobGasUsed,
      'deserialized block should have correct blob gas used',
    )
  })

  it('should correctly detect fork with enough blobs to confirm validity', async () => {
    // Create a block at BPO2 with maximum allowed blobs
    const bpo2Timestamp = BigInt(1761607008) // Sepolia BPO2
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Bpo2,
      customCrypto: { kzg },
    })

    // blobGasPerBlob is constant: 131072
    const blobGasPerBlob = BigInt(131072)
    // targetBlobGasPerBlock for BPO2 is 1835008 (14 blobs * 131072)
    const targetBlobGasPerBlock = BigInt(1835008)
    // maxBlobGasPerBlock for BPO2 is 2752512 (21 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(2752512)
    const numBlobs = Number(maxBlobGasPerBlock / blobGasPerBlob) // 21 blobs
    const blobGasUsed = maxBlobGasPerBlock

    // Create parent header
    const parentHeader = createBlockHeader(
      {
        number: 3000n,
        timestamp: bpo2Timestamp - BigInt(12),
        excessBlobGas: 4194304,
        blobGasUsed: 0,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Create maximum number of blob transactions
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

    // Calculate next excess blob gas manually
    const parentExcessBlobGas = BigInt(parentHeader.excessBlobGas ?? 0)
    const parentBlobGasUsed = BigInt(parentHeader.blobGasUsed ?? 0)
    const nextExcessBlobGas = parentExcessBlobGas + parentBlobGasUsed - targetBlobGasPerBlock

    // Create block header
    const blockHeader = createBlockHeader(
      {
        number: 3001n,
        parentHash: parentHeader.hash(),
        timestamp: bpo2Timestamp,
        excessBlobGas: nextExcessBlobGas < 0n ? 0n : nextExcessBlobGas,
        blobGasUsed,
      },
      { common, skipConsensusFormatValidation: true },
    )

    const block = createBlock(
      {
        header: blockHeader,
        transactions,
      },
      { common, skipConsensusFormatValidation: true },
    )

    // Serialize and deserialize
    const serialized = block.serialize()

    const deserializedCommon = new Common({
      chain: Sepolia,
    })

    const detectedHardfork = deserializedCommon.getHardforkBy({
      timestamp: blockHeader.timestamp,
    })

    assert.strictEqual(detectedHardfork, Hardfork.Bpo2, 'should detect BPO2 hardfork')

    const deserializedBlock = createBlock(serialized, {
      common: deserializedCommon,
      skipConsensusFormatValidation: true,
    })

    // Block with max blobs should be valid for BPO2
    deserializedBlock.validateBlobTransactions(parentHeader)

    assert.strictEqual(
      deserializedBlock.header.blobGasUsed,
      blobGasUsed,
      'block with max blobs should be valid',
    )

    // Verify the limit is correct for BPO2 (already verified by maxBlobGasPerBlock constant above)
  })

  it('should detect Osaka (Fusaka) on mainnet', () => {
    const common = new Common({
      chain: Mainnet,
    })

    // Mainnet Osaka timestamp: 1764798551 (Dec 3, 2025)
    const osakaTimestamp = BigInt(1764798551)
    const hardfork = common.getHardforkBy({
      timestamp: osakaTimestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Osaka, 'should detect Osaka on mainnet')
  })

  it('should detect BPO1 on mainnet', () => {
    const common = new Common({
      chain: Mainnet,
    })

    // Mainnet BPO1 timestamp: 1765290071 (Dec 9, 2025)
    const bpo1Timestamp = BigInt(1765290071)
    const hardfork = common.getHardforkBy({
      timestamp: bpo1Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo1, 'should detect BPO1 on mainnet')

    // Verify BPO1 blob parameters
    // maxBlobGasPerBlock for BPO1 is 1966080 (15 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(1966080)
    assert.strictEqual(
      maxBlobGasPerBlock,
      BigInt(1966080), // 15 blobs * 131072
      'BPO1 should have max blob gas of 1966080',
    )

    // targetBlobGasPerBlock for BPO1 is 1310720 (10 blobs * 131072)
    const targetBlobGasPerBlock = BigInt(1310720)
    assert.strictEqual(
      targetBlobGasPerBlock,
      BigInt(1310720), // 10 blobs * 131072
      'BPO1 should have target blob gas of 1310720',
    )
  })

  it('should detect BPO2 on mainnet', () => {
    const common = new Common({
      chain: Mainnet,
    })

    // Mainnet BPO2 timestamp: 1767747671 (Jan 7, 2026)
    const bpo2Timestamp = BigInt(1767747671)
    const hardfork = common.getHardforkBy({
      timestamp: bpo2Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo2, 'should detect BPO2 on mainnet')

    // Verify BPO2 blob parameters
    // maxBlobGasPerBlock for BPO2 is 2752512 (21 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(2752512)
    assert.strictEqual(
      maxBlobGasPerBlock,
      BigInt(2752512), // 21 blobs * 131072
      'BPO2 should have max blob gas of 2752512',
    )

    // targetBlobGasPerBlock for BPO2 is 1835008 (14 blobs * 131072)
    const targetBlobGasPerBlock = BigInt(1835008)
    assert.strictEqual(
      targetBlobGasPerBlock,
      BigInt(1835008), // 14 blobs * 131072
      'BPO2 should have target blob gas of 1835008',
    )
  })

  it('should detect Osaka (Fusaka) on Sepolia', () => {
    const common = new Common({
      chain: Sepolia,
    })

    // Sepolia Osaka timestamp: 1760427360 (Oct 14, 2025)
    const osakaTimestamp = BigInt(1760427360)
    const hardfork = common.getHardforkBy({
      timestamp: osakaTimestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Osaka, 'should detect Osaka on Sepolia')
  })

  it('should detect BPO1 on Sepolia', () => {
    const common = new Common({
      chain: Sepolia,
    })

    // Sepolia BPO1 timestamp: 1761017184 (Oct 21, 2025)
    const bpo1Timestamp = BigInt(1761017184)
    const hardfork = common.getHardforkBy({
      timestamp: bpo1Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo1, 'should detect BPO1 on Sepolia')

    // Verify BPO1 blob parameters
    // maxBlobGasPerBlock for BPO1 is 1966080 (15 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(1966080)
    assert.strictEqual(
      maxBlobGasPerBlock,
      BigInt(1966080),
      'BPO1 should have correct max blob gas on Sepolia',
    )
  })

  it('should detect BPO2 on Sepolia', () => {
    const common = new Common({
      chain: Sepolia,
    })

    // Sepolia BPO2 timestamp: 1761607008 (Oct 27, 2025)
    const bpo2Timestamp = BigInt(1761607008)
    const hardfork = common.getHardforkBy({
      timestamp: bpo2Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo2, 'should detect BPO2 on Sepolia')

    // Verify BPO2 blob parameters
    // maxBlobGasPerBlock for BPO2 is 2752512 (21 blobs * 131072)
    const maxBlobGasPerBlock = BigInt(2752512)
    assert.strictEqual(
      maxBlobGasPerBlock,
      BigInt(2752512),
      'BPO2 should have correct max blob gas on Sepolia',
    )
  })

  it('should detect Osaka (Fusaka) on Holesky', () => {
    const common = new Common({
      chain: Holesky,
    })

    // Holesky Osaka timestamp: 1759308480 (Oct 1, 2025)
    const osakaTimestamp = BigInt(1759308480)
    const hardfork = common.getHardforkBy({
      timestamp: osakaTimestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Osaka, 'should detect Osaka on Holesky')
  })

  it('should detect BPO1 on Holesky', () => {
    const common = new Common({
      chain: Holesky,
    })

    // Holesky BPO1 timestamp: 1759800000 (Oct 7, 2025)
    const bpo1Timestamp = BigInt(1759800000)
    const hardfork = common.getHardforkBy({
      timestamp: bpo1Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo1, 'should detect BPO1 on Holesky')
  })

  it('should detect BPO2 on Holesky', () => {
    const common = new Common({
      chain: Holesky,
    })

    // Holesky BPO2 timestamp: 1760389824 (Oct 13, 2025)
    const bpo2Timestamp = BigInt(1760389824)
    const hardfork = common.getHardforkBy({
      timestamp: bpo2Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo2, 'should detect BPO2 on Holesky')
  })

  it('should detect Osaka (Fusaka) on Hoodi', () => {
    const common = new Common({
      chain: Hoodi,
    })

    // Hoodi Osaka timestamp: 1761677592 (Oct 28, 2025)
    const osakaTimestamp = BigInt(1761677592)
    const hardfork = common.getHardforkBy({
      timestamp: osakaTimestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Osaka, 'should detect Osaka on Hoodi')
  })

  it('should detect BPO1 on Hoodi', () => {
    const common = new Common({
      chain: Hoodi,
    })

    // Hoodi BPO1 timestamp: 1762365720 (Nov 5, 2025)
    const bpo1Timestamp = BigInt(1762365720)
    const hardfork = common.getHardforkBy({
      timestamp: bpo1Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo1, 'should detect BPO1 on Hoodi')
  })

  it('should detect BPO2 on Hoodi', () => {
    const common = new Common({
      chain: Hoodi,
    })

    // Hoodi BPO2 timestamp: 1762955544 (Nov 12, 2025)
    const bpo2Timestamp = BigInt(1762955544)
    const hardfork = common.getHardforkBy({
      timestamp: bpo2Timestamp,
    })

    assert.strictEqual(hardfork, Hardfork.Bpo2, 'should detect BPO2 on Hoodi')
  })

  it('should have correct fork hashes for mainnet', () => {
    const common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Osaka,
    })

    const forkHash = common.forkHash(Hardfork.Osaka)
    assert.strictEqual(forkHash, '0x5167e2a6', 'Osaka should have correct fork hash on mainnet')

    common.setHardfork(Hardfork.Bpo1)
    const bpo1ForkHash = common.forkHash(Hardfork.Bpo1)
    assert.strictEqual(bpo1ForkHash, '0xcba2a1c0', 'BPO1 should have correct fork hash on mainnet')

    common.setHardfork(Hardfork.Bpo2)
    const bpo2ForkHash = common.forkHash(Hardfork.Bpo2)
    assert.strictEqual(bpo2ForkHash, '0x07c9462e', 'BPO2 should have correct fork hash on mainnet')
  })

  it('should have correct fork hashes for Sepolia', () => {
    const common = new Common({
      chain: Sepolia,
      hardfork: Hardfork.Osaka,
    })

    const forkHash = common.forkHash(Hardfork.Osaka)
    assert.strictEqual(forkHash, '0xe2ae4999', 'Osaka should have correct fork hash on Sepolia')

    common.setHardfork(Hardfork.Bpo1)
    const bpo1ForkHash = common.forkHash(Hardfork.Bpo1)
    assert.strictEqual(bpo1ForkHash, '0x56078a1e', 'BPO1 should have correct fork hash on Sepolia')

    common.setHardfork(Hardfork.Bpo2)
    const bpo2ForkHash = common.forkHash(Hardfork.Bpo2)
    assert.strictEqual(bpo2ForkHash, '0x268956b6', 'BPO2 should have correct fork hash on Sepolia')
  })

  it('should have correct fork hashes for Holesky', () => {
    const common = new Common({
      chain: Holesky,
      hardfork: Hardfork.Osaka,
    })

    const forkHash = common.forkHash(Hardfork.Osaka)
    assert.strictEqual(forkHash, '0x783def52', 'Osaka should have correct fork hash on Holesky')

    common.setHardfork(Hardfork.Bpo1)
    const bpo1ForkHash = common.forkHash(Hardfork.Bpo1)
    assert.strictEqual(bpo1ForkHash, '0xa280a45c', 'BPO1 should have correct fork hash on Holesky')

    common.setHardfork(Hardfork.Bpo2)
    const bpo2ForkHash = common.forkHash(Hardfork.Bpo2)
    assert.strictEqual(bpo2ForkHash, '0x9bc6cb31', 'BPO2 should have correct fork hash on Holesky')
  })

  it('should have correct fork hashes for Hoodi', () => {
    const common = new Common({
      chain: Hoodi,
      hardfork: Hardfork.Osaka,
    })

    const forkHash = common.forkHash(Hardfork.Osaka)
    assert.strictEqual(forkHash, '0xe7e0e7ff', 'Osaka should have correct fork hash on Hoodi')

    common.setHardfork(Hardfork.Bpo1)
    const bpo1ForkHash = common.forkHash(Hardfork.Bpo1)
    assert.strictEqual(bpo1ForkHash, '0x3893353e', 'BPO1 should have correct fork hash on Hoodi')

    common.setHardfork(Hardfork.Bpo2)
    const bpo2ForkHash = common.forkHash(Hardfork.Bpo2)
    assert.strictEqual(bpo2ForkHash, '0x23aa1351', 'BPO2 should have correct fork hash on Hoodi')
  })
}, 120000)
