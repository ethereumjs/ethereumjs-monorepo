import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { BlockHeader } from '@ethereumjs/block'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun })

// TODO: add a more meaningful example including at least one blob tx
const header = BlockHeader.fromHeaderData(
  {
    excessBlobGas: 0n,
  },
  {
    common,
    skipConsensusFormatValidation: true,
  }
)

console.log(`4844 block header with excessBlobGas=${header.excessBlobGas} created`)
