import assert from 'assert'
import { BN, toBuffer } from '../src'
import { Address } from '../src'
const eip1014Testdata = require('./testdata/eip1014Examples.json')

describe('Address', () => {
  const ZERO_ADDR_S = '0x0000000000000000000000000000000000000000'

  it('should validate address length', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a11'
    assert.throws(() => Address.fromString(str))
    const shortStr = '0x2f015c60e0be116b1f0cd534704db9c92118fb'
    assert.throws(() => Address.fromString(shortStr))
    const buf = toBuffer(str)
    assert.throws(() => new Address(buf))
  })

  it('should generate a zero address', () => {
    const addr = Address.zero()
    assert.deepEqual(addr.buf, toBuffer(ZERO_ADDR_S))
    assert.equal(addr.toString(), ZERO_ADDR_S)
  })

  it('should instantiate address from zero address string', () => {
    const addr = Address.fromString(ZERO_ADDR_S)
    assert.deepEqual(addr.toString(), ZERO_ADDR_S)
    assert.equal(addr.isZero(), true)
  })

  it('should detect non-zero address', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromString(str)
    assert.equal(addr.isZero(), false)
  })

  it('should instantiate from public key', () => {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPublicKey(pubKey)
    assert.equal(addr.toString(), str)
  })

  it('should fail to instantiate from invalid public key', () => {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex'
    )
    assert.throws(() => Address.fromPublicKey(pubKey))
  })

  it('should instantiate from private key', () => {
    // prettier-ignore
    const privateKey = Buffer.from([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95])
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPrivateKey(privateKey)
    assert.equal(addr.toString(), str)
  })

  it('should generate address for created contract', () => {
    const from = Address.fromString('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39')
    const addr = Address.generate(from, new BN(14))
    assert.equal(addr.toString(), '0xd658a4b8247c14868f3c512fa5cbb6e458e4a989')

    const addr2 = Address.generate(from, new BN(0))
    assert.equal(addr2.toString(), '0xbfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })

  it('should generate address for CREATE2', () => {
    for (const testdata of eip1014Testdata) {
      const { address, salt, initCode, result } = testdata
      const from = Address.fromString(address)
      const addr = Address.generate2(from, toBuffer(salt), toBuffer(initCode))
      assert.equal(addr.toString(), result)
    }
  })

  it('should provide a buffer that does not mutate the original address', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = Address.fromString(str)
    const addressBuf = address.toBuffer()
    addressBuf.fill(0)
    assert.equal(address.toString(), str)
  })

  it('should compare equality properly', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address1 = Address.fromString(str)
    const address2 = new Address(Buffer.from(str.slice(2), 'hex'))
    assert.ok(address1.equals(address2))
    assert.ok(address1.buf.equals(address2.buf))

    const str2 = '0xcd4EC7b66fbc029C116BA9Ffb3e59351c20B5B06'
    const address3 = Address.fromString(str2)
    assert.ok(!address1.equals(address3))

    const address3LowerCase = Address.fromString(str2.toLowerCase())
    assert.ok(address3.equals(address3LowerCase))

    const address4 = Address.zero()
    assert.ok(!address1.equals(address4))
  })
})
