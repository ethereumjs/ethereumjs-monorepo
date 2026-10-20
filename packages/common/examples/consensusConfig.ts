import { Common, Hardfork } from '@ethereumjs/common'
import { testnetMergeChainConfig } from '@ethereumjs/testdata'

const common = new Common({ chain: testnetMergeChainConfig, hardfork: Hardfork.London })

console.log(`consensusType: ${common.consensusType()}`)
console.log(`consensusAlgorithm: ${common.consensusAlgorithm()}`)

const clique = common.consensusConfig()
console.log(`clique period=${clique.period}s epoch=${clique.epoch} blocks`)
