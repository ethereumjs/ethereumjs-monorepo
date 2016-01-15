const tape = require('tape')
const utils = require('ethereumjs-util')
const Block = require('../index.js')
const params = require('ethereum-common')

tape('[Block]: Block functions', function (t) {
  t.test('should create with default constructor', function (st) {
    var block = new Block()

    var header = block.header
    st.deepEqual(header.parentHash, utils.zeros(32))
    st.equal(header.uncleHash.toString('hex'), utils.SHA3_RLP_ARRAY_S)
    st.deepEqual(header.coinbase, utils.zeros(20))
    st.deepEqual(header.stateRoot, utils.zeros(32))
    st.equal(header.transactionsTrie.toString('hex'), utils.SHA3_RLP_S)
    st.equal(header.receiptTrie.toString('hex'), utils.SHA3_RLP_S)
    st.deepEqual(header.bloom, utils.zeros(256))
    st.deepEqual(header.difficulty, new Buffer([]))
    st.deepEqual(header.number, utils.intToBuffer(params.homeSteadForkNumber.v))
    st.deepEqual(header.gasLimit, new Buffer('ffffffffffffff', 'hex'))
    st.deepEqual(header.gasUsed, new Buffer([]))
    st.deepEqual(header.timestamp, new Buffer([]))
    st.deepEqual(header.extraData, new Buffer([]))
    st.deepEqual(header.mixHash, utils.zeros(32))
    st.deepEqual(header.nonce, new Buffer([]))

    st.equal(block.uncleHeaders.length, 0)
    st.equal(block.transactions.length, 0)

    st.end()
  })

  t.test('should be true for isGenesis', function (st) {
    var block = new Block()
    st.equal(block.isGenesis(), false)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })
})
