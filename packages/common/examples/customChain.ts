import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { customChainConfig } from '@ethereumjs/testdata'

const common = createCustomCommon(customChainConfig, Mainnet)

console.log(`Chain ${common.chainName()} (chainId=${common.chainId()})`)
console.log(`Hardfork at block 4: ${common.getHardforkBy({ blockNumber: 4n })}`)
console.log(`Bootstrap nodes: ${common.bootstrapNodes().length}`)

common.setHardfork(Hardfork.Byzantium)
console.log(`Active hardfork on custom chain: ${common.hardfork()}`)
