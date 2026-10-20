import { Mainnet, createCustomCommon } from '@ethereumjs/common'

// Keep Mainnet params but override chainId — typical for L2 / private networks
const l2Common = createCustomCommon({ chainId: 42161 }, Mainnet)

console.log(`chainId=${l2Common.chainId()} name=${l2Common.chainName()}`)
console.log(`Hardfork schedule inherited (${l2Common.hardforks().length} entries)`)
