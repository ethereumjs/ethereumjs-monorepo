import { Block, BlockHeader, executionPayloadFromBeaconPayload } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import blocks from '../../testdata/blocks/kaustinen2.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen2.json'
import { baseRequest, params, setupChain } from '../helpers'

import type { HttpServer } from 'jayson'

// this verkle genesis stateroot and blockhash of the local generated kaustinen2 network
const genesisVerkleStateRoot = '0x30d24fe15e1281600a15328add431b906597d83cf33d23050627c51936bb0d1a'
const genesisVerkleBlockHash = '0x65bb31e62063fccdd3addd1da3a27c27d83f2eced51cad22da2a49e400b2f85c'
const merkleGenesisJsonBlock = {
  number: '0x0',
  hash: '0xdca7128b1c8b8ceff0c97c407f462dd50ee4dce2e28450b6bfecfaa8b293b7ab',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  nonce: '0x0000000000000056',
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  stateRoot: '0xb1a96ff063ca4cdc5e605ae282c5d525894633e6e5eeac958f5b26252b62b526',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  miner: '0x0000000000000000000000000000000000000000',
  difficulty: '0x1',
  totalDifficulty: '0x1',
  extraData: '0x',
  size: '0x57b',
  gasLimit: '0x2fefd8',
  gasUsed: '0x0',
  timestamp: '0x641d76f8',
  transactions: [],
  uncles: [],
  baseFeePerGas: '0x3b9aca00',
  withdrawalsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  withdrawals: [],
}

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

export const batchBlocks = async (server: HttpServer) => {
  for (let i = 0; i < blocks.length; i++) {
    const executionPayload = executionPayloadFromBeaconPayload(blocks[i])
    const req = params('engine_newPayloadV2', [executionPayload])
    const expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectRes, false, false)
  }
}

describe(`verkle genesis checks`, () => {
  const common = Common.fromGethGenesis(genesisJSON, { chain: 'kaustinen2' })
  it('genesis fork', async () => {
    assert.equal(common.hardfork(), Hardfork.Prague, 'should be set at prague hardfork for verkle')
  })
  const merkleGenesisBlock = Block.fromRPC(merkleGenesisJsonBlock, [], { common })
  assert.equal(merkleGenesisJsonBlock.hash, bytesToHex(merkleGenesisBlock.hash()))

  // get the block with the verkle genesis root instead of merkle root
  const verkleGenesisBlock = Block.fromRPC(
    { ...merkleGenesisJsonBlock, stateRoot: genesisVerkleStateRoot },
    [],
    { common }
  )
  assert.equal(genesisVerkleBlockHash, bytesToHex(verkleGenesisBlock.hash()))
})

describe(`invalid verkle network setup`, () => {
  it('start client without verkle state root', async () => {
    // assign a chain id not of kaustinen2 chain so as to not interfere with the stateroot lookup of
    // kaustinen in genesis state enum of well known networks
    const invalidGenesis = Object.assign({}, genesisJSON, {
      config: { ...genesisJSON.config, chainId: 90069420 },
    })
    try {
      await setupChain(invalidGenesis, 'post-merge', {
        engine: true,
      })
      assert.fail('Should have failed to start')
    } catch (e) {
      assert.equal(e.message, 'Verkle trie state not yet supported')
    }
  })
})

describe(`valid verkle network setup`, async () => {
  const { server } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    genesisStateRoot: genesisVerkleStateRoot,
  })

  it(
    ('genesis should be correctly setup',
    async () => {
      const req = params('eth_getBlockByNumber', ['0x0', false])
      const expectRes = (res: any) => {
        const block0 = res.body.result
        assert.equal(block0.hash, genesisVerkleBlockHash)
        assert.equal(block0.stateRoot, genesisVerkleStateRoot)
      }
      await baseRequest(server, req, 200, expectRes, false, false)
    })
  )

  it('should be able to apply new verkle payloads', async () => {
    await batchBlocks(server)
  })

  it(`reset TD`, () => {
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
