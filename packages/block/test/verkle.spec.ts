import Common, { Chain, Hardfork } from '@ethereumjs/common'
import tape from 'tape'
import { Block } from '../src'
import * as verkleBlockJSON from './testdata/verkleBlock.json'

tape('[VerkleBlock]: Verkle Block Functionality (Fake-EIP-999001)', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })

    const block = Block.fromBlockData(verkleBlockJSON, { common })
    console.log(block)

    st.pass('Everything ok.')
    st.end()
  })
})
