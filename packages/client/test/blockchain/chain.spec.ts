import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { KeyEncoding, ValueEncoding, bytesToHex, equalsBytes } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { Chain } from '../../src/blockchain/index.ts'
import { Config } from '../../src/config.ts'

import type { BlockData, HeaderData } from '@ethereumjs/block'
import type { LevelDB } from '../../src/execution/level.ts'

const config = new Config({ accountCache: 10000, storageCache: 1000 })

describe('[Chain]', () => {
  it('should test blockchain DB is initialized', async () => {
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
    assert.strictEqual(value, testValue, 'read value matches written value')
  })

  it('should retrieve chain properties', async () => {
    const chain = await Chain.create({ config })
    await chain.open()
    assert.strictEqual(chain.chainId, BigInt(1), 'get chain.chainId')
    assert.strictEqual(chain.blocks.td.toString(10), '17179869184', 'get chain.blocks.td')
    assert.strictEqual(chain.blocks.height.toString(10), '0', 'get chain.blocks.height')
    assert.strictEqual(
      bytesToHex(chain.genesis.hash()),
      '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      'get chain.genesis',
    )
    assert.isTrue(
      equalsBytes(chain.genesis.hash(), chain.blocks.latest!.hash()),
      'get chain.block.latest',
    )
    await chain.close()
  })

  it('should detect unopened chain', async () => {
    const blockchain = await createBlockchain({
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = await Chain.create({ config, blockchain })
    const headerData: HeaderData = {
      number: BigInt(1),
      difficulty: BigInt(0xabcdffff),
      parentHash: chain.genesis.hash(),
    }
    const block = createBlock({ header: headerData } as BlockData, {
      common: config.chainCommon,
    })

    assert.strictEqual(await chain.update(), false, 'skip update if not opened')
    assert.strictEqual(await chain.close(), false, 'skip close if not opened')
    assert.isFalse(chain.opened, 'chain should be closed')
    assert.strictEqual(chain.blocks.height, 0n, 'chain should be empty if not opened')
    await expect(chain.putHeaders([block.header])).rejects.toThrow('Chain closed')

    await chain.close()

    await expect(chain.putBlocks([block])).rejects.toThrow('Chain closed')
    assert.isFalse(chain.opened)
    await expect(chain.getBlocks(block.hash())).rejects.toThrow('Chain closed')
    await expect(chain.getBlock(block.hash())).rejects.toThrow('Chain closed')
    await expect(chain.getCanonicalHeadHeader()).rejects.toThrow('Chain closed')
    await expect(chain.getCanonicalHeadBlock()).rejects.toThrow('Chain closed')
    await expect(chain.getTd(block.hash(), block.header.number)).rejects.toThrow('Chain closed')

    await chain.open()

    assert.strictEqual(await chain.open(), false, 'skip open if already opened')

    await chain.close()
  })

  it('should add block to chain', async () => {
    // TODO: add test cases with activated block validation
    const blockchain = await createBlockchain({
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
    const block = createBlock({ header: headerData } as BlockData, {
      common: config.chainCommon,
    })
    await chain.putBlocks([block])
    assert.strictEqual(chain.blocks.td.toString(16), '4abcdffff', 'get chain.td')
    assert.strictEqual(chain.blocks.height.toString(10), '1', 'get chain.height')
    await chain.close()
  })
})
