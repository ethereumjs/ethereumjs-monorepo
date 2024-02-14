import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { KECCAK256_RLP } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

describe('General MuirGlacier VM tests', () => {
  it('should accept muirGlacier harfork option for supported chains', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.MuirGlacier })
    const vm = await VM.create({ common })
    assert.ok(vm.stateManager)
    assert.deepEqual((<any>vm.stateManager)._trie.root(), KECCAK256_RLP, 'it has default trie')
  })
})
