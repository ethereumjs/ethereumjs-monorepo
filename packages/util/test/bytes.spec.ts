import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import {
  Address,
  addHexPrefix,
  baToJSON,
  bigIntToBytes,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bufArrToArr,
  bytesToBigInt,
  bytesToInt,
  bytesToPrefixedHexString,
  fromSigned,
  hexStringToBytes,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isZeroAddress,
  setLengthLeft,
  setLengthRight,
  short,
  toBytes,
  toUnsigned,
  toUtf8,
  unpadArray,
  unpadBytes,
  unpadHexString,
  validateNoLeadingZeroes,
  zeroAddress,
  zeros,
} from '../src'

tape('zeros function', function (t) {
  t.test('should produce lots of 0s', function (st) {
    const z60 = zeros(30)
    const zs60 = '000000000000000000000000000000000000000000000000000000000000'
    st.equal(bytesToHex(z60), zs60)
    st.end()
  })
})

tape('zero address', function (t) {
  t.test('should generate a zero address', function (st) {
    st.equal(zeroAddress(), '0x0000000000000000000000000000000000000000')
    st.end()
  })
})

tape('is zero address', function (t) {
  t.test('should return true when a zero address is passed', function (st) {
    st.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
    st.end()
  })

  t.test('should return false when the address is not equal to zero', function (st) {
    const nonZeroAddress = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    st.equal(isZeroAddress(nonZeroAddress), false)
    st.end()
  })

  t.test('should return false when address is not hex-prefixed', function (st) {
    st.equal(isZeroAddress('0000000000000000000000000000000000000000'), false)
    st.end()
  })
})

tape('unpadBytes', function (t) {
  t.test('should unpad a Uint8Array', function (st) {
    const bytes = toBytes('0x0000000006600')
    const r = unpadBytes(bytes)
    st.deepEquals(r, toBytes('0x6600'))
    st.end()
  })
  t.test('should throw if input is not a Uint8Array', function (st) {
    st.throws(function () {
      unpadBytes((<unknown>'0000000006600') as Uint8Array)
    })
    st.end()
  })
})

tape('unpadArray', function (t) {
  t.test('should unpad an Array', function (st) {
    const arr = [0, 0, 0, 1]
    const r = unpadArray(arr)
    st.deepEqual(r, [1])
    st.end()
  })
  t.test('should throw if input is not an Array', function (st) {
    st.throws(function () {
      unpadArray((<unknown>toBytes([0, 0, 0, 1])) as number[])
    })
    st.end()
  })
})

tape('unpadHexString', function (t) {
  t.test('should unpad a hex prefixed string', function (st) {
    const str = '0x0000000006600'
    const r = unpadHexString(str)
    st.equal(r, '0x6600')
    st.end()
  })
  t.test('should throw if input is not hex-prefixed', function (st) {
    st.throws(function () {
      unpadHexString('0000000006600')
    })
    st.end()
  })
})

tape('setLengthLeft', function (t) {
  t.test('should left pad a Uint8Array', function (st) {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthLeft(bytes, 3)
    st.equal(bytesToHex(padded), '000909')
    st.end()
  })
  t.test('should left truncate a Uint8Array', function (st) {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthLeft(bytes, 2)
    st.equal(bytesToHex(padded), '0009')
    st.end()
  })
  t.test('should throw if input is not a Uint8Array', function (st) {
    st.throws(function () {
      setLengthLeft((<unknown>[9, 9]) as Buffer, 3)
    })
    st.end()
  })
})

tape('setLengthRight', function (t) {
  t.test('should right pad a Uint8Array', function (st) {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthRight(bytes, 3)
    st.equal(bytesToHex(padded), '090900')
    st.end()
  })
  t.test('should right truncate a Uint8Array', function (st) {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthRight(bytes, 2)
    st.equal(bytesToHex(padded), '0900')
    st.end()
  })
  t.test('should throw if input is not a Uint8Array', function (st) {
    st.throws(function () {
      setLengthRight((<unknown>[9, 9]) as Uint8Array, 3)
    })
    st.end()
  })
})

tape('bytesToPrefixedHexString', function (t) {
  t.test('should convert a Uint8Array to a prefixed hex string', function (st) {
    const bytes = hexToBytes('5b9ac8')
    const hex = bytesToPrefixedHexString(bytes)
    st.equal(hex, '0x5b9ac8')
    st.end()
  })
  t.test('empty Uint8Array', function (st) {
    const bytes = new Uint8Array()
    const hex = bytesToPrefixedHexString(bytes)
    st.strictEqual(hex, '0x')
    st.end()
  })
})

tape('bytesToInt', function (t) {
  t.test('should convert an int to hex', function (st) {
    const bytes = hexToBytes('5b9ac8')
    const i = bytesToInt(bytes)
    st.equal(i, 6003400)
    st.equal(bytesToInt(new Uint8Array()), 0)
    st.end()
  })
  t.test('should convert empty input to 0', function (st) {
    st.equal(bytesToInt(new Uint8Array()), 0)
    st.end()
  })
})

tape('fromSigned', function (t) {
  t.test('should convert an unsigned (negative) Uint8Array to a signed number', function (st) {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = zeros(32)
    bytes[0] = 255

    st.equal(fromSigned(bytes).toString(), neg)
    st.end()
  })
  t.test('should convert an unsigned (positive) Uint8Array to a signed number', function (st) {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = zeros(32)
    bytes[0] = 1

    st.equal(fromSigned(bytes).toString(), neg)
    st.end()
  })
})

tape('toUnsigned', function (t) {
  t.test('should convert a signed (negative) number to unsigned', function (st) {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = 'ff00000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    st.equal(bytesToHex(toUnsigned(num)), hex)
    st.end()
  })

  t.test('should convert a signed (positive) number to unsigned', function (st) {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0100000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    st.equal(bytesToHex(toUnsigned(num)), hex)
    st.end()
  })
})

tape('hex prefix', function (t) {
  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  t.test('should add', function (st) {
    st.equal(addHexPrefix(string), '0x' + string)
    st.end()
  })
  t.test('should return on non-string input', function (st) {
    st.equal(addHexPrefix(1 as any), 1)
    st.end()
  })
})

tape('short', function (t) {
  const string = '657468657265756d000000000000000000000000000000000000000000000000'
  const shortened = '657468657265756d0000000000000000000000000000000000…'
  const shortenedToTen = '6574686572…'
  t.test('should short string', function (st) {
    st.equal(short(string), shortened)
    st.end()
  })
  t.test('should short buffer', function (st) {
    st.equal(short(hexToBytes(string)), shortened)
    st.end()
  })
  t.test('should short buffer to 10 chars', function (st) {
    st.equal(short(hexToBytes(string), 10), shortenedToTen)
    st.end()
  })
})

tape('toUtf8', function (t) {
  t.test('toUtf8', (st) => {
    let input = bytesToHex(utf8ToBytes('hello')) // '68656c6c6f'
    st.equal(toUtf8(input), 'hello', 'should convert a non-hex-prefixed value')
    st.equal(toUtf8(`0x${input}`), 'hello', 'should convert a hex-prefixed value')

    input = bytesToHex(utf8ToBytes('bip')) // '626970'
    st.equal(toUtf8(input), 'bip', 'should handle trailing single 0s correctly')

    input = '657468657265756d000000000000000000000000000000000000000000000000'
    st.equal(toUtf8(input), 'ethereum', 'should handle trailing double 0s correctly')
    input = '657468657265756d'
    st.equal(toUtf8(input), 'ethereum', 'neither trailing nor leading zeros')
    input = '000000000000000000000000000000000000000000000000657468657265756d'
    st.equal(toUtf8(input), 'ethereum', 'should handle leading double 0s correctly')

    st.throws(() => {
      toUtf8('123')
    }, 'should throw on uneven hex-string input')
    st.end()
  })
})

tape('toBytes', function (t) {
  t.test('should work', function (st) {
    // Buffer
    st.ok(equalsBytes(toBytes(new Uint8Array(0)), new Uint8Array()))
    // Array
    st.ok(equalsBytes(toBytes([]), new Uint8Array()))
    // String
    st.ok(equalsBytes(toBytes('0x11'), Uint8Array.from([17])))
    st.equal(bytesToHex(toBytes('0x1234')), '1234')
    st.ok(equalsBytes(toBytes('0x'), Uint8Array.from([])))
    // Number
    st.ok(equalsBytes(toBytes(1), Uint8Array.from([1])))
    // null
    st.ok(equalsBytes(toBytes(null), new Uint8Array(0)))
    // undefined
    st.deepEquals(toBytes(undefined), new Uint8Array(0))
    // BigInt
    st.deepEquals(toBytes(BigInt(1)), Uint8Array.from([1]))
    // 'toArray'
    st.deepEquals(
      toBytes({
        toBytes(): any {
          return Uint8Array.from([1])
        },
      }),
      Uint8Array.from([1])
    )
    st.end()
  })
  t.test('should fail', function (st) {
    st.throws(function () {
      toBytes({ test: 1 } as any)
    })
    st.throws(function () {
      toBytes(BigInt(-10))
    })
    st.end()
  })

  t.test('should fail with non 0x-prefixed hex strings', function (st) {
    st.throws(() => toBytes('11'), '11')
    st.throws(() => toBytes(''))
    st.throws(() => toBytes('0xR'), '0xR')
    st.end()
  })

  t.test(
    'should convert a TransformabletoBytes like the Address class (i.e. provides a toBytes method)',
    function (st) {
      const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
      const address = Address.fromString(str)
      const addressBytes = toBytes(address)
      st.deepEquals(addressBytes, address.toBytes())
      st.end()
    }
  )
})

tape('baToJSON', function (t) {
  t.test('should turn a array of buffers into a pure json object', function (st) {
    const ba = [Buffer.from([0]), Buffer.from([1]), [Buffer.from([2])]]
    st.deepEqual(baToJSON(ba), ['0x00', '0x01', ['0x02']])
    st.end()
  })
  t.test('should turn a buffers into string', function (st) {
    st.deepEqual(baToJSON(Buffer.from([0])), '0x00')
    st.end()
  })
})

tape('intToBytes', function (st) {
  st.throws(() => intToBytes(<any>'test'), 'throws on string')
  st.throws(() => intToBytes(<any>Infinity), 'throws on +Infinity')
  st.throws(() => intToBytes(<any>-Infinity), 'throws on -Infinity')
  st.throws(() => intToBytes(<any>NaN), 'throws on NaN')
  st.throws(() => intToBytes(<any>undefined), 'throws on undefined')
  st.throws(() => intToBytes(<any>null), 'throws on null')
  st.throws(() => intToBytes(<any>-1), 'throws on negative numbers')
  st.throws(() => intToBytes(<any>1.05), 'throws on decimal numbers')
  st.throws(() => intToBytes(<any>{}), 'throws on objects')
  st.throws(() => intToBytes(<any>true), 'throws on true')
  st.throws(() => intToBytes(<any>false), 'throws on false')
  st.throws(() => intToBytes(<any>[]), 'throws on arrays')
  st.throws(() => intToBytes(<any>(() => {})), 'throws on arrays')
  st.throws(() => intToBytes(Number.MAX_SAFE_INTEGER + 1), 'throws on unsafe integers')
  st.deepEquals(intToBytes(0), hexToBytes('00'), 'correctly converts 0 to a Uint8Array')
  st.deepEquals(intToBytes(1), hexToBytes('01'), 'correctly converts 1 to a Uint8Array')
  st.end()
})

tape('intToHex', function (st) {
  st.throws(() => intToHex(<any>'test'), 'throws on string')
  st.throws(() => intToHex(<any>Infinity), 'throws on +Infinity')
  st.throws(() => intToHex(<any>-Infinity), 'throws on -Infinity')
  st.throws(() => intToHex(<any>NaN), 'throws on NaN')
  st.throws(() => intToHex(<any>undefined), 'throws on undefined')
  st.throws(() => intToHex(<any>null), 'throws on null')
  st.throws(() => intToHex(<any>-1), 'throws on negative numbers')
  st.throws(() => intToHex(<any>1.05), 'throws on decimal numbers')
  st.throws(() => intToHex(<any>{}), 'throws on objects')
  st.throws(() => intToHex(<any>true), 'throws on true')
  st.throws(() => intToHex(<any>false), 'throws on false')
  st.throws(() => intToHex(<any>[]), 'throws on arrays')
  st.throws(() => intToHex(<any>(() => {})), 'throws on arrays')
  st.throws(() => intToHex(Number.MAX_SAFE_INTEGER + 1), 'throws on unsafe integers')
  st.ok(intToHex(0) === '0x0', 'correctly converts 0 to a hex string')
  st.ok(intToHex(1) === '0x1', 'correctly converts 1 to a hex string')
  st.end()
})

tape('validateNoLeadingZeroes', function (st) {
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

  st.doesNotThrow(
    () => validateNoLeadingZeroes(noLeadingZeroes),
    'does not throw when no leading zeroes'
  )
  st.doesNotThrow(() => validateNoLeadingZeroes(emptyBuffer), 'does not throw with empty buffer')
  st.doesNotThrow(
    () => validateNoLeadingZeroes(undefinedValue),
    'does not throw when undefined passed in'
  )
  st.doesNotThrow(
    () => validateNoLeadingZeroes(noleadingZeroBytes),
    'does not throw when value has leading zero bytes'
  )
  st.throws(
    () => validateNoLeadingZeroes(leadingZeroBytes),
    'throws when value has leading zero bytes'
  )
  st.throws(() => validateNoLeadingZeroes(onlyZeroes), 'throws when value has only zeroes')
  st.end()
})

tape('bytesToBigInt', (st) => {
  const buf = toBytes('0x123')
  st.equal(BigInt(0x123), bytesToBigInt(buf))
  st.end()
})

tape('bigIntToBytes', (st) => {
  const num = BigInt(0x123)
  st.deepEqual(toBytes('0x123'), bigIntToBytes(num))
  st.end()
})

tape('bigIntToUnpaddedBytes', function (t) {
  t.test('should equal unpadded buffer value', function (st) {
    st.deepEquals(bigIntToUnpaddedBytes(BigInt(0)), Uint8Array.from([]))
    st.deepEquals(bigIntToUnpaddedBytes(BigInt(100)), hexToBytes('64'))
    st.end()
  })
})

tape('intToUnpaddedBytes', function (t) {
  t.test('should equal unpadded buffer value', function (st) {
    st.deepEquals(intToUnpaddedBytes(0), Uint8Array.from([]))
    st.deepEquals(intToUnpaddedBytes(100), hexToBytes('64'))
    st.end()
  })
})

tape('bigIntToHex', (st) => {
  st.equal(bigIntToHex(BigInt(1)), '0x1')
  st.end()
})
