const tape = require('tape')
const utils = require('ethereumjs-util')
const Block = require('../index.js')

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
    st.deepEqual(header.number, new Buffer([]))
    st.deepEqual(header.gasLimit, new Buffer([]))
    st.deepEqual(header.gasUsed, new Buffer([]))
    st.deepEqual(header.timestamp, new Buffer([]))
    st.deepEqual(header.extraData, new Buffer([]))
    st.deepEqual(header.mixHash, utils.zeros(32))
    st.deepEqual(header.nonce, new Buffer([]))

    st.equal(block.uncleHeaders.length, 0)
    st.equal(block.transactions.length, 0)

    st.end()
  })

  t.test('should hash', function (st) {
    var block = new Block()
    st.deepEqual(block.hash(), new Buffer('651e4cd502f3843ef75e0ea0b459246ad6cfe2718abd0d177b921430e79c72f9', 'hex'))
    st.end()
  })

  t.test('should be true for isGenesis', function (st) {
    var block = new Block()
    st.equal(block.isGenesis(), true)
    st.end()
  })

  t.test('should serialize', function (st) {
    var block = new Block()
    var r = 'f901eaf901e5a00000000000000000000000000000000000000000000000000000000000000000a0' +
            '1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d493479400000000000000' +
            '00000000000000000000000000a00000000000000000000000000000000000000000000000000000' +
            '000000000000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0' +
            '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b901000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '0000000000000000000000808080808080a000000000000000000000000000000000000000000000' +
            '0000000000000000000080c0c0'
    st.equal(block.serialize().toString('hex'), r)
    st.end()
  })
})
