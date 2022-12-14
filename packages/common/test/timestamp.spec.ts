import * as tape from 'tape'

import { Common, Hardfork } from '../src'

import * as timestampJson from './data/shanghai-time.json'

tape('[Common]: Timestamp Hardfork logic', function (t: tape.Test) {
  t.test('shanghai-time', function (st: tape.Test) {
    const c = Common.fromGethGenesis(timestampJson, {
      chain: 'withdrawals',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699476),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699576),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.end()
  })

  t.test('schedule sharding on shanghai-time', function (st: tape.Test) {
    const config = Object.assign({}, timestampJson.config, {
      shardingForkTime: timestampJson.config.shanghaiTime,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    // If two hardforks are schedule on same block/timestamp, should pick the last
    // one
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699476),
      Hardfork.ShardingFork_INTERNAL,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699576),
      Hardfork.ShardingFork_INTERNAL,
      'should match the HF'
    )
    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai),
      null,
      'should give null on next Hardfork block'
    )

    st.end()
  })

  t.test('schedule sharding post shanghai-time', function (st: tape.Test) {
    const config = Object.assign({}, timestampJson.config, {
      shardingForkTime: timestampJson.config.shanghaiTime + 1000,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    // Should give the shanghai as sharding is schedule a bit post shanghai
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699476),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699576),
      Hardfork.Shanghai,
      'should match the HF'
    )

    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai),
      BigInt(1668700476),
      'should give correct next Hardfork block/time'
    )
    st.end()
  })
})
