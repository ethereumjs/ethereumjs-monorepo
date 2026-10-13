import { assert, describe, it } from 'vitest'

import { RLP, utils } from '../src/index.ts'

import { bytesToUtf8 } from './utils.ts'

const { bytesToHex, hexToBytes, utf8ToBytes } = utils

describe('[RLP]: decode (string)', () => {
  it('returns byte itself when first byte < 0x7f', () => {
    const decodedStr = RLP.decode(Uint8Array.from([97])) as Uint8Array
    assert.deepEqual(1, decodedStr.length)
    assert.deepEqual(bytesToUtf8(decodedStr), 'a')
  })

  it('returns payload when first byte < 0xb7', () => {
    const decodedStr = RLP.decode(Uint8Array.from([131, 100, 111, 103])) as Uint8Array
    assert.deepEqual(3, decodedStr.length)
    assert.deepEqual(bytesToUtf8(decodedStr), 'dog')
  })

  it('decodes string list', () => {
    const decodedBufferArray = RLP.decode(
      Uint8Array.from([204, 131, 100, 111, 103, 131, 103, 111, 100, 131, 99, 97, 116]),
    )
    assert.deepEqual(decodedBufferArray, [
      utf8ToBytes('dog'),
      utf8ToBytes('god'),
      utf8ToBytes('cat'),
    ])
  })
})

describe('[RLP]: decode (int)', () => {
  it('returns byte itself when first byte < 0x7f', () => {
    const decodedSmallNum = RLP.decode(Uint8Array.from([15]))
    assert.deepEqual(1, decodedSmallNum.length)
    assert.deepEqual(decodedSmallNum[0], 15)
  })

  it('returns payload when first byte < 0xb7', () => {
    const decodedNum = RLP.decode(Uint8Array.from([130, 4, 0])) as Uint8Array
    assert.deepEqual(2, decodedNum.length)
    assert.deepEqual(bytesToHex(decodedNum), '0400')
  })
})

describe('[RLP]: decode (BigInt)', () => {
  it('returns byte itself when first byte < 0x7f', () => {
    const decodedSmallNum = bytesToHex(RLP.decode(BigInt(15)) as Uint8Array)
    assert.deepEqual(2, decodedSmallNum.length)
    assert.deepEqual(decodedSmallNum, '0f')
  })

  it('returns payload when first byte < 0xb7', () => {
    const decodedNum = bytesToHex(RLP.decode(BigInt(0x820400)) as Uint8Array)
    assert.deepEqual(4, decodedNum.length)
    assert.deepEqual(decodedNum, '0400')
  })
})

describe('[RLP]: decode long strings and lists', () => {
  it('round-trips string over 55 bytes', () => {
    const testString =
      'This function takes in data, converts it to bytes, and adds a length for recursion'
    const test = utf8ToBytes(testString)
    const encoded = RLP.encode(test)
    assert.deepEqual(encoded[0], 184)
    assert.deepEqual(encoded[1], 82)
    const decoded = RLP.decode(encoded) as Uint8Array
    assert.deepEqual(bytesToUtf8(decoded), testString)
  })

  it('round-trips list over 55 bytes', () => {
    const testString = [
      'This',
      'function',
      'takes',
      'in',
      'a',
      'data',
      'convert',
      'it',
      'to',
      'bytes',
      'if',
      'not',
      'and',
      'a',
      'length',
      'for',
      'recursion',
      'a1',
      'a2',
      'a3',
      'ia4',
      'a5',
      'a6',
      'a7',
      'a8',
      'ba9',
    ]
    const encoded = RLP.encode(testString)
    const decodedArr = RLP.decode(encoded) as Uint8Array[]
    const decoded: string[] = decodedArr.map((a) => bytesToUtf8(a))
    assert.deepEqual(decoded, testString)
  })
})

describe('[RLP]: decode nested lists', () => {
  const nestedList = [[], [[]], [[], [[]]]]
  const valueList = [
    [1, 2, 3],
    [
      Uint8Array.from([4, 5, 6]),
      Uint8Array.from([7, 8, 9]),
      [Uint8Array.from([0]), hexToBytes('abcd')],
    ],
  ]

  it('encodes and decodes empty nested structure', () => {
    const encoded = RLP.encode(nestedList)
    assert.deepEqual(encoded, Uint8Array.from([0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0]))
    assert.deepEqual(RLP.decode(encoded), nestedList)
  })

  it('encodes list with mixed value types', () => {
    const valueEncoded = RLP.encode(valueList)
    assert.deepEqual(
      valueEncoded,
      Uint8Array.from([
        0xd2, 0xc3, 0x01, 0x02, 0x03, 0xcd, 0x83, 0x04, 0x05, 0x06, 0x83, 0x07, 0x08, 0x09, 0xc4,
        0x00, 0x82, 0xab, 0xcd,
      ]),
    )
  })
})

describe('[RLP]: decode null and edge values', () => {
  it('encodes and decodes null in list', () => {
    const encoded = RLP.encode([null])
    assert.deepEqual(encoded, Uint8Array.from([0xc1, 0x80]))
    assert.deepEqual(Uint8Array.from([]), RLP.decode(hexToBytes('80')))
  })

  it('round-trips zero byte item', () => {
    const encoded = RLP.encode(Uint8Array.from([0]))
    assert.deepEqual(encoded, Uint8Array.from([0]))
    assert.deepEqual(RLP.decode(Uint8Array.from([0])), Uint8Array.from([0]))
  })

  it('decode() returns empty array for empty input', () => {
    assert.deepEqual(RLP.decode(Uint8Array.from([])), Uint8Array.from([]))
  })
})

describe('[RLP]: bad values', () => {
  it('decode() throws on wrong encoded zero', () => {
    const val = hexToBytes(
      'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
    )
    assert.throws(() => RLP.decode(val))
  })

  it('decode() throws on invalid length', () => {
    const a = hexToBytes(
      'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
    )
    assert.throws(() => RLP.decode(a))
  })

  it('decode() throws on extra data at end (variant 1)', () => {
    const c =
      'f90260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0ef'

    assert.throws(() => RLP.decode(hexToBytes(c)))
  })

  it('decode() throws on extra data at end (variant 2)', () => {
    const c =
      'f9ffffffc260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0'

    assert.throws(() => RLP.decode(hexToBytes(c)))
  })

  it('decode() throws when list length exceeds data', () => {
    const c =
      'f9ffffffc260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0'

    assert.throws(() => RLP.decode(hexToBytes(c)))
  })
})
