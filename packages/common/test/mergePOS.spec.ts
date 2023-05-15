import * as tape from 'tape'

import { Chain, Common, Hardfork } from '../src'

import * as testnetMerge from './data/merge/testnetMerge.json'
import * as testnetPOS from './data/merge/testnetPOS.json'

tape('[Common]: Merge/POS specific logic', function (t: tape.Test) {
  t.test('hardforkTTD()', function (st: tape.Test) {
    const customChains = [testnetMerge]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })
    st.equal(c.hardforkTTD(Hardfork.Paris), BigInt(5000), 'should get the HF total difficulty')
    st.equal(
      c.hardforkTTD('thisHardforkDoesNotExist'),
      null,
      'should return null if HF does not exist on chain'
    )

    st.end()
  })

  t.test(
    'getHardforkByBlockNumber(), merge block null, with total difficulty',
    function (st: tape.Test) {
      const customChains = [testnetMerge]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      let msg = 'block number < last HF block number set, without TD set'
      st.equal(c.getHardforkByBlockNumber(0), 'chainstart', msg)
      msg = 'block number > last HF block number set, without TD set'
      st.equal(c.getHardforkByBlockNumber(14), 'london', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.getHardforkByBlockNumber(15, 5000), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.getHardforkByBlockNumber(15, 5001), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and smaller'
      st.equal(c.getHardforkByBlockNumber(15, 4999), 'london', msg)
      msg = 'block number < last HF block number set, TD set and smaller'
      st.equal(c.getHardforkByBlockNumber(12, 4999), 'berlin', msg)
      st.end()
    }
  )

  t.test(
    'getHardforkByBlockNumber(), merge block set, with total difficulty',
    function (st: tape.Test) {
      const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
      // Set Merge block to 15
      testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
      const customChains = [testnetMergeWithBlockNumber]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      let msg = 'block number < last HF block number set, without TD set'
      st.equal(c.getHardforkByBlockNumber(0), 'chainstart', msg)
      msg = 'block number > last HF block number set, without TD set'
      st.equal(c.getHardforkByBlockNumber(16), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.getHardforkByBlockNumber(16, 5000), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.getHardforkByBlockNumber(16, 5001), 'paris', msg)
      msg = 'block number < last HF block number set, TD set and smaller'
      st.equal(c.getHardforkByBlockNumber(12, 4999), 'berlin', msg)

      try {
        c.getHardforkByBlockNumber(16, 4999)
      } catch (e: any) {
        msg = 'block number > last HF block number set, TD set and smaller (should throw)'
        const eMsg = 'Maximum HF determined by total difficulty is lower than the block number HF'
        st.ok(e.message.includes(eMsg), msg)
      }
      try {
        c.getHardforkByBlockNumber(14, 5000)
      } catch (e: any) {
        msg = 'block number < last HF block number set, TD set and higher (should throw)'
        const eMsg = 'HF determined by block number is lower than the minimum total difficulty HF'
        st.ok(e.message.includes(eMsg), msg)
      }

      st.end()
    }
  )

  t.test(
    'getHardforkByBlockNumber(), merge block set + subsequent HF, with total difficulty',
    function (st: tape.Test) {
      const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
      // Set Merge block to 15
      testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
      // Set Shanghai block to 18
      testnetMergeWithBlockNumber['hardforks'][9]['block'] = 18
      const customChains = [testnetMergeWithBlockNumber]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      const msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.getHardforkByBlockNumber(18, 5001), 'shanghai', msg)

      st.end()
    }
  )

  t.test(
    'setHardforkByBlockNumber(), merge block null, with total difficulty',
    function (st: tape.Test) {
      const customChains = [testnetMerge]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      let msg = 'block number < last HF block number set, without TD set'
      st.equal(c.setHardforkByBlockNumber(0), 'chainstart', msg)
      msg = 'block number > last HF block number set, without TD set'
      st.equal(c.setHardforkByBlockNumber(14), 'london', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.setHardforkByBlockNumber(15, 5000), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.setHardforkByBlockNumber(15, 5001), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and smaller'
      st.equal(c.setHardforkByBlockNumber(15, 4999), 'london', msg)
      msg = 'block number < last HF block number set, TD set and smaller'
      st.equal(c.setHardforkByBlockNumber(12, 4999), 'berlin', msg)
      st.end()
    }
  )

  t.test(
    'setHardforkByBlockNumber(), merge block set, with total difficulty',
    function (st: tape.Test) {
      const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
      // Set Merge block to 15
      testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
      const customChains = [testnetMergeWithBlockNumber]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      let msg = 'block number < last HF block number set, without TD set'
      st.equal(c.setHardforkByBlockNumber(0), 'chainstart', msg)
      msg = 'block number > last HF block number set, without TD set'
      st.equal(c.setHardforkByBlockNumber(16), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.setHardforkByBlockNumber(16, 5000), 'paris', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.setHardforkByBlockNumber(16, 5001), 'paris', msg)
      msg = 'block number < last HF block number set, TD set and smaller'
      st.equal(c.setHardforkByBlockNumber(12, 4999), 'berlin', msg)

      try {
        c.setHardforkByBlockNumber(16, 4999)
        st.fail(`should have thrown td < ttd validation error`)
      } catch (e: any) {
        msg = 'block number > last HF block number set, TD set and smaller (should throw)'
        const eMsg = 'Maximum HF determined by total difficulty is lower than the block number HF'
        st.ok(e.message.includes(eMsg), msg)
      }
      try {
        c.setHardforkByBlockNumber(14, 5000)
        st.fail(`should have thrown td > ttd validation error`)
      } catch (e: any) {
        msg = 'block number < last HF block number set, TD set and higher (should throw)'
        const eMsg = 'HF determined by block number is lower than the minimum total difficulty HF'
        st.ok(e.message.includes(eMsg), msg)
      }

      st.end()
    }
  )

  t.test(
    'setHardforkByBlockNumber(), merge block set + subsequent HF, with total difficulty',
    function (st: tape.Test) {
      const testnetMergeWithBlockNumber = JSON.parse(JSON.stringify(testnetMerge))
      // Set Merge block to 15
      testnetMergeWithBlockNumber['hardforks'][8]['block'] = 16
      // Set Shanghai block to 18
      testnetMergeWithBlockNumber['hardforks'][9]['block'] = 18
      const customChains = [testnetMergeWithBlockNumber]
      const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })

      const msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.setHardforkByBlockNumber(18, 5001), 'shanghai', msg)

      st.end()
    }
  )

  t.test('Pure POS testnet', function (st: tape.Test) {
    const customChains = [testnetPOS]
    const c = new Common({ chain: 'testnetPOS', hardfork: Hardfork.Chainstart, customChains })

    st.equal(c.hardforkTTD(Hardfork.Chainstart), BigInt(0), 'should get the HF total difficulty')

    const msg = 'block number > last HF block number set, TD set (0) and equal'
    st.equal(c.getHardforkByBlockNumber(5, 0), 'shanghai', msg)
    st.end()
  })

  t.test('Should fail setting invalid hardfork', function (st: tape.Test) {
    const customChains = [testnetPOS]
    try {
      new Common({ chain: 'testnetPOS', hardfork: Hardfork.Istanbul, customChains })
      st.fail(`should have failed setting absent hardfork instanbul`)
    } catch (e) {
      st.pass(`failed setting absent hardfork instanbul`)
    }
    st.end()
  })

  t.test('should get the correct merge hardfork at genesis', async (st) => {
    const json = require(`../../client/test/testdata/geth-genesis/post-merge.json`)
    const c = Common.fromGethGenesis(json, { chain: 'post-merge' })
    const msg = 'should get HF correctly'
    st.equal(c.getHardforkByBlockNumber(0), Hardfork.London, msg)
    st.equal(c.getHardforkByBlockNumber(0, BigInt(0)), Hardfork.Paris, msg)
  })

  t.test('test post merge hardforks using Sepolia with block null', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Sepolia })
    let msg = 'should get HF correctly'

    st.equal(c.getHardforkByBlockNumber(0), Hardfork.London, msg)
    // Make it null manually as config could be updated later
    const mergeHf = c.hardforks().filter((hf) => hf.ttd !== undefined && hf.ttd !== null)[0]
    const prevMergeBlockVal = mergeHf.block
    mergeHf.block = null

    // should get Hardfork.London even though happened with 1450408 as terminal as config doesn't have that info
    st.equal(c.getHardforkByBlockNumber(1450409), Hardfork.London, msg)
    // however with correct td in input it should select merge
    st.equal(c.getHardforkByBlockNumber(1450409, BigInt('17000000000000000')), Hardfork.Paris, msg)
    // should select MergeForkIdTransition even without td specified as the block is set for this hardfork
    st.equal(c.getHardforkByBlockNumber(1735371), Hardfork.MergeForkIdTransition, msg)
    // also with td specified
    st.equal(
      c.getHardforkByBlockNumber(1735371, BigInt('17000000000000000')),
      Hardfork.MergeForkIdTransition,
      msg
    )

    // Check nextHardforkBlockOrTimestamp should be MergeForkIdTransition's block on london and merge both
    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Berlin),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )
    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.London),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )
    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Paris),
      1735371n,
      `should get nextHardforkBlockOrTimestamp correctly`
    )

    try {
      st.equal(
        c.getHardforkByBlockNumber(1735371, BigInt('15000000000000000')),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail('should have thrown as specified td < merge ttd for a post merge hardfork')
    } catch (error) {
      st.pass('throws error as specified td < merge ttd for a post merge hardfork')
    }

    msg = 'should set HF correctly'

    st.equal(c.setHardforkByBlockNumber(0), Hardfork.London, msg)
    st.equal(c.setHardforkByBlockNumber(1450409), Hardfork.London, msg)
    st.equal(c.setHardforkByBlockNumber(1450409, BigInt('17000000000000000')), Hardfork.Paris, msg)
    st.equal(c.setHardforkByBlockNumber(1735371), Hardfork.MergeForkIdTransition, msg)
    st.equal(
      c.setHardforkByBlockNumber(1735371, BigInt('17000000000000000')),
      Hardfork.MergeForkIdTransition,
      msg
    )
    try {
      st.equal(
        c.setHardforkByBlockNumber(1735371, BigInt('15000000000000000')),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail('should have thrown as specified td < merge ttd for a post merge hardfork')
    } catch (error) {
      st.pass('throws error as specified td < merge ttd for a post merge hardfork')
    }

    // restore value
    mergeHf.block = prevMergeBlockVal

    st.end()
  })

  t.test(
    'should get correct merge and post merge hf with merge block specified ',
    function (st: tape.Test) {
      const c = new Common({ chain: Chain.Sepolia })

      const mergeHf = c.hardforks().filter((hf) => hf.ttd !== undefined && hf.ttd !== null)[0]
      const prevMergeBlockVal = mergeHf.block
      // the terminal block on sepolia is 1450408
      mergeHf.block = 1450409
      const msg = 'should get HF correctly'

      // should get merge even without td supplied as the merge hf now has the block specified
      st.equal(c.setHardforkByBlockNumber(1450409), Hardfork.Paris, msg)
      st.equal(
        c.setHardforkByBlockNumber(1450409, BigInt('17000000000000000')),
        Hardfork.Paris,
        msg
      )
      st.equal(c.setHardforkByBlockNumber(1735371), Hardfork.MergeForkIdTransition, msg)
      st.equal(
        c.setHardforkByBlockNumber(1735371, BigInt('17000000000000000')),
        Hardfork.MergeForkIdTransition,
        msg
      )

      // Check nextHardforkBlockOrTimestamp should be MergeForkIdTransition's block on london and merge both
      st.equal(
        c.nextHardforkBlockOrTimestamp(Hardfork.London),
        1735371n,
        `should get nextHardforkBlockOrTimestamp correctly`
      )
      st.equal(
        c.nextHardforkBlockOrTimestamp(Hardfork.Paris),
        1735371n,
        `should get nextHardforkBlockOrTimestamp correctly`
      )

      // restore value
      mergeHf.block = prevMergeBlockVal

      st.end()
    }
  )

  t.test(
    'should throw if encounters a double ttd hardfork specification',
    function (st: tape.Test) {
      const c = new Common({ chain: Chain.Sepolia })
      // Add the ttd to mergeForkIdTransition which occurs post merge in sepolia
      c.hardforks().filter((hf) => hf.name === 'mergeForkIdTransition')[0]!['ttd'] =
        '17000000000000000'

      try {
        c.setHardforkByBlockNumber(1735371)
        st.fail('should have thrown as two hardforks with ttd specified')
      } catch (error) {
        st.pass('throws error as two hardforks with ttd specified')
      }
      st.end()
    }
  )
})
