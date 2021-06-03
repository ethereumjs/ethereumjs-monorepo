import tape from 'tape'
import Common from '../src/'
import { BN } from 'ethereumjs-util'

tape('[Common]: isSupportedChainId static method', function (t: tape.Test) {
  t.test('Should return correct response', function (st: tape.Test) {
    st.equal(Common.isSupportedChainId(new BN(1)), true, 'should return true for supported chainId')
    st.equal(
      Common.isSupportedChainId(new BN(1234)),
      false,
      'should return false for unsupported chainId'
    )
    st.end()
  })
})
