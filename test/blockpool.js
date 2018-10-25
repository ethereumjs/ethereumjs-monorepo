const tape = require('tape')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const { Chain, BlockPool } = require('../lib/blockchain')
const { defaultLogger } = require('../lib/logging')
defaultLogger.silent = true

tape('[BlockPool]: functions', t => {
  t.test('should add block segment to chain', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    const pool = new BlockPool({ chain })
    await pool.open()

    const block1 = new Block()
    block1.header.number = util.toBuffer(1)
    block1.header.difficulty = '0x11111111'
    block1.header.parentHash = chain.genesis.hash

    const block2 = new Block()
    block2.header.number = util.toBuffer(2)
    block2.header.difficulty = '0x22222222'
    block2.header.parentHash = block1.hash()

    // add blocks out of order to make sure they are inserted in order
    await pool.add(block2)
    await pool.add(block1)
    st.equal(chain.blocks.td.toString(16), '433333333', 'get chain.blocks.td')
    st.equal(chain.blocks.height.toString(10), '2', 'get chain.blocks.height')
    chain.close()
    st.end()
  })

  t.test('should get pool size', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    const pool = new BlockPool({ chain })
    await pool.open()

    const block1 = new Block()
    block1.header.number = util.toBuffer(1)
    block1.header.difficulty = '0x11111111'
    block1.header.parentHash = chain.genesis.hash

    const block2 = new Block()
    block2.header.number = util.toBuffer(2)
    block2.header.difficulty = '0x22222222'
    block2.header.parentHash = block1.hash()

    await pool.add(block2)
    st.equal(pool.size, 1, 'pool contains out of order block')
    await pool.add(block1)
    st.equal(pool.size, 0, 'pool should be empty')
    chain.close()
    st.end()
  })

  t.test('should check opened state', async (st) => {
    const chain = new Chain() // eslint-disable-line no-new
    const pool = new BlockPool({ chain })
    st.equal(await pool.add([]), false, 'not opened')
    await pool.open()
    st.equal(await pool.open(), false, 'already opened')
    st.end()
  })
})
