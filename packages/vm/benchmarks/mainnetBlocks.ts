import { readFileSync } from 'fs'
import Benchmark = require('benchmark')
import Common from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import blockFromRPC from '@ethereumjs/block/dist/from-rpc'
import VM from '../dist'
import { getPreState, getBlockchain, verifyResult } from './util'

const BLOCK_FIXTURE = 'benchmarks/fixture/blocks-prestate.json'

const onAdd = async (vm: VM, block: Block, receipts: any) => {
  const vmCopy = vm.copy()

  const result = await vmCopy.runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
  })

  verifyResult(block, result)
}

export async function mainnetBlocks(suite?: Benchmark.Suite, numSamples?: number) {
  let data = JSON.parse(readFileSync(BLOCK_FIXTURE, 'utf8'))
  if (!Array.isArray(data)) data = [data]
  console.log(`Total number of blocks in data set: ${data.length}`)

  numSamples = numSamples ? numSamples : data.length
  console.log(`Number of blocks to sample: ${numSamples}`)
  data = data.slice(0, numSamples)

  const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })

  for (const blockData of data) {
    const block = blockFromRPC(blockData.block, [], { common: common })
    const blockNumber = block.header.number.toNumber()
    const { receipts, preState, blockhashes } = blockData

    const stateManager = await getPreState(preState, common)
    const blockchain = getBlockchain(blockhashes) as any
    const vm = new VM({ stateManager, common, blockchain })

    if (suite) {
      suite.add(`Block ${blockNumber}`, onAdd.bind(vm, block, receipts))
    } else {
      await onAdd(vm, block, receipts)
    }
  }
}
