import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'

// With enums:
const commonWithEnums = new Common({ chain: Mainnet, hardfork: Hardfork.London })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: Mainnet })

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an EIP activated
c = new Common({ chain: Mainnet, eips: [4844] })
console.log(`EIP 4844 is active -- ${c.isActivatedEIP(4844)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 }, Mainnet)
console.log(`The current chain ID is ${commonWithCustomChainId.chainId}`)
