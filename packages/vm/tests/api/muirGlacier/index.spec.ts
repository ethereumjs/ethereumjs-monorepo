import tape from 'tape'
import { KECCAK256_RLP } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'

tape('General MuirGlacier VM tests', (t) => {
  t.test('should accept muirGlacier harfork option for supported chains', (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.MuirGlacier })
    const vm = new VM({ common })
    st.ok(vm.stateManager)
    st.deepEqual((<any>vm.stateManager)._trie.root, KECCAK256_RLP, 'it has default trie')
    st.end()
  })
})
