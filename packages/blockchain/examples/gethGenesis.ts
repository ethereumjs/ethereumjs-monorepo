import { createBlockchain } from '@ethereumjs/blockchain'
import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'

import gethGenesisJson from './genesisData/post-merge.json'

const main = async () => {
  // Load geth genesis json file into lets say `gethGenesisJson`
  const common = createCommonFromGethGenesis(gethGenesisJson, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(gethGenesisJson)
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
