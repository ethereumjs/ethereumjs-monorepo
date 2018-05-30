const tape = require('tape')
const Common = require('ethereumjs-common')
const utils = require('ethereumjs-util')
const rlp = utils.rlp
const testing = require('ethereumjs-testing')
const Header = require('../header.js')
const Block = require('../index.js')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader (st, header) {
      st.deepEqual(header.parentHash, utils.zeros(32))
      st.equal(header.uncleHash.toString('hex'), utils.SHA3_RLP_ARRAY_S)
      st.deepEqual(header.coinbase, utils.zeros(20))
      st.deepEqual(header.stateRoot, utils.zeros(32))
      st.equal(header.transactionsTrie.toString('hex'), utils.SHA3_RLP_S)
      st.equal(header.receiptTrie.toString('hex'), utils.SHA3_RLP_S)
      st.deepEqual(header.bloom, utils.zeros(256))
      st.deepEqual(header.difficulty, new Buffer([]))
      st.deepEqual(header.number, utils.intToBuffer(1150000))
      st.deepEqual(header.gasLimit, new Buffer('ffffffffffffff', 'hex'))
      st.deepEqual(header.gasUsed, new Buffer([]))
      st.deepEqual(header.timestamp, new Buffer([]))
      st.deepEqual(header.extraData, new Buffer([]))
      st.deepEqual(header.mixHash, utils.zeros(32))
      st.deepEqual(header.nonce, utils.zeros(8))
    }

    var header = new Header()
    compareDefaultHeader(st, header)

    var block = new Block()
    header = block.header
    compareDefaultHeader(st, header)

    st.end()
  })

  t.test('should test header initialization', function (st) {
    const header1 = new Header(null, { 'chain': 'ropsten' })
    const common = new Common('ropsten')
    const header2 = new Header(null, { 'common': common })
    header1.setGenesisParams()
    header2.setGenesisParams()
    st.strictEqual(header1.hash().toString('hex'), header2.hash().toString('hex'), 'header hashes match')

    st.throws(function () { new Header(null, { 'chain': 'ropsten', 'common': common }) }, /not allowed!$/, 'should throw on initialization with chain and common parameter') // eslint-disable-line
    st.end()
  })

  t.test('should test validateGasLimit', function (st) {
    const testData = testing.getSingleFile('BlockchainTests/bcBlockGasLimitTest.json')

    var parentBlock = new Block(rlp.decode(testData['BlockGasLimit2p63m1'].genesisRLP))
    var block = new Block(rlp.decode(testData['BlockGasLimit2p63m1'].blocks[0].rlp))
    st.equal(block.header.validateGasLimit(parentBlock), true)
    st.end()
  })

  t.test('should test isGenesis', function (st) {
    var header = new Header()
    st.equal(header.isGenesis(), false)
    header.number = new Buffer([])
    st.equal(header.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = testing.getSingleFile('BasicTests/genesishashestest.json')
  t.test('should test genesis hashes (mainnet default)', function (st) {
    var header = new Header()
    header.setGenesisParams()
    st.strictEqual(header.hash().toString('hex'), testDataGenesis.genesis_hash, 'genesis hash match')
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    var genesisHeader = new Header(null, { 'chain': 'ropsten' })
    genesisHeader.setGenesisParams()
    let ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(genesisHeader.stateRoot.toString('hex'), ropstenStateRoot, 'genesis stateRoot match')
    st.end()
  })
})
