import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'

import { Goerli } from '../test/testdata/goerliCommon.ts'

const common = new Common({ chain: Goerli, hardfork: Hardfork.Chainstart })

console.log(common.consensusType()) // 'poa'
console.log(common.consensusAlgorithm()) // 'clique'

createBlock({ header: { extraData: new Uint8Array(97) } }, { common })
console.log(`Old Clique Proof-of-Authority block created`)
