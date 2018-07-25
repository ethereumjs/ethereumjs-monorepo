const tape = require('tape')
const fakeBlockchain = require('../../lib/fakeBlockChain')

tape('fakeBlockChain', (t) => {
  const blockchain = fakeBlockchain

  t.test('should fail to get block by invalid type', (st) => {
    blockchain.getBlock(null, (err, block) => {
      st.ok(err, 'should return error')
      st.notOk(block)
      st.end()
    })
  })

  t.test('should get block hash by number', (st) => {
    blockchain.getBlock(1, isValidBlock(st))
  })

  t.test('should get block hash by buffer', (st) => {
    blockchain.getBlock(Buffer.from('0x0'), isValidBlock(st))
  })

  t.test('should "del" block', (st) => {
    blockchain.delBlock('0x0', (err) => {
      st.error(err)
      st.end()
    })
  })
})

const isValidBlock = (st) => (err, block) => {
  st.notOk(err)
  st.ok(block, 'should return non-empty value')
  st.ok(Buffer.isBuffer(block.hash()), 'block hash should of type buffer')
  st.end()
}
