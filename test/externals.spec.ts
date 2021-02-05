import assert from 'assert'

import BN_export from 'bn.js'
import * as rlp_export from 'rlp'

import * as src from '../src'

describe('External BN export', () => {
  it('should export `BN`', () => {
    assert.equal(src.BN, BN_export)
  })

  it('should use a BN function correctly', () => {
    const a = new src.BN('dead', 16)
    const b = new src.BN('101010', 2)
    const result = a.add(b)
    assert.equal(result.toString(10), 57047)
  })

  it('should throw on exceptions', () => {
    // should not allow 0 input
    assert.throws(() => {
      new src.BN(1).egcd(new src.BN('0'))
    }, /^Error: Assertion failed$/)
  })

  // should not accept an unsafe integer
  const num = Math.pow(2, 53)
  assert.throws(() => {
    return new src.BN(num, 10)
  }, /^Error: Assertion failed$/)

  // should throw error with num eq 0x4000000
  assert.throws(function() {
    new src.BN(0).iaddn(0x4000000)
  }, /^Error: Assertion failed$/)
})

describe('External rlp export', () => {
  it('should export `rlp`', () => {
    assert.equal(src.rlp, rlp_export)
  })

  it('should use a rlp function correctly', () => {
    const nestedList = [[], [[]], [[], [[]]]]
    const encoded = src.rlp.encode(nestedList)
    const decoded = src.rlp.decode(encoded)
    assert.deepEqual(nestedList, decoded)
  })

  it('should throw on exceptions', () => {
    // bad values: wrong encoded a zero
    const val = Buffer.from(
      'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex'
    )
    let result
    try {
      result = src.rlp.decode(val)
    } catch (e) {
      // pass
    }
    assert.equal(result, undefined)

    // bad values: invalid length
    const a = Buffer.from(
      'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex'
    )

    let res
    try {
      result = src.rlp.decode(a)
    } catch (e) {
      // pass
    }
    assert.equal(res, undefined)
  })
})

describe('External ethjsUtil export', () => {
  it('should have all ethjsUtil methods', () => {
    const expected = [
      'arrayContainsArray',
      'toBuffer',
      'intToBuffer',
      'getBinarySize',
      'stripHexPrefix',
      'isHexPrefixed',
      'padToEven',
      'intToHex',
      'fromAscii',
      'fromUtf8',
      'toAscii',
      'getKeys',
      'isHexString',
      'toUtf8'
    ]

    expected.forEach(prop => {
      assert.ok(prop in src)
    })
  })

  it('should use ethjsUtil functions correctly', () => {
    // should convert intToHex
    assert.equal(src.intToHex(new src.BN(0).toNumber()), '0x0')

    // should convert intToHex
    const i = 6003400
    const hex = src.intToHex(i)
    assert.equal(hex, '0x5b9ac8')

    // should convert a int to a buffer
    const j = 6003400
    const buf = src.intToBuffer(j)
    assert.equal(buf.toString('hex'), '5b9ac8')
  })

  it('should handle exceptions and invalid inputs', () => {
    // should throw when invalid abi
    assert.throws(() => src.getKeys([], (<unknown>3289) as string), Error)

    // should detect invalid length hex string
    assert.equal(src.isHexString('0x0', 2), false)
  })
})
