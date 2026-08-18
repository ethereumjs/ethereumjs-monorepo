import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const withHardfork = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const withDefault = new Common({ chain: Mainnet })

console.log(`Explicit hardfork: ${withHardfork.hardfork()}`)
console.log(
  `Default hardfork: ${withDefault.hardfork()} (DEFAULT_HARDFORK=${withDefault.DEFAULT_HARDFORK})`,
)
