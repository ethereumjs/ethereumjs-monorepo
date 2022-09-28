import * as tape from 'tape'

import { Common, Hardfork } from '../src'

import * as testnetMerge from './data/merge/testnetMerge.json'
import * as testnetPOS from './data/merge/testnetPOS.json'

tape('[Common]: Merge/POS specific logic', function (t: tape.Test) {
  t.test('hardforkTTD()', function (st: tape.Test) {
    const customChains = [testnetMerge]
    const c = new Common({ chain: 'testnetMerge', hardfork: Hardfork.Istanbul, customChains })
    st.equal(c.hardforkTTD(Hardfork.Merge), BigInt(5000), 'should get the HF total difficulty')
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
      st.equal(c.getHardforkByBlockNumber(15, 5000), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.getHardforkByBlockNumber(15, 5001), 'merge', msg)
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
      st.equal(c.getHardforkByBlockNumber(16), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.getHardforkByBlockNumber(16, 5000), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.getHardforkByBlockNumber(16, 5001), 'merge', msg)
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
      st.equal(c.setHardforkByBlockNumber(15, 5000), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.setHardforkByBlockNumber(15, 5001), 'merge', msg)
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
      st.equal(c.setHardforkByBlockNumber(16), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and equal'
      st.equal(c.setHardforkByBlockNumber(16, 5000), 'merge', msg)
      msg = 'block number > last HF block number set, TD set and higher'
      st.equal(c.setHardforkByBlockNumber(16, 5001), 'merge', msg)
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
    const c = new Common({ chain: 'testnetPOS', hardfork: Hardfork.Istanbul, customChains })

    st.equal(c.hardforkTTD(Hardfork.Chainstart), BigInt(0), 'should get the HF total difficulty')

    const msg = 'block number > last HF block number set, TD set (0) and equal'
    st.equal(c.getHardforkByBlockNumber(5, 0), 'shanghai', msg)
    st.end()
  })
})
