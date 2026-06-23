import { assert, describe, it } from 'vitest'

import { Common, Hardfork, Mainnet, createCommon } from '../src/index.ts'

// D-NAME-3: `createCommon(opts)` is the convention-aligned factory for `new Common(opts)`
// and must produce an equivalent object.
describe('API conventions: createCommon factory alias (D-NAME-3)', () => {
  it('createCommon and new Common produce equivalent objects', () => {
    const opts = { chain: Mainnet, hardfork: Hardfork.Shanghai }
    const viaFactory = createCommon(opts)
    const viaConstructor = new Common(opts)

    assert.instanceOf(viaFactory, Common)
    assert.strictEqual(viaFactory.chainId(), viaConstructor.chainId())
    assert.strictEqual(viaFactory.hardfork(), viaConstructor.hardfork())
  })
})
