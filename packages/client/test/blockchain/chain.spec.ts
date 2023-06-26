// explicitly import util and buffer,
// needed for karma-typescript bundling
import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { KeyEncoding, ValueEncoding } from '@ethereumjs/util'
import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'

import type { LevelDB } from '../../src/execution/level'
import type { BlockData, HeaderData } from '@ethereumjs/block'

const config = new Config({ accountCache: 10000, storageCache: 1000 })

tape('[Chain]', (t) => {
  t.test('should test blockchain DB is initialized', async (t) => {
    const chain = await Chain.create({ config })

    const db = chain.chainDB as LevelDB
    const testKey = 'name'
    const testValue = 'test'
    await db.put(testKey, testValue, {
      keyEncoding: KeyEncoding.String,
      valueEncoding: ValueEncoding.String,
    })

    const value = await db.get(testKey, {
      keyEncoding: KeyEncoding.String,
      valueEncoding: ValueEncoding.String,
    })
    t.equal(value, testValue, 'read value matches written value')
    t.end()
  })

  t.test('should retrieve chain properties', async (t) => {
    const chain = await Chain.create({ config })
    await chain.open()
    t.equal(chain.networkId, BigInt(1), 'get chain.networkId')
    t.equal(chain.blocks.td.toString(10), '17179869184', 'get chain.blocks.td')
    t.equal(chain.blocks.height.toString(10), '0', 'get chain.blocks.height')
    t.equal(
      bytesToHex(chain.genesis.hash()),
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      'get chain.genesis'
    )
    t.ok(equalsBytes(chain.genesis.hash(), chain.blocks.latest!.hash()), 'get chain.block.latest')
    await chain.close()
    t.end()
  })

  t.test('should detect unopened chain', async (t) => {
    const blockchain = await Blockchain.create({
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = await Chain.create({ config, blockchain })
    const headerData: HeaderData = {
      number: BigInt(1),
      difficulty: BigInt(0xabcdffff),
      parentHash: chain.genesis.hash(),
    }
    const block = Block.fromBlockData({ header: headerData } as BlockData, {
      common: config.chainCommon,
    })

    t.equal(await chain.update(), false, 'skip update if not opened')
    t.equal(await chain.close(), false, 'skip close if not opened')
    t.notOk(chain.opened, 'chain should be closed')
    t.notOk(chain.blocks.height, 'chain should be empty if not opened')
    try {
      await chain.putHeaders([block.header])
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.close()
    try {
      await chain.putBlocks([block])
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.close()
    t.notOk(chain.opened, 'chain should close')
    try {
      await chain.getBlocks(block.hash())
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.close()
    try {
      await chain.getBlock(block.hash())
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    try {
      await chain.getCanonicalHeadHeader()
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.close()
    try {
      await chain.getCanonicalHeadBlock()
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.close()
    try {
      await chain.getTd(block.hash(), block.header.number)
      t.fail('should error if chain is closed')
    } catch (error) {
      t.pass('threw an error when chain is closed')
    }
    await chain.open()
    t.equal(await chain.open(), false, 'skip open if already opened')
    await chain.close()
    t.end()
  })

  t.test('should add block to chain', async (t) => {
    // TODO: add test cases with activated block validation
    const blockchain = await Blockchain.create({
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = await Chain.create({ config, blockchain })
    await chain.open()
    const headerData: HeaderData = {
      number: BigInt(1),
      difficulty: BigInt(0xabcdffff),
      parentHash: chain.genesis.hash(),
    }
    const block = Block.fromBlockData({ header: headerData } as BlockData, {
      common: config.chainCommon,
    })
    await chain.putBlocks([block])
    t.equal(chain.blocks.td.toString(16), '4abcdffff', 'get chain.td')
    t.equal(chain.blocks.height.toString(10), '1', 'get chain.height')
    await chain.close()
    t.end()
  })
})
