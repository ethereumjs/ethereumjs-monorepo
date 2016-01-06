const tape = require('tape')
const utils = require('ethereumjs-util')
const BN = utils.BN
const rlp = utils.rlp
const BlockHeader = require('../header.js')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    var header = new BlockHeader()
    st.deepEqual(header.parentHash, utils.zeros(32))
    st.equal(header.uncleHash.toString('hex'), utils.SHA3_RLP_ARRAY_S)
    st.deepEqual(header.coinbase, utils.zeros(20))
    st.deepEqual(header.stateRoot, utils.zeros(32))
    st.equal(header.transactionsTrie.toString('hex'), utils.SHA3_RLP_S)
    st.equal(header.receiptTrie.toString('hex'), utils.SHA3_RLP_S)
    st.deepEqual(header.bloom, utils.zeros(256))
    st.deepEqual(header.difficulty, new Buffer([]))
    st.deepEqual(header.number, new Buffer([]))
    st.deepEqual(header.gasLimit, new Buffer([]))
    st.deepEqual(header.gasUsed, new Buffer([]))
    st.deepEqual(header.timestamp, new Buffer([]))
    st.deepEqual(header.extraData, new Buffer([]))
    st.deepEqual(header.mixHash, utils.zeros(32))
    st.deepEqual(header.nonce, new Buffer([]))
    st.end()
  })

  t.test('should hash', function (st) {
    var header = new BlockHeader()
    st.deepEqual(header.hash(), new Buffer('651e4cd502f3843ef75e0ea0b459246ad6cfe2718abd0d177b921430e79c72f9', 'hex'))
    st.end()
  })

  t.test('should be true for isGenesis', function (st) {
    var header = new BlockHeader()
    st.equal(header.isGenesis(), true)
    st.end()
  })

  t.test('should be false for isGenesis', function (st) {
    var header = new BlockHeader({ number: 1 })
    st.equal(header.isGenesis(), false)
    st.end()
  })
})
