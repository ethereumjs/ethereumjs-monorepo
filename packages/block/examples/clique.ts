import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'

const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlock({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
