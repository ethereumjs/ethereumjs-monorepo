const tape = require('tape')
const util = require('ethereumjs-util')
const VM = require('../../../dist/index').default

tape('General MuirGlacier VM tests', (t) => {
  t.test('should accept muirGlacier harfork option for supported chains', (st) => {
    let vm = new VM({ hardfork: 'muirGlacier' })
    st.ok(vm.stateManager)
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })
})