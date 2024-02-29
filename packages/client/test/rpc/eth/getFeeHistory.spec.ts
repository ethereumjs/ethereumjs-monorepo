import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { bigIntToHex, bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import pow from '../../testdata/geth-genesis/pow.json'
import { getRpcClient, gethGenesisStartLondon, setupChain } from '../helpers'

import type { Chain } from '../../../src/blockchain'
import type { VMExecution } from '../../../src/execution'

const method = 'eth_feeHistory'

const produceFakeGasUsedBlock = async (execution: VMExecution, chain: Chain, gasUsed: bigint) => {
  const { vm } = execution
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.shallowCopy()
  // Set block's gas used to max
  const blockBuilder = await vmCopy.buildBlock({
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

  const block = await blockBuilder.build()
  await chain.putBlocks([block], false)
  //await execution.run()
}

describe(method, () => {
  it(`${method}: should return 12.5% increased baseFee if parent block is full`, async () => {
    const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
    const gasUsed = bytesToBigInt(hexToBytes(pow.gasLimit))

    // Produce 3 fake blocks on the chain.
    // This also ensures that the correct blocks are being retrieved.
    await produceFakeGasUsedBlock(execution, chain, gasUsed / BigInt(2))
    await produceFakeGasUsedBlock(execution, chain, gasUsed / BigInt(2))
    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRpcClient(server)

    // Expect to retrieve the blocks [2,3]
    const res = await rpc.request(method, ['0x2', 'latest', []])
    const [firstBaseFee, previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [
      string,
      string,
      string
    ]
    const increase =
      Number(
        (1000n *
          (bytesToBigInt(hexToBytes(nextBaseFee)) - bytesToBigInt(hexToBytes(previousBaseFee)))) /
          bytesToBigInt(hexToBytes(previousBaseFee))
      ) / 1000

    // Note: this also ensures that block 2,3 are returned, since gas of block 0 -> 1 and 1 -> 2 does not change
    assert.equal(increase, 0.125)
    // Sanity check
    assert.equal(firstBaseFee, previousBaseFee)
    // 2 blocks are requested, but the next baseFee is able to be calculated from the latest block
    // Per spec, also return this. So return 3 baseFeePerGas
    assert.equal(res.result.baseFeePerGas.length, 3)

    // Check that the expected gasRatios of the blocks are correct
    assert.equal(res.result.gasUsedRatio[0], 0.5) // Block 2
    assert.equal(res.result.gasUsedRatio[1], 1) // Block 3

    // No ratios were requested
    assert.deepEqual(res.result.reward, [[], []])

    // oldestBlock is correct
    assert.equal(res.result.oldestBlock, '0x2')
  })

  it(`${method}: should return 12.5% decreased base fee if the block is empty`, async () => {
    const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
    const gasUsed = BigInt(0)

    await produceFakeGasUsedBlock(execution, chain, gasUsed)
    const rpc = getRpcClient(server)

    const res = await rpc.request(method, ['0x2', 'latest', []])
    const [, previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [string, string, string]
    const increase =
      Number(
        (1000n *
          (bytesToBigInt(hexToBytes(nextBaseFee)) - bytesToBigInt(hexToBytes(previousBaseFee)))) /
          bytesToBigInt(hexToBytes(previousBaseFee))
      ) / 1000

    assert.equal(increase, -0.125)
  })

  it(`${method}: should return initial base fee if the block number is london hard fork`, async () => {
    const common = new Common({
      eips: [1559],
      chain: CommonChain.Mainnet,
      hardfork: Hardfork.London,
    })

    const initialBaseFee = common.param('gasConfig', 'initialBaseFee')
    const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

    const rpc = getRpcClient(server)

    const res = await rpc.request(method, ['0x1', 'latest', []])

    const [baseFee] = res.result.baseFeePerGas as [string]

    assert.equal(bytesToBigInt(hexToBytes(baseFee)), initialBaseFee)
  })

  it(`${method}: should return 0x0 for base fees requested before eip-1559`, async () => {
    const { chain, execution, server } = await setupChain(pow, 'pow')
    const gasUsed = BigInt(0)

    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRpcClient(server)

    const res = await rpc.request(method, ['0x1', 'latest', []])

    const [previousBaseFee, nextBaseFee] = res.result.baseFeePerGas as [string, string]

    assert.equal(previousBaseFee, '0x0')
    assert.equal(nextBaseFee, '0x0')
  })

  it(`${method}: should return correct gas used ratios`, async () => {
    const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
    const gasUsed = bytesToBigInt(hexToBytes(pow.gasLimit)) / 2n

    await produceFakeGasUsedBlock(execution, chain, gasUsed)

    const rpc = getRpcClient(server)

    const res = await rpc.request(method, ['0x2', 'latest', []])

    const [genesisGasUsedRatio, nextGasUsedRatio] = res.result.gasUsedRatio as [number, number]

    assert.equal(genesisGasUsedRatio, 0)
    assert.equal(nextGasUsedRatio, 0.5)
  })

  it(`${method}: should throw error if block count is below 1`, async () => {
    const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

    const rpc = getRpcClient(server)

    const req = await rpc.request(method, ['0x0', 'latest', []])
    assert.ok(req.error !== undefined)
  })

  it(`${method}: should throw error if block count is above 1024`, async () => {
    const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

    const rpc = getRpcClient(server)

    const req = await rpc.request(method, ['0x401', 'latest', []])
    assert.ok(req.error !== undefined)
  })
})
