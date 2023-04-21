import { Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { getCommon } from '../../tester/config'

tape('bloom', (t: tape.Test) => {
  t.test('should initialize common with the right hardfork', (st) => {
    const common = getCommon('byzantium')
    st.ok(common.hardfork() === Hardfork.Byzantium)
    st.end()
  })
  t.test('should initialize common with the right hardfork uppercased', (st) => {
    let common = getCommon('Byzantium')
    st.ok(common.hardfork() === Hardfork.Byzantium)
    common = getCommon('BYZANTIUM')
    st.ok(common.hardfork() === Hardfork.Byzantium)
    st.end()
  })
  t.test('should always activate EIP 3607', (st) => {
    let common = getCommon('byzantium')
    st.ok(common.isActivatedEIP(3607))
    common = getCommon('ArrowGlacierToMergeAtDiffC0000')
    st.ok(common.isActivatedEIP(3607))
    common = getCommon('ByzantiumToConstantinopleFixAt5')
    st.ok(common.isActivatedEIP(3607))
    st.end()
  })
  t.test('should be able to activate hardforks with EIPs enabled', (st) => {
    let common = getCommon('byzantium+2537')
    st.ok(common.isActivatedEIP(2537))
    common = getCommon('byzantium+2537+2929')
    st.ok(common.isActivatedEIP(2537))
    st.ok(common.isActivatedEIP(2929))
    st.end()
  })
  t.test('should be able to activate transition forks', (st) => {
    st.doesNotThrow(() => getCommon('ByzantiumToConstantinopleFixAt5'))
    st.end()
  })
  t.test('should be able to activate merge transition fork with the correct TTD set', (st) => {
    const forks = [
      { hf: 'arrowGlacier', TTD: 20000 },
      { hf: 'london', TTD: 20000 },
      { hf: 'arrowGlacier', TTD: 40000 },
    ]
    forks.map((testCase) => {
      const str = testCase.hf + 'ToMergeAtDiff' + testCase.TTD.toString(16)
      const common = getCommon(str)
      st.ok(common.hardfork() === testCase.hf)
      st.ok(common.hardforkTTD('paris') === BigInt(testCase.TTD))
    })
    st.end()
  })
  t.test('should throw on a non-existing fork', (st) => {
    st.throws(() => getCommon('NonExistingFork'))
    st.end()
  })
})
