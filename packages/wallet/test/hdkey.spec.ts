import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EthereumHDKey } from '../src/hdkey.ts'

// from BIP39 mnemonic: awake book subject inch gentle blur grant damage process float month clown
const fixtureseed = hexToBytes(
  '0x747f302d9c916698912d5f70be53a6cf53bc495803a5523d3a7c3afa2afba94ec3803f838b3e1929ab5481f9da35441372283690fdcf27372c38f40ba134fe03',
)
const fixturehd = EthereumHDKey.fromMasterSeed(fixtureseed)
const fixtureMnemonic = 'awake book subject inch gentle blur grant damage process float month clown'
const fixtureAddress = '0x4dcccf58c6573eb896250b0c9647a40c1673af44'
const fixturePrivateKey = '0xf62a8ea4ab7025d151ccd84981c66278d0d3cd58ff837467cdc51229915a22d1'
describe('HD Key tests', () => {
  it('.fromMasterSeed()', () => {
    assert.doesNotThrow(function () {
      EthereumHDKey.fromMasterSeed(fixtureseed)
    })
  }, 30000)

  it('.fromMnemonic()', () => {
    const path = "m/44'/60'/0'/0/0"
    const hdWallet = EthereumHDKey.fromMnemonic(fixtureMnemonic)
    const wallet = hdWallet.derivePath(path).getWallet()

    assert.strictEqual(wallet.getPrivateKeyString(), fixturePrivateKey)
    assert.strictEqual(wallet.getAddressString(), fixtureAddress)
  }, 30000)

  it('.privateExtendedKey()', () => {
    assert.deepEqual(
      fixturehd.privateExtendedKey(),
      'xprv9s21ZrQH143K4KqQx9Zrf1eN8EaPQVFxM2Ast8mdHn7GKiDWzNEyNdduJhWXToy8MpkGcKjxeFWd8oBSvsz4PCYamxR7TX49pSpp3bmHVAY',
    )
  }, 30000)

  it('.publicExtendedKey()', () => {
    assert.deepEqual(
      fixturehd.publicExtendedKey(),
      'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ',
    )
  }, 30000)

  it('.fromExtendedKey()', () => {
    const onlyPublicExtendedKey = EthereumHDKey.fromExtendedKey(
      'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ',
    )
    assert.deepEqual(
      onlyPublicExtendedKey.publicExtendedKey(),
      'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ',
    )
    assert.throws(
      function () {
        onlyPublicExtendedKey.privateExtendedKey()
      },
      /^No private key$/,
      'throws when trying to access private extended key with no private key provided',
    )
    const fullExtendedKey = EthereumHDKey.fromExtendedKey(
      'xprv9s21ZrQH143K4KqQx9Zrf1eN8EaPQVFxM2Ast8mdHn7GKiDWzNEyNdduJhWXToy8MpkGcKjxeFWd8oBSvsz4PCYamxR7TX49pSpp3bmHVAY',
    )
    assert.deepEqual(
      fullExtendedKey.publicExtendedKey(),
      'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ',
      'successfully generated key from extended private key',
    )
    assert.deepEqual(
      fullExtendedKey.privateExtendedKey(),
      'xprv9s21ZrQH143K4KqQx9Zrf1eN8EaPQVFxM2Ast8mdHn7GKiDWzNEyNdduJhWXToy8MpkGcKjxeFWd8oBSvsz4PCYamxR7TX49pSpp3bmHVAY',
      'successfully generated key from extended private key',
    )
  }, 30000)

  it('.deriveChild()', () => {
    const hdnode = fixturehd.deriveChild(1)
    assert.deepEqual(
      hdnode.privateExtendedKey(),
      'xprv9vYSvrg3eR5FaKbQE4Ao2vHdyvfFL27aWMyH6X818mKWMsqqQZAN6HmRqYDGDPLArzaqbLExRsxFwtx2B2X2QKkC9uoKsiBNi22tLPKZHNS',
    )
  }, 30000)

  it('.derivePath()', () => {
    const hdnode1 = fixturehd.derivePath('m')
    assert.deepEqual(
      hdnode1.privateExtendedKey(),
      'xprv9s21ZrQH143K4KqQx9Zrf1eN8EaPQVFxM2Ast8mdHn7GKiDWzNEyNdduJhWXToy8MpkGcKjxeFWd8oBSvsz4PCYamxR7TX49pSpp3bmHVAY',
      'should work with m',
    )
    const hdnode2 = fixturehd.derivePath("m/44'/0'/0/1")
    assert.deepEqual(
      hdnode2.privateExtendedKey(),
      'xprvA1ErCzsuXhpB8iDTsbmgpkA2P8ggu97hMZbAXTZCdGYeaUrDhyR8fEw47BNEgLExsWCVzFYuGyeDZJLiFJ9kwBzGojQ6NB718tjVJrVBSrG',
      "should work with m/44'/0'/0/1",
    )
  }, 30000)

  it('.getWallet()', () => {
    assert.deepEqual(
      fixturehd.getWallet().getPrivateKeyString(),
      '0x26cc9417b89cd77c4acdbe2e3cd286070a015d8e380f9cd1244ae103b7d89d81',
    )
    assert.deepEqual(
      fixturehd.getWallet().getPublicKeyString(),
      '0x0639797f6cc72aea0f3d309730844a9e67d9f1866e55845c5f7e0ab48402973defa5cb69df462bcc6d73c31e1c663c225650e80ef14a507b203f2a12aea55bc1',
    )
    const hdnode = EthereumHDKey.fromExtendedKey(
      'xpub661MyMwAqRbcGout4B6s29b6gGQsowyoiF6UgXBEr7eFCWYfXuZDvRxP9zEh1Kwq3TLqDQMbkbaRpSnoC28oWvjLeshoQz1StZ9YHM1EpcJ',
    )
    assert.throws(function () {
      hdnode.getWallet().getPrivateKeyString()
    }, /^This is a public key only wallet$/)
    assert.deepEqual(
      hdnode.getWallet().getPublicKeyString(),
      '0x0639797f6cc72aea0f3d309730844a9e67d9f1866e55845c5f7e0ab48402973defa5cb69df462bcc6d73c31e1c663c225650e80ef14a507b203f2a12aea55bc1',
      'should work with public nodes',
    )
  }, 30000)
})
