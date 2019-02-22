const tape = require('tape')
const fakeBlockchain = require('../../lib/fakeBlockChain')

tape('fakeBlockChain', (t) => {
  const blockchain = fakeBlockchain

  t.test('should fail to get block by invalid type', (st) => {
    blockchain.getBlock(null, isError(st, 'Unknown blockTag type'))
  })

  t.test('should not get block hash by number', (st) => {
    blockchain.getBlock(1, isError(st, 'fakeBlockChain can\'t return blocks by number'))
  })

  t.test('should get block by hash', (st) => {
    const hash = Buffer.from('d71b71b0860adfe1ebd703eb8025d1d312925aa3e759e0542967ff1915f7b991', 'hex')
    blockchain.getBlock(hash, isValidBlock(st, hash))
  })

  t.test('should "del" block', (st) => {
    blockchain.delBlock('0x0', (err) => {
      st.error(err)
      st.end()
    })
  })
})

const isValidBlock = (st, expectedHash) => (err, block) => {
  st.notOk(err)
  st.ok(block, 'should return non-empty value')
  st.ok(Buffer.isBuffer(block.hash()), 'block hash should of type buffer')

  if (expectedHash) {
    st.ok(
      expectedHash.compare(block.hash()) === 0,
      'block should have hash ' + expectedHash.toString('hex')
    )
  }
  st.end()
}

const isError = (st, errorMessage) => (err, block) => {
  st.ok(err, 'should return error')
  st.ok(err.message === errorMessage, 'should return error')
  st.notOk(block)
  st.end()
}
