import { Common } from '@ethereumjs/common'
import * as tape from 'tape'

import { Blockchain } from '../src/blockchain'
import { genesisStateRoot } from '../src/genesisStates'
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
  t.test('should properly parse genesis state from gethGenesis', async (t) => {
    // kiln genesis with deposit contract storage set
    const json = require(`./testdata/geth-genesis-kiln.json`)
    const genesisState = parseGethGenesisState(json)
    const stateRoot = await genesisStateRoot(genesisState)
    t.equal(
      stateRoot.toString('hex'),
      '52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches'
    )
  })

  t.test('should initialize blockchain from gethGenesis', async (t) => {
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
