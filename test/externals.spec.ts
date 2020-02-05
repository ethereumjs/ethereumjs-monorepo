import * as assert from 'assert'

import * as BN_export from 'bn.js'
import * as rlp_export from 'rlp'
import * as secp256k1_export from 'secp256k1'

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
    var encoded = src.rlp.encode(nestedList)
    var decoded = src.rlp.decode(encoded)
    assert.deepEqual(nestedList, decoded)
  })

  it('should throw on exceptions', () => {
    // bad values: wrong encoded a zero
    const val = Buffer.from(
      'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex',
    )
    let result
    try {
      result = src.rlp.decode(val)
    } catch (e) {}
    assert.equal(result, undefined)

    // bad values: invalid length
    const a = Buffer.from(
      'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
      'hex',
    )

    let res
    try {
      result = src.rlp.decode(a)
    } catch (e) {}
    assert.equal(res, undefined)
  })
})

describe('External secp256k1 export', () => {
  it('should export `secp256k1`', () => {
    assert.equal(src.secp256k1, secp256k1_export)
  })

  it('should use a secp256k1 function correctly', () => {
    // generate message to sign
    const msg = Buffer.from(
      '983232e10f8d440b3bde2c0787084b1228a0a0bd6d18bf78165696bc76f3530e',
      'hex',
    )
    // generate privKey
    const privKey = Buffer.from(
      '59812df42e7bbb8f60a0ae92c660dcb6700927f944c709eaa0b9447d9ebffaf7',
      'hex',
    )
    // get the public key in a compressed format
    const pubKey = src.secp256k1.publicKeyCreate(privKey)
    // sign the message
    const sigObj = src.secp256k1.sign(msg, privKey)
    // verify the signature
    assert.ok(src.secp256k1.verify(msg, sigObj.signature, pubKey))
  })

  it('should throw on exceptions', () => {
    // publicKeyVerify should be a Buffer
    assert.throws(() => {
      src.secp256k1.publicKeyVerify(null as any)
    })

    // publicKeyCombine public keys should have length greater that zero
    assert.throws(() => {
      src.secp256k1.publicKeyCombine([])
    })

    // privateKeyImport invalid format
    assert.throws(() => {
      const buffer = Buffer.from([0x00])
      src.secp256k1.privateKeyImport(buffer)
    })
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
      'toUtf8',
    ]

    expected.forEach(prop => {
      assert.ok(src.hasOwnProperty(prop))
    })
  })

  it('should use ethjsUtil functions correctly', () => {
    // should convert intToHex
    assert.equal((src as any).intToHex(new src.BN(0)), '0x0')

    // should convert intToHex
    const i = 6003400
    const hex = (src as any).intToHex(i)
    assert.equal(hex, '0x5b9ac8')

    // should convert a int to a buffer
    const j = 6003400
    const buf = (src as any).intToBuffer(j)
    assert.equal(buf.toString('hex'), '5b9ac8')
  })

  it('should handle exceptions and invalid inputs', () => {
    // should throw when invalid abi
    assert.throws(() => (src as any).getKeys([], 3289), Error)

    // should detect invalid length hex string
    assert.equal((src as any).isHexString('0x0', 2), false)
  })
})
