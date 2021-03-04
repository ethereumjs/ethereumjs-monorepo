import assert from 'assert'
import BN from 'bn.js'
import { toType, TypeOutput, intToBuffer, bufferToHex, intToHex, bnToHex, toBuffer } from '../src'

describe('toType', function() {
  describe('from Number', function() {
    const num = 1000
    it('should convert to Number', function() {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(result, num)
    })
    it('should convert to BN', function() {
      const result = toType(num, TypeOutput.BN)
      assert.ok(result.eq(new BN(num)))
    })
    it('should convert to Buffer', function() {
      const result = toType(num, TypeOutput.Buffer)
      assert.ok(result.equals(intToBuffer(num)))
    })
    it('should convert to PrefixedHexString', function() {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bufferToHex(new BN(num).toArrayLike(Buffer)))
    })
    it('should throw an error if greater than MAX_SAFE_INTEGER', function() {
      assert.throws(
        () => {
          const num = Number.MAX_SAFE_INTEGER + 1
          toType(num, TypeOutput.BN)
        },
        {
          message:
            'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
        }
      )
    })
  })
  describe('from BN', function() {
    const num = new BN(1000)
    it('should convert to Number', function() {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(result, num.toNumber())
    })
    it('should convert to BN', function() {
      const result = toType(num, TypeOutput.BN)
      assert.ok(result.eq(num))
    })
    it('should convert to Buffer', function() {
      const result = toType(num, TypeOutput.Buffer)
      assert.ok(result.equals(num.toArrayLike(Buffer)))
    })
    it('should convert to PrefixedHexString', function() {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bufferToHex(num.toArrayLike(Buffer)))
    })
    it('should throw an error if converting to Number and greater than MAX_SAFE_INTEGER', function() {
      const num = new BN(Number.MAX_SAFE_INTEGER).addn(1)
      assert.throws(
        () => {
          toType(num, TypeOutput.Number)
        },
        {
          message:
            'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative output type)'
        }
      )
    })
  })
  describe('from Buffer', function() {
    const num = intToBuffer(1000)
    it('should convert to Number', function() {
      const result = toType(num, TypeOutput.Number)
      assert.ok(intToBuffer(result).equals(num))
    })
    it('should convert to BN', function() {
      const result = toType(num, TypeOutput.BN)
      assert.ok(result.eq(new BN(num)))
    })
    it('should convert to Buffer', function() {
      const result = toType(num, TypeOutput.Buffer)
      assert.ok(result.equals(num))
    })
    it('should convert to PrefixedHexString', function() {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bufferToHex(num))
    })
  })
  describe('from HexPrefixedString', function() {
    const num = intToHex(1000)
    it('should convert to Number', function() {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(intToHex(result), num)
    })
    it('should convert to BN', function() {
      const result = toType(num, TypeOutput.BN)
      assert.strictEqual(bnToHex(result), num)
    })
    it('should convert to Buffer', function() {
      const result = toType(num, TypeOutput.Buffer)
      assert.ok(result.equals(toBuffer(num)))
    })
    it('should throw an error if is not 0x-prefixed', function() {
      assert.throws(
        () => {
          toType('1', TypeOutput.Number)
        },
        {
          message: 'A string must be provided with a 0x-prefix, given: 1'
        }
      )
    })
  })
})
