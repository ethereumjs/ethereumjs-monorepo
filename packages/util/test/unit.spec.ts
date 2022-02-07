import tape from 'tape'
import { Units } from '../src'

tape('unit', function (t) {
  t.test('should work for big unit to small unit', function (st) {
    st.equal(Units.convert('1', 'ether', 'wei'), '1000000000000000000')
    st.equal(Units.convert('20', 'gwei', 'wei'), '20000000000')
    // st.equal(Units.convert('20.05', 'gwei', 'wei'), '20050000000')
    // st.equal(Units.convert('20.005', 'kwei', 'wei'), '20005')
    // st.equal(Units.convert('20.0005', 'kwei', 'wei'), '20000')
    st.equal(Units.convert('1', 'tether', 'ether'), '1000000000000')
    st.equal(Units.convert('1', 'tether', 'wei'), '1000000000000000000000000000000')
    st.end()
  })

  t.test('should convert for small unit to big unit', function (st) {
    st.equal(Units.convert('1', 'wei', 'ether'), '0.000000000000000001')
    // st.equal(Units.convert('0.5', 'wei', 'ether'), '0')
    // st.equal(Units.convert('0.0005', 'kwei', 'ether'), '0')
    st.equal(Units.convert('12000000000', 'gwei', 'ether'), '12')
    st.equal(Units.convert('20', 'gwei', 'ether'), '0.00000002')
    st.equal(Units.convert('2044', 'gwei', 'ether'), '0.000002044')
    // st.equal(Units.convert('12460000000', 'gwei', 'ether'), '12.46')
    st.equal(Units.convert('1', 'ether', 'tether'), '0.000000000001')
    st.equal(Units.convert('1', 'ether', 'tether'), '0.000000000001')
    // XXX: precision loss
    // st.equal(Units.convert('1', 'milli', 'tether'), '0')
    st.end()
  })
})
