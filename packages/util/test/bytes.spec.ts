import { assert, describe, it } from 'vitest'

import {
  addHexPrefix,
  bigIntToAddressBytes,
  bigIntToBytes,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  bytesToInt,
  createAddressFromString,
  equalsBytes,
  fromSigned,
  hexToBytes,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isZeroAddress,
  setLengthLeft,
  setLengthRight,
  short,
  toBytes,
  toUnsigned,
  unpadArray,
  unpadBytes,
  unpadHex,
  unprefixedHexToBytes,
  validateNoLeadingZeroes,
  zeroAddress,
  zeros,
} from '../src/index.js'

describe('zeros function', () => {
  it('should produce lots of 0s', () => {
    const z60 = zeros(30)
    const zs60 = '0x000000000000000000000000000000000000000000000000000000000000'
    assert.equal(bytesToHex(z60), zs60)
  })
})

describe('zero address', () => {
  it('should generate a zero address', () => {
    assert.equal(zeroAddress(), '0x0000000000000000000000000000000000000000')
  })
})

describe('is zero address', () => {
  it('should return true when a zero address is passed', () => {
    assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
  })

  it('should return false when the address is not equal to zero', () => {
    const nonZeroAddress = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    assert.equal(isZeroAddress(nonZeroAddress), false)
  })

  it('should return false when address is not hex-prefixed', () => {
    assert.equal(isZeroAddress('0000000000000000000000000000000000000000'), false)
  })
})

describe('unpadBytes', () => {
  it('should unpad a Uint8Array', () => {
    const bytes = toBytes('0x0000000006600')
    const r = unpadBytes(bytes)
    assert.deepEqual(r, toBytes('0x6600'))
  })
  it('should throw if input is not a Uint8Array', () => {
    assert.throws(function () {
      unpadBytes((<unknown>'0000000006600') as Uint8Array)
    })
  })
})

describe('unpadArray', () => {
  it('should unpad an Array', () => {
    const arr = [0, 0, 0, 1]
    const r = unpadArray(arr)
    assert.deepEqual(r, [1])
  })
  it('should throw if input is not an Array', () => {
    assert.throws(function () {
      unpadArray((<unknown>toBytes([0, 0, 0, 1])) as number[])
    })
  })
})

describe('unpadHex', () => {
  it('should unpad a hex prefixed string', () => {
    const str = '0x0000000006600'
    const r = unpadHex(str)
    assert.equal(r, '0x6600')
  })
  it('should throw if input is not hex-prefixed', () => {
    assert.throws(function () {
      unpadHex('0000000006600' as any)
    })
  })
})

describe('setLengthLeft', () => {
  it('should left pad a Uint8Array', () => {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthLeft(bytes, 3)
    assert.equal(bytesToHex(padded), '0x000909')
  })
  it('should left truncate a Uint8Array', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthLeft(bytes, 2)
    assert.equal(bytesToHex(padded), '0x0009')
  })
  it('should throw if input is not a Uint8Array', () => {
    assert.throws(function () {
      setLengthLeft((<unknown>[9, 9]) as Uint8Array, 3)
    })
  })
})

describe('setLengthRight', () => {
  it('should right pad a Uint8Array', () => {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthRight(bytes, 3)
    assert.equal(bytesToHex(padded), '0x090900')
  })
  it('should right truncate a Uint8Array', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthRight(bytes, 2)
    assert.equal(bytesToHex(padded), '0x0900')
  })
  it('should throw if input is not a Uint8Array', () => {
    assert.throws(function () {
      setLengthRight((<unknown>[9, 9]) as Uint8Array, 3)
    })
  })
})

describe('bytesToHex', () => {
  it('should convert a Uint8Array to a prefixed hex string', () => {
    const bytes = hexToBytes('0x5b9ac8')
    const hex = bytesToHex(bytes)
    assert.equal(hex, '0x5b9ac8')
  })
  it('empty Uint8Array', () => {
    const bytes = new Uint8Array()
    const hex = bytesToHex(bytes)
    assert.strictEqual(hex, '0x')
  })
})

describe('bytesToInt', () => {
  it('should convert an int to hex', () => {
    const bytes = hexToBytes('0x5b9ac8')
    const i = bytesToInt(bytes)
    assert.equal(i, 6003400)
    assert.equal(bytesToInt(new Uint8Array()), 0)
  })
  it('should convert empty input to 0', () => {
    assert.equal(bytesToInt(new Uint8Array()), 0)
  })
})

describe('fromSigned', () => {
  it('should convert an unsigned (negative) Uint8Array to a signed number', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = zeros(32)
    bytes[0] = 255

    assert.equal(fromSigned(bytes).toString(), neg)
  })
  it('should convert an unsigned (positive) Uint8Array to a signed number', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = zeros(32)
    bytes[0] = 1

    assert.equal(fromSigned(bytes).toString(), neg)
  })
})

describe('toUnsigned', () => {
  it('should convert a signed (negative) number to unsigned', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0xff00000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.equal(bytesToHex(toUnsigned(num)), hex)
  })

  it('should convert a signed (positive) number to unsigned', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0x0100000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.equal(bytesToHex(toUnsigned(num)), hex)
  })
})

describe('hex prefix', () => {
  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it('should add', () => {
    assert.equal(addHexPrefix(string), '0x' + string)
  })
})

describe('short', () => {
  const string = '0x657468657265756d000000000000000000000000000000000000000000000000'
  const shortened = '0x657468657265756d0000000000000000000000000000000000…'
  const shortenedToTen = '0x6574686572…'
  it('should short string', () => {
    assert.equal(short(string), shortened)
  })
  it('should short buffer', () => {
    assert.equal(short(hexToBytes(string)), shortened)
  })
  it('should short buffer to 10 chars', () => {
    assert.equal(short(hexToBytes(string), 10), shortenedToTen)
  })
})

describe('toBytes', () => {
  it('should work', () => {
    // Uint8Array
    assert.ok(equalsBytes(toBytes(new Uint8Array(0)), new Uint8Array()))
    // Array
    assert.ok(equalsBytes(toBytes([]), new Uint8Array()))
    // String
    assert.ok(equalsBytes(toBytes('0x11'), Uint8Array.from([17])))
    assert.equal(bytesToHex(toBytes('0x1234')), '0x1234')
    assert.ok(equalsBytes(toBytes('0x'), Uint8Array.from([])))
    // Number
    assert.ok(equalsBytes(toBytes(1), Uint8Array.from([1])))
    // null
    assert.ok(equalsBytes(toBytes(null), new Uint8Array(0)))
    // undefined
    assert.deepEqual(toBytes(undefined), new Uint8Array(0))
    // BigInt
    assert.deepEqual(toBytes(BigInt(1)), Uint8Array.from([1]))
    // 'toArray'
    assert.deepEqual(
      toBytes({
        toBytes(): any {
          return Uint8Array.from([1])
        },
      }),
      Uint8Array.from([1]),
    )
  })
  it('should fail', () => {
    assert.throws(function () {
      toBytes({ test: 1 } as any)
    })
    assert.throws(function () {
      toBytes(BigInt(-10))
    })
  })

  it('should fail with non 0x-prefixed hex strings', () => {
    assert.throws(() => toBytes('11' as any), '11')
    assert.throws(() => toBytes('' as any))
    assert.throws(() => toBytes('0xR'), '0xR')
  })

  it('should convert a TransformabletoBytes like the Address class (i.e. provides a toBytes method)', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = createAddressFromString(str)
    const addressBytes = toBytes(address)
    assert.deepEqual(addressBytes, address.toBytes())
  })
})

describe('intToBytes', () => {
  it('should throw on wrong input', () => {
    assert.throws(() => intToBytes(<any>'test'), undefined, undefined, 'throws on string')
    assert.throws(() => intToBytes(<any>Infinity), undefined, undefined, 'throws on +Infinity')
    assert.throws(() => intToBytes(<any>-Infinity), undefined, undefined, 'throws on -Infinity')
    assert.throws(() => intToBytes(<any>NaN), undefined, undefined, 'throws on NaN')
    assert.throws(() => intToBytes(<any>undefined), undefined, undefined, 'throws on undefined')
    assert.throws(() => intToBytes(<any>null), undefined, undefined, 'throws on null')
    assert.throws(() => intToBytes(<any>-1), undefined, undefined, 'throws on negative numbers')
    assert.throws(() => intToBytes(<any>1.05), undefined, undefined, 'throws on decimal numbers')
    assert.throws(() => intToBytes(<any>{}), undefined, undefined, 'throws on objects')
    assert.throws(() => intToBytes(<any>true), undefined, undefined, 'throws on true')
    assert.throws(() => intToBytes(<any>false), undefined, undefined, 'throws on false')
    assert.throws(() => intToBytes(<any>[]), undefined, undefined, 'throws on arrays')
    assert.throws(() => intToBytes(<any>(() => {})), undefined, undefined, 'throws on arrays')
    assert.throws(
      () => intToBytes(Number.MAX_SAFE_INTEGER + 1),
      undefined,
      undefined,
      'throws on unsafe integers',
    )
  })

  it('should pass on correct input', () => {
    assert.deepEqual(intToBytes(0), hexToBytes('0x00'), 'correctly converts 0 to a Uint8Array')
    assert.deepEqual(intToBytes(1), hexToBytes('0x01'), 'correctly converts 1 to a Uint8Array')
  })
})

describe('intToHex', () => {
  it('should throw on wrong input', () => {
    assert.throws(() => intToHex(<any>'test'), undefined, undefined, 'throws on string')
    assert.throws(() => intToHex(<any>Infinity), undefined, undefined, 'throws on +Infinity')
    assert.throws(() => intToHex(<any>-Infinity), undefined, undefined, 'throws on -Infinity')
    assert.throws(() => intToHex(<any>NaN), undefined, undefined, 'throws on NaN')
    assert.throws(() => intToHex(<any>undefined), undefined, undefined, 'throws on undefined')
    assert.throws(() => intToHex(<any>null), undefined, undefined, 'throws on null')
    assert.throws(() => intToHex(<any>-1), undefined, undefined, 'throws on negative numbers')
    assert.throws(() => intToHex(<any>1.05), undefined, undefined, 'throws on decimal numbers')
    assert.throws(() => intToHex(<any>{}), undefined, undefined, 'throws on objects')
    assert.throws(() => intToHex(<any>true), undefined, undefined, 'throws on true')
    assert.throws(() => intToHex(<any>false), undefined, undefined, 'throws on false')
    assert.throws(() => intToHex(<any>[]), undefined, undefined, 'throws on arrays')
    assert.throws(() => intToHex(<any>(() => {})), undefined, undefined, 'throws on arrays')
    assert.throws(
      () => intToHex(Number.MAX_SAFE_INTEGER + 1),
      undefined,
      undefined,
      'throws on unsafe integers',
    )
  })
  it('should pass on correct input', () => {
    assert.ok(intToHex(0) === '0x0', 'correctly converts 0 to a hex string')
    assert.ok(intToHex(1) === '0x1', 'correctly converts 1 to a hex string')
  })
})

describe('validateNoLeadingZeroes', () => {
  const noLeadingZeroes = {
    a: toBytes('0x123'),
  }
  const noleadingZeroBytes = {
    a: toBytes('0x01'),
  }
  const leadingZeroBytes = {
    a: toBytes('0x001'),
  }
  const onlyZeroes = {
    a: toBytes('0x0'),
  }
  const emptyBuffer = {
    a: toBytes('0x'),
  }

  const undefinedValue = {
    a: undefined,
  }

  it('should pass on correct input', () => {
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(noLeadingZeroes),
      'does not throw when no leading zeroes',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(emptyBuffer),
      'does not throw with empty buffer',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(undefinedValue),
      'does not throw when undefined passed in',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(noleadingZeroBytes),
      'does not throw when value has leading zero bytes',
    )
  })

  it('should throw on wrong input', () => {
    assert.throws(
      () => validateNoLeadingZeroes(leadingZeroBytes),
      undefined,
      undefined,
      'throws when value has leading zero bytes',
    )
    assert.throws(
      () => validateNoLeadingZeroes(onlyZeroes),
      undefined,
      undefined,
      'throws when value has only zeroes',
    )
  })
})

describe('bytesToBigInt', () => {
  it('should pass on correct input', () => {
    const buf = toBytes('0x123')
    assert.equal(BigInt(0x123), bytesToBigInt(buf))
  })
})

describe('bigIntToBytes', () => {
  it('should pass on correct input', () => {
    const num = BigInt(0x123)
    assert.deepEqual(toBytes('0x123'), bigIntToBytes(num))
  })
})

describe('bigIntToUnpaddedBytes', () => {
  it('should equal unpadded buffer value', () => {
    assert.deepEqual(bigIntToUnpaddedBytes(BigInt(0)), Uint8Array.from([]))
    assert.deepEqual(bigIntToUnpaddedBytes(BigInt(100)), hexToBytes('0x64'))
  })
})

describe('bigIntToAddressBytes', () => {
  const testCases = [
    [
      '0x0aae40965e6800cd9b1f4b05ff21581047e3f91e',
      BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'),
      true,
    ],
    [
      '0xe473f7e92ba2490e9fcbbe8bb9c3be3adbb74efc',
      BigInt('0xe473f7e92ba2490e9fcbbe8bb9c3be3adbb74efc'),
      true,
    ],
    [
      '0xae40965e6800cd9b1f4b05ff21581047e3f91e00',
      BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e00'),
      false,
    ],
  ]

  for (const [addressHex, addressBigInt, isSafe] of testCases) {
    it('should correctly convert', () => {
      const addressHexFromBigInt = bytesToHex(bigIntToAddressBytes(addressBigInt as bigint, false))
      assert.equal(addressHex, addressHexFromBigInt, `should correctly convert ${addressBigInt}`)
      if (isSafe === false) {
        assert.throw(() => bigIntToAddressBytes(addressBigInt as bigint))
      }
    })
  }
})

describe('intToUnpaddedBytes', () => {
  it('should equal unpadded buffer value', () => {
    assert.deepEqual(intToUnpaddedBytes(0), Uint8Array.from([]))
    assert.deepEqual(intToUnpaddedBytes(100), hexToBytes('0x64'))
  })
})

describe('bigIntToHex', () => {
  it('should pass on correct input', () => {
    assert.equal(bigIntToHex(BigInt(1)), '0x1')
  })
})

describe('hexToBytes', () => {
  it('should throw on non-prefixed strings', () => {
    assert.throws(() => {
      hexToBytes('aabbcc112233' as any)
    })
  })

  it('should throw on invalid hex', () => {
    assert.throws(() => {
      hexToBytes('0xinvalidhexstring')
    })
    assert.throws(() => {
      hexToBytes('0xfz')
    })
  })

  it('should convert prefixed hex-strings', () => {
    const converted = hexToBytes('0x1')
    assert.deepEqual(converted, new Uint8Array([1]))
  })
})

describe('unprefixedHexToBytes', () => {
  it('should throw on prefixed strings', () => {
    assert.throws(() => {
      unprefixedHexToBytes('0xaabbcc112233')
    })
  })
  it('should convert unprefixed hex-strings', () => {
    const converted = unprefixedHexToBytes('1')
    assert.deepEqual(converted, new Uint8Array([1]))
  })
  it('should convert unprefixed hex-strings', () => {
    const converted = unprefixedHexToBytes('11')
    assert.deepEqual(converted, new Uint8Array([17]))
  })
})
