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

import type { PrefixedHexString } from '../../src/index.ts'

describe('[Util/Account]: generateAddress', () => {
  it('generateAddress() derives CREATE address', () => {
    const addr = generateAddress(
      utf8ToBytes('990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      intToBytes(14),
    )
    assert.strictEqual(
      bytesToHex(addr),
      '0x936a4295d8d74e310c0c95f0a63e53737b998d12',
      'should produce an address given a public key',
    )
  })

  it('generateAddress() accepts hex-prefixed sender bytes', () => {
    const addr = generateAddress(
      hexToBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      intToBytes(14),
    )
    assert.strictEqual(
      bytesToHex(addr),
      '0xd658a4b8247c14868f3c512fa5cbb6e458e4a989',
      'should produce an address given a public key',
    )
  })

  // cspell:disable
  it('generateAddress() uses RLP null for nonce zero', () => {
    // cspell:enable
    const addr = generateAddress(
      hexToBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      intToBytes(0),
    )
    assert.strictEqual(
      bytesToHex(addr),
      '0xbfa69ba91385206bfdd2d8b9c1a5d6c10097a85b',
      'should produce an address given a public key',
    )
  })

  // cspell:disable
  it('generateAddress() rejects non-Uint8Array sender or nonce', () => {
    // cspell:enable
    assert.throws(
      function () {
        generateAddress(
          // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
          (<unknown>'0x990ccf8a0de58091c028d6ff76bb235ee67c1c39') as Uint8Array,
          intToBytes(0),
        )
      },
      undefined,
      undefined,
      'should throw if address is not Uint8Array',
    )

    assert.throws(
      function () {
        generateAddress(
          hexToBytes('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
          // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
          (<unknown>0) as Uint8Array,
        )
      },
      undefined,
      undefined,
      'should throw if nonce is not Uint8Array',
    )
  })

  it('generateAddress2() matches EIP-1014 vectors', () => {
    for (const testdata of eip1404ExamplesData) {
      const { address, comment, result, salt, initCode } = testdata
      const addr = generateAddress2(
        hexToBytes(address as PrefixedHexString),
        hexToBytes(salt as PrefixedHexString),
        hexToBytes(initCode as PrefixedHexString),
      )
      assert.strictEqual(
        bytesToHex(addr),
        result,
        `${comment}: should generate the addresses provided`,
      )
    }
  })

  it('generateAddress2() rejects non-Uint8Array arguments', () => {
    const { address, salt, initCode } = eip1404ExamplesData[0]

    assert.throws(
      function () {
        generateAddress2(
          address as unknown as Uint8Array,
          hexToBytes(salt as PrefixedHexString),
          hexToBytes(initCode as PrefixedHexString),
        )
      },
      undefined,
      undefined,
      'should throw if address is not Uint8Array',
    )

    assert.throws(
      function () {
        generateAddress2(
          hexToBytes(address as PrefixedHexString),
          salt as unknown as Uint8Array,
          hexToBytes(initCode as PrefixedHexString),
        )
      },
      undefined,
      undefined,
      'should throw if salt is not Uint8Array',
    )

    assert.throws(
      function () {
        generateAddress2(
          hexToBytes(address as PrefixedHexString),
          hexToBytes(salt as PrefixedHexString),
          initCode as unknown as Uint8Array,
        )
      },
      undefined,
      undefined,
      'should throw if initCode is not Uint8Array',
    )
  })
})
