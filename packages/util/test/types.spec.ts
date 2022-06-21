import * as tape from 'tape'
import {
  toType,
  TypeOutput,
  intToBuffer,
  bufferToHex,
  intToHex,
  toBuffer,
  bigIntToHex,
  bigIntToBuffer,
  bufferToBigInt,
} from '../src'

tape('toType', function (t) {
  t.test('from null and undefined', function (st) {
    st.equal(toType(null, TypeOutput.Number), null)
    st.equal(toType(null, TypeOutput.BigInt), null)
    st.equal(toType(null, TypeOutput.Buffer), null)
    st.equal(toType(null, TypeOutput.PrefixedHexString), null)
    st.equal(toType(undefined, TypeOutput.Number), undefined)
    st.equal(toType(undefined, TypeOutput.BigInt), undefined)
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
    st.test('should convert to BigInt', function (st) {
      const result = toType(num, TypeOutput.BigInt)
      st.equal(result, BigInt(num))
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(intToBuffer(num)))
      st.end()
    })
    st.test('should convert to PrefixedHexString', function (st) {
      const result = toType(num, TypeOutput.PrefixedHexString)
      st.strictEqual(result, bufferToHex(bigIntToBuffer(BigInt(num))))
      st.end()
    })
    st.test('should throw an error if greater than MAX_SAFE_INTEGER', function (st) {
      st.throws(() => {
        const num = Number.MAX_SAFE_INTEGER + 1
        toType(num, TypeOutput.BigInt)
      }, /^Error: The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative input type\)$/)
      st.end()
    })
  })
  t.test('from BigInt', function (st) {
    const num = BigInt(1000)
    st.test('should convert to Number', function (st) {
      const result = toType(num, TypeOutput.Number)
      st.strictEqual(result, Number(num))
      st.end()
    })
    st.test('should convert to BigInt', function (st) {
      const result = toType(num, TypeOutput.BigInt)
      st.equal(result, num)
      st.end()
    })
    st.test('should convert to Buffer', function (st) {
      const result = toType(num, TypeOutput.Buffer)
      st.ok(result.equals(bigIntToBuffer(num)))
      st.end()
    })
    st.test('should convert to PrefixedHexString', function (st) {
      const result = toType(num, TypeOutput.PrefixedHexString)
      st.strictEqual(result, bufferToHex(bigIntToBuffer(num)))
      st.end()
    })
    st.test(
      'should throw an error if converting to Number and greater than MAX_SAFE_INTEGER',
      function (st) {
        const num = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)
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
    st.test('should convert to BigInt', function (st) {
      const result = toType(num, TypeOutput.BigInt)
      st.equal(result, bufferToBigInt(num))
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
    st.test('should convert to BigInt', function (st) {
      const result = toType(num, TypeOutput.BigInt)
      st.strictEqual(bigIntToHex(result), num)
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
