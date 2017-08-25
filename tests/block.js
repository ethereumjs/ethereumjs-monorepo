const tape = require('tape')
const utils = require('ethereumjs-util')
const Block = require('../index.js')
const params = require('ethereum-common')
const testData = require('./testdata.json')

tape('[Block]: Block functions', function (t) {
  t.test('should be true for isGenesis', function (st) {
    var block = new Block()
    st.equal(block.isGenesis(), false)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  t.test('should be true for transaction validation', function (st) {
    var block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
    st.equal(block.validateTransactions(), true, 'test validateTransactions()')
    st.end()
  })
})
