import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { KECCAK256_RLP } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.js'

describe('General MuirGlacier VM tests', () => {
  it('should accept muirGlacier hardfork option for supported chains', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.MuirGlacier })
    const vm = await createVM({ common })
    assert.ok(vm.stateManager)
    assert.deepEqual((<any>vm.stateManager)._trie.root(), KECCAK256_RLP, 'it has default trie')
  })
})
