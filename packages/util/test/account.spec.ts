import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import {
  Account,
  bytesToBigInt,
  bytesToPrefixedHexString,
  generateAddress,
  generateAddress2,
  hexStringToBytes,
  importPublic,
  intToBytes,
  intToPrefixedHexString,
  isValidAddress,
  isValidChecksumAddress,
  isValidPrivate,
  isValidPublic,
  padToEven,
  privateToAddress,
  privateToPublic,
  publicToAddress,
  toBytes,
  toChecksumAddress,
} from '../src/index.js'

import eip1014Testdata from './testdata/eip1014Examples.json'

const _0n = BigInt(0)

describe('Account', () => {
  it('empty constructor', () => {
    const account = new Account()
    assert.equal(account.nonce, _0n, 'should have zero nonce')
    assert.equal(account.balance, _0n, 'should have zero balance')
    assert.equal(
      bytesToHex(account.storageRoot),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have storageRoot equal to KECCAK256_RLP'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have codeHash equal to KECCAK256_NULL'
    )
  })

  it('from Array data', () => {
    const raw = [
      '0x02', // nonce
      '0x0384', // balance
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', // storageRoot
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', // codeHash
    ]
    const account = Account.fromValuesArray(raw.map((el) => hexStringToBytes(el)))

    assert.equal(account.nonce, BigInt(2), 'should have correct nonce')
    assert.equal(account.balance, BigInt(900), 'should have correct balance')
    assert.equal(
      bytesToHex(account.storageRoot),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })

  it('from Object data', () => {
    const raw = {
      nonce: '0x02',
      balance: '0x0384',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = Account.fromAccountData(raw)
    assert.equal(account.nonce, BigInt(2), 'should have correct nonce')
    assert.equal(account.balance, BigInt(900), 'should have correct balance')
    assert.equal(
      bytesToHex(account.storageRoot),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })

  it('from RLP data', () => {
    const accountRlp = hexToBytes(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    )
    const account = Account.fromRlpSerializedAccount(accountRlp)
    assert.equal(account.nonce, BigInt(2), 'should have correct nonce')
    assert.equal(account.balance, BigInt(900), 'should have correct balance')
    assert.equal(
      bytesToHex(account.storageRoot),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })

  it('serialize', () => {
    const raw = {
      nonce: '0x01',
      balance: '0x42',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = Account.fromAccountData(raw)
    const accountRlp = RLP.encode([raw.nonce, raw.balance, raw.storageRoot, raw.codeHash])

    assert.ok(equalsBytes(account.serialize(), accountRlp), 'should serialize correctly')
  })

  it('isContract', () => {
    const accountRlp = hexToBytes(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    )
    let account = Account.fromRlpSerializedAccount(accountRlp)
    assert.notOk(account.isContract(), 'should return false for a non-contract account')

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    account = Account.fromAccountData(raw)
    assert.ok(account.isContract(), 'should return true for a contract account')
  })

  it('isEmpty', () => {
    let account = new Account()
    assert.ok(account.isEmpty(), 'should return true for an empty account')

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
    }
    account = Account.fromAccountData(raw)
    assert.notOk(account.isEmpty(), 'should return false for a non-empty account')
  })

  it('validation', () => {
    assert.throws(
      () => {
        new Account(undefined, undefined, hexToBytes('hey'), undefined)
      },
      undefined,
      undefined,
      'should only accept length 32 buffer for storageRoot'
    )

    assert.throws(
      () => {
        new Account(undefined, undefined, undefined, hexToBytes('hey'))
      },
      undefined,
      undefined,
      'should only accept length 32 buffer for codeHash'
    )

    const data = { balance: BigInt(5) }
    assert.throws(
      () => {
        Account.fromRlpSerializedAccount(data as any)
      },
      undefined,
      undefined,
      'should only accept an array in fromRlpSerializedAccount'
    )

    assert.throws(
      () => {
        new Account(BigInt(-5))
      },
      undefined,
      undefined,
      'should not accept nonce less than 0'
    )

    assert.throws(
      () => {
        new Account(undefined, BigInt(-5))
      },
      undefined,
      undefined,
      'should not accept balance less than 0'
    )
  })
})

describe('Utility Functions', () => {
  it('isValidPrivate', () => {
    const SECP256K1_N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')

    let tmp = '0011223344'
    assert.notOk(isValidPrivate(hexToBytes(tmp)), 'should fail on short input')

    tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.notOk(isValidPrivate(hexToBytes(tmp)), 'should fail on too big input')

    assert.notOk(
      isValidPrivate((<unknown>'WRONG_INPUT_TYPE') as Uint8Array),
      'should fail on wrong input type'
    )

    tmp = '0000000000000000000000000000000000000000000000000000000000000000'
    assert.notOk(isValidPrivate(hexToBytes(tmp)), 'should fail on invalid curve (zero)')

    tmp = SECP256K1_N.toString(16)
    assert.notOk(isValidPrivate(hexToBytes(tmp)), 'should fail on invalid curve (== N)')

    tmp = (SECP256K1_N + BigInt(1)).toString(16)
    assert.notOk(isValidPrivate(hexToBytes(tmp)), 'should fail on invalid curve (>= N)')

    tmp = (SECP256K1_N - BigInt(1)).toString(16)
    assert.ok(isValidPrivate(hexToBytes(tmp)), 'should work otherwise (< N)')
  })

  it('isValidPublic', () => {
    let pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744'
    )
    assert.notOk(isValidPublic(pubKey), 'should fail on too short input')

    pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00'
    )
    assert.notOk(isValidPublic(pubKey), 'should fail on too big input')

    pubKey = hexToBytes(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.notOk(isValidPublic(pubKey), 'should fail on SEC1 key')

    pubKey = hexToBytes(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.ok(
      isValidPublic(pubKey, true),
      "shouldn't fail on SEC1 key wt.testh sant.testize enabled"
    )

    pubKey = hexToBytes(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.notOk(isValidPublic(pubKey), 'should fail wt.testh an invalid SEC1 public key')

    pubKey = hexToBytes('03fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
    assert.notOk(isValidPublic(pubKey), 'should fail an invalid 33-byte public key')

    pubKey = hexToBytes(
      'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f0000000000000000000000000000000000000000000000000000000000000001'
    )
    assert.notOk(isValidPublic(pubKey), 'should fail an invalid 64-byte public key')

    pubKey = hexToBytes(
      '04fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f0000000000000000000000000000000000000000000000000000000000000001'
    )
    assert.notOk(isValidPublic(pubKey, true), 'should fail an invalid 65-byte public key')

    pubKey = hexToBytes('033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a')
    assert.ok(
      isValidPublic(pubKey, true),
      'should work wt.testh compressed keys wt.testh sant.testize enabled'
    )

    pubKey = hexToBytes(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.ok(isValidPublic(pubKey, true), 'should work wt.testh sant.testize enabled')

    pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.ok(isValidPublic(pubKey), 'should work otherwise')

    pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    try {
      isValidPublic((<unknown>pubKey) as Uint8Array)
    } catch (err: any) {
      assert.ok(
        err.message.includes('This method only supports Uint8Array'),
        'should throw if input is not Uint8Array'
      )
    }
  })

  it('importPublic', () => {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'

    let tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.equal(
      bytesToHex(importPublic(hexToBytes(tmp))),
      pubKey,
      'should work wt.testh an Ethereum public key'
    )

    tmp =
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assert.equal(
      bytesToHex(importPublic(hexToBytes(tmp))),
      pubKey,
      'should work wt.testh uncompressed SEC1 keys'
    )

    tmp = '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a'
    assert.equal(
      bytesToHex(importPublic(hexToBytes(tmp))),
      pubKey,
      'should work wt.testh compressed SEC1 keys'
    )

    assert.throws(
      function () {
        importPublic((<unknown>pubKey) as Uint8Array)
      },
      undefined,
      undefined,
      'should throw if input is not Uint8Array'
    )
  })

  it('publicToAddress', () => {
    let pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    let address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    let r = publicToAddress(pubKey)
    assert.equal(bytesToHex(r), address, 'should produce an address given a public key')

    pubKey = hexToBytes(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    r = publicToAddress(pubKey, true)
    assert.equal(bytesToHex(r), address, 'should produce an address given a SEC1 public key')

    pubKey = hexToBytes(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    )
    assert.throws(
      function () {
        publicToAddress(pubKey, true)
      },
      undefined,
      undefined,
      "shouldn't produce an address given an invalid SEC1 public key"
    )

    pubKey = hexToBytes(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744'
    )
    assert.throws(
      function () {
        publicToAddress(pubKey)
      },
      undefined,
      undefined,
      "shouldn't produce an address given an invalid public key"
    )

    pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    assert.throws(
      function () {
        publicToAddress(pubKey)
      },
      undefined,
      undefined,
      'should throw if input is not a Uint8Array'
    )
  })

  it('privateToPublic', () => {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    let privateKey = hexToBytes('ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f')
    const r = privateToPublic(privateKey)
    assert.equal(bytesToHex(r), pubKey, 'should produce a public key given a private key')

    privateKey = hexToBytes('ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f2a')
    assert.throws(
      function () {
        privateToPublic(privateKey)
      },
      undefined,
      undefined,
      "shouldn't produce a public key given an invalid private key"
    )

    privateKey = hexToBytes('ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c')
    assert.throws(
      function () {
        privateToPublic(privateKey)
      },
      undefined,
      undefined,
      "shouldn't produce a public key given an invalid private key"
    )

    privateKey = '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f' as any
    try {
      privateToPublic((<unknown>privateKey) as Uint8Array)
    } catch (err: any) {
      assert.ok(
        err.message.includes('This method only supports Uint8Array'),
        'should throw if private key is not Uint8Array'
      )
      assert.ok(err.message.includes(privateKey), 'should throw if private key is not Uint8Array')
    }
  })

  it('privateToAddress', () => {
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = hexToBytes(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f'
    )
    const r = privateToAddress(privateKey)
    assert.equal(bytesToHex(r), address, 'should produce an address given a private key')
  })

  it('generateAddress', () => {
    const addr = generateAddress(
      utf8ToBytes('990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBytes(14)
    )
    assert.equal(
      bytesToHex(addr),
      '936a4295d8d74e310c0c95f0a63e53737b998d12',
      'should produce an address given a public key'
    )
  })

  it('generateAddress with hex prefix', () => {
    const addr = generateAddress(toBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'), toBytes(14))
    assert.equal(
      bytesToHex(addr),
      'd658a4b8247c14868f3c512fa5cbb6e458e4a989',
      'should produce an address given a public key'
    )
  })

  it('generateAddress wt.testh nonce 0 (special case)', () => {
    const addr = generateAddress(toBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'), toBytes(0))
    assert.equal(
      bytesToHex(addr),
      'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b',
      'should produce an address given a public key'
    )
  })

  it('generateAddress wt.testh non-buffer inputs', () => {
    assert.throws(
      function () {
        generateAddress(
          (<unknown>'0x990ccf8a0de58091c028d6ff76bb235ee67c1c39') as Uint8Array,
          toBytes(0)
        )
      },
      undefined,
      undefined,
      'should throw if address is not Uint8Array'
    )

    assert.throws(
      function () {
        generateAddress(
          toBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
          (<unknown>0) as Uint8Array
        )
      },
      undefined,
      undefined,
      'should throw if nonce is not Uint8Array'
    )
  })

  it('generateAddress2: EIP-1014 testdata examples', () => {
    for (const testdata of eip1014Testdata) {
      const { address, comment, result, salt, initCode } = testdata
      const addr = generateAddress2(toBytes(address), toBytes(salt), toBytes(initCode))
      assert.equal(
        '0x' + bytesToHex(addr),
        result,
        `${comment}: should generate the addresses provided`
      )
    }
  })

  it('generateAddress2: non-buffer inputs', () => {
    const { address, salt, initCode } = eip1014Testdata[0]

    assert.throws(
      function () {
        generateAddress2((<unknown>address) as Uint8Array, toBytes(salt), toBytes(initCode))
      },
      undefined,
      undefined,
      'should throw if address is not Uint8Array'
    )

    assert.throws(
      function () {
        generateAddress2(toBytes(address), (<unknown>salt) as Uint8Array, toBytes(initCode))
      },
      undefined,
      undefined,
      'should throw if salt is not Uint8Array'
    )

    assert.throws(
      function () {
        generateAddress2(toBytes(address), toBytes(salt), (<unknown>initCode) as Uint8Array)
      },
      undefined,
      undefined,
      'should throw if initCode is not Uint8Array'
    )
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

  it('toChecksumAddress()', () => {
    it('EIP55', () => {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        const tmp = eip55ChecksumAddresses[i]
        assert.equal(toChecksumAddress(tmp.toLowerCase()).toLowerCase(), tmp.toLowerCase())
      }
    })

    it('EIP1191', () => {
      it('Should encode the example addresses correctly', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            assert.equal(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
            assert.equal(
              toChecksumAddress(addr.toLowerCase(), hexToBytes(padToEven(chainId))).toLowerCase(),
              addr.toLowerCase()
            )
            assert.equal(
              toChecksumAddress(addr.toLowerCase(), BigInt(chainId)).toLowerCase(),
              addr.toLowerCase()
            )
            assert.equal(
              toChecksumAddress(addr.toLowerCase(), '0x' + padToEven(chainId)).toLowerCase(),
              addr.toLowerCase()
            )
          }
        }
      })
      it('Should encode large chain ids greater than MAX_INTEGER correctly', () => {
        const addr = '0x88021160C5C792225E4E5452585947470010289D'
        const chainIDBytes = hexToBytes('796f6c6f763378')
        assert.equal(toChecksumAddress(addr.toLowerCase(), chainIDBytes), addr)
        assert.equal(toChecksumAddress(addr.toLowerCase(), bytesToBigInt(chainIDBytes)), addr)
        assert.equal(
          toChecksumAddress(addr.toLowerCase(), bytesToPrefixedHexString(chainIDBytes)),
          addr
        )
      })
    })

    it('input format', () => {
      assert.throws(
        function () {
          toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
        },
        undefined,
        undefined,
        'Should throw when the address is not hex-prefixed'
      )

      assert.throws(
        function () {
          toChecksumAddress('0xde709f2102306220921060314715629080e2fb77', '1234')
        },
        undefined,
        undefined,
        'Should throw when the chainId is not hex-prefixed'
      )
    })
  })

  it('isValidChecksumAddress()', () => {
    it('EIP55', () => {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        assert.ok(isValidChecksumAddress(eip55ChecksumAddresses[i]))
      }
      assert.notOk(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
    })

    it('EIP1191', () => {
      it('Should return true for the example addresses', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            assert.ok(isValidChecksumAddress(addr, Number(chainId)))
            assert.ok(isValidChecksumAddress(addr, intToBytes(parseInt(chainId))))
            assert.ok(isValidChecksumAddress(addr, BigInt(chainId)))
            assert.ok(
              isValidChecksumAddress(
                addr,
                '0x' + padToEven(intToPrefixedHexString(parseInt(chainId)).slice(2))
              )
            )
          }
        }
      })

      it('Should return false for invalid cases', () => {
        // If we set the chain id, an EIP55 encoded address should be invalid
        for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
          assert.notOk(isValidChecksumAddress(eip55ChecksumAddresses[i], 1))
        }

        assert.notOk(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a', 1))
      })

      it('Should return false if the wrong chain id is used', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            assert.notOk(isValidChecksumAddress(addr, Number(chainId) + 1))
          }
        }
      })

      it('Should return false if input is not hex-prefixed', () => {
        assert.notOk(isValidChecksumAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      })
    })
  })

  it('isValidAddress()', () => {
    it('should return true', () => {
      assert.ok(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.ok(isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7'))
    })
    it('should return false', () => {
      assert.notOk(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6'))
      assert.notOk(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6aa'))
      assert.notOk(isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.notOk(isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.notOk(isValidAddress('0X52908400098527886E0F7030069857D2E4169EE7'))
    })
  })
})
