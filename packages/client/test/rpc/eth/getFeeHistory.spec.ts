import { paramsBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createTx } from '@ethereumjs/tx'
import { BIGINT_0, bigIntToHex, bytesToBigInt, hexToBytes } from '@ethereumjs/util'
import { buildBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { SIGNER_G, powData } from '@ethereumjs/testdata'
import { getRPCClient, gethGenesisStartLondon, setupChain } from '../helpers.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { Chain } from '../../../src/blockchain/index.ts'
import type { VMExecution } from '../../../src/execution/index.ts'

const method = 'eth_feeHistory'

/*const privateKey4844 = hexToBytes(
  '0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
)
const p4844Address = createAddressFromPrivateKey(privateKey4844)
const kzg = new microEthKZG(trustedSetup)*/

const produceFakeGasUsedBlock = async (execution: VMExecution, chain: Chain, gasUsed: bigint) => {
  const { vm } = execution
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.shallowCopy()
  // Set block's gas used to max
  const blockBuilder = await buildBlock(vmCopy, {
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
      gasUsed: bigIntToHex(gasUsed),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  blockBuilder.gasUsed = gasUsed

  const { block } = await blockBuilder.build()
  await chain.putBlocks([block], false)
  //await execution.run()
}

/**
 * This method builds a block on top of the current head block
 * It allows two optional parameters which will determine the gas limit + maxPriorityFeesPerGas
 * The txs will all completely revert, so all gas limit of the tx will be consumed
 * @param execution
 * @param chain
 * @param maxPriorityFeesPerGas Optional array of the maxPriorityFeesPerGas per tx
 * @param gasLimits Optional array of the gasLimit per tx. This array length should be equal to maxPriorityFeesPerGas length
 */
const produceBlockWithTx = async (
  execution: VMExecution,
  chain: Chain,
  maxPriorityFeesPerGas: bigint[] = [BigInt(0xff)],
  gasLimits: bigint[] = [BigInt(0xfffff)],
) => {
  const { vm } = execution
  const account = await vm.stateManager.getAccount(SIGNER_G.address)
  let nonce = account?.nonce ?? BIGINT_0
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.shallowCopy()
  // Set block's gas used to max
  const blockBuilder = await buildBlock(vmCopy, {
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  for (let i = 0; i < maxPriorityFeesPerGas.length; i++) {
    const maxPriorityFeePerGas = maxPriorityFeesPerGas[i]
    const gasLimit = gasLimits[i]
    await blockBuilder.addTransaction(
      createTx(
        {
          type: 2,
          gasLimit,
          maxFeePerGas: 0xffffffff,
          maxPriorityFeePerGas,
          nonce,
          data: '0xFE',
        },
        { common: vmCopy.common },
      ).sign(SIGNER_G.privateKey),
    )
    nonce++
  }

  const { block } = await blockBuilder.build()
  await chain.putBlocks([block], false)
  await execution.run()
}

/**
 * This method builds a block on top of the current head block and will insert 4844 txs
 * @param execution
 * @param chain
 * @param blobsCount Array of blob txs to produce. The amount of blobs in here is thus the amount of blobs per tx.
 */
/*const produceBlockWith4844Tx = async (
  execution: VMExecution,
  chain: Chain,
  blobsCount: number[],
) => {
  // 4844 sample blob
  const sampleBlob = getBlobs('hello world')
  const commitment = blobsToCommitments(kzg, sampleBlob)
  const blobVersionedHash = commitmentsToVersionedHashes(commitment)

  const { vm } = execution
  const account = await vm.stateManager.getAccount(p4844Address)
  let nonce = account?.nonce ?? BIGINT_0
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.shallowCopy()
  // Set block's gas used to max
  const blockBuilder = await buildBlock(vmCopy, {
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  for (let i = 0; i < blobsCount.length; i++) {
    const blobVersionedHashes = [] as PrefixedHexString[]
    const blobs = [] as PrefixedHexString[]
    const kzgCommitments = [] as PrefixedHexString[]
    const to = createZeroAddress()
    if (blobsCount[i] > 0) {
      for (let blob = 0; blob < blobsCount[i]; blob++) {
        blobVersionedHashes.push(...blobVersionedHash)
        blobs.push(...sampleBlob)
        kzgCommitments.push(...commitment)
      }
    }
    await blockBuilder.addTransaction(
      createTx(
        {
          type: 3,
          gasLimit: 21000,
          maxFeePerGas: 0xffffffff,
          maxPriorityFeePerGas: BIGINT_256,
          nonce,
          to,
          blobVersionedHashes,
          blobs,
          kzgCommitments,
          maxFeePerBlobGas: BigInt(1000),
        },
        { common: vmCopy.common },
      ).sign(privateKey4844),
    )
    nonce++
  }

  const { block } = await blockBuilder.build()
  await chain.putBlocks([block], true)
  await execution.run()
}*/

describe(method, () => {
  it(`${method}: should return 12.5% increased baseFee if parent block is full`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const gasUsed = bytesToBigInt(hexToBytes(powData.gasLimit))

    // Produce 3 fake blocks on the chain.
    // This also ensures that the correct blocks are being retrieved.
    await produceFakeGasUsedBlock(execution, chain, gasUsed / BigInt(2))
    await produceFakeGasUsedBlock(execution, chain, gasUsed / BigInt(2))
    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRPCClient(server)

    // Expect to retrieve the blocks [2,3]
    const res = await rpc.request(method, ['0x2', 'latest', []])
    const [firstBaseFee, previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [
      PrefixedHexString,
      PrefixedHexString,
      PrefixedHexString,
    ]
    const increase =
      Number(
        (1000n *
          (bytesToBigInt(hexToBytes(nextBaseFee)) - bytesToBigInt(hexToBytes(previousBaseFee)))) /
          bytesToBigInt(hexToBytes(previousBaseFee)),
      ) / 1000

    // Note: this also ensures that block 2,3 are returned, since gas of block 0 -> 1 and 1 -> 2 does not change
    assert.strictEqual(increase, 0.125)
    // Sanity check
    assert.strictEqual(firstBaseFee, previousBaseFee)
    // 2 blocks are requested, but the next baseFee is able to be calculated from the latest block
    // Per spec, also return this. So return 3 baseFeePerGas
    assert.strictEqual(res.result.baseFeePerGas.length, 3)

    // Check that the expected gasRatios of the blocks are correct
    assert.strictEqual(res.result.gasUsedRatio[0], 0.5) // Block 2
    assert.strictEqual(res.result.gasUsedRatio[1], 1) // Block 3

    // No ratios were requested
    assert.deepEqual(res.result.reward, [[], []])

    // oldestBlock is correct
    assert.strictEqual(res.result.oldestBlock, '0x2')
  })

  it(`${method}: should return 12.5% decreased base fee if the block is empty`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const gasUsed = BigInt(0)

    await produceFakeGasUsedBlock(execution, chain, gasUsed)
    const rpc = getRPCClient(server)

    const res = await rpc.request(method, ['0x2', 'latest', []])
    const [, previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [
      PrefixedHexString,
      PrefixedHexString,
      PrefixedHexString,
    ]
    const decrease =
      Number(
        (1000n *
          (bytesToBigInt(hexToBytes(nextBaseFee)) - bytesToBigInt(hexToBytes(previousBaseFee)))) /
          bytesToBigInt(hexToBytes(previousBaseFee)),
      ) / 1000

    assert.strictEqual(decrease, -0.125)
  })

  it(`${method}: should return initial base fee if the block number is london hard fork`, async () => {
    const common = new Common({
      eips: [1559],
      chain: Mainnet,
      hardfork: Hardfork.London,
      params: paramsBlock,
    })

    const initialBaseFee = common.param('initialBaseFee')
    const { server } = await setupChain(gethGenesisStartLondon(powData), 'powLondon')

    const rpc = getRPCClient(server)

    const res = await rpc.request(method, ['0x1', 'latest', []])

    const [baseFee] = res.result.baseFeePerGas as [PrefixedHexString]

    assert.strictEqual(bytesToBigInt(hexToBytes(baseFee)), initialBaseFee)
  })

  it(`${method}: should return 0x0 for base fees requested before eip-1559`, async () => {
    const { chain, execution, server } = await setupChain(powData, 'pow')
    const gasUsed = BigInt(0)

    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRPCClient(server)

    const res = await rpc.request(method, ['0x1', 'latest', []])

    const [previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [
      PrefixedHexString,
      PrefixedHexString,
    ]

    assert.strictEqual(previousBaseFee, '0x0')
    assert.strictEqual(nextBaseFee, '0x0')
  })

  it(`${method}: should return correct gas used ratios`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const gasUsed = bytesToBigInt(hexToBytes(powData.gasLimit)) / 2n

    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRPCClient(server)

    const res = await rpc.request(method, ['0x2', 'latest', []])

    const [genesisGasUsedRatio, nextGasUsedRatio] = res.result.gasUsedRatio as [number, number]

    assert.strictEqual(genesisGasUsedRatio, 0)
    assert.strictEqual(nextGasUsedRatio, 0.5)
  })

  it(`${method}: should throw error if block count is below 1`, async () => {
    const { server } = await setupChain(gethGenesisStartLondon(powData), 'powLondon')

    const rpc = getRPCClient(server)

    const req = await rpc.request(method, ['0x0', 'latest', []])
    assert.isDefined(req.error, undefined)
  })

  it(`${method}: should throw error if block count is above 1024`, async () => {
    const { server } = await setupChain(gethGenesisStartLondon(powData), 'powLondon')

    const rpc = getRPCClient(server)

    const req = await rpc.request(method, ['0x401', 'latest', []])
    assert.isDefined(req.error, undefined)
  })

  it(`${method}: should generate reward percentiles with 0s`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    await produceFakeGasUsedBlock(execution, chain, 1n)

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, ['0x1', 'latest', [50, 60]])
    assert.strictEqual(
      parseInt(res.result.reward[0][0]),
      0,
      'Should return 0 for empty block reward percentiles',
    )
    assert.strictEqual(
      res.result.reward[0][1],
      '0x0',
      'Should return 0 for empty block reward percentiles',
    )
  })
  it(`${method}: should generate reward percentiles`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    await produceBlockWithTx(execution, chain)

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, ['0x1', 'latest', [50]])
    assert.isNotEmpty(res.result.reward[0], 'Produced at least one rewards percentile')
  })

  it(`${method}: should generate reward percentiles`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    await produceBlockWithTx(execution, chain)

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, ['0x1', 'latest', [50]])
    assert.isNotEmpty(res.result.reward[0], 'Produced at least one rewards percentile')
  })

  it(`${method}: should generate reward percentiles - sorted check`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const priorityFees = [BigInt(100), BigInt(200)]
    const gasUsed = [BigInt(400000), BigInt(600000)]
    await produceBlockWithTx(execution, chain, priorityFees, gasUsed)

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, ['0x1', 'latest', [40, 100]])
    assert.isNotEmpty(res.result.reward[0], 'Produced at least one rewards percentile')
    const expected = priorityFees.map(bigIntToHex)
    assert.deepEqual(res.result.reward[0], expected)

    // If the txs order is swapped, the output should still be the same
    // This tests that the txs are ordered in ascending order of `priorityFee`
    await produceBlockWithTx(execution, chain, priorityFees.reverse(), gasUsed.reverse())

    const res2 = await rpc.request(method, ['0x1', 'latest', [40, 100]])
    assert.isNotEmpty(res.result.reward[0], 'Produced at least one rewards percentile')
    assert.deepEqual(res2.result.reward[0], expected)
  })

  it(`${method} - reward percentiles - should return the correct reward percentiles`, async () => {
    const { chain, server, execution } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const priorityFees = [BigInt(100), BigInt(200)]
    const gasUsed = [BigInt(500000), BigInt(500000)]
    await produceBlockWithTx(execution, chain, priorityFees, gasUsed)

    const rpc = getRPCClient(server)
    /**
     * In this test, both txs use 50% of the block gas used
     * Request the reward percentiles [10, 20, 60, 100] so expect rewards of:
     * [tx1, tx1, tx2, tx2]
     */
    const res = await rpc.request(method, ['0x1', 'latest', [10, 20, 60, 100]])

    const expected = [priorityFees[0], priorityFees[0], priorityFees[1], priorityFees[1]].map(
      bigIntToHex,
    )
    assert.deepEqual(res.result.reward[0], expected)

    // Check that pre-4844 blocks have 0-filled arrays
    assert.deepEqual(res.result.baseFeePerBlobGas, ['0x0', '0x0'])
    assert.deepEqual(res.result.blobGasUsedRatio, [0])
  })

  /**
   * 4844-related test
   */
  /*it(
    `${method} - Should correctly return the right blob base fees and ratios for a chain with 4844 active`,
    async () => {
      const { chain, execution, server } = await setupChain(eip4844GethGenesis, 'post-merge', {
        engine: true,
        hardfork: Hardfork.Cancun,
        customCrypto: {
          kzg,
        },
      })

      // Start cranking up the initial blob gas for some more "realistic" testing

      for (let i = 0; i < 10; i++) {
        await produceBlockWith4844Tx(execution, chain, [6])
      }

      // Now for the actual test: create 6 blocks each with a decreasing amount of blobs
      for (let i = 6; i > 0; i--) {
        await produceBlockWith4844Tx(execution, chain, [i])
      }

      const rpc = getRPCClient(server)

      const res = await rpc.request(method, ['0x6', 'latest', []])

      const head = await chain.getCanonicalHeadBlock()

      const expBlobGas = []
      const expRatio = [1, 5 / 6, 4 / 6, 3 / 6, 2 / 6, 1 / 6]

      for (let i = 5; i >= 0; i--) {
        const blockNumber = head.header.number - BigInt(i)
        const block = await chain.getBlock(blockNumber)
        expBlobGas.push(bigIntToHex(block.header.getBlobGasPrice()))
      }

      expBlobGas.push(bigIntToHex(head.header.calcNextBlobGasPrice(head.common)))

      assert.deepEqual(res.result.baseFeePerBlobGas, expBlobGas)
      assert.deepEqual(res.result.blobGasUsedRatio, expRatio)
    },
    {
      timeout: 60000,
    },
  )*/
})
