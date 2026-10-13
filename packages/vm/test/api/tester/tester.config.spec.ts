import { Hardfork } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { getCommon } from '../../tester/legacy/config.ts'

describe('[VM/T8nTool]: runner config', () => {
  it('initializes common with the right hardfork', () => {
    const common = getCommon('byzantium')
    assert.strictEqual(common.hardfork(), Hardfork.Byzantium)
  })
  it('initializes common with the right hardfork upper-cased', () => {
    let common = getCommon('Byzantium')
    assert.strictEqual(common.hardfork(), Hardfork.Byzantium)
    common = getCommon('BYZANTIUM')
    assert.strictEqual(common.hardfork(), Hardfork.Byzantium)
  })
  it('always activate EIP 3607', () => {
    let common = getCommon('byzantium')
    assert.isTrue(common.isActivatedEIP(3607))
    common = getCommon('ArrowGlacierToMergeAtDiffC0000')
    assert.isTrue(common.isActivatedEIP(3607))
    common = getCommon('ByzantiumToConstantinopleFixAt5')
    assert.isTrue(common.isActivatedEIP(3607))
  })
  it('is able to activate hardforks with EIPs enabled', () => {
    let common = getCommon('byzantium+2537')
    assert.isTrue(common.isActivatedEIP(2537))
    common = getCommon('byzantium+2537+2929')
    assert.isTrue(common.isActivatedEIP(2537))
    assert.isTrue(common.isActivatedEIP(2929))
  })
  it('is able to activate transition forks', () => {
    assert.doesNotThrow(() => getCommon('ByzantiumToConstantinopleFixAt5'))
  })
  it('is able to activate merge transition fork with the correct TTD set', () => {
    const forks = [
      { hf: 'arrowGlacier', TTD: 20000 },
      { hf: 'london', TTD: 20000 },
      { hf: 'arrowGlacier', TTD: 40000 },
    ]
    forks.map((testCase) => {
      const str = testCase.hf + 'ToMergeAtDiff' + testCase.TTD.toString(16)
      const common = getCommon(str)
      assert.strictEqual(common.hardfork(), testCase.hf)
    })
  })
  it('throws on a non-existing fork', () => {
    assert.throws(() => getCommon('NonExistingFork'))
  })
})
