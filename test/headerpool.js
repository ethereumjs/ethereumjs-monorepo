const tape = require('tape')
const tmp = require('tmp')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const { Chain, HeaderPool } = require('../lib/blockchain')
const { defaultLogger } = require('../lib/logging')
defaultLogger.silent = true

tape('[HeaderPool]: functions', t => {
  const config = {}

  t.test('should add header segment to chain', async (st) => {
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
    st.equal(chain.headers.td.toString(16), '433333333', 'get chain.headers.td')
    st.equal(chain.headers.height.toString(10), '2', 'get chain.headers.height')
    chain.close()
    st.end()
  })

  t.test('should check opened state', async (st) => {
    const tmpdir = tmp.dirSync()
    config.dataDir = `${tmpdir.name}/chaindb`

    const chain = new Chain(config) // eslint-disable-line no-new
    const pool = new HeaderPool({ chain })
    st.equal(await pool.add([]), false, 'not opened')
    st.end()
  })
})
