import { Blockchain } from '@ethereumjs/blockchain'
import { Common, parseGethGenesis } from '@ethereumjs/common'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import gethGenesisJson from './genesisData/post-merge.json'

const main = async () => {
  // Load geth genesis json file into lets say `gethGenesisJson`
  const common = Common.fromGethGenesis(gethGenesisJson, { chain: 'customChain' })
  const genesisState = parseGethGenesisState(gethGenesisJson)
  const blockchain = await Blockchain.create({
    genesisState,
    common,
  })
  const genesisBlockHash = blockchain.genesisBlock.hash()
  common.setForkHashes(genesisBlockHash)
  console.log(
    `Genesis hash from geth genesis parameters - ${bytesToHex(blockchain.genesisBlock.hash())}`
  )
}

main()
