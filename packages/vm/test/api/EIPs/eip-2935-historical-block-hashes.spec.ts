import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address, bigIntToHex } from '@ethereumjs/util'
import { describe, it } from 'vitest'

import { VM } from '../../../src/vm'

// TODO: create a Common where EIP 2935 is activated at a certain timestamp
// It does not seem that this is possible with common.custom
// We can insert hardforks with certain times, but in this case we need a "custom hardfork" (this is thus 2935)
// And then schedule this on a timestamp
// The alternative is to currently use Prague, but this also means we need to use Verkle (6800)
// This is not handy and this will bloat these tests up with non-EIP 2935 tests
const common = new Common({ chain: Chain.Mainnet, eips: [2935], hardfork: Hardfork.Shanghai })
const historyAddress = Address.fromString(bigIntToHex(common.param('vm', 'historyStorageAddress')))

describe('EIP 2935: historical block hashes', () => {
  it('should save genesis block hash to the history block hash contract', async () => {
    const vm = await VM.create({ common })
    const genesis = await vm.blockchain.getBlock(0)
    const block = await (
      await vm.buildBlock({
        parentBlock: genesis,
      })
    ).build()
    await vm.blockchain.putBlock(block)
    await vm.runBlock({ block })
    // TODO: finish
    // Run block 1 and then verify that if you get the state from the history contract,
    // The genesis hash is indeed written to it
  })
  it('should ensure blocks older than 256 blocks can be retrieved from the history contract', async () => {
    // Test: build a chain with 256+ blocks and then retrieve BLOCKHASH of the genesis block and block 1
  })
  it('should ensure that the history of 256 blocks is added to the blockhash contract upon activation', async () => {
    // Test: build a chain with 300 blocks where the fork gets activated at block 280
    // Ensure that blocks 280-256=24 (note: can be off by one) to block 299 can be retrieved from block 300
  })
  it('should ensure that the history address does not get deleted from state when touched', async () => {
    // Test: touch the history contract (with a CALL for instance)
    // And then verify that the account / storage still exists and is thus not wiped from the chain
  })
})
