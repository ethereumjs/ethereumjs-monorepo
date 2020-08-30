import * as fs from 'fs'
import blockFromRPC from '@ethereumjs/block/dist/from-rpc'
import { Block } from '@ethereumjs/block'
import VM from '../dist'
import { getPreState } from './util'
import Common from '@ethereumjs/common'

const BLOCK_FIXTURE = 'benchmarks/fixture/blocks-prestate.json'

const onAdd = async (vm: VM, block: Block) => {
  const vmCopy = vm.copy()
  let result = await vmCopy.runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
  })

  // verify the receipt root, the logs bloom and the gas used after block execution, throw if any of these is not the expected value
  if (
    result.receiptRoot &&
    result.receiptRoot.toString('hex') !== block.header.receiptTrie.toString('hex')
  ) {
    throw new Error('invalid receiptTrie ')
  }
  if (result.logsBloom.toString('hex') !== block.header.bloom.toString('hex')) {
    throw new Error('invalid bloom ')
  }
  if (bufferToInt(block.header.gasUsed) !== Number(result.gasUsed)) {
    throw new Error('invalid gasUsed ')
  }
}

export async function mainnetBlocks(suite: any, numSamples?: number) {
  let data = JSON.parse(fs.readFileSync(BLOCK_FIXTURE, 'utf8'))
  if (!Array.isArray(data)) data = [data]
  console.log(`Total number of blocks in data set: ${data.length}`)

  numSamples = numSamples ? numSamples : data.length
  console.log(`Number of blocks to sample: ${numSamples}`)
  data = data.slice(0, numSamples)

  const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })

  for (const blockData of data) {
    const block = blockFromRPC(blockData.block)
    const blockNumber = block.header.number.toString()

    const stateManager = await getPreState(blockData.preState, common)
    const vm = new VM({ stateManager, common })

    if (suite) {
      suite.add(`Block ${blockNumber}`, onAdd)
    } else {
      onAdd(vm, block)
    }
  }
}
