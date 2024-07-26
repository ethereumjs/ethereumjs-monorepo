import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'

import genesisJson from './genesisData/post-merge.json'

const genesisHash = hexToBytes('0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a')
// Load geth genesis json file into lets say `genesisJson` and optional `chain` and `genesisHash`
const common = createCommonFromGethGenesis(genesisJson, { chain: 'customChain', genesisHash })
// If you don't have `genesisHash` while initiating common, you can later configure common (for e.g.
// after calculating it via `blockchain`)
common.setForkHashes(genesisHash)

console.log(`The London forkhash for this custom chain is ${common.forkHash('london')}`)
