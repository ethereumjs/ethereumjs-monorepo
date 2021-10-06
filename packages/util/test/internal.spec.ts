import tape from 'tape'
import { isHexPrefixed, stripHexPrefix } from '../src/internal'

tape('hex strings', (t) => {
  t.test('isHexPrefixed should return if prefixed with 0x', (st) => {
    st.equal(isHexPrefixed('0xabc'), true)
    st.equal(isHexPrefixed('abc'), false)
    st.end()
  })
  t.test('stripHexPrefix should strip prefix', (st) => {
    st.equal(stripHexPrefix('0xabc'), 'abc')
    st.equal(stripHexPrefix('abc'), 'abc')
    st.end()
  })
  t.end()
})
