import tape from 'tape'
import { Units } from '../src'

tape('unit', function (t) {
  t.test('should work for big unit to small unit', function (st) {
    st.equal(Units.fromEth('1.1'), BigInt(1100000000000000000))
    st.equal(Units.fromEth('1.100000'), BigInt(1100000000000000000))
    st.equal(Units.fromEth('0.1'), BigInt(100000000000000000))
    st.equal(Units.fromEth('10'), BigInt(10000000000000000000))

    st.equal(Units.fromGwei('5'), BigInt(5000000000))
    st.equal(Units.fromGwei('0.5'), BigInt(500000000))
    st.equal(Units.fromGwei('50.123'), BigInt(50123000000))
    st.equal(Units.fromGwei('0.005'), BigInt(5000000))

    st.end()
  })

  t.test('should convert for small unit to big unit', function (st) {
    st.equal(Units.toEth(BigInt(1100000000000000000)), '1.1')
    st.equal(Units.toEth(BigInt(2904354000000000000)), '2.904354')
    st.equal(Units.toEth(BigInt(110000000000000)), '0.00011')
    st.equal(Units.toEth(BigInt(1000000000000000000)), '1')
    st.equal(Units.toEth(BigInt(23000000000000000000)), '23')

    st.equal(Units.toGwei(BigInt(5000000000)), '5')
    st.equal(Units.toGwei(BigInt(512300000000)), '512.3')
    st.equal(Units.toGwei(BigInt(50000000)), '0.05')
    st.equal(Units.toGwei(BigInt(23000000000000000000)), '23000000000')
    st.end()
  })
})
