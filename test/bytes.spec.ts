import assert from 'assert'
import BN from 'bn.js'
import {
  Address,
  zeros,
  zeroAddress,
  isZeroAddress,
  unpadBuffer,
  unpadArray,
  unpadHexString,
  setLengthLeft,
  setLengthRight,
  bufferToHex,
  bufferToInt,
  fromSigned,
  toUnsigned,
  addHexPrefix,
  toBuffer,
  baToJSON
} from '../src'

describe('zeros function', function() {
  it('should produce lots of 0s', function() {
    const z60 = zeros(30)
    const zs60 = '000000000000000000000000000000000000000000000000000000000000'
    assert.equal(z60.toString('hex'), zs60)
  })
})

describe('zero address', function() {
  it('should generate a zero address', function() {
    assert.equal(zeroAddress(), '0x0000000000000000000000000000000000000000')
  })
})

describe('is zero address', function() {
  it('should return true when a zero address is passed', function() {
    assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
  })

  it('should return false when the address is not equal to zero', function() {
    const nonZeroAddress = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    assert.equal(isZeroAddress(nonZeroAddress), false)
  })

  it('should throw when address is not hex-prefixed', function() {
    assert.throws(function() {
      isZeroAddress('0000000000000000000000000000000000000000')
    })
  })
})

describe('unpadBuffer', function() {
  it('should unpad a Buffer', function() {
    const buf = toBuffer('0x0000000006600')
    const r = unpadBuffer(buf)
    assert.deepEqual(r, toBuffer('0x6600'))
  })
  it('should throw if input is not a Buffer', function() {
    assert.throws(function() {
      unpadBuffer((<unknown>'0000000006600') as Buffer)
    })
  })
})

describe('unpadArray', function() {
  it('should unpad an Array', function() {
    const arr = [0, 0, 0, 1]
    const r = unpadArray(arr)
    assert.deepEqual(r, [1])
  })
  it('should throw if input is not an Array', function() {
    assert.throws(function() {
      unpadArray((<unknown>toBuffer([0, 0, 0, 1])) as number[])
    })
  })
})

describe('unpadHexString', function() {
  it('should unpad a hex prefixed string', function() {
    const str = '0x0000000006600'
    const r = unpadHexString(str)
    assert.equal(r, '6600')
  })
  it('should throw if input is not hex-prefixed', function() {
    assert.throws(function() {
      unpadHexString('0000000006600')
    })
  })
})

describe('setLengthLeft', function() {
  it('should left pad a Buffer', function() {
    const buf = Buffer.from([9, 9])
    const padded = setLengthLeft(buf, 3)
    assert.equal(padded.toString('hex'), '000909')
  })
  it('should left truncate a Buffer', function() {
    const buf = Buffer.from([9, 0, 9])
    const padded = setLengthLeft(buf, 2)
    assert.equal(padded.toString('hex'), '0009')
  })
  it('should throw if input is not a Buffer', function() {
    assert.throws(function() {
      setLengthLeft((<unknown>[9, 9]) as Buffer, 3)
    })
  })
})

describe('setLengthRight', function() {
  it('should right pad a Buffer', function() {
    const buf = Buffer.from([9, 9])
    const padded = setLengthRight(buf, 3)
    assert.equal(padded.toString('hex'), '090900')
  })
  it('should right truncate a Buffer', function() {
    const buf = Buffer.from([9, 0, 9])
    const padded = setLengthRight(buf, 2)
    assert.equal(padded.toString('hex'), '0900')
  })
  it('should throw if input is not a Buffer', function() {
    assert.throws(function() {
      setLengthRight((<unknown>[9, 9]) as Buffer, 3)
    })
  })
})

describe('bufferToHex', function() {
  it('should convert a buffer to hex', function() {
    const buf = Buffer.from('5b9ac8', 'hex')
    const hex = bufferToHex(buf)
    assert.equal(hex, '0x5b9ac8')
  })
  it('empty buffer', function() {
    const buf = Buffer.alloc(0)
    const hex = bufferToHex(buf)
    assert.strictEqual(hex, '0x')
  })
})

describe('bufferToInt', function() {
  it('should convert a int to hex', function() {
    const buf = Buffer.from('5b9ac8', 'hex')
    const i = bufferToInt(buf)
    assert.equal(i, 6003400)
    assert.equal(bufferToInt(Buffer.allocUnsafe(0)), 0)
  })
  it('should convert empty input to 0', function() {
    assert.equal(bufferToInt(Buffer.allocUnsafe(0)), 0)
  })
})

describe('fromSigned', function() {
  it('should convert an unsigned (negative) buffer to a singed number', function() {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const buf = Buffer.allocUnsafe(32).fill(0)
    buf[0] = 255

    assert.equal(fromSigned(buf), neg)
  })
  it('should convert an unsigned (positive) buffer to a singed number', function() {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const buf = Buffer.allocUnsafe(32).fill(0)
    buf[0] = 1

    assert.equal(fromSigned(buf), neg)
  })
})

describe('toUnsigned', function() {
  it('should convert a signed (negative) number to unsigned', function() {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = 'ff00000000000000000000000000000000000000000000000000000000000000'
    const num = new BN(neg)

    assert.equal(toUnsigned(num).toString('hex'), hex)
  })

  it('should convert a signed (positive) number to unsigned', function() {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0100000000000000000000000000000000000000000000000000000000000000'
    const num = new BN(neg)

    assert.equal(toUnsigned(num).toString('hex'), hex)
  })
})

describe('hex prefix', function() {
  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it('should add', function() {
    assert.equal(addHexPrefix(string), '0x' + string)
  })
  it('should return on non-string input', function() {
    assert.equal(addHexPrefix(1 as any), 1)
  })
})

describe('toBuffer', function() {
  it('should work', function() {
    // Buffer
    assert.deepEqual(toBuffer(Buffer.allocUnsafe(0)), Buffer.allocUnsafe(0))
    // Array
    assert.deepEqual(toBuffer([]), Buffer.allocUnsafe(0))
    // String
    assert.deepEqual(toBuffer('0x11'), Buffer.from([17]))
    assert.deepEqual(toBuffer('0x1234').toString('hex'), '1234')
    assert.deepEqual(toBuffer('0x'), Buffer.from([]))
    // Number
    assert.deepEqual(toBuffer(1), Buffer.from([1]))
    // null
    assert.deepEqual(toBuffer(null), Buffer.allocUnsafe(0))
    // undefined
    assert.deepEqual(toBuffer(undefined), Buffer.allocUnsafe(0))
    // 'toBN'
    assert.deepEqual(toBuffer(new BN(1)), Buffer.from([1]))
    // 'toArray'
    assert.deepEqual(
      toBuffer({
        toArray: function(): any {
          return [1]
        }
      }),
      Buffer.from([1])
    )
  })
  it('should fail', function() {
    assert.throws(function() {
      // @ts-ignore
      toBuffer({ test: 1 })
    })
  })

  it('should fail with non 0x-prefixed hex strings', function() {
    assert.throws(() => toBuffer('11'), '11')
    assert.throws(() => toBuffer(''))
    assert.throws(() => toBuffer('0xR'), '0xR')
  })

  it('should convert a TransformableToBuffer like the Address class (i.e. provides a toBuffer method)', function() {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = Address.fromString(str)
    const addressBuf = toBuffer(address)
    assert.ok(addressBuf.equals(address.toBuffer()))
  })
})

describe('baToJSON', function() {
  it('should turn a array of buffers into a pure json object', function() {
    const ba = [Buffer.from([0]), Buffer.from([1]), [Buffer.from([2])]]
    assert.deepEqual(baToJSON(ba), ['0x00', '0x01', ['0x02']])
  })
  it('should turn a buffers into string', function() {
    assert.deepEqual(baToJSON(Buffer.from([0])), '0x00')
  })
})
