import { Common } from '@ethereumjs/common'
import * as tape from 'tape'

import { Blockchain } from '../src/blockchain'
import { parseGethGenesisState } from '../src/utils'

async function getBlockchain(gethGenesis: any): Promise<Blockchain> {
  const common = Common.fromGethGenesis(gethGenesis, { chain: 'kiln' })
  const genesisState = parseGethGenesisState(gethGenesis)
  const blockchain = await Blockchain.create({
    genesisState,
    common,
  })
  return blockchain
}

tape('[Utils/Parse]', (t) => {
  t.test('should parse geth params file', async (t) => {
    // kiln genesis with deposit contract storage set
    const json = require(`./testdata/geth-genesis-kiln.json`)
    const blockchain = await getBlockchain(json)
    const genesisHash = blockchain.genesisBlock.hash()

    t.equal(
      genesisHash.toString('hex'),
      '51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8',
      'kiln genesis hash matches'
    )
  })
})
