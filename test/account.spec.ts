import * as assert from 'assert'
import * as BN from 'bn.js'
import {
  isValidPrivate,
  isValidPublic,
  importPublic,
  publicToAddress,
  privateToAddress,
  privateToPublic,
  generateAddress,
  generateAddress2,
  toBuffer,
  isValidChecksumAddress,
  isValidAddress,
  toChecksumAddress,
} from '../src'
const eip1014Testdata = require('./testdata/eip1014Examples.json')

describe('isValidPrivate', function() {
  const SECP256K1_N = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16)
  it('should fail on short input', function() {
    const tmp = '0011223344'
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  it('should fail on too big input', function() {
    const tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  it('should fail on wrong input type', function() {
    assert.throws(function() {
      isValidPrivate((<unknown>'WRONG_INPUT_TYPE') as Buffer)
    })
  })
  it('should fail on invalid curve (zero)', function() {
    const tmp = '0000000000000000000000000000000000000000000000000000000000000000'
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  it('should fail on invalid curve (== N)', function() {
    const tmp = SECP256K1_N.toString(16)
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  it('should fail on invalid curve (>= N)', function() {
    const tmp = SECP256K1_N.addn(1).toString(16)
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  it('should work otherwise (< N)', function() {
    const tmp = SECP256K1_N.subn(1).toString(16)
    assert.equal(isValidPrivate(Buffer.from(tmp, 'hex')), true)
  })
})

describe('isValidPublic', function() {
  it('should fail on too short input', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex',
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it('should fail on too big input', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00',
      'hex',
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it('should fail on SEC1 key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it("shouldn't fail on SEC1 key with sanitize enabled", function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should fail with an invalid SEC1 public key', function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.equal(isValidPublic(pubKey, true), false)
  })
  it('should work with compressed keys with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a',
      'hex',
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should work with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should work otherwise', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.equal(isValidPublic(pubKey), true)
  })
})

describe('importPublic', function() {
  const pubKey =
    '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
  it('should work with an Ethereum public key', function() {
    const tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.equal(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })
  it('should work with uncompressed SEC1 keys', function() {
    const tmp =
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.equal(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })
  it('should work with compressed SEC1 keys', function() {
    const tmp = '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a'
    assert.equal(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })
})

describe('publicToAddress', function() {
  it('should produce an address given a public key', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
  it('should produce an address given a SEC1 public key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey, true)
    assert.equal(r.toString('hex'), address)
  })
  it("shouldn't produce an address given an invalid SEC1 public key", function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assert.throws(function() {
      publicToAddress(pubKey, true)
    })
  })
  it("shouldn't produce an address given an invalid public key", function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex',
    )
    assert.throws(function() {
      publicToAddress(pubKey)
    })
  })
})

describe('publicToAddress 0x', function() {
  it('should produce an address given a public key', function() {
    const pubKey: any =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
})

describe('privateToPublic', function() {
  it('should produce a public key given a private key', function() {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    const privateKey = Buffer.from([
      234,
      84,
      189,
      197,
      45,
      22,
      63,
      136,
      201,
      58,
      176,
      97,
      87,
      130,
      207,
      113,
      138,
      46,
      251,
      158,
      81,
      167,
      152,
      154,
      171,
      27,
      8,
      6,
      126,
      156,
      28,
      95,
    ])
    const r: any = privateToPublic(privateKey).toString('hex')
    assert.equal(r.toString('hex'), pubKey)
  })
  it("shouldn't produce a public key given an invalid private key", function() {
    const privateKey1 = Buffer.from([
      234,
      84,
      189,
      197,
      45,
      22,
      63,
      136,
      201,
      58,
      176,
      97,
      87,
      130,
      207,
      113,
      138,
      46,
      251,
      158,
      81,
      167,
      152,
      154,
      171,
      27,
      8,
      6,
      126,
      156,
      28,
      95,
      42,
    ])
    const privateKey2 = Buffer.from([
      234,
      84,
      189,
      197,
      45,
      22,
      63,
      136,
      201,
      58,
      176,
      97,
      87,
      130,
      207,
      113,
      138,
      46,
      251,
      158,
      81,
      167,
      152,
      154,
      171,
      27,
      8,
      6,
      126,
      156,
      28,
    ])
    assert.throws(function() {
      privateToPublic(privateKey1)
    })
    assert.throws(function() {
      privateToPublic(privateKey2)
    })
  })
})

describe('privateToAddress', function() {
  it('should produce an address given a private key', function() {
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = Buffer.from([
      234,
      84,
      189,
      197,
      45,
      22,
      63,
      136,
      201,
      58,
      176,
      97,
      87,
      130,
      207,
      113,
      138,
      46,
      251,
      158,
      81,
      167,
      152,
      154,
      171,
      27,
      8,
      6,
      126,
      156,
      28,
      95,
    ])
    const r: any = privateToAddress(privateKey).toString('hex')
    assert.equal(r.toString('hex'), address)
  })
})

describe('generateAddress', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      Buffer.from('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 'utf8'),
      toBuffer(14),
    ).toString('hex')
    assert.equal(add.toString('hex'), '936a4295d8d74e310c0c95f0a63e53737b998d12')
  })
})

describe('generateAddress with hex prefix', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(14),
    ).toString('hex')
    assert.equal(add.toString('hex'), 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })
})

describe('generateAddress with nonce 0 (special case)', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(0),
    ).toString('hex')
    assert.equal(add.toString('hex'), 'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })
})

describe('generateAddress2: EIP-1014 testdata examples', function() {
  for (let i = 0; i <= 6; i++) {
    let e = eip1014Testdata[i]
    it(`${e['comment']}: should generate the addresses provided`, function() {
      let result = generateAddress2(e['address'], e['salt'], e['initCode'])
      assert.equal('0x' + result.toString('hex'), e['result'])
    })
  }
})

const eip55ChecksumAddresses = [
  // All caps
  '0x52908400098527886E0F7030069857D2E4169EE7',
  '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
  // All Lower
  '0xde709f2102306220921060314715629080e2fb77',
  '0x27b1fdb04752bbc536007a920d24acb045561c26',
  // Normal
  '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
  '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
  '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
]

const eip1191ChecksummAddresses = {
  1: [
    '0x88021160c5C792225E4E5452585947470010289d',
    '0x27b1FdB04752bBc536007a920D24ACB045561c26',
    '0x52908400098527886e0f7030069857D2e4169EE7',
    '0x5aaeB6053f3E94C9b9A09f33669435e7Ef1bEAed',
    '0x8617E340b3d01FA5F11F306f4090FD50E238070d',
    '0xd1220a0CF47C7B9Be7A2E6ba89F429762E7B9Adb',
    '0xdBf03b407c01e7cD3CBea99509d93f8dDDC8C6fB',
    '0xDe709F2102306220921060314715629080E2fb77',
    '0xfb6916095Ca1dF60bB79cE92ce3ea74C37c5D359',
  ],
  30: [
    '0x6549F4939460DE12611948B3F82B88C3C8975323',
    '0x27b1FdB04752BBc536007A920D24ACB045561c26',
    '0x3599689E6292B81B2D85451025146515070129Bb',
    '0x52908400098527886E0F7030069857D2E4169ee7',
    '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
    '0x8617E340b3D01Fa5f11f306f4090fd50E238070D',
    '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB',
    '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB',
    '0xDe709F2102306220921060314715629080e2FB77',
    '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359',
  ],
  31: [
    '0x42712D45473476B98452F434E72461577D686318',
    '0x27B1FdB04752BbC536007a920D24acB045561C26',
    '0x3599689e6292b81b2D85451025146515070129Bb',
    '0x52908400098527886E0F7030069857D2e4169EE7',
    '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
    '0x66f9664F97F2b50f62d13eA064982F936DE76657',
    '0x8617e340b3D01fa5F11f306F4090Fd50e238070d',
    '0xDE709F2102306220921060314715629080e2Fb77',
    '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359',
    '0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB',
    '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB',
  ],
}

describe('.toChecksumAddress()', function() {
  describe('EIP55', function() {
    it('should work', function() {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        let tmp = eip55ChecksumAddresses[i]
        assert.equal(toChecksumAddress(tmp.toLowerCase()), tmp)
      }
    })
  })

  describe('EIP1191', function() {
    it('Should encode the example addresses correctly', function() {
      for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
        for (const addr of addresses) {
          assert.equal(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
        }
      }
    })
  })

  describe('input format', function() {
    it('Should throw when the address is not hex-prefixed', function() {
      assert.throws(function() {
        toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
      })
    })
  })
})

describe('.isValidChecksumAddress()', function() {
  describe('EIP55', function() {
    it('should return true', function() {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        assert.equal(isValidChecksumAddress(eip55ChecksumAddresses[i]), true)
      }
    })
    it('should validate', function() {
      assert.equal(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'), false)
    })
  })

  describe('EIP1191', function() {
    it('Should return true for the example addresses', function() {
      for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
        for (const addr of addresses) {
          assert.equal(isValidChecksumAddress(addr, Number(chainId)), true)
        }
      }
    })

    it('Should return false for invalid cases', function() {
      // If we set the chain id, an EIP55 encoded address should be invalid
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        assert.equal(isValidChecksumAddress(eip55ChecksumAddresses[i], 1), false)
      }

      assert.equal(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a', 1), false)
    })

    it('Should return false if the wrong chain id is used', function() {
      for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
        for (const addr of addresses) {
          assert.equal(isValidChecksumAddress(addr, Number(chainId) + 1), false)
        }
      }
    })
  })

  describe('input format', function() {
    it('Should throw when the address is not hex-prefixed', function() {
      assert.throws(function() {
        isValidChecksumAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')
      })
    })
  })
})

describe('.isValidAddress()', function() {
  it('should return true', function() {
    assert.equal(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'), true)
    assert.equal(isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7'), true)
  })
  it('should return false', function() {
    assert.equal(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6'), false)
    assert.equal(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6aa'), false)
  })
  it('should throw when input is not hex prefixed', function() {
    assert.throws(function() {
      isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')
    })
    assert.throws(function() {
      isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a')
    })
    assert.throws(function() {
      isValidAddress('0X52908400098527886E0F7030069857D2E4169EE7')
    })
  })
  it('error message should have correct format', function() {
    const input = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    try {
      isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')
    } catch (err) {
      assert(err.message.includes('only supports 0x-prefixed hex strings'))
      assert(err.message.includes(input))
    }
  })
})
