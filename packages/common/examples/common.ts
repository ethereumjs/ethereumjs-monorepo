import { Chain, Common, Hardfork, createCustomCommon } from '@ethereumjs/common'

// With enums:
const commonWithEnums = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

// (also possible with directly passing in strings:)
const commonWithStrings = new Common({ chain: 'mainnet', hardfork: 'london' })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: Chain.Mainnet })

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an EIP activated
c = new Common({ chain: Chain.Mainnet, eips: [4844] })
console.log(`EIP 4844 is active -- ${c.isActivatedEIP(4844)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 })
console.log(`The current chain ID is ${commonWithCustomChainId.chainId}`)
