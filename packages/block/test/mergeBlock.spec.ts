import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  Address,
  KECCAK256_RLP,
  KECCAK256_RLP_ARRAY,
  equalsBytes,
  hexStringToBytes,
  zeros,
} from '@ethereumjs/util'
import * as tape from 'tape'

import { Block } from '../src/block'
import { BlockHeader } from '../src/header'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Paris,
})

function validateMergeHeader(st: tape.Test, header: BlockHeader) {
  st.ok(equalsBytes(header.parentHash, zeros(32)), 'parentHash')
  st.ok(equalsBytes(header.uncleHash, KECCAK256_RLP_ARRAY), 'uncleHash')
  st.ok(header.coinbase.equals(Address.zero()), 'coinbase')
  st.ok(equalsBytes(header.stateRoot, zeros(32)), 'stateRoot')
  st.ok(equalsBytes(header.transactionsTrie, KECCAK256_RLP), 'transactionsTrie')
  st.ok(equalsBytes(header.receiptTrie, KECCAK256_RLP), 'receiptTrie')
  st.ok(equalsBytes(header.logsBloom, zeros(256)), 'logsBloom')
  st.equal(header.difficulty, BigInt(0), 'difficulty')
  st.equal(header.number, BigInt(0), 'number')
  st.equal(header.gasLimit, BigInt('0xffffffffffffff'), 'gasLimit')
  st.equal(header.gasUsed, BigInt(0), 'gasUsed')
  st.equal(header.timestamp, BigInt(0), 'timestamp')
  st.ok(header.extraData.length <= 32, 'extraData')
  st.equal(header.mixHash.length, 32, 'mixHash')
  st.ok(equalsBytes(header.nonce, zeros(8)), 'nonce')
}

tape('[Header]: Casper PoS / The Merge Functionality', function (t) {
  t.test('should construct default blocks with post-merge PoS constants fields', function (st) {
    const header = BlockHeader.fromHeaderData({}, { common })
    validateMergeHeader(st, header)

    const block = new Block(undefined, undefined, undefined, { common })
    validateMergeHeader(st, block.header)

    st.end()
  })

  t.test('should throw if non merge-conforming PoS constants are provided', function (st) {
    // Building a header with random values for constants
    try {
      const headerData = {
        uncleHash: hexStringToBytes('123abc'),
      }
      BlockHeader.fromHeaderData(headerData, { common })
      st.fail('should throw')
    } catch (e: any) {
      st.pass('should throw on wrong uncleHash')
    }

    try {
      const headerData = {
        difficulty: BigInt(123456),
        number: 1n,
      }
      BlockHeader.fromHeaderData(headerData, { common })
      st.fail('should throw')
    } catch (e: any) {
      st.pass('should throw on wrong difficulty')
    }

    try {
      const headerData = {
        extraData: new Uint8Array(33).fill(1),
        number: 1n,
      }
      BlockHeader.fromHeaderData(headerData, { common })
      st.fail('should throw')
    } catch (e: any) {
      st.pass('should throw on invalid extraData length')
    }

    try {
      const headerData = {
        mixHash: new Uint8Array(30).fill(1),
      }
      BlockHeader.fromHeaderData(headerData, { common })
      st.fail('should throw')
    } catch (e: any) {
      st.pass('should throw on invalid mixHash length')
    }

    try {
      const headerData = {
        nonce: new Uint8Array(8).fill(1),
        number: 1n,
      }
      BlockHeader.fromHeaderData(headerData, { common })
      st.fail('should throw')
    } catch (e: any) {
      st.pass('should throw on wrong nonce')
    }

    st.end()
  })

  t.test('test that a PoS block with uncles cannot be produced', function (st) {
    try {
      new Block(undefined, undefined, [BlockHeader.fromHeaderData(undefined, { common })], {
        common,
      })
      st.fail('should have thrown')
    } catch (e: any) {
      st.pass('should throw')
    }
    st.end()
  })

  t.test('EIP-4399: prevRando should return mixHash value', function (st) {
    const mixHash = new Uint8Array(32).fill(3)
    let block = Block.fromBlockData({ header: { mixHash } }, { common })
    st.ok(equalsBytes(block.header.prevRandao, mixHash), 'prevRandao should return mixHash value')

    const commonLondon = common.copy()
    commonLondon.setHardfork(Hardfork.London)
    block = Block.fromBlockData({ header: { mixHash } }, { common: commonLondon })
    try {
      block.header.prevRandao
      st.fail('should have thrown')
    } catch (e: any) {
      st.pass('prevRandao should throw if EIP-4399 is not activated')
    }
    st.end()
  })
})
