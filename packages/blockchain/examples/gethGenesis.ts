import { createBlockchain } from '@ethereumjs/blockchain'
import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'

const main = async () => {
  // Load geth genesis file
  const common = createCommonFromGethGenesis(postMergeGethGenesis, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(postMergeGethGenesis)
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
