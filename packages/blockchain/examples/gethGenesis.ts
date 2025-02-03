import { createBlockchain } from '@ethereumjs/blockchain'
import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'

import gethGenesisJSON from './genesisData/post-merge.json'

const main = async () => {
  // Load geth genesis json file into lets say `gethGenesisJSON`
  const common = createCommonFromGethGenesis(gethGenesisJSON, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(gethGenesisJSON)
  const blockchain = await createBlockchain({
    genesisState,
    common,
  })
  const genesisBlockHash = blockchain.genesisBlock.hash()
  common.setForkHashes(genesisBlockHash)
  console.log(
    `Genesis hash from geth genesis parameters - ${bytesToHex(blockchain.genesisBlock.hash())}`,
  )
}

void main()
