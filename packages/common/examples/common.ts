import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'

// With enums:
const commonWithEnums = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: Mainnet })

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an EIP activated (with pre-EIP hardfork)
c = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
console.log(`EIP 7702 is active -- ${c.isActivatedEIP(7702)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 }, Mainnet)
console.log(`The current chain ID is ${commonWithCustomChainId.chainId()}`)
