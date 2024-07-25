import { createBlockFromRPC } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

import { runBlock } from '../src/index.js'
import { VM } from '../src/vm.js'

import goerliBlock2 from './testData/goerliBlock2.json'

const main = async () => {
  const common = new Common({ chain: Chain.Goerli, hardfork: 'london' })
  const vm = await VM.create({ common, setHardfork: true })

  const block = createBlockFromRPC(goerliBlock2, undefined, { common })
  const result = await runBlock(vm, { block, generate: true, skipHeaderValidation: true }) // we skip header validaiton since we are running a block without the full Ethereum history available
  console.log(`The state root for Goerli block 2 is ${bytesToHex(result.stateRoot)}`)
}

void main()
