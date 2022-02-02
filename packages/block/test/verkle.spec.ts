import Common, { Chain, Hardfork } from '@ethereumjs/common'
import tape from 'tape'
import { Block } from '../src'
import * as verkleBlockJSON from './testdata/verkleBlock.json'

tape('[VerkleBlock]: Verkle Block Functionality (Fake-EIP-999001)', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })

    const block = Block.fromBlockData(verkleBlockJSON, { common })

    const key = '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01'
    const value = '0x320122e8584be00d'
    st.equal(block.header.verkleState![key], value, 'should read in the verkle state')
    st.end()
  })
})
