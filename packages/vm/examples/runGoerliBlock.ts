import type { JSONRPCBlock } from '@ethereumjs/block'
import { createBlockFromRPC } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'
import { bytesToHex } from '@ethereumjs/util'

import { createVM, runBlock } from '../src/index.ts'

import goerliBlock2 from './testData/goerliBlock2.json'

const main = async () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: 'london' })
  const vm = await createVM({ common, setHardfork: true })

  const block = createBlockFromRPC(goerliBlock2 as JSONRPCBlock, undefined, { common })
  const result = await runBlock(vm, { block, generate: true, skipHeaderValidation: true }) // we skip header validation since we are running a block without the full Ethereum history available
  console.log(`The state root for Goerli block 2 is ${bytesToHex(result.stateRoot)}`)
}

void main()
