const tape = require('tape')
const tmp = require('tmp')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const { Chain, HeaderPool } = require('../../lib/blockchain')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[HeaderPool]', t => {
  const config = {}

  t.test('should add header segment to chain', async (t) => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    const pool = new HeaderPool({ chain })
    await pool.open()

    const header1 = new Block.Header()
    header1.number = util.toBuffer(1)
    header1.difficulty = '0x11111111'
    header1.parentHash = chain.genesis.hash

    const header2 = new Block.Header()
    header2.number = util.toBuffer(2)
    header2.difficulty = '0x22222222'
    header2.parentHash = header1.hash()

    // add headers out of order to make sure they are inserted in order
    await pool.add(header2)
    await pool.add(header1)
    t.equal(chain.headers.td.toString(16), '433333333', 'get chain.headers.td')
    t.equal(chain.headers.height.toString(10), '2', 'get chain.headers.height')
    chain.close()
    t.end()
  })

  t.test('should check opened state', async (t) => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    const pool = new HeaderPool({ chain })
    t.equal(await pool.add([]), false, 'not opened')
    t.end()
  })
})
