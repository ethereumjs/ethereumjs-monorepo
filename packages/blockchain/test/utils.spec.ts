import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { genesisStateRoot } from '@ethereumjs/trie'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

// kiln genesis with deposit contract storage set
import { createBlockchain } from '../src/index.js'

import gethGenesisKilnJSON from './testdata/geth-genesis-kiln.json'

import type { Blockchain } from '../src/blockchain.js'

async function getBlockchain(gethGenesis: any): Promise<Blockchain> {
  const common = createCommonFromGethGenesis(gethGenesis, { chain: 'kiln' })
  const genesisState = parseGethGenesisState(gethGenesis)
  const blockchain = await createBlockchain({
    genesisState,
    common,
  })
  return blockchain
}

describe('[Utils/Parse]', () => {
  it('should properly parse genesis state from gethGenesis', async () => {
    const genesisState = parseGethGenesisState(gethGenesisKilnJSON)
    const stateRoot = await genesisStateRoot(genesisState)
    assert.equal(
      bytesToHex(stateRoot),
      '0x52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches',
    )
  })

  it('should initialize blockchain from gethGenesis', async () => {
    const blockchain = await getBlockchain(gethGenesisKilnJSON)
    const genesisHash = blockchain.genesisBlock.hash()

    assert.equal(
      bytesToHex(genesisHash),
      '0x51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8',
      'kiln genesis hash matches',
    )
  })
})
