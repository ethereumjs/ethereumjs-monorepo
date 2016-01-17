const genesisData = require('ethereumjs-testing').tests.basicTests.genesishashestest
const tape = require('tape')
const VM = require('../')

var vm = new VM()

tape('[Common]: genesis hashes tests', function (t) {
  t.test('should generate the genesis state correctly', function (st) {
    vm.stateManager.generateCanonicalGenesis(function () {
      st.equal(vm.trie.root.toString('hex'), genesisData.genesis_state_root)
      st.end()
    })
  })
})
