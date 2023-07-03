import { assert, describe, it } from 'vitest'

import { Chain, Common, Hardfork } from '../src/index.js'

import * as postMergeJSON from './data/geth-genesis/post-merge.json'
import * as testnetMerge from './data/merge/testnetMerge.json'
import * as testnetPOS from './data/merge/testnetPOS.json'

describe('[Common]: Merge/POS specific logic', () => {
  it('hardforkTTD()', () => {
    const customChains = [testnetMerge]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })
    assert.equal(c.hardforkTTD(Hardfork.Paris), BigInt(5000), 'should get the HF total difficulty')
    assert.equal(
      c.hardforkTTD('thisHardforkDoesNotExist'),
      null,
      'should return null if HF does not exist on chain'
    )
  })

  it('getHardforkBy(), merge block null, with total difficulty', () => {
    const customChains = [testnetMerge]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let msg = 'block number < last HF block number set, without TD set'
    assert.equal(c.getHardforkBy({ blockNumber: 0n }), 'chainstart', msg)
    msg = 'block number > last HF block number set, without TD set'
    assert.equal(c.getHardforkBy({ blockNumber: 14n }), 'london', msg)
    msg = 'block number > last HF block number set, TD set and equal'
    assert.equal(c.getHardforkBy({ blockNumber: 15n, td: 5000n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.getHardforkBy({ blockNumber: 15n, td: 5001n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and smaller'
    assert.equal(c.getHardforkBy({ blockNumber: 15n, td: 4999n }), 'london', msg)
    msg = 'block number < last HF block number set, TD set and smaller'
    assert.equal(c.getHardforkBy({ blockNumber: 12n, td: 4999n }), 'berlin', msg)
  })

  it('getHardforkBy(), merge block set, with total difficulty', () => {
    const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
    // Set Merge block to 15
    testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
    const customChains = [testnetMergeWithBlockNumber]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let msg = 'block number < last HF block number set, without TD set'
    assert.equal(c.getHardforkBy({ blockNumber: 0n }), 'chainstart', msg)
    msg = 'block number > last HF block number set, without TD set'
    assert.equal(c.getHardforkBy({ blockNumber: 16n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and equal'
    assert.equal(c.getHardforkBy({ blockNumber: 16n, td: 5000n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.getHardforkBy({ blockNumber: 16n, td: 5001n }), 'paris', msg)
    msg = 'block number < last HF block number set, TD set and smaller'
    assert.equal(c.getHardforkBy({ blockNumber: 12n, td: 4999n }), 'berlin', msg)

    try {
      c.getHardforkBy({ blockNumber: 16n, td: 4999n })
    } catch (e: any) {
      msg = 'block number > last HF block number set, TD set and smaller (should throw)'
      const eMsg = 'Maximum HF determined by total difficulty is lower than the block number HF'
      assert.ok(e.message.includes(eMsg), msg)
    }
    try {
      c.getHardforkBy({ blockNumber: 14n, td: 5000n })
    } catch (e: any) {
      msg = 'block number < last HF block number set, TD set and higher (should throw)'
      const eMsg = 'HF determined by block number is lower than the minimum total difficulty HF'
      assert.ok(e.message.includes(eMsg), msg)
    }
  })

  it('getHardforkBy(), merge block set + subsequent HF, with total difficulty', () => {
    const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
    // Set Merge block to 15
    testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
    // Set Shanghai block to 18
    testnetMergeWithBlockNumber['hardforks'][9]['block'] = 18
    const customChains = [testnetMergeWithBlockNumber]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    const msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.getHardforkBy({ blockNumber: 18n, td: 5001n }), 'shanghai', msg)
  })

  it('setHardforkBy(), merge block null, with total difficulty', () => {
    const customChains = [testnetMerge]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let msg = 'block number < last HF block number set, without TD set'
    assert.equal(c.setHardforkBy({ blockNumber: 0n }), 'chainstart', msg)
    msg = 'block number > last HF block number set, without TD set'
    assert.equal(c.setHardforkBy({ blockNumber: 14n }), 'london', msg)
    msg = 'block number > last HF block number set, TD set and equal'
    assert.equal(c.setHardforkBy({ blockNumber: 15n, td: 5000n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.setHardforkBy({ blockNumber: 15n, td: 5001n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and smaller'
    assert.equal(c.setHardforkBy({ blockNumber: 15n, td: 4999n }), 'london', msg)
    msg = 'block number < last HF block number set, TD set and smaller'
    assert.equal(c.setHardforkBy({ blockNumber: 12n, td: 4999n }), 'berlin', msg)
  })

  it('setHardforkBy(), merge block set, with total difficulty', () => {
    const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
    // Set Merge block to 15
    testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
    const customChains = [testnetMergeWithBlockNumber]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    let msg = 'block number < last HF block number set, without TD set'
    assert.equal(c.setHardforkBy({ blockNumber: 0n }), 'chainstart', msg)
    msg = 'block number > last HF block number set, without TD set'
    assert.equal(c.setHardforkBy({ blockNumber: 16n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and equal'
    assert.equal(c.setHardforkBy({ blockNumber: 16n, td: 5000n }), 'paris', msg)
    msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.setHardforkBy({ blockNumber: 16n, td: 5001n }), 'paris', msg)
    msg = 'block number < last HF block number set, TD set and smaller'
    assert.equal(c.setHardforkBy({ blockNumber: 12n, td: 4999n }), 'berlin', msg)

    try {
      c.setHardforkBy({ blockNumber: 16n, td: 4999n })
      assert.fail(`should have thrown td < ttd validation error`)
    } catch (e: any) {
      msg = 'block number > last HF block number set, TD set and smaller (should throw)'
      const eMsg = 'Maximum HF determined by total difficulty is lower than the block number HF'
      assert.ok(e.message.includes(eMsg), msg)
    }
    try {
      c.setHardforkBy({ blockNumber: 14n, td: 5000n })
      assert.fail(`should have thrown td > ttd validation error`)
    } catch (e: any) {
      msg = 'block number < last HF block number set, TD set and higher (should throw)'
      const eMsg = 'HF determined by block number is lower than the minimum total difficulty HF'
      assert.ok(e.message.includes(eMsg), msg)
    }
  })

  it('setHardforkBy(), merge block set + subsequent HF, with total difficulty', () => {
    const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
    // Set Merge block to 15
    testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
    // Set Shanghai block to 18
    testnetMergeWithBlockNumber['hardforks'][9]['block'] = 18
    const customChains = [testnetMergeWithBlockNumber]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

    const msg = 'block number > last HF block number set, TD set and higher'
    assert.equal(c.setHardforkBy({ blockNumber: 18n, td: 5001n }), 'shanghai', msg)
  })

  it('Pure POS testnet', () => {
    const customChains = [testnetPOS]
    const c = new Common({ chain: 'testnetPOS', hardfork: Hardfork.Chainstart, customChains })

    assert.equal(
      c.hardforkTTD(Hardfork.Chainstart),
      BigInt(0),
      'should get the HF total difficulty'
    )

    const msg = 'block number > last HF block number set, TD set (0) and equal'
    assert.equal(c.getHardforkBy({ blockNumber: 5n, td: 0n }), 'shanghai', msg)
  })

  it('Should fail setting invalid hardfork', () => {
    const customChains = [testnetPOS]
    const f = () => {
      new Common({ chain: 'testnetPOS', hardfork: Hardfork.Istanbul, customChains })
    }
    assert.throws(f, undefined, undefined, `failed setting absent hardfork instanbul`)
  })

  it('should get the correct merge hardfork at genesis', async () => {
    const c = Common.fromGethGenesis(postMergeJSON, { chain: 'post-merge' })
    const msg = 'should get HF correctly'
    assert.equal(c.getHardforkBy({ blockNumber: 0n }), Hardfork.London, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 0n, td: 0n }), Hardfork.Paris, msg)
  })

  it('test post merge hardforks using Sepolia with block null', () => {
    const c = new Common({ chain: Chain.Sepolia })
    let msg = 'should get HF correctly'

    assert.equal(c.getHardforkBy({ blockNumber: 0n }), Hardfork.London, msg)
    // Make it null manually as config could be updated later
    const mergeHf = c.hardforks().filter((hf) => hf.ttd !== undefined && hf.ttd !== null)[0]
    const prevMergeBlockVal = mergeHf.block
    mergeHf.block = null

    // should get Hardfork.London even though happened with 1450408 as terminal as config doesn't have that info
    assert.equal(c.getHardforkBy({ blockNumber: 1450409n }), Hardfork.London, msg)
    // however with correct td in input it should select merge
    assert.equal(
      c.getHardforkBy({ blockNumber: 1450409n, td: 17000000000000000n }),
      Hardfork.Paris,
      msg
    )
    // should select MergeForkIdTransition even without td specified as the block is set for this hardfork
    assert.equal(c.getHardforkBy({ blockNumber: 1735371n }), Hardfork.MergeForkIdTransition, msg)
    // also with td specified
    assert.equal(
      c.getHardforkBy({ blockNumber: 1735371n, td: 17000000000000000n }),
      Hardfork.MergeForkIdTransition,
      msg
    )

    // Check nextHardforkBlockOrTimestamp should be MergeForkIdTransition's block on london and merge both
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Berlin),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.London),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Paris),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )

    let f = () => {
      c.getHardforkBy({ blockNumber: 1735371n, td: 15000000000000000n })
    }
    assert.throws(
      f,
      undefined,
      undefined,
      'throws error as specified td < merge ttd for a post merge hardfork'
    )

    msg = 'should set HF correctly'

    assert.equal(c.setHardforkBy({ blockNumber: 0n }), Hardfork.London, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 1450409n }), Hardfork.London, msg)
    assert.equal(
      c.setHardforkBy({ blockNumber: 1450409n, td: 17000000000000000n }),
      Hardfork.Paris,
      msg
    )
    assert.equal(c.setHardforkBy({ blockNumber: 1735371n }), Hardfork.MergeForkIdTransition, msg)
    assert.equal(
      c.setHardforkBy({ blockNumber: 1735371n, td: 17000000000000000n }),
      Hardfork.MergeForkIdTransition,
      msg
    )
    f = () => {
      c.setHardforkBy({ blockNumber: 1735371n, td: 15000000000000000n })
    }
    assert.throws(
      f,
      undefined,
      undefined,
      'throws error as specified td < merge ttd for a post merge hardfork'
    )

    // restore value
    mergeHf.block = prevMergeBlockVal
  })

  it('should get correct merge and post merge hf with merge block specified ', () => {
    const c = new Common({ chain: Chain.Sepolia })

    const mergeHf = c.hardforks().filter((hf) => hf.ttd !== undefined && hf.ttd !== null)[0]
    const prevMergeBlockVal = mergeHf.block
    // the terminal block on sepolia is 1450408
    mergeHf.block = 1450409
    const msg = 'should get HF correctly'

    // should get merge even without td supplied as the merge hf now has the block specified
    assert.equal(c.setHardforkBy({ blockNumber: 1450409n }), Hardfork.Paris, msg)
    assert.equal(
      c.setHardforkBy({ blockNumber: 1450409n, td: 17000000000000000n }),
      Hardfork.Paris,
      msg
    )
    assert.equal(c.setHardforkBy({ blockNumber: 1735371n }), Hardfork.MergeForkIdTransition, msg)
    assert.equal(
      c.setHardforkBy({ blockNumber: 1735371n, td: 17000000000000000n }),
      Hardfork.MergeForkIdTransition,
      msg
    )

    // Check nextHardforkBlockOrTimestamp should be MergeForkIdTransition's block on london and merge both
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.London),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Paris),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )

    // restore value
    mergeHf.block = prevMergeBlockVal
  })

  it('should throw if encounters a double ttd hardfork specification', () => {
    const c = new Common({ chain: Chain.Sepolia })
    // Add the ttd to mergeForkIdTransition which occurs post merge in sepolia
    c.hardforks().filter((hf) => hf.name === 'mergeForkIdTransition')[0]!['ttd'] =
      '17000000000000000'

    const f = () => {
      c.setHardforkBy({ blockNumber: 1735371n })
    }
    assert.throws(f, undefined, undefined, 'throws error as two hardforks with ttd specified')
  })
})
