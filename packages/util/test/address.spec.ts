import * as tape from 'tape'
import { Address, toBuffer } from '../src'
const eip1014Testdata = require('./testdata/eip1014Examples.json')

tape('Address', (t) => {
  const ZERO_ADDR_S = '0x0000000000000000000000000000000000000000'

  t.test('should validate address length', (st) => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a11'
    st.throws(() => Address.fromString(str))
    const shortStr = '0x2f015c60e0be116b1f0cd534704db9c92118fb'
    st.throws(() => Address.fromString(shortStr))
    const buf = toBuffer(str)
    st.throws(() => new Address(buf))
    st.end()
  })

  t.test('should generate a zero address', (st) => {
    const addr = Address.zero()
    st.deepEqual(addr.buf, toBuffer(ZERO_ADDR_S))
    st.equal(addr.toString(), ZERO_ADDR_S)
    st.end()
  })

  t.test('should instantiate address from zero address string', (st) => {
    const addr = Address.fromString(ZERO_ADDR_S)
    st.deepEqual(addr.toString(), ZERO_ADDR_S)
    st.ok(addr.isZero())
    st.end()
  })

  t.test('should detect non-zero address', (st) => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromString(str)
    st.notOk(addr.isZero())
    st.end()
  })

  t.test('should instantiate from public key', (st) => {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPublicKey(pubKey)
    st.equal(addr.toString(), str)
    st.end()
  })

  t.test('should fail to instantiate from invalid public key', (st) => {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex'
    )
    st.throws(() => Address.fromPublicKey(pubKey))
    st.end()
  })

  t.test('should instantiate from private key', (st) => {
    // prettier-ignore
    const privateKey = Buffer.from([234, 84, 189, 197, 45, 22, 63, 136, 201, 58, 176, 97, 87, 130, 207, 113, 138, 46, 251, 158, 81, 167, 152, 154, 171, 27, 8, 6, 126, 156, 28, 95])
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const addr = Address.fromPrivateKey(privateKey)
    st.equal(addr.toString(), str)
    st.end()
  })

  t.test('should generate address for created contract', (st) => {
    const from = Address.fromString('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39')
    const addr = Address.generate(from, BigInt(14))
    st.equal(addr.toString(), '0xd658a4b8247c14868f3c512fa5cbb6e458e4a989')

    const addr2 = Address.generate(from, BigInt(0))
    st.equal(addr2.toString(), '0xbfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
    st.end()
  })

  t.test('should provide correct precompile check', (st) => {
    const precompile = Address.fromString('0x0000000000000000000000000000000000000009')
    st.true(precompile.isPrecompileOrSystemAddress(), 'should detect precompile address')
    const nonPrecompile = Address.fromString('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39')
    st.false(nonPrecompile.isPrecompileOrSystemAddress(), 'should detect non-precompile address')
    st.end()
  })

  t.test('should generate address for CREATE2', (st) => {
    for (const testdata of eip1014Testdata) {
      const { address, salt, initCode, result } = testdata
      const from = Address.fromString(address)
      const addr = Address.generate2(from, toBuffer(salt), toBuffer(initCode))
      st.equal(addr.toString(), result)
    }
    st.end()
  })

  t.test('should provide a buffer that does not mutate the original address', (st) => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = Address.fromString(str)
    const addressBuf = address.toBuffer()
    addressBuf.fill(0)
    st.equal(address.toString(), str)
    st.end()
  })

  t.test('should compare equality properly', (st) => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address1 = Address.fromString(str)
    const address2 = new Address(Buffer.from(str.slice(2), 'hex'))
    st.ok(address1.equals(address2))
    st.ok(address1.buf.equals(address2.buf))

    const str2 = '0xcd4EC7b66fbc029C116BA9Ffb3e59351c20B5B06'
    const address3 = Address.fromString(str2)
    st.ok(!address1.equals(address3))

    const address3LowerCase = Address.fromString(str2.toLowerCase())
    st.ok(address3.equals(address3LowerCase))

    const address4 = Address.zero()
    st.ok(!address1.equals(address4))
    st.end()
  })
})
