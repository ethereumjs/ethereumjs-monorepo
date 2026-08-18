import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

common.events.on('hardforkChanged', (hardfork) => {
  console.log(`hardforkChanged event: ${hardfork}`)
})

common.setHardfork(Hardfork.Prague)
