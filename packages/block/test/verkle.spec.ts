import { Chain, Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { Block } from '../src'

import * as verkleBlockJSON from './testdata/verkleBlock.json'

tape('[VerkleBlock]: Verkle Block Functionality (Fake-EIP-999001)', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })

    const block = Block.fromBlockData(verkleBlockJSON, { common })

    const key = '0x6c99a3a0427cab63b7ab24f0683da88a1c5ed53f7b072b9e4efebd5dc412fd03'
    const value = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    st.equal(block.header.verkleState![key], value, 'should read in the verkle state')

    const proofStart = '0x00000000030000000a'
    st.equal(block.header.verkleProof!.slice(0, 20), proofStart, 'should read in the verkle proof')
    st.end()
  })
})
