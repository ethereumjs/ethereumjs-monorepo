import { Common } from '@ethereumjs/common'
import * as tape from 'tape'

import { Blockchain } from '../src/blockchain'
import { parseGethGenesisState } from '../src/utils'

async function getBlockchain(gethGenesis: any): Promise<Blockchain> {
  const common = Common.fromGethGenesis(gethGenesis, { chain: 'customChain' })
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
      '4b5a404c07ee216ee79f8896ad79c30d68c5b7aaa9499c404ae1460005041106',
      'kiln genesis hash matches'
    )
  })
})
