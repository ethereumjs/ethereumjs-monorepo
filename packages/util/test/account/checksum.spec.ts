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

describe('[Util/Account]: checksum addresses', () => {
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

  const eip1191ChecksumAddresses = {
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

  describe('toChecksumAddress', () => {
    it('toChecksumAddress() matches EIP-55 vectors', () => {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        const tmp = eip55ChecksumAddresses[i]
        assert.strictEqual(toChecksumAddress(tmp.toLowerCase()).toLowerCase(), tmp.toLowerCase())
      }
    })

    describe('EIP1191', () => {
      it('toChecksumAddress() matches EIP-1191 vectors per chainId', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksumAddresses)) {
          for (const addr of addresses) {
            assert.strictEqual(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
            assert.strictEqual(
              toChecksumAddress(
                addr.toLowerCase(),
                hexToBytes(`0x${padToEven(chainId)}`),
              ).toLowerCase(),
              addr.toLowerCase(),
            )
            assert.strictEqual(
              toChecksumAddress(addr.toLowerCase(), BigInt(chainId)).toLowerCase(),
              addr.toLowerCase(),
            )
            assert.strictEqual(
              toChecksumAddress(addr.toLowerCase(), `0x${padToEven(chainId)}`).toLowerCase(),
              addr.toLowerCase(),
            )
          }
        }
      })
      it('toChecksumAddress() accepts large chainId encodings', () => {
        const addr = '0x88021160C5C792225E4E5452585947470010289D'
        const chainIDBytes = hexToBytes('0x796f6c6f763378')
        assert.strictEqual(toChecksumAddress(addr.toLowerCase(), chainIDBytes), addr)
        assert.strictEqual(toChecksumAddress(addr.toLowerCase(), bytesToBigInt(chainIDBytes)), addr)
        assert.strictEqual(toChecksumAddress(addr.toLowerCase(), bytesToHex(chainIDBytes)), addr)
      })
    })

    it('toChecksumAddress() rejects non-prefixed address or chainId', () => {
      assert.throws(
        function () {
          toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
        },
        undefined,
        undefined,
        'Should throw when the address is not hex-prefixed',
      )

      assert.throws(
        function () {
          toChecksumAddress('0xde709f2102306220921060314715629080e2fb77', '1234' as any)
        },
        undefined,
        undefined,
        'Should throw when the chainId is not hex-prefixed',
      )
    })
  })

  describe('isValidChecksumAddress', () => {
    it('isValidChecksumAddress() accepts EIP-55 checksums', () => {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        assert.isTrue(isValidChecksumAddress(eip55ChecksumAddresses[i]))
      }
      assert.isFalse(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
    })

    describe('EIP1191', () => {
      it('isValidChecksumAddress() accepts EIP-1191 checksums', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksumAddresses)) {
          for (const addr of addresses) {
            assert.isTrue(isValidChecksumAddress(addr, Number(chainId)))
            assert.isTrue(isValidChecksumAddress(addr, intToBytes(parseInt(chainId))))
            assert.isTrue(isValidChecksumAddress(addr, BigInt(chainId)))
            assert.isTrue(
              isValidChecksumAddress(addr, `0x${padToEven(intToHex(parseInt(chainId)).slice(2))}`),
            )
          }
        }
      })

      it('isValidChecksumAddress() rejects EIP-55 when chainId is set', () => {
        // If we set the chain id, an EIP55 encoded address should be invalid
        for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
          assert.isFalse(isValidChecksumAddress(eip55ChecksumAddresses[i], 1))
        }

        assert.isFalse(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a', 1))
      })

      it('isValidChecksumAddress() rejects wrong chainId', () => {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksumAddresses)) {
          for (const addr of addresses) {
            assert.isFalse(isValidChecksumAddress(addr, Number(chainId) + 1))
          }
        }
      })

      it('isValidChecksumAddress() rejects non-prefixed address', () => {
        assert.isFalse(isValidChecksumAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      })
    })
  })

  describe('isValidAddress', () => {
    it('isValidAddress() accepts valid 20-byte hex addresses', () => {
      assert.isTrue(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.isTrue(isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7'))
    })
    it('isValidAddress() rejects malformed addresses', () => {
      assert.isFalse(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6'))
      assert.isFalse(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6aa'))
      assert.isFalse(isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.isFalse(isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      assert.isFalse(isValidAddress('0X52908400098527886E0F7030069857D2E4169EE7'))
    })
  })
})
