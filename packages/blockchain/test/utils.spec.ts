import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { genesisStateRoot } from '@ethereumjs/trie'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createBlockchain } from '../src/index.js'

import gethGenesisJSON from './testdata/post-merge.json'

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
    const genesisState = parseGethGenesisState(gethGenesisJSON)
    const stateRoot = await genesisStateRoot(genesisState)
    assert.equal(
      bytesToHex(stateRoot),
      '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
      'stateRoot matches',
    )
  })

  it('should initialize blockchain from gethGenesis', async () => {
    const blockchain = await getBlockchain(gethGenesisJSON)
    const genesisHash = blockchain.genesisBlock.hash()

    assert.equal(
      bytesToHex(genesisHash),
      '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
      'genesis hash matches',
    )
  })
})
