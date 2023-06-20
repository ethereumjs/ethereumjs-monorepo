import { Common } from '@ethereumjs/common'
import { genesisStateRoot } from '@ethereumjs/trie'
import { parseGethGenesisState } from '@ethereumjs/util'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { Blockchain } from '../src/blockchain.js'

async function getBlockchain(gethGenesis: any): Promise<Blockchain> {
  const common = Common.fromGethGenesis(gethGenesis, { chain: 'kiln' })
  const genesisState = parseGethGenesisState(gethGenesis)
  const blockchain = await Blockchain.create({
    genesisState,
    common,
  })
  return blockchain
}

describe('[Utils/Parse]', () => {
  it('should properly parse genesis state from gethGenesis', async () => {
    // kiln genesis with deposit contract storage set
    const json = require(`./testdata/geth-genesis-kiln.json`)
    const genesisState = parseGethGenesisState(json)
    const stateRoot = await genesisStateRoot(genesisState)
    assert.equal(
      bytesToHex(stateRoot),
      '52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches'
    )
  })

  it('should initialize blockchain from gethGenesis', async () => {
    // kiln genesis with deposit contract storage set
    const json = require(`./testdata/geth-genesis-kiln.json`)
    const blockchain = await getBlockchain(json)
    const genesisHash = blockchain.genesisBlock.hash()

    assert.equal(
      bytesToHex(genesisHash),
      '51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8',
      'kiln genesis hash matches'
    )
  })
})
