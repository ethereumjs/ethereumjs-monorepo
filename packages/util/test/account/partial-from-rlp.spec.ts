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

describe('[Util/Account]: createPartialAccountFromRLP', () => {
  it('createPartialAccountFromRLP() rejects non-array RLP input', () => {
    const invalidSerialized = bigIntToBytes(1n)
    assert.throws(
      () => createPartialAccountFromRLP(invalidSerialized),
      /Invalid serialized account input/,
    )
  })

  const testCases = [
    {
      description: 'should handle a mix of null and non-null values correctly',
      data: [
        [intToBytes(1), intToBytes(1)], // Nonce: 1
        [intToBytes(0)], // Balance: null
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(0)], // CodeHash: null
        [intToBytes(1), intToBytes(10)], // CodeSize: 10
        [intToBytes(0)], // Version: null
      ],
      shouldThrow: false,
      expected: new Account(BigInt(1), null, KECCAK256_RLP, null, 10, null),
      errorRegex: null,
    },
    {
      description: 'should throw when all fields are null',
      data: [
        [intToBytes(0)], // Nonce: null
        [intToBytes(0)], // Balance: null
        [intToBytes(0)], // StorageRoot: null
        [intToBytes(0)], // CodeHash: null
        [intToBytes(0)], // CodeSize: null
        [intToBytes(0)], // Version: null
      ],
      shouldThrow: true,
      expected: null,
      errorRegex: /All partial fields null/,
    },
    {
      description: 'should handle all non-null fields correctly',
      data: [
        [intToBytes(1), intToBytes(2)], // Nonce: 2
        [intToBytes(1), intToBytes(1000)], // Balance: 1000
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(1), KECCAK256_RLP], // CodeHash: KECCAK256_RLP
        [intToBytes(1), intToBytes(50)], // CodeSize: 50
        [intToBytes(1), intToBytes(1)], // Version: 1
      ],
      shouldThrow: false,
      expected: new Account(BigInt(2), BigInt(1000), KECCAK256_RLP, KECCAK256_RLP, 50, 1),
      errorRegex: null,
    },
    {
      description:
        'should return partial account with non-null fields when isNotNullIndicator is 1',
      data: [
        [intToBytes(1), intToBytes(2)], // Nonce: 2
        [intToBytes(1), intToBytes(1000)], // Balance: 1000
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(1), KECCAK256_RLP], // CodeHash: KECCAK256_RLP
        [intToBytes(1), intToBytes(50)], // CodeSize: 50
        [intToBytes(1), intToBytes(1)], // Version: 1
      ],
      shouldThrow: false,
      expected: new Account(BigInt(2), BigInt(1000), KECCAK256_RLP, KECCAK256_RLP, 50, 1),
      errorRegex: null,
    },
    {
      description: 'should return a mix of null and non-null fields based on isNotNullIndicator',
      data: [
        [intToBytes(1), intToBytes(2)], // Nonce: 2
        [intToBytes(0)], // Balance: null
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(0)], // CodeHash: null
        [intToBytes(1), intToBytes(50)], // CodeSize: 50
        [intToBytes(0)], // Version: null
      ],
      shouldThrow: false,
      expected: new Account(BigInt(2), null, KECCAK256_RLP, null, 50, null),
      errorRegex: null,
    },
    {
      description:
        'should handle cases where some fields are non-null and others are null correctly',
      data: [
        [intToBytes(1), intToBytes(2)], // Nonce: 2
        [intToBytes(0)], // Balance: null
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(1), KECCAK256_RLP], // CodeHash: KECCAK256_RLP
        [intToBytes(0)], // CodeSize: null
        [intToBytes(0)], // Version: null
      ],
      shouldThrow: false,
      expected: new Account(BigInt(2), null, KECCAK256_RLP, KECCAK256_RLP, null, null),
      errorRegex: null,
    },
    {
      description: 'should handle fields with empty arrays (isNullIndicator=0) correctly',
      data: [
        [], // nonce -> empty array => null
        [intToBytes(1), intToBytes(1000)], // balance: 1000
        [], // storageRoot -> null
        [], // codeHash -> null
        [], // codeSize -> null
        [], // version -> null
      ],
      shouldThrow: false,
      expected: new Account(null, BigInt(1000), null, null, null, null),
      errorRegex: null,
    },
    {
      description: 'should throw: invalid partial nonce encoding',
      data: [KECCAK256_RLP, [], [], [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid partial balance encoding',
      data: [[], KECCAK256_RLP, [], [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid partial storageRoot encoding',
      data: [[], [], KECCAK256_RLP, [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid partial codeHash encoding',
      data: [[], [], [], KECCAK256_RLP, [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid partial codeSize encoding',
      data: [[], [], [], [], KECCAK256_RLP, []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid partial version encoding',
      data: [[], [], [], [], [], KECCAK256_RLP],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid partial encoding. Each item must be an array/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for nonce',
      data: [[intToBytes(2)], [], [], [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for balance',
      data: [[], [intToBytes(2)], [], [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for storageRoot',
      data: [[], [], [intToBytes(2)], [], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for codeHash',
      data: [[], [], [], [intToBytes(2)], [], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for codeSize',
      data: [[], [], [], [], [intToBytes(2)], []],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
    {
      description: 'should throw: invalid isNullIndicator=2 for version',
      data: [[], [], [], [], [], [intToBytes(2)]],
      shouldThrow: true,
      expected: null,
      errorRegex: /Invalid isNullIndicator=2/,
    },
  ]

  for (const { description, data, shouldThrow, expected, errorRegex } of testCases) {
    it(description, () => {
      const serialized = RLP.encode(data)
      if (shouldThrow) {
        assert.throws(() => createPartialAccountFromRLP(serialized), errorRegex as RegExp)
      } else {
        const account = createPartialAccountFromRLP(serialized)
        assert.deepEqual(account, expected)
      }
    })
  }
})
