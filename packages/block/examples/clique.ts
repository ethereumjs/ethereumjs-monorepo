import { createBlock } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlock({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
