import tape from 'tape'
const Block = require('ethereumjs-block')
const { toBuffer } = require('ethereumjs-util')
const { Chain } = require('../../lib/blockchain')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

// explicitly import util and buffer,
// needed for karma-typescript bundling
import * as util from 'util'
import { Buffer } from 'buffer'

tape('[Chain]', (t) => {
  t.test('should test object creation without logger', (t) => {
    t.equal(new Chain().logger, defaultLogger)

    t.end()
  })

  t.test('should test blockchain DB is initialized', (t) => {
    const chain = new Chain() // eslint-disable-line no-new

    const db = chain.db
    const testKey = 'name'
    const testValue = 'test'

    db.put(testKey, testValue, function (err: Error) {
      if (err) t.fail('could not write key to db')

      db.get(testKey, function (err: Error, value: any) {
        if (err) t.fail('could not read key to db')

        t.equal(testValue, value, 'read value matches written value')
        t.end()
      })
    })
  })

  t.test('should retrieve chain properties', async (t) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    t.equal(chain.networkId, 1, 'get chain.networkId')
    t.equal(chain.blocks.td.toString(10), '17179869184', 'get chain.blocks.td')
    t.equal(chain.blocks.height.toString(10), '0', 'get chain.blocks.height')
    t.equal(chain.genesis.hash.toString('hex'),
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      'get chain.genesis')
    t.ok(chain.genesis.hash.equals(chain.blocks.latest.hash()),
      'get chain.block.latest')
    await chain.close()
    t.end()
  })

  t.test('should detect unopened chain', async (t) => {
    const chain = new Chain() // eslint-disable-line no-new
    const block = new Block()
    block.header.number = toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash

    t.equal(await chain.update(), false, 'skip update if not opened')
    t.equal(await chain.close(), false, 'skip close if not opened')
    t.notOk(chain.opened, 'chain shoud be closed')
    t.notOk(chain.blocks.height.toNumber(), 'chain should be empty if not opened')
    await chain.putHeaders([block.header])
    t.equal(chain.headers.height.toString(10), '1', 'header should be added even if chain closed')
    await chain.close()
    await chain.putBlocks([block])
    t.equal(chain.blocks.height.toString(10), '1', 'block should be added even if chain closed')
    await chain.close()
    t.notOk(chain.opened, 'chain should close')
    await chain.getBlocks(block.hash())
    t.ok(chain.opened, 'chain should open if getBlocks() called')
    await chain.close()
    await chain.getBlock(block.hash())
    t.ok(chain.opened, 'chain should open if getBlock() called')
    await chain.close()
    await chain.getLatestHeader()
    t.ok(chain.opened, 'chain should open if getLatestHeader() called')
    await chain.close()
    await chain.getLatestBlock()
    t.ok(chain.opened, 'chain should open if getLatestBlock() called')
    await chain.close()
    await chain.getTd(block.hash())
    t.ok(chain.opened, 'chain should open if getTd() called')
    t.equal(await chain.open(), false, 'skip open if already opened')
    await chain.close()
    t.end()
  })

  t.test('should handle bad arguments to putBlocks()', async (t) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    t.notOk(await chain.putBlocks(), 'add undefined block')
    t.notOk(await chain.putBlocks(null), 'add null block')
    t.notOk(await chain.putBlocks([]), 'add empty block list')
    await chain.close()
    t.end()
  })

  t.test('should handle bad arguments to putHeaders()', async (t) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    t.notOk(await chain.putHeaders(), 'add undefined header')
    t.notOk(await chain.putHeaders(null), 'add null header')
    t.notOk(await chain.putHeaders([]), 'add empty header list')
    await chain.close()
    t.end()
  })

  t.test('should add block to chain', async (t) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()

    const block = new Block()
    block.header.number = toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash
    await chain.putBlocks([block])
    t.equal(chain.blocks.td.toString(16), '4abcdffff', 'get chain.td')
    t.equal(chain.blocks.height.toString(10), '1', 'get chain.height')
    await chain.close()
    t.end()
  })
})
