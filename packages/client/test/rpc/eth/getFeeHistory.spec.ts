import { bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { baseRequest, gethGenesisStartLondon, params, setupChain } from '../helpers'

import pow = require('./../../testdata/geth-genesis/pow.json')

import type { Chain } from '../../../src/blockchain'
import type { VMExecution } from '../../../src/execution'

const method = 'eth_feeHistory'

const produceFakeBlock = async (execution: VMExecution, chain: Chain, gasUsed: string) => {
  const { vm } = execution
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.copy()
  // Set block's gas used to max
  const blockBuilder = await vmCopy.buildBlock({
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
      gasUsed,
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  const block = await blockBuilder.build()
  await chain.putBlocks([block], false)
  await execution.run()
}

tape.only(
  `${method}: should return 12.5% increased baseFee if parent block is 100% full`,
  async (t) => {
    const { chain, server, execution } = await setupChain(gethGenesisStartLondon(pow), 'powLondon')
    const gasLimit = pow.gasLimit

    await produceFakeBlock(execution, chain, gasLimit)
    const req = params(method, ['0x1', 'latest', [20, 30]])

    const expectRes = (res: any) => {
      const [previousBaseFee, nextBaseFee] = res.body.result.baseFeePerGas as [string, string]
      const increase =
        Number(
          (1000n *
            (bytesToBigInt(hexToBytes(nextBaseFee)) - bytesToBigInt(hexToBytes(previousBaseFee)))) /
            bytesToBigInt(hexToBytes(previousBaseFee))
        ) / 1000

      t.equal(increase, 0.125)
    }

    await baseRequest(t, server, req, 200, expectRes)
  }
)
