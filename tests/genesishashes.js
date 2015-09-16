const genesisData = require('ethereumjs-testing').tests.basicTests.genesishashestest
const tape = require('tape')
const Block = require('ethereumjs-block')
const VM = require('../')

var vm = new VM()

tape('[Common]: genesis hashes tests', function (t) {
  t.test('should generate the genesis state correctly', function (st) {
    vm.generateCanonicalGenesis(function () {
      st.equal(vm.trie.root.toString('hex'), genesisData.genesis_state_root)
      st.end()
    })
  })

  t.test('should generete the genesis correctly', function (st) {
    var blockGenesis = new Block()
    blockGenesis.setGenesisParams()
    var rlpGenesis = blockGenesis.serialize()
    st.strictEqual(rlpGenesis.toString('hex'), genesisData.genesis_rlp_hex, 'rlp hex mismatch')
    st.strictEqual(blockGenesis.hash().toString('hex'), genesisData.genesis_hash)
    st.end()
  })
})
