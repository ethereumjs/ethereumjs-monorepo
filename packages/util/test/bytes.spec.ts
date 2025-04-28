import { assert, describe, it } from 'vitest'

import {
  addHexPrefix,
  bigIntToAddressBytes,
  bigIntToBytes,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bitsToBytes,
  bytesToBigInt,
  bytesToBits,
  bytesToHex,
  bytesToInt,
  createAddressFromString,
  equalsBits,
  equalsBytes,
  fromSigned,
  hexToBytes,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isZeroAddress,
  matchingBitsLength,
  matchingBytesLength,
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
} from '../src/index.ts'

describe('zero address', () => {
  it('should generate a zero address', () => {
    assert.strictEqual(zeroAddress(), '0x0000000000000000000000000000000000000000')
  })
})

describe('is zero address', () => {
  it('should return true when a zero address is passed', () => {
    assert.strictEqual(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
  })

  it('should return false when the address is not equal to zero', () => {
    const nonZeroAddress = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    assert.strictEqual(isZeroAddress(nonZeroAddress), false)
  })

  it('should return false when address is not hex-prefixed', () => {
    assert.strictEqual(isZeroAddress('0000000000000000000000000000000000000000'), false)
  })
})

describe('unpadBytes', () => {
  it('should unpad a Uint8Array', () => {
    const bytes = hexToBytes('0x0000000006600')
    const r = unpadBytes(bytes)
    assert.deepEqual(r, hexToBytes('0x6600'))
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
      unpadArray(toBytes([0, 0, 0, 1]) as unknown as number[])
    })
  })
})

describe('unpadHex', () => {
  it('should unpad a hex prefixed string', () => {
    const str = '0x0000000006600'
    const r = unpadHex(str)
    assert.strictEqual(r, '0x6600')
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
    assert.strictEqual(bytesToHex(padded), '0x000909')
  })
  it('should left truncate a Uint8Array', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthLeft(bytes, 2)
    assert.strictEqual(bytesToHex(padded), '0x0009')
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
    assert.strictEqual(bytesToHex(padded), '0x090900')
  })
  it('should right truncate a Uint8Array', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthRight(bytes, 2)
    assert.strictEqual(bytesToHex(padded), '0x0900')
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
    assert.strictEqual(hex, '0x5b9ac8')
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
    assert.strictEqual(i, 6003400)
    assert.strictEqual(bytesToInt(new Uint8Array()), 0)
  })
  it('should convert empty input to 0', () => {
    assert.strictEqual(bytesToInt(new Uint8Array()), 0)
  })
})

describe('fromSigned', () => {
  it('should convert an unsigned (negative) Uint8Array to a signed number', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = new Uint8Array(32)
    bytes[0] = 255

    assert.strictEqual(fromSigned(bytes).toString(), neg)
  })
  it('should convert an unsigned (positive) Uint8Array to a signed number', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = new Uint8Array(32)
    bytes[0] = 1

    assert.strictEqual(fromSigned(bytes).toString(), neg)
  })
})

describe('toUnsigned', () => {
  it('should convert a signed (negative) number to unsigned', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0xff00000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.strictEqual(bytesToHex(toUnsigned(num)), hex)
  })

  it('should convert a signed (positive) number to unsigned', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0x0100000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.strictEqual(bytesToHex(toUnsigned(num)), hex)
  })
})

describe('hex prefix', () => {
  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it('should add', () => {
    assert.strictEqual(addHexPrefix(string), '0x' + string)
  })
})

describe('short', () => {
  const string = '0x657468657265756d000000000000000000000000000000000000000000000000'
  const shortened = '0x657468657265756d0000000000000000000000000000000000…'
  const shortenedToTen = '0x6574686572…'
  it('should short string', () => {
    assert.strictEqual(short(string), shortened)
  })
  it('should short buffer', () => {
    assert.strictEqual(short(hexToBytes(string)), shortened)
  })
  it('should short buffer to 10 chars', () => {
    assert.strictEqual(short(hexToBytes(string), 10), shortenedToTen)
  })
})

describe('toBytes', () => {
  it('should work', () => {
    // Uint8Array
    assert.isTrue(equalsBytes(toBytes(new Uint8Array(0)), new Uint8Array()))
    // Array
    assert.isTrue(equalsBytes(toBytes([]), new Uint8Array()))
    // String
    assert.isTrue(equalsBytes(toBytes('0x11'), Uint8Array.from([17])))
    assert.strictEqual(bytesToHex(toBytes('0x1234')), '0x1234')
    assert.isTrue(equalsBytes(toBytes('0x'), Uint8Array.from([])))
    // Number
    assert.isTrue(equalsBytes(toBytes(1), Uint8Array.from([1])))
    // null
    assert.isTrue(equalsBytes(toBytes(null), new Uint8Array(0)))
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
    // @ts-expect-error -- Testing wrong input
    assert.throws(() => toBytes('11'), '11')
    // @ts-expect-error -- Testing wrong input
    assert.throws(() => toBytes(''))
    assert.throws(() => toBytes('0xR'), '0xR')
  })

  it('should convert a TransformableToBytes like the Address class (i.e. provides a toBytes method)', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = createAddressFromString(str)
    const addressBytes = toBytes(address)
    assert.deepEqual(addressBytes, address.toBytes())
  })
})

describe('intToBytes and intToHex', () => {
  const errorCases = [
    'test',
    Infinity,
    -Infinity,
    NaN,
    undefined,
    null,
    -1,
    1.05,
    {},
    true,
    false,
    [],
    () => {},
    Number.MAX_SAFE_INTEGER + 1,
  ]
  it('intToBytes should throw on wrong input', () => {
    for (const value of errorCases) {
      // @ts-expect-error -- Testing wrong input
      assert.throws(() => intToBytes(value), undefined, undefined, `throws on ${value}`)
    }
  })

  it('intToHex should throw on wrong input', () => {
    for (const value of errorCases) {
      // @ts-expect-error -- Testing wrong input
      assert.throws(() => intToHex(value), undefined, undefined, `throws on ${value}`)
    }
  })

  it('should pass on correct input', () => {
    assert.strictEqual(intToHex(0), '0x0', 'correctly converts 0 to a hex string')
    assert.strictEqual(intToHex(1), '0x1', 'correctly converts 1 to a hex string')
  })

  it('should pass on correct input', () => {
    assert.deepEqual(intToBytes(0), hexToBytes('0x00'), 'correctly converts 0 to a Uint8Array')
    assert.deepEqual(intToBytes(1), hexToBytes('0x01'), 'correctly converts 1 to a Uint8Array')
  })
})

describe('validateNoLeadingZeroes', () => {
  const noLeadingZeroes = {
    a: hexToBytes('0x123'),
  }
  const noLeadingZeroBytes = {
    a: hexToBytes('0x01'),
  }
  const leadingZeroBytes = {
    a: hexToBytes('0x001'),
  }
  const onlyZeroes = {
    a: hexToBytes('0x0'),
  }
  const emptyBuffer = {
    a: hexToBytes('0x'),
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
      () => validateNoLeadingZeroes(noLeadingZeroBytes),
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
    const buf = hexToBytes('0x123')
    assert.strictEqual(BigInt(0x123), bytesToBigInt(buf))
  })
})

describe('bigIntToBytes', () => {
  it('should pass on correct input', () => {
    const num = BigInt(0x123)
    assert.deepEqual(hexToBytes('0x123'), bigIntToBytes(num))
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
      assert.strictEqual(
        addressHex,
        addressHexFromBigInt,
        `should correctly convert ${addressBigInt}`,
      )
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
    assert.strictEqual(bigIntToHex(BigInt(1)), '0x1')
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
      hexToBytes('0xInvalidHexString')
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

describe('matchingBytesLength', () => {
  it('should return 0 when both arrays are empty', () => {
    const bytes1 = new Uint8Array([])
    const bytes2 = new Uint8Array([])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should return 0 when one of the arrays is empty', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should return 0 when arrays have no matching elements', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([4, 5, 6])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should handle arrays with same elements but different lengths', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([1, 2, 3, 4])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 3)
  })

  it('should handle arrays with matching elements at end', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([0, 1, 2, 3])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 0)
  })

  it('should handle arrays with matching elements at start', () => {
    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([1, 2, 3, 4, 5])
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 3)
  })

  it('should handle arrays with large number of elements', () => {
    const bytes1 = new Uint8Array(Array.from({ length: 1000000 }, (_, i) => i))
    const bytes2 = new Uint8Array(Array.from({ length: 1000000 }, (_, i) => i))
    assert.strictEqual(matchingBytesLength(bytes1, bytes2), 1000000)
  })
})

describe('matchingBitsLength', () => {
  it('should return 0 when both arrays are empty', () => {
    const bits1: number[] = []
    const bits2: number[] = []
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('should return 0 when one of the arrays is empty', () => {
    const bits1: number[] = [1, 0, 1, 1, 0, 0, 1, 1] // Example bits
    const bits2: number[] = []
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('should return 0 when arrays have no matching bits in the first byte', () => {
    // 0xff = 11111111, 0x7f = 01111111: first bit mismatches.
    const bits1: number[] = [1, 1, 1, 1, 1, 1, 1, 1] // 0xff
    const bits2: number[] = [0, 1, 1, 1, 1, 1, 1, 1] // 0x7f
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('should return correct count for partially matching bits in the first byte', () => {
    // 0xff = 11111111, 0xf0 = 11110000:
    // The first four bits match, then the 5th bit mismatches.
    const bits1: number[] = [1, 1, 1, 1, 1, 1, 1, 1] // 0xff
    const bits2: number[] = [1, 1, 1, 1, 0, 0, 0, 0] // 0xf0
    assert.strictEqual(matchingBitsLength(bits1, bits2), 4)
  })

  it('should handle arrays with matching bits across multiple bytes', () => {
    // First byte: 0xaa (10101010) matches exactly.
    // Second byte: 0xff (11111111) vs 0xf0 (11110000) match for the first 4 bits.
    // Total matching bits: 8 (from the first byte) + 4 = 12.
    const bits1: number[] = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // 0xaa
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1, // 0xff
    ]
    const bits2: number[] = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // 0xaa
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0, // 0xf0
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 12)
  })

  it('should handle arrays with same elements but different lengths', () => {
    // The first three bytes match exactly (3 * 8 = 24 bits), even if the second array is longer.
    const bits1: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
    ]
    const bits2: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      0, // 0x78 (extra)
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 24)
  })

  it('should handle arrays with matching bits at the start then mismatch mid-byte', () => {
    // First two bytes match fully (16 bits).
    // Third byte: 0x56 = 01010110, 0x00 = 00000000.
    // Bit-by-bit in the third byte: the most significant bit (bit 7) is 0 in both, then bit 6: 1 vs 0 (mismatch).
    // Total matching bits: 16 (first two bytes) + 1 (first bit of third byte) = 17.
    const bits1: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
    ]
    const bits2: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0, // 0x00
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 17)
  })

  it('should handle arrays with a large number of elements', () => {
    const length = 100000 * 8 // Convert to bits
    const arr1: number[] = []
    const arr2: number[] = []
    for (let i = 0; i < length; i++) {
      arr1.push(i % 2) // Alternating 0,1 pattern
      arr2.push(i % 2) // Same pattern
    }
    // Each bit matches exactly.
    assert.strictEqual(matchingBitsLength(arr1, arr2), length)
  })
})

describe('bytesToBits', () => {
  it('should return an empty array for an empty Uint8Array', () => {
    const input = new Uint8Array([])
    const expected: number[] = []
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('should correctly convert 0x00 to eight 0 bits', () => {
    const input = new Uint8Array([0x00])
    const expected = [0, 0, 0, 0, 0, 0, 0, 0]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('should correctly convert 0xFF to eight 1 bits', () => {
    const input = new Uint8Array([0xff])
    const expected = [1, 1, 1, 1, 1, 1, 1, 1]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('should correctly convert 0x80 (10000000) to bits', () => {
    const input = new Uint8Array([0x80])
    const expected = [1, 0, 0, 0, 0, 0, 0, 0]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('should correctly convert multiple bytes to bits', () => {
    // 0xAA = 10101010 and 0x55 = 01010101
    const input = new Uint8Array([0xaa, 0x55])
    const expected = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // for 0xAA
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1, // for 0x55
    ]
    assert.deepEqual(bytesToBits(input), expected)
  })
})

describe('bitsToBytes', () => {
  it('should return an empty Uint8Array for an empty bits array', () => {
    const input: number[] = []
    const expected = new Uint8Array([])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('should correctly convert eight 0 bits to 0x00', () => {
    const input = [0, 0, 0, 0, 0, 0, 0, 0]
    const expected = new Uint8Array([0x00])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('should correctly convert eight 1 bits to 0xFF', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1]
    const expected = new Uint8Array([0xff])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('should correctly convert bits representing 0x80 to a byte', () => {
    const input = [1, 0, 0, 0, 0, 0, 0, 0]
    const expected = new Uint8Array([0x80])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('should correctly convert multiple groups of 8 bits to bytes', () => {
    // 0xAA = 10101010 and 0x55 = 01010101
    const input = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // for 0xAA
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1, // for 0x55
    ]
    const expected = new Uint8Array([0xaa, 0x55])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('should correctly convert a non-multiple-of-8 bit array, padding the last byte', () => {
    // 110 (3 bits) should be stored as 0b11000000 in a single byte (0xC0)
    const input = [1, 1, 0]
    const expected = new Uint8Array([0b11000000]) // Expect padding with zeros
    assert.deepEqual(bitsToBytes(input), expected)
  })
})

describe('Round-trip conversion from bytes to bits', () => {
  it('should convert bytes to bits and back to the original bytes', () => {
    const original = new Uint8Array([0x12, 0x34, 0x56, 0x78])
    const bits = bytesToBits(original)
    const result = bitsToBytes(bits)
    assert.deepEqual(result, original)
  })
})

describe('equalsBits', () => {
  it('should return true for two empty bit arrays', () => {
    const bits1: number[] = []
    const bits2: number[] = []
    assert.isTrue(equalsBits(bits1, bits2))
  })

  it('should return true for two identical bit arrays', () => {
    const bits1 = [1, 0, 1, 1, 0, 1]
    const bits2 = [1, 0, 1, 1, 0, 1]
    assert.isTrue(equalsBits(bits1, bits2))
  })

  it('should return false for arrays with different lengths', () => {
    const bits1 = [1, 0, 1]
    const bits2 = [1, 0, 1, 0]
    assert.isFalse(equalsBits(bits1, bits2))
  })

  it('should return false if the arrays differ in at least one element', () => {
    const bits1 = [1, 0, 1, 1]
    const bits2 = [1, 1, 1, 1]
    assert.isFalse(equalsBits(bits1, bits2))
  })
})
