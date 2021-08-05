import tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Address, BN, KECCAK256_RLP, KECCAK256_RLP_ARRAY, zeros } from 'ethereumjs-util'
import { Mockchain } from './mockchain'
import { Block } from '../src/block'

const common = new Common({
  eips: [3675],
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
})

function validateMergeHeader(st: tape.Test, header: BlockHeader) {
  st.ok(header.parentHash.equals(zeros(32)))
  st.ok(header.uncleHash.equals(KECCAK256_RLP_ARRAY))
  st.ok(header.coinbase.equals(Address.zero()))
  st.ok(header.stateRoot.equals(zeros(32)))
  st.ok(header.transactionsTrie.equals(KECCAK256_RLP))
  st.ok(header.receiptTrie.equals(KECCAK256_RLP))
  st.ok(header.bloom.equals(zeros(256)))
  st.ok(header.difficulty.isZero())
  st.ok(header.number.isZero())
  st.ok(header.gasLimit.eq(new BN(Buffer.from('ffffffffffffff', 'hex'))))
  st.ok(header.gasUsed.isZero())
  st.ok(header.timestamp.isZero())
  st.ok(header.extraData.equals(Buffer.from('80', 'hex')))
  st.ok(header.mixHash.equals(zeros(32)))
  st.ok(header.nonce.equals(zeros(8)))
}

tape('The Merge tests', function (t) {
  t.test('should construct default blocks with post-merge constants fields', function (st) {
    const header = BlockHeader.fromHeaderData({}, { common })
    validateMergeHeader(st, header)

    const block = new Block(undefined, undefined, undefined, { common })
    validateMergeHeader(st, block.header)

    st.end()
  })

  t.test('should override custom blocks fields with post-merge constants', function (st) {
    // Building a header with random values for constants
    const header = BlockHeader.fromHeaderData(
      {
        uncleHash: Buffer.from('123abc', 'hex'),
        difficulty: new BN(123456),
        extraData: Buffer.from('123abc', 'hex'),
        mixHash: Buffer.from('123abc', 'hex'),
        nonce: Buffer.from('123abc', 'hex'),
      },
      {
        common,
      }
    )
    validateMergeHeader(st, header)

    st.end()
  })
})
