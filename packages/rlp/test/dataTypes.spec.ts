import * as tape from 'tape'
import RLP, { utils } from '../src'
import { bytesToUtf8 } from './utils'

const { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } = utils

tape('invalid RLPs', (t) => {
  const errCases = [
    // prettier-ignore
    {input: Uint8Array.from([239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 191, 189, 29, 239, 191, 189, 77, 239, 191, 189, 239, 191, 189, 239, 191, 189, 93, 122, 239, 191, 189, 239, 191, 189, 239, 191, 189, 103, 239, 191, 189, 239, 191, 189, 239, 191, 189, 26, 239, 191, 189, 18, 69, 27, 239, 191, 189, 239, 191, 189, 116, 19, 239, 191, 189, 239, 191, 189, 66, 239, 191, 189, 64, 212, 147, 71, 239, 191, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 191, 189, 11, 222, 155, 122, 54, 42, 194, 169, 239, 191, 189, 70, 239, 191, 189, 72, 239, 191, 189, 239, 191, 189, 54, 53, 239, 191, 189, 100, 73, 239, 191, 189, 55, 239, 191, 189, 239, 191, 189, 59, 1, 239, 191, 189, 109, 239, 191, 189, 239, 191, 189, 93, 239, 191, 189, 208, 128, 239, 191, 189, 239, 191, 189, 0, 239, 191, 189, 239, 191, 189, 239, 191, 189, 15, 66, 64, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 4, 239, 191, 189, 79, 103, 239, 191, 189, 85, 239, 191, 189, 239, 191, 189, 239, 191, 189, 74, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 54, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 83, 239, 191, 189, 14, 239, 191, 189, 239, 191, 189, 239, 191, 189, 4, 63, 239, 191, 189, 63, 239, 191, 189, 41, 239, 191, 189, 239, 191, 189, 239, 191, 189, 67, 28, 239, 191, 189, 239, 191, 189, 11, 239, 191, 189, 31, 239, 191, 189, 239, 191, 189, 104, 96, 100, 239, 191, 189, 239, 191, 189, 12, 239, 191, 189, 239, 191, 189, 206, 152, 239, 191, 189, 239, 191, 189, 31, 112, 111, 239, 191, 189, 239, 191, 189, 65, 239, 191, 189, 41, 239, 191, 189, 239, 191, 189, 53, 84, 11, 239, 191, 189, 239, 191, 189, 12, 102, 24, 12, 42, 105, 109, 239, 191, 189, 58, 239, 191, 189, 4, 239, 191, 189, 104, 82, 9, 239, 191, 189, 6, 66, 91, 43, 38, 102, 117, 239, 191, 189, 105, 239, 191, 189, 239, 191, 189, 239, 191, 189, 89, 127, 239, 191, 189, 114])},
    {
      input: hexToBytes('efdebd'),
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
    {
      input: hexToBytes('efb83600'),
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
    {
      input: hexToBytes('efdebdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
      msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
    },
  ]
  errCases.forEach(({ input, msg }, index) => {
    t.test(`should not crash on an invalid rlp - ${index}`, async (st) => {
      try {
        RLP.decode(input)
        st.ok(false)
      } catch (e: any) {
        if (msg) {
          st.deepEqual(e.message, msg)
        } else {
          // FIXME: check for exception name
          st.ok(true)
        }
      }
    })
  })
})

tape('RLP encoding (string)', (t) => {
  t.test('should return itself if single byte and less than 0x7f', (st) => {
    const encodedSelf = RLP.encode('a')
    st.deepEqual(bytesToUtf8(encodedSelf), 'a')
    st.end()
  })

  t.test('length of string 0-55 should return (0x80+len(data)) plus data', (st) => {
    const encodedDog = RLP.encode('dog')
    st.deepEqual(4, encodedDog.length)
    st.deepEqual(encodedDog[0], 131)
    st.deepEqual(encodedDog[1], 100)
    st.deepEqual(encodedDog[2], 111)
    st.deepEqual(encodedDog[3], 103)
    st.end()
  })

  t.test(
    'length of string >55 should return 0xb7+len(len(data)) plus len(data) plus data',
    (st) => {
      const encodedLongString = RLP.encode(
        'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss'
      )
      st.deepEqual(72, encodedLongString.length)
      st.deepEqual(encodedLongString[0], 184)
      st.deepEqual(encodedLongString[1], 70)
      st.deepEqual(encodedLongString[2], 122)
      st.deepEqual(encodedLongString[3], 111)
      st.deepEqual(encodedLongString[12], 53)
      st.end()
    }
  )
})

tape('RLP encoding (list)', (t) => {
  t.test('length of list 0-55 should return (0xc0+len(data)) plus data', (st) => {
    const encodedArrayOfStrings = RLP.encode(['dog', 'god', 'cat'])
    st.deepEqual(13, encodedArrayOfStrings.length)
    st.deepEqual(encodedArrayOfStrings[0], 204)
    st.deepEqual(encodedArrayOfStrings[1], 131)
    st.deepEqual(encodedArrayOfStrings[11], 97)
    st.deepEqual(encodedArrayOfStrings[12], 116)
    st.end()
  })

  t.test('length of list >55 should return 0xf7+len(len(data)) plus len(data) plus data', (st) => {
    const data = [
      'dog',
      'god',
      'cat',
      'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss',
    ]
    const encodedArrayOfStrings = RLP.encode(data)
    const str = bytesToUtf8(encodedArrayOfStrings)
    for (const innerStr of data) {
      st.ok(str.includes(innerStr))
    }
    // Verified with Geth's RLPDump
    const expected = hexToBytes(
      'f85483646f6783676f6483636174b8467a6f6f3235357a6f6f3235357a7a7a7a7a7a7a7a7a7a7a7a73737373737373737373737373737373737373737373737373737373737373737373737373737373737373737373'
    )
    st.deepEqual(encodedArrayOfStrings, expected)
    st.end()
  })
})

tape('RLP encoding (BigInt)', (t) => {
  t.test('should encode a BigInt value', (st) => {
    const encoded = RLP.encode(BigInt(3))
    st.deepEqual(encoded[0], 3)
    st.end()
  })

  t.test('length of bigint = 1, less than 0x7f, similar to string', (st) => {
    const encodedNumber = RLP.encode(BigInt(15))
    st.deepEqual(1, encodedNumber.length)
    st.deepEqual(encodedNumber[0], 15)
    st.end()
  })

  t.test('length of bigint > 55, similar to string', (st) => {
    const encodedNumber = RLP.encode(BigInt(1024))
    st.deepEqual(3, encodedNumber.length)
    st.deepEqual(encodedNumber[0], 130)
    st.deepEqual(encodedNumber[1], 4)
    st.deepEqual(encodedNumber[2], 0)
    st.end()
  })

  t.test('it should handle zero', (st) => {
    st.deepEqual(bytesToHex(RLP.encode(BigInt(0))), '80')
    st.end()
  })
})

tape('RLP encoding (integer)', (t) => {
  t.test('length of int = 1, less than 0x7f, similar to string', (st) => {
    const encodedNumber = RLP.encode(15)
    st.deepEqual(1, encodedNumber.length)
    st.deepEqual(encodedNumber[0], 15)
    st.end()
  })

  t.test('length of int > 55, similar to string', (st) => {
    const encodedNumber = RLP.encode(1024)
    st.deepEqual(3, encodedNumber.length)
    st.deepEqual(encodedNumber[0], 130)
    st.deepEqual(encodedNumber[1], 4)
    st.deepEqual(encodedNumber[2], 0)
    st.end()
  })

  t.test('it should handle zero', (st) => {
    st.deepEqual(bytesToHex(RLP.encode(0)), '80')
    st.end()
  })
})

tape('RLP decoding (string)', (t) => {
  t.test('first byte < 0x7f, return byte itself', (st) => {
    const decodedStr = RLP.decode(Uint8Array.from([97])) as Uint8Array
    st.deepEqual(1, decodedStr.length)
    st.deepEqual(bytesToUtf8(decodedStr), 'a')
    st.end()
  })

  t.test('first byte < 0xb7, data is everything except first byte', (st) => {
    const decodedStr = RLP.decode(Uint8Array.from([131, 100, 111, 103])) as Uint8Array
    st.deepEqual(3, decodedStr.length)
    st.deepEqual(bytesToUtf8(decodedStr), 'dog')
    st.end()
  })

  t.test('array', (st) => {
    // prettier-ignore
    const decodedBufferArray = RLP.decode(Uint8Array.from([204, 131, 100, 111, 103, 131, 103, 111, 100, 131, 99, 97, 116]))
    st.deepEqual(decodedBufferArray, [utf8ToBytes('dog'), utf8ToBytes('god'), utf8ToBytes('cat')])
    st.end()
  })
})

tape('RLP decoding (int)', (t) => {
  t.test('first byte < 0x7f, return itself', (st) => {
    const decodedSmallNum = RLP.decode(Uint8Array.from([15]))
    st.deepEqual(1, decodedSmallNum.length)
    st.deepEqual(decodedSmallNum[0], 15)
    st.end()
  })

  t.test('first byte < 0xb7, data is everything except first byte', (st) => {
    const decodedNum = RLP.decode(Uint8Array.from([130, 4, 0])) as Uint8Array
    st.deepEqual(2, decodedNum.length)
    st.deepEqual(bytesToHex(decodedNum), '0400')
    st.end()
  })
})

tape('RLP decoding (BigInt)', (t) => {
  t.test('first byte < 0x7f, return itself', (st) => {
    const decodedSmallNum = bytesToHex(RLP.decode(BigInt(15)) as Uint8Array)
    st.deepEqual(2, decodedSmallNum.length)
    st.deepEqual(decodedSmallNum, '0f')
    st.end()
  })

  t.test('first byte < 0xb7, data is everything except first byte', (st) => {
    const decodedNum = bytesToHex(RLP.decode(BigInt(0x820400)) as Uint8Array)
    st.deepEqual(4, decodedNum.length)
    st.deepEqual(decodedNum, '0400')
    st.end()
  })
})

tape('strings over 55 bytes long', (t) => {
  const testString =
    'This function takes in data, converts it to bytes, and adds a length for recursion'
  const test = utf8ToBytes(testString)
  let encoded: Uint8Array

  t.test('should encode it', (st) => {
    encoded = RLP.encode(test)
    st.deepEqual(encoded[0], 184)
    st.deepEqual(encoded[1], 82)
    st.end()
  })

  t.test('should decode', (st) => {
    const decoded = RLP.decode(encoded) as Uint8Array
    st.deepEqual(bytesToUtf8(decoded), testString)
    st.end()
  })
})

tape('list over 55 bytes long', (t) => {
  // prettier-ignore
  const testString = ['This', 'function', 'takes', 'in', 'a', 'data', 'convert', 'it', 'to', 'bytes', 'if', 'not', 'and', 'a', 'length', 'for', 'recursion', 'a1', 'a2', 'a3', 'ia4', 'a5', 'a6', 'a7', 'a8', 'ba9']
  let encoded: Uint8Array

  t.test('should encode it', (st) => {
    encoded = RLP.encode(testString)
    st.end()
  })

  t.test('should decode', (st) => {
    const decodedArr = RLP.decode(encoded) as Uint8Array[]
    const decoded: string[] = decodedArr.map((a) => bytesToUtf8(a))
    st.deepEqual(decoded, testString)
    st.end()
  })
})

tape('nested lists:', (t) => {
  // prettier-ignore
  const nestedList = [
    [],
    [
      []
    ],
    [
      [],
      [
        []
      ]
    ]
  ]
  const valueList = [
    [1, 2, 3],
    [
      Uint8Array.from([4, 5, 6]),
      Uint8Array.from([7, 8, 9]),
      [Uint8Array.from([0]), hexToBytes('abcd')],
    ],
  ]
  let encoded: Uint8Array
  t.test('encode a nested list', (st) => {
    encoded = RLP.encode(nestedList)
    st.deepEqual(encoded, Uint8Array.from([0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0]))
    st.end()
  })

  t.test('should decode a nested list', (st) => {
    const decoded = RLP.decode(encoded)
    st.deepEqual(nestedList, decoded)
    st.end()
  })

  t.test('should encode a list with values', (st) => {
    const valueEncoded = RLP.encode(valueList)
    // prettier-ignore
    st.deepEqual(valueEncoded, Uint8Array.from([0xd2, 0xc3, 0x01, 0x02, 0x03, 0xcd, 0x83, 0x04, 0x05, 0x06, 0x83, 0x07, 0x08, 0x09, 0xc4, 0x00, 0x82, 0xab, 0xcd]))
    st.end()
  })
})

tape('typed lists:', (t) => {
  const valueList = [
    [1, 2, 3],
    [
      Uint8Array.from([4, 5, 6]),
      Uint8Array.from([7, 8, 9]),
      [Uint8Array.from([0]), hexToBytes('abcd')],
    ],
  ]

  // equivalent to list of values above
  t.test('encode a nested list', (st) => {
    const valueEncoded = RLP.encode(valueList)
    // prettier-ignore
    st.deepEqual(valueEncoded, Uint8Array.from([0xd2, 0xc3, 0x01, 0x02, 0x03, 0xcd, 0x83, 0x04, 0x05, 0x06, 0x83, 0x07, 0x08, 0x09, 0xc4, 0x00, 0x82, 0xab, 0xcd]))
    st.end()
  })
})

tape('null values', (t) => {
  const nestedList = [null]
  let encoded
  t.test('encode a null array', (st) => {
    encoded = RLP.encode(nestedList)
    st.deepEqual(encoded, Uint8Array.from([0xc1, 0x80]))
    st.end()
  })

  t.test('should decode a null value', (st) => {
    st.deepEqual(Uint8Array.from([]), RLP.decode(hexToBytes('80')))
    st.end()
  })
})

tape('zero values', (t) => {
  let encoded
  t.test('encode a zero', (st) => {
    encoded = RLP.encode(Uint8Array.from([0]))
    st.deepEqual(encoded, Uint8Array.from([0]))
    st.end()
  })

  t.test('decode a zero', (st) => {
    const decode = RLP.decode(Uint8Array.from([0]))
    st.deepEqual(decode, Uint8Array.from([0]))
    st.end()
  })
})

tape('empty values', (t) => {
  let decoded
  t.test('decode empty array', (st) => {
    decoded = RLP.decode(Uint8Array.from([]))
    st.deepEqual(decoded, Uint8Array.from([]))
    st.end()
  })
})

tape('bad values', (t) => {
  t.test('wrong encoded a zero', (st) => {
    const val = hexToBytes(
      'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3'
    )
    let result
    try {
      result = RLP.decode(val)
    } catch (e) {
      // pass
    }
    st.deepEqual(result, undefined)
    st.end()
  })

  t.test('invalid length', (st) => {
    const a = hexToBytes(
      'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3'
    )

    let result
    try {
      result = RLP.decode(a)
    } catch (e) {
      // pass
    }
    st.deepEqual(result, undefined)
    st.end()
  })

  t.test('extra data at end', (st) => {
    const c =
      'f90260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0ef'

    const a = hexToBytes(c)

    let result
    try {
      result = RLP.decode(a)
    } catch (e) {
      // pass
    }
    st.deepEqual(result, undefined)
    st.end()
  })

  t.test('extra data at end', (st) => {
    const c =
      'f9ffffffc260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0'

    const a = hexToBytes(c)

    let result
    try {
      result = RLP.decode(a)
    } catch (e) {
      // pass
    }
    st.deepEqual(result, undefined)
    st.end()
  })

  t.test('list length longer than data', (st) => {
    const c =
      'f9ffffffc260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0'

    const a = hexToBytes(c)

    let result
    try {
      result = RLP.decode(a)
    } catch (e) {
      // pass
    }
    st.deepEqual(result, undefined)
    st.end()
  })
})

tape('hex prefix', (t) => {
  t.test('should have the same value', (st) => {
    const a = RLP.encode('0x88f')
    const b = RLP.encode('88f')
    st.notDeepEqual(bytesToHex(a), bytesToHex(b)) // ???
    st.end()
  })
})

tape('recursive typings', (t) => {
  t.test('should not throw compilation error', (st) => {
    type IsType<T, U> = Exclude<T, U> extends never
      ? Exclude<U, T> extends never
        ? true
        : false
      : false
    const assertType = <T, U>(isTrue: IsType<T, U>) => {
      return isTrue
    }
    // tslint:disable-next-line:no-dead-store
    const a = RLP.encode([[[[[0]]]]])
    st.ok(assertType<typeof a, Uint8Array>(true))
    st.end()
  })
})

tape('stream', (t) => {
  t.test('should handle stream decoding correctly', (st) => {
    const encodedNumber = RLP.encode(1)
    const str = 'This is a string'
    const longString =
      'This is a long string, so we can trigger the prefix when the array length is larger than 55.'
    const encodedString = RLP.encode(str)
    const encodedLongString = RLP.encode(longString)
    const encodedList = RLP.encode([1, 2, 3])
    const bufferStream = concatBytes(encodedNumber, encodedString, encodedLongString, encodedList)
    let decoded = RLP.decode(bufferStream, true)
    st.deepEqual(bytesToHex(decoded.data as Uint8Array), '01')
    decoded = RLP.decode(decoded.remainder, true)
    st.deepEqual(decoded.data, utf8ToBytes(str))
    decoded = RLP.decode(decoded.remainder, true)
    st.deepEqual(decoded.data, utf8ToBytes(longString))
    decoded = RLP.decode(decoded.remainder, true)
    st.equal(decoded.data.length, 3)
    st.deepEqual(decoded.data[0], Uint8Array.from([1]))
    st.deepEqual(decoded.data[1], Uint8Array.from([2]))
    st.deepEqual(decoded.data[2], Uint8Array.from([3]))
    st.equal(decoded.remainder.length, 0)
    st.end()
  })
})
