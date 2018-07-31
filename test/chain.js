const fs = require('fs')
const tape = require('tape')
const tmp = require('tmp')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const { Chain } = require('../lib/blockchain')
const { defaultLogger } = require('../lib/logging')
defaultLogger.silent = true

tape('[Chain]: Database functions', t => {
  const config = {}

  t.test('should test object creation without logger', st => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    st.equal(new Chain(config).logger, defaultLogger)

    st.end()
  })

  t.test('should test data dir creation', st => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    new Chain(config) // eslint-disable-line no-new

    st.ok(fs.existsSync(config.dataDir), 'data dir exists')

    st.end()
  })

  t.test('should test non-error on already created data dir', st => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    fs.mkdirSync(config.dataDir)

    st.ok(fs.existsSync(config.dataDir), 'data dir exists before creating DBManager')

    new Chain(config) // eslint-disable-line no-new

    st.ok(fs.existsSync(config.dataDir), 'data dir exists after creating DBManager')

    st.end()
  })

  t.test('should test blockchain DB is initialized', st => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new

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
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
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
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    const block = new Block()
    block.header.number = util.toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash

    st.equal(await chain.update(), false, 'skip update if not opened')
    st.equal(await chain.close(), false, 'skip close if not opened')
    st.equal(await chain.add(block), false, 'skip add if not opened')
    st.equal(await chain.addHeaders([block.header]), false, 'skip addHeaders if not opened')
    st.notOk(chain.blocks.height.toNumber(), 'chain should be empty if not opened')

    await chain.open()
    st.equal(await chain.open(), false, 'skip open if already opened')
    await chain.add(block)
    st.equal(chain.blocks.height.toString(10), '1', 'block should be added if chain opened')
    st.end()
  })

  t.test('should handle bad arguments to add()', async (st) => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    await chain.open()
    st.notOk(await chain.add(), 'add undefined block')
    st.notOk(await chain.add(null), 'add null block')
    st.notOk(await chain.add([]), 'add empty block list')
    st.end()
  })

  t.test('should add block to chain', async (st) => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    await chain.open()

    const block = new Block()
    block.header.number = util.toBuffer(1)
    block.header.difficulty = '0xabcdffff'
    block.header.parentHash = chain.genesis.hash
    await chain.add(block)
    st.equal(chain.blocks.td.toString(16), '4abcdffff', 'get chain.td')
    st.equal(chain.blocks.height.toString(10), '1', 'get chain.height')
    chain.close()
    st.end()
  })
})
