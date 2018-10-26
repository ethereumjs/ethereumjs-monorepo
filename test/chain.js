const tape = require('tape')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const { Chain } = require('../lib/blockchain')
const { defaultLogger } = require('../lib/logging')
defaultLogger.silent = true

tape('[Chain]: Database functions', t => {
  t.test('should test object creation without logger', st => {
    st.equal(new Chain().logger, defaultLogger)

    st.end()
  })

  t.test('should test blockchain DB is initialized', st => {
    const chain = new Chain() // eslint-disable-line no-new

    const db = chain.db
    const testKey = 'name'
    const testValue = 'test'

    db.put(testKey, testValue, function (err) {
      if (err) st.fail('could not write key to db')

      db.get(testKey, function (err, value) {
        if (err) st.fail('could not read key to db')

        st.equal(testValue, value, 'read value matches written value')
        st.end()
      })
    })
  })

  t.test('should retrieve chain properties', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    st.equal(chain.networkId, 1, 'get chain.networkId')
    st.equal(chain.blocks.td.toString(10), '17179869184', 'get chain.blocks.td')
    st.equal(chain.blocks.height.toString(10), '0', 'get chain.blocks.height')
    st.equal(chain.genesis.hash.toString('hex'),
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      'get chain.genesis')
    st.equal(chain.genesis.hash.toString('hex'),
      chain.blocks.latest.hash().toString('hex'),
      'get chain.block.latest')
    chain.close()
    st.end()
  })

  t.test('should detect unopened chain', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    const block = new Block()
    block.header.number = util.toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash

    st.equal(await chain.update(), false, 'skip update if not opened')
    st.equal(await chain.close(), false, 'skip close if not opened')
    st.notOk(chain.opened, 'chain shoud be closed')
    st.notOk(chain.blocks.height.toNumber(), 'chain should be empty if not opened')
    await chain.putHeaders([block.header])
    st.equal(chain.headers.height.toString(10), '1', 'header should be added even if chain closed')
    await chain.close()
    await chain.putBlocks([block])
    st.equal(chain.blocks.height.toString(10), '1', 'block should be added even if chain closed')
    await chain.close()
    st.notOk(chain.opened, 'chain should close')
    await chain.getBlocks(block.hash())
    st.ok(chain.opened, 'chain should open if getBlocks() called')
    await chain.close()
    await chain.getBlock(block.hash())
    st.ok(chain.opened, 'chain should open if getBlock() called')
    await chain.close()
    await chain.getLatestHeader()
    st.ok(chain.opened, 'chain should open if getLatestHeader() called')
    await chain.close()
    await chain.getLatestBlock()
    st.ok(chain.opened, 'chain should open if getLatestBlock() called')
    await chain.close()
    await chain.getTd(block.hash())
    st.ok(chain.opened, 'chain should open if getTd() called')
    st.equal(await chain.open(), false, 'skip open if already opened')
    st.end()
  })

  t.test('should handle bad arguments to putBlocks()', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    st.notOk(await chain.putBlocks(), 'add undefined block')
    st.notOk(await chain.putBlocks(null), 'add null block')
    st.notOk(await chain.putBlocks([]), 'add empty block list')
    st.end()
  })

  t.test('should handle bad arguments to putHeaders()', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()
    st.notOk(await chain.putHeaders(), 'add undefined header')
    st.notOk(await chain.putHeaders(null), 'add null header')
    st.notOk(await chain.putHeaders([]), 'add empty header list')
    st.end()
  })

  t.test('should add block to chain', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    await chain.open()

    const block = new Block()
    block.header.number = util.toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash
    await chain.putBlocks([block])
    st.equal(chain.blocks.td.toString(16), '4abcdffff', 'get chain.td')
    st.equal(chain.blocks.height.toString(10), '1', 'get chain.height')
    chain.close()
    st.end()
  })
})
