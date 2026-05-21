import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

  const block = createBlock(
    {
      header: {
        slotNumber: 42n,
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  console.log(`slotNumber: ${block.header.slotNumber}`)
}

void main()
