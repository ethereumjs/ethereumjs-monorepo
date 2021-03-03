import assert from 'assert'
import BN from 'bn.js'
import * as rlp from 'rlp'
import {
  Account,
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
  toChecksumAddress
} from '../src'
const eip1014Testdata = require('./testdata/eip1014Examples.json')

describe('Account', function() {
  describe('empty constructor', function() {
    const account = new Account()
    it('should have zero nonce', function() {
      assert.ok(account.nonce.isZero())
    })
    it('should have zero balance', function() {
      assert.ok(account.balance.isZero())
    })
    it('should have stateRoot equal to KECCAK256_RLP', function() {
      assert.ok(
        account.stateRoot.toString('hex'),
        '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
      )
    })
    it('should have codeHash equal to KECCAK256_NULL', function() {
      assert.equal(
        account.codeHash.toString('hex'),
        'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    })
  })

  describe('from Array data', function() {
    const raw = [
      '0x02', // nonce
      '0x0384', // balance
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', // stateRoot
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' // codeHash
    ]
    const account = Account.fromValuesArray(raw.map(toBuffer))
    it('should have correct nonce', function() {
      assert.ok(account.nonce.eqn(2))
    })
    it('should have correct balance', function() {
      assert.ok(account.balance.eqn(900))
    })
    it('should have correct stateRoot', function() {
      assert.equal(
        account.stateRoot.toString('hex'),
        '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
      )
    })
    it('should have correct codeHash', function() {
      assert.equal(
        account.codeHash.toString('hex'),
        'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    })
  })

  describe('from Object data', function() {
    const raw = {
      nonce: '0x02',
      balance: '0x0384',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
    const account = Account.fromAccountData(raw)
    it('should have correct nonce', function() {
      assert.ok(account.nonce.eqn(2))
    })
    it('should have correct balance', function() {
      assert.ok(account.balance.eqn(900))
    })
    it('should have correct stateRoot', function() {
      assert.equal(
        account.stateRoot.toString('hex'),
        '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
      )
    })
    it('should have correct codeHash', function() {
      assert.equal(
        account.codeHash.toString('hex'),
        'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    })
  })

  describe('from RLP data', function() {
    const accountRlp = Buffer.from(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'hex'
    )
    const account = Account.fromRlpSerializedAccount(accountRlp)
    it('should have correct nonce', function() {
      assert.ok(account.nonce.eqn(2))
    })
    it('should have correct balance', function() {
      assert.ok(account.balance.eqn(900))
    })
    it('should have correct stateRoot', function() {
      assert.equal(
        account.stateRoot.toString('hex'),
        '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
      )
    })
    it('should have correct codeHash', function() {
      assert.equal(
        account.codeHash.toString('hex'),
        'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    })
  })

  describe('serialize', function() {
    const raw = {
      nonce: '0x01',
      balance: '0x42',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
    const account = Account.fromAccountData(raw)
    const accountRlp = rlp.encode([raw.nonce, raw.balance, raw.stateRoot, raw.codeHash])
    it('should serialize correctly', function() {
      assert.ok(account.serialize().equals(accountRlp))
    })
  })

  describe('isContract', function() {
    it('should return false for a non-contract account', function() {
      const accountRlp = Buffer.from(
        'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        'hex'
      )
      const account = Account.fromRlpSerializedAccount(accountRlp)
      assert.equal(account.isContract(), false)
    })

    it('should return true for a contract account', function() {
      const raw = {
        nonce: '0x01',
        balance: '0x0042',
        stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      }
      const account = Account.fromAccountData(raw)
      assert.ok(account.isContract())
    })
  })

  describe('isEmpty', function() {
    it('should return true for an empty account', function() {
      const account = new Account()
      assert.ok(account.isEmpty())
    })

    it('should return false for a non-empty account', function() {
      const raw = {
        nonce: '0x01',
        balance: '0x0042',
        stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        codeHash: '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b'
      }
      const account = Account.fromAccountData(raw)
      assert.equal(account.isEmpty(), false)
    })
  })

  describe('validation', function() {
    it('should only accept length 32 buffer for stateRoot', function() {
      assert.throws(() => {
        new Account(undefined, undefined, Buffer.from('hey'), undefined)
      })
    })

    it('should only accept length 32 buffer for codeHash', function() {
      assert.throws(() => {
        new Account(undefined, undefined, undefined, Buffer.from('hey'))
      })
    })

    it('should only accept an array in fromRlpSerializedAccount', function() {
      const data = { balance: new BN(5) }
      assert.throws(() => {
        Account.fromRlpSerializedAccount(data as any)
      })
    })

    it('should not accept nonce less than 0', function() {
      assert.throws(() => {
        new Account(new BN(-5))
      })
    })

    it('should not accept balance less than 0', function() {
      assert.throws(() => {
        new Account(undefined, new BN(-5))
      })
    })
  })
})

describe('isValidPrivate', function() {
  const SECP256K1_N = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16)
  it('should fail on short input', function() {
    const tmp = '0011223344'
    assert.throws(function() {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    })
  })
  it('should fail on too big input', function() {
    const tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.throws(function() {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    })
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
      'hex'
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it('should fail on too big input', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00',
      'hex'
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it('should fail on SEC1 key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.equal(isValidPublic(pubKey), false)
  })
  it("shouldn't fail on SEC1 key with sanitize enabled", function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should fail with an invalid SEC1 public key', function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.equal(isValidPublic(pubKey, true), false)
  })
  it('should work with compressed keys with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a',
      'hex'
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should work with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.equal(isValidPublic(pubKey, true), true)
  })
  it('should work otherwise', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.equal(isValidPublic(pubKey), true)
  })
  it('should throw if input is not Buffer', function() {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    try {
      isValidPublic((<unknown>pubKey) as Buffer)
    } catch (err) {
      assert(err.message.includes('This method only supports Buffer'))
    }
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
  it('should throw if input is not Buffer', function() {
    assert.throws(function() {
      importPublic((<unknown>pubKey) as Buffer)
    })
  })
})

describe('publicToAddress', function() {
  it('should produce an address given a public key', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey)
    assert.equal(r.toString('hex'), address)
  })
  it('should produce an address given a SEC1 public key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey, true)
    assert.equal(r.toString('hex'), address)
  })
  it("shouldn't produce an address given an invalid SEC1 public key", function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    assert.throws(function() {
      publicToAddress(pubKey, true)
    })
  })
  it("shouldn't produce an address given an invalid public key", function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex'
    )
    assert.throws(function() {
      publicToAddress(pubKey)
    })
  })
  it('should throw if input is not a buffer', function() {
    const pubKey: any =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.throws(function() {
      publicToAddress(pubKey)
    })
  })
})

describe('privateToPublic', function() {
  it('should produce a public key given a private key', function() {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    const privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex'
    )
    const r: any = privateToPublic(privateKey).toString('hex')
    assert.equal(r.toString('hex'), pubKey)
  })
  it("shouldn't produce a public key given an invalid private key", function() {
    const privateKey1 = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f2a',
      'hex'
    )
    const privateKey2 = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c',
      'hex'
    )
    assert.throws(function() {
      privateToPublic(privateKey1)
    })
    assert.throws(function() {
      privateToPublic(privateKey2)
    })
  })

  it('should throw if private key is not Buffer', function() {
    const privateKey = '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f'
    try {
      privateToPublic((<unknown>privateKey) as Buffer)
    } catch (err) {
      assert(err.message.includes('This method only supports Buffer'))
      assert(err.message.includes(privateKey))
    }
  })
})

describe('privateToAddress', function() {
  it('should produce an address given a private key', function() {
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex'
    )
    const r: any = privateToAddress(privateKey).toString('hex')
    assert.equal(r.toString('hex'), address)
  })
})

describe('generateAddress', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      Buffer.from('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 'utf8'),
      toBuffer(14)
    ).toString('hex')
    assert.equal(add.toString('hex'), '936a4295d8d74e310c0c95f0a63e53737b998d12')
  })
})

describe('generateAddress with hex prefix', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(14)
    ).toString('hex')
    assert.equal(add.toString('hex'), 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })
})

describe('generateAddress with nonce 0 (special case)', function() {
  it('should produce an address given a public key', function() {
    const add: any = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(0)
    ).toString('hex')
    assert.equal(add.toString('hex'), 'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })
})

describe('generateAddress with non-buffer inputs', function() {
  it('should throw if address is not Buffer', function() {
    assert.throws(function() {
      generateAddress(
        (<unknown>'0x990ccf8a0de58091c028d6ff76bb235ee67c1c39') as Buffer,
        toBuffer(0)
      )
    })
  })
  it('should throw if nonce is not Buffer', function() {
    assert.throws(function() {
      generateAddress(
        toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
        (<unknown>0) as Buffer
      )
    })
  })
})

describe('generateAddress2: EIP-1014 testdata examples', function() {
  for (let i = 0; i <= 6; i++) {
    const e = eip1014Testdata[i]
    it(`${e['comment']}: should generate the addresses provided`, function() {
      const result = generateAddress2(
        toBuffer(e['address']),
        toBuffer(e['salt']),
        toBuffer(e['initCode'])
      )
      assert.equal('0x' + result.toString('hex'), e['result'])
    })
  }
})

describe('generateAddress2: non-buffer inputs', function() {
  const e = eip1014Testdata[0]

  it('should throw if address is not Buffer', function() {
    assert.throws(function() {
      generateAddress2(
        (<unknown>e['address']) as Buffer,
        toBuffer(e['salt']),
        toBuffer(e['initCode'])
      )
    })
  })
  it('should throw if salt is not Buffer', function() {
    assert.throws(function() {
      generateAddress2(
        toBuffer(e['address']),
        (<unknown>e['salt']) as Buffer,
        toBuffer(e['initCode'])
      )
    })
  })
  it('should throw if initCode is not Buffer', function() {
    assert.throws(function() {
      generateAddress2(
        toBuffer(e['address']),
        toBuffer(e['salt']),
        (<unknown>e['initCode']) as Buffer
      )
    })
  })
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
  '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb'
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
    '0xfb6916095Ca1dF60bB79cE92ce3ea74C37c5D359'
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
    '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359'
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
    '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB'
  ]
}

describe('.toChecksumAddress()', function() {
  describe('EIP55', function() {
    it('should work', function() {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        const tmp = eip55ChecksumAddresses[i]
        assert.equal(toChecksumAddress(tmp.toLowerCase()), tmp)
      }
    })
  })

  describe('EIP1191', function() {
    it('Should encode the example addresses correctly', function() {
      for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
        for (const addr of addresses) {
          assert.equal(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
          assert.equal(toChecksumAddress(addr.toLowerCase(), Buffer.from([chainId])), addr)
          assert.equal(toChecksumAddress(addr.toLowerCase(), new BN(chainId)), addr)
          assert.equal(
            toChecksumAddress(addr.toLowerCase(), '0x' + Buffer.from([chainId]).toString('hex')),
            addr
          )
        }
      }
    })
    it('Should encode large chain ids greater than MAX_INTEGER correctly', function() {
      const addr = '0x88021160C5C792225E4E5452585947470010289D'
      const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
      assert.equal(toChecksumAddress(addr.toLowerCase(), chainIDBuffer), addr)
      assert.equal(toChecksumAddress(addr.toLowerCase(), new BN(chainIDBuffer)), addr)
      assert.equal(
        toChecksumAddress(addr.toLowerCase(), '0x' + chainIDBuffer.toString('hex')),
        addr
      )
      const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
      assert.throws(
        () => {
          toChecksumAddress(addr.toLowerCase(), chainIDNumber)
        },
        {
          message:
            'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)'
        }
      )
    })
  })

  describe('input format', function() {
    it('Should throw when the address is not hex-prefixed', function() {
      assert.throws(function() {
        toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
      })
    })
    it('Should throw when the chainId is not hex-prefixed', function() {
      assert.throws(function() {
        toChecksumAddress('0xde709f2102306220921060314715629080e2fb77', '1234')
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
          assert.equal(isValidChecksumAddress(addr, Buffer.from([chainId])), true)
          assert.equal(isValidChecksumAddress(addr, new BN(chainId)), true)
          assert.equal(
            isValidChecksumAddress(addr, '0x' + Buffer.from([chainId]).toString('hex')),
            true
          )
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
