import { createBlockFromBlockData } from '@ethereumjs/block'
import { Common, Goerli, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Goerli, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlockFromBlockData({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
