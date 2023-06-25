import { Hardfork } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { getCommon } from '../../tester/config'

describe('bloom', () => {
  it('should initialize common with the right hardfork', () => {
    const common = getCommon('byzantium')
    assert.ok(common.hardfork() === Hardfork.Byzantium)
  })
  it('should initialize common with the right hardfork uppercased', () => {
    let common = getCommon('Byzantium')
    assert.ok(common.hardfork() === Hardfork.Byzantium)
    common = getCommon('BYZANTIUM')
    assert.ok(common.hardfork() === Hardfork.Byzantium)
  })
  it('should always activate EIP 3607', () => {
    let common = getCommon('byzantium')
    assert.ok(common.isActivatedEIP(3607))
    common = getCommon('ArrowGlacierToMergeAtDiffC0000')
    assert.ok(common.isActivatedEIP(3607))
    common = getCommon('ByzantiumToConstantinopleFixAt5')
    assert.ok(common.isActivatedEIP(3607))
  })
  it('should be able to activate hardforks with EIPs enabled', () => {
    let common = getCommon('byzantium+2537')
    assert.ok(common.isActivatedEIP(2537))
    common = getCommon('byzantium+2537+2929')
    assert.ok(common.isActivatedEIP(2537))
    assert.ok(common.isActivatedEIP(2929))
  })
  it('should be able to activate transition forks', () => {
    assert.doesNotThrow(() => getCommon('ByzantiumToConstantinopleFixAt5'))
  })
  it('should be able to activate merge transition fork with the correct TTD set', () => {
    const forks = [
      { hf: 'arrowGlacier', TTD: 20000 },
      { hf: 'london', TTD: 20000 },
      { hf: 'arrowGlacier', TTD: 40000 },
    ]
    forks.map((testCase) => {
      const str = testCase.hf + 'ToMergeAtDiff' + testCase.TTD.toString(16)
      const common = getCommon(str)
      assert.ok(common.hardfork() === testCase.hf)
      assert.ok(common.hardforkTTD('paris') === BigInt(testCase.TTD))
    })
  })
  it('should throw on a non-existing fork', () => {
    assert.throws(() => getCommon('NonExistingFork'))
  })
})
