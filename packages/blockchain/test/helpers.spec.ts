import { Chain, ChainGenesis, Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { genGenesisStateRoot, getGenesisStateRoot } from '../src/helpers.ts'

describe('[Blockchain/Helpers]: genesis state root', () => {
  it('genGenesisStateRoot() computes root for empty genesis state', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const root = await genGenesisStateRoot({}, common)
    assert.strictEqual(bytesToHex(root).length, 66)
  })

  it('getGenesisStateRoot() returns known chain root for Mainnet', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const root = await getGenesisStateRoot(Chain.Mainnet, common)
    assert.deepEqual(root, ChainGenesis[Chain.Mainnet].stateRoot)
  })

  it('getGenesisStateRoot() falls back to empty state for unknown chain', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const unknownChain = 999999 as Chain
    const root = await getGenesisStateRoot(unknownChain, common)
    const emptyRoot = await genGenesisStateRoot({}, common)
    assert.deepEqual(root, emptyRoot)
  })
})
