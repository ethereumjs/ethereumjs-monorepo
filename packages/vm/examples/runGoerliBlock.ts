import { Block } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import goerliBlock2 from './testData/goerliBlock2.json'

const main = async () => {
  const common = new Common({ chain: Chain.Goerli, hardfork: 'london' })
  const vm = await VM.create({ common, setHardfork: true })

  const block = Block.fromBlockData(goerliBlock2, {
    setHardfork: true,
    skipConsensusFormatValidation: true,
  })
  const result = await vm.runBlock({ block, generate: true })
  console.log(`The state root for Goerli block 2 is ${bytesToHex(result.stateRoot)}`)
}

main()
