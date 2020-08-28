import * as fs from 'fs'
import blockFromRPC from '@ethereumjs/block/dist/from-rpc'
import { Block } from '@ethereumjs/block'
import VM from '../dist'
import { getPreState } from './util'
import Common from '@ethereumjs/common'

const onAdd = async (vm: VM, block: Block) => {
  // TODO: validate tx, add receipt and gas usage checks
  await vm.copy().runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
  })
}

const onCycle = (event: any) => {
  console.log(String(event.target))
}

export async function mainnetBlocks(suite: any, blockFixture: string, numSamples?: number) {
  let data = JSON.parse(fs.readFileSync(blockFixture, 'utf8'))
  if (!Array.isArray(data)) data = [data]
  console.log(`Total number of blocks in data set: ${data.length}`)

  numSamples = numSamples ? numSamples : data.length
  console.log(`Number of blocks to sample: ${numSamples}`)
  data = data.slice(0, numSamples)

  for (const blockData of data) {
    const block = blockFromRPC(blockData.block)
    const blockNumber = block.header.number.toString()

    const stateManager = await getPreState(blockData.preState)
    const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
    const vm = new VM({ stateManager, common })

    if (suite) {
      suite.add(`Block ${blockNumber}`, onAdd)
    } else {
      onAdd(vm, block)
    }
  }

  if (suite) {
    suite
      .on('cycle', onCycle)
      .run()
  }
}

const args = process.argv
if (args[2] !== 'mainnetBlocks') {
  mainnetBlocks(undefined, args[2], args[3] ? Number(args[3]) : undefined)
    .then()
    .catch((e: Error) => {
      throw e
    })
}