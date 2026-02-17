import { createBlock } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { goerliBlocks, goerliChainConfig } from '@ethereumjs/testdata'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: 'london' })
  const vm = await createVM({ common })

  const block = createBlock(goerliBlocks[0], { common })
  const result = await runBlock(vm, { block, generate: true, skipHeaderValidation: true }) // we skip header validation since we are running a block without the full Ethereum history available
  console.log(`The state root for the block is ${bytesToHex(result.stateRoot)}`)
}

void main()
