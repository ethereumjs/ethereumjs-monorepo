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
    st.end()
  })
})
