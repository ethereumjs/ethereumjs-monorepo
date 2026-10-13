import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import {
  Account,
  KECCAK256_NULL,
  KECCAK256_RLP,
  Units,
  accountBodyFromSlim,
  accountBodyToRLP,
  accountBodyToSlim,
  bigIntToBytes,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  createAccount,
  createAccountFromBytesArray,
  createAccountFromRLP,
  createPartialAccount,
  createPartialAccountFromRLP,
  equalsBytes,
  generateAddress,
  generateAddress2,
  hexToBytes,
  importPublic,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isValidAddress,
  isValidChecksumAddress,
  isValidPrivate,
  isValidPublic,
  padToEven,
  privateToAddress,
  privateToPublic,
  publicToAddress,
  toChecksumAddress,
  utf8ToBytes,
} from '../../src/index.ts'

import { eip1404ExamplesData } from '../testdata/eip1014Examples.ts'

describe('[Util/Account]: private key validation', () => {
  it('isValidPrivate() accepts valid keys and rejects invalid', () => {
    const SECP256K1_N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')

    assert.isFalse(isValidPrivate(hexToBytes('0x0011223344')), 'should fail on short input')

    assert.isFalse(
      isValidPrivate(
        hexToBytes(
          '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
        ),
      ),
      'should fail on too big input',
    )

    assert.isFalse(
      // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
      isValidPrivate((<unknown>'WRONG_INPUT_TYPE') as Uint8Array),
      'should fail on wrong input type',
    )

    assert.isFalse(
      isValidPrivate(
        hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
      ),
      'should fail on invalid curve (zero)',
    )

    assert.isFalse(
      isValidPrivate(hexToBytes(`0x${SECP256K1_N.toString(16)}`)),
      'should fail on invalid curve (== N)',
    )

    assert.isFalse(
      isValidPrivate(hexToBytes(`0x${(SECP256K1_N + BigInt(1)).toString(16)}`)),
      'should fail on invalid curve (>= N)',
    )

    assert.isTrue(
      isValidPrivate(hexToBytes(`0x${(SECP256K1_N - BigInt(1)).toString(16)}`)),
      'should work otherwise (< N)',
    )
  })
})

describe('[Util/Account]: public key validation', () => {
  it('isValidPublic() validates length curve and SEC1', () => {
    let pubKey = hexToBytes(
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
    )
    assert.isFalse(isValidPublic(pubKey), 'should fail on too short input')

    pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    assert.throws(() => isValidPublic(pubKey as Uint8Array), /This method only supports Uint8Array/)
  })
})

describe('[Util/Account]: importPublic', () => {
  it('importPublic() normalizes SEC1 and Ethereum keys', () => {
    const pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'

    assert.strictEqual(
      bytesToHex(
        importPublic(
          hexToBytes(
            '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
          ),
        ),
      ),
      pubKey,
      'should work wt.testh an Ethereum public key', // cspell:disable-line
    )

    assert.strictEqual(
      bytesToHex(
        importPublic(
          hexToBytes(
            '0x043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
          ),
        ),
      ),
      pubKey,
      'should work wt.testh uncompressed SEC1 keys', // cspell:disable-line
    )

    assert.strictEqual(
      bytesToHex(
        importPublic(
          hexToBytes('0x033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a'),
        ),
      ),
      pubKey,
      'should work wt.testh compressed SEC1 keys', // cspell:disable-line
    )

    assert.throws(
      function () {
        importPublic(pubKey as unknown as Uint8Array)
      },
      undefined,
      undefined,
      'should throw if input is not Uint8Array',
    )
  })
})

describe('[Util/Account]: publicToAddress', () => {
  it('publicToAddress() derives address from public key', () => {
    let pubKey = hexToBytes(
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
    )
    let address = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    let r = publicToAddress(pubKey)
    assert.strictEqual(bytesToHex(r), address, 'should produce an address given a public key')

    pubKey = hexToBytes(
      '0x043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
    )
    address = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    r = publicToAddress(pubKey, true)
    assert.strictEqual(bytesToHex(r), address, 'should produce an address given a SEC1 public key')

    pubKey = hexToBytes(
      '0x023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
    )
    assert.throws(
      function () {
        publicToAddress(pubKey, true)
      },
      undefined,
      undefined,
      "shouldn't produce an address given an invalid SEC1 public key",
    )

    pubKey = hexToBytes(
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
    )
    assert.throws(
      function () {
        publicToAddress(pubKey)
      },
      undefined,
      undefined,
      "shouldn't produce an address given an invalid public key",
    )

    pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    assert.throws(
      function () {
        publicToAddress(pubKey)
      },
      undefined,
      undefined,
      'should throw if input is not a Uint8Array',
    )
  })
})

describe('[Util/Account]: privateToPublic', () => {
  it('privateToPublic() derives public key from private key', () => {
    const pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    let privateKey = hexToBytes(
      '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
    )
    const r = privateToPublic(privateKey)
    assert.strictEqual(bytesToHex(r), pubKey, 'should produce a public key given a private key')

    privateKey = hexToBytes('0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f2a')
    assert.throws(
      function () {
        privateToPublic(privateKey)
      },
      undefined,
      undefined,
      "shouldn't produce a public key given an invalid private key",
    )

    privateKey = hexToBytes('0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c')
    assert.throws(
      function () {
        privateToPublic(privateKey)
      },
      undefined,
      undefined,
      "shouldn't produce a public key given an invalid private key",
    )

    privateKey = '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f' as any
    assert.throws(
      () => privateToPublic(privateKey as Uint8Array),
      /This method only supports Uint8Array/,
    )
  })
})

describe('[Util/Account]: privateToAddress', () => {
  it('privateToAddress() derives address from private key', () => {
    const address = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = hexToBytes(
      '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
    )
    const r = privateToAddress(privateKey)
    assert.strictEqual(bytesToHex(r), address, 'should produce an address given a private key')
  })
})
