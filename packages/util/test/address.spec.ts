import { equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { Address, hexStringToBytes, toBytes } from '../src/index.js'

import eip1014Testdata from './testdata/eip1014Examples.json'

describe('Address', () => {
  const ZERO_ADDR_S = '0x0000000000000000000000000000000000000000'

  it('should validate address length', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a11'
    assert.throws(() => Address.fromString(str))
    const shortStr = '0x2f015c60e0be116b1f0cd534704db9c92118fb'
    assert.throws(() => Address.fromString(shortStr))
    const buf = toBytes(str)
    assert.throws(() => new Address(buf))
  })

  it('should generate a zero address', () => {
    const addr = Address.zero()
    assert.deepEqual(addr.bytes, toBytes(ZERO_ADDR_S))
    assert.equal(addr.toString(), ZERO_ADDR_S)
  })

  it('should instantiate address from zero address string', () => {
    const addr = Address.fromString(ZERO_ADDR_S)
    assert.deepEqual(addr.toString(), ZERO_ADDR_S)
    assert.ok(addr.isZero())
  })

  it('should detect non-zero address', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromString(str)
    assert.notOk(addr.isZero())
  })

  it('should instantiate from public key', () => {
    const pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPublicKey(pubKey)
    assert.equal(addr.toString(), str)
  })

  it('should fail to instantiate from invalid public key', () => {
    const pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744'
    )
    assert.throws(() => Address.fromPublicKey(pubKey))
  })

  it('should instantiate from private key', () => {
    // prettier-ignore
    const privateKey = Uint8Array.from([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95])
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPrivateKey(privateKey)
    assert.equal(addr.toString(), str)
  })

  it('should generate address for created contract', () => {
    const from = Address.fromString('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39')
    const addr = Address.generate(from, BigInt(14))
    assert.equal(addr.toString(), '0xd658a4b8247c14868f3c512fa5cbb6e458e4a989')

    const addr2 = Address.generate(from, BigInt(0))
    assert.equal(addr2.toString(), '0xbfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })

  it('should provide correct precompile check', () => {
    const precompile = Address.fromString('0x0000000000000000000000000000000000000009')
    assert.isTrue(precompile.isPrecompileOrSystemAddress(), 'should detect precompile address')
    const nonPrecompile = Address.fromString('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39')
    assert.isFalse(
      nonPrecompile.isPrecompileOrSystemAddress(),
      'should detect non-precompile address'
    )
  })

  it('should generate address for CREATE2', () => {
    for (const testdata of eip1014Testdata) {
      const { address, salt, initCode, result } = testdata
      const from = Address.fromString(address)
      const addr = Address.generate2(from, toBytes(salt), toBytes(initCode))
      assert.equal(addr.toString(), result)
    }
  })

  it('should provide a Uint8Array that does not mutate the original address', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = Address.fromString(str)
    const addressBytes = address.toBytes()
    addressBytes.fill(0)
    assert.equal(address.toString(), str)
  })

  it('should compare equality properly', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address1 = Address.fromString(str)
    const address2 = new Address(hexStringToBytes(str))
    assert.ok(address1.equals(address2))
    assert.ok(equalsBytes(address1.bytes, address2.bytes))

    const str2 = '0xcd4EC7b66fbc029C116BA9Ffb3e59351c20B5B06'
    const address3 = Address.fromString(str2)
    assert.ok(!address1.equals(address3))

    const address3LowerCase = Address.fromString(str2.toLowerCase())
    assert.ok(address3.equals(address3LowerCase))

    const address4 = Address.zero()
    assert.ok(!address1.equals(address4))
  })
})
