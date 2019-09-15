const tape = require('tape')
const util = require('ethereumjs-util')
const VM = require('../../../dist/index').default

tape('General Istanbul VM tests', (t) => {
  t.test('should accept istanbul harfork option', (st) => {
    const vm = new VM({ hardfork: 'istanbul' })
    st.ok(vm.stateManager)
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })
})