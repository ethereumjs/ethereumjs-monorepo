import tape from 'tape'
import {
  BN,
  toType,
  TypeOutput,
  intToBuffer,
  bufferToHex,
  intToHex,
  bnToHex,
  bnToUnpaddedBuffer,
  toBuffer,
} from '../src'

tape('toType', function (t) {
  t.test('from null and undefined', function (st) {
    st.equal(toType(null, TypeOutput.Number), null)
    st.equal(toType(null, TypeOutput.BN), null)
    st.equal(toType(null, TypeOutput.Buffer), null)
    st.equal(toType(null, TypeOutput.PrefixedHexString), null)
    st.equal(toType(undefined, TypeOutput.Number), undefined)
    st.equal(toType(undefined, TypeOutput.BN), undefined)
    st.equal(toType(undefined, TypeOutput.Buffer), undefined)
    st.equal(toType(undefined, TypeOutput.PrefixedHexString), undefined)
    st.end()
  })
  t.test('from Number', function (st) {
    const num = 1000
    st.test('should convert to Number', function (st) {
      const result = toType(num, TypeOutput.Number)
      st.strictEqual(result, num)
      st.end()
    })
    st.test('should convert to BN', function (st) {
      const result = toType(num, TypeOutput.BN)
      st.ok(result.eq(new BN(num)))
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(intToBuffer(num)))
      st.end()
    })
    st.test('should convert to PrefixedHexString', function (st) {
      const result = toType(num, TypeOutput.PrefixedHexString)
      st.strictEqual(result, bufferToHex(new BN(num).toArrayLike(Buffer)))
      st.end()
    })
    st.test('should throw an error if greater than MAX_SAFE_INTEGER', function (st) {
      st.throws(() => {
        const num = Number.MAX_SAFE_INTEGER + 1
        toType(num, TypeOutput.BN)
      }, /^Error: The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative input type\)$/)
      st.end()
    })
  })
  t.test('from BN', function (st) {
    const num = new BN(1000)
    st.test('should convert to Number', function (st) {
      const result = toType(num, TypeOutput.Number)
      st.strictEqual(result, num.toNumber())
      st.end()
    })
    st.test('should convert to BN', function (st) {
      const result = toType(num, TypeOutput.BN)
      st.ok(result.eq(num))
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(num.toArrayLike(Buffer)))
      st.end()
    })
    st.test('should convert to PrefixedHexString', function (st) {
      const result = toType(num, TypeOutput.PrefixedHexString)
      st.strictEqual(result, bufferToHex(num.toArrayLike(Buffer)))
      st.end()
    })
    st.test(
      'should throw an error if converting to Number and greater than MAX_SAFE_INTEGER',
      function (st) {
        const num = new BN(Number.MAX_SAFE_INTEGER).addn(1)
        st.throws(() => {
          toType(num, TypeOutput.Number)
        }, /^Error: The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative output type\)$/)
        st.end()
      }
    )
  })
  t.test('from Buffer', function (st) {
    const num = intToBuffer(1000)
    st.test('should convert to Number', function (st) {
      const result = toType(num, TypeOutput.Number)
      st.ok(intToBuffer(result).equals(num))
      st.end()
    })
    st.test('should convert to BN', function (st) {
      const result = toType(num, TypeOutput.BN)
      st.ok(result.eq(new BN(num)))
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(num))
      st.end()
    })
    st.test('should convert to PrefixedHexString', function (st) {
      const result = toType(num, TypeOutput.PrefixedHexString)
      st.strictEqual(result, bufferToHex(num))
      st.end()
    })
  })
  t.test('from HexPrefixedString', function (st) {
    const num = intToHex(1000)
    st.test('should convert to Number', function (st) {
      const result = toType(num, TypeOutput.Number)
      st.strictEqual(intToHex(result), num)
      st.end()
    })
    st.test('should convert to BN', function (st) {
      const result = toType(num, TypeOutput.BN)
      st.strictEqual(bnToHex(result), num)
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(toBuffer(num)))
      st.end()
    })
    st.test('should throw an error if is not 0x-prefixed', function (st) {
      st.throws(() => {
        toType('1', TypeOutput.Number)
      }, /^Error: A string must be provided with a 0x-prefix, given: 1$/)
      st.end()
    })
  })
})

tape('bnToUnpaddedBuffer', function (t) {
  t.test('should equal unpadded buffer value', function (st) {
    st.ok(bnToUnpaddedBuffer(new BN(0)).equals(Buffer.from([])))
    st.ok(bnToUnpaddedBuffer(new BN(100)).equals(Buffer.from('64', 'hex')))
    st.end()
  })
})
