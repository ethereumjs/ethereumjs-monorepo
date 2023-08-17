import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { bigIntToHex, bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { baseRequest, gethGenesisStartLondon, params, setupChain } from '../helpers'

import pow = require('./../../testdata/geth-genesis/pow.json')

import type { Chain } from '../../../src/blockchain'
import type { VMExecution } from '../../../src/execution'

const method = 'eth_feeHistory'

const produceFakeGasUsedBlock = async (execution: VMExecution, chain: Chain, gasUsed: bigint) => {
  const { vm } = execution
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.copy()
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
  await execution.run()
}

tape(`${method}: should return 12.5% increased baseFee if parent block is full`, async (t) => {
  const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
  const gasUsed = bytesToBigInt(hexToBytes(pow.gasLimit))

  await produceFakeGasUsedBlock(execution, chain, gasUsed)
  const req = params(method, ['0x2', 'latest', []])

  const expectRes = (res: any) => {
    const [, previousBaseFee, nextBaseFee] = res.body.result.baseFeePerGas as [
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

    t.equal(increase, 0.125)
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: should return 12.5% decreased base fee if the block is empty`, async (t) => {
  const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
  const gasUsed = BigInt(0)

  await produceFakeGasUsedBlock(execution, chain, gasUsed)
  const req = params(method, ['0x2', 'latest', []])

  const expectRes = (res: any) => {
    const [, previousBaseFee, nextBaseFee] = res.body.result.baseFeePerGas as [
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

    t.equal(increase, -0.125)
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(
  `${method}: should return initial base fee if the block number is london hard fork`,
  async (t) => {
    const common = new Common({
      eips: [1559],
      chain: CommonChain.Mainnet,
      hardfork: Hardfork.London,
    })

    const initialBaseFee = common.param('gasConfig', 'initialBaseFee')
    const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

    const req = params(method, ['0x1', 'latest', []])

    const expectRes = (res: any) => {
      const [baseFee] = res.body.result.baseFeePerGas as [string]

      t.equal(bytesToBigInt(hexToBytes(baseFee)), initialBaseFee)
    }

    await baseRequest(t, server, req, 200, expectRes)
  }
)

tape(`${method}: should return 0x0 for base fees requested before eip-1559`, async (t) => {
  const { chain, execution, server } = await setupChain(pow, 'pow')
  const gasUsed = BigInt(0)

  await produceFakeGasUsedBlock(execution, chain, gasUsed)
  const req = params(method, ['0x1', 'latest', []])

  const expectRes = (res: any) => {
    const [previousBaseFee, nextBaseFee] = res.body.result.baseFeePerGas as [string, string]

    t.equal(previousBaseFee, '0x0')
    t.equal(nextBaseFee, '0x0')
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: should return correct gas used ratios`, async (t) => {
  const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
  const gasUsed = bytesToBigInt(hexToBytes(pow.gasLimit)) / 2n

  await produceFakeGasUsedBlock(execution, chain, gasUsed)
  const req = params(method, ['0x2', 'latest', []])

  const expectRes = (res: any) => {
    const [genesisGasUsedRatio, nextGasUsedRatio] = res.body.result.gasUsedRatio as [number, number]

    t.equal(genesisGasUsedRatio, 0)
    t.equal(nextGasUsedRatio, 0.5)
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: should throw error if block count is below 1`, async (t) => {
  const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

  const req = params(method, ['0x0', 'latest', []])
  const expectRes = (res: any) => {
    t.assert('error' in res.body)
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: should throw error if block count is above 1024`, async (t) => {
  const { server } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')

  const req = params(method, ['0x401', 'latest', []])
  const expectRes = (res: any) => {
    t.assert('error' in res.body)
  }

  await baseRequest(t, server, req, 200, expectRes)
})
