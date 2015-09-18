const genesisData = require('ethereumjs-testing').tests.basicTests.genesishashestest
const tape = require('tape')
const Block = require('../')

tape('[Common]: genesis hashes tests', function (t) {
  t.test('should generete the genesis correctly', function (st) {
    var blockGenesis = new Block()
    blockGenesis.setGenesisParams()
    var rlpGenesis = blockGenesis.serialize()
    st.strictEqual(rlpGenesis.toString('hex'), genesisData.genesis_rlp_hex, 'rlp hex mismatch')
    st.strictEqual(blockGenesis.hash().toString('hex'), genesisData.genesis_hash)
    st.end()
  })
})
