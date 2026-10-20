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

describe('[Util/Account]: serializeWithPartialInfo', () => {
  const testCases = [
    {
      description: 'should serialize all fields as null (isNotNullIndicator=0)',
      account: new Account(null, null, null, null, null, null),
      expectedDecoded: [
        [new Uint8Array()], // Nonce: null
        [new Uint8Array()], // Balance: null
        [new Uint8Array()], // StorageRoot: null
        [new Uint8Array()], // CodeHash: null
        [new Uint8Array()], // CodeSize: null
        [new Uint8Array()], // Version: null
      ],
    },
    {
      description: 'should serialize all fields as non-null (isNotNullIndicator=1)',
      account: new Account(BigInt(2), Units.ether(1), KECCAK256_RLP, KECCAK256_RLP, 50, 1),
      expectedDecoded: [
        [intToBytes(1), bigIntToUnpaddedBytes(BigInt(2))], // Nonce: 2
        [intToBytes(1), bigIntToUnpaddedBytes(Units.ether(1))], // Balance: 1000
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(1), KECCAK256_RLP], // CodeHash: KECCAK256_RLP
        [intToBytes(1), intToUnpaddedBytes(50)], // CodeSize: 50
        [intToBytes(1), intToUnpaddedBytes(1)], // Version: 1
      ],
    },
    {
      description: 'should serialize mixed null and non-null fields',
      account: new Account(BigInt(2), null, KECCAK256_RLP, null, 50, null),
      expectedDecoded: [
        [intToBytes(1), bigIntToUnpaddedBytes(BigInt(2))], // Nonce: 2
        [new Uint8Array()], // Balance: null
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [new Uint8Array()], // CodeHash: null
        [intToBytes(1), intToUnpaddedBytes(50)], // CodeSize: 50
        [new Uint8Array()], // Version: null
      ],
    },
    {
      description:
        'should correctly handle serialization of null hash for storageRoot and codeHash',
      account: new Account(BigInt(2), Units.ether(1), KECCAK256_RLP, KECCAK256_RLP, 50, 1),
      expectedDecoded: [
        [intToBytes(1), bigIntToUnpaddedBytes(BigInt(2))], // Nonce: 2
        [intToBytes(1), bigIntToUnpaddedBytes(Units.ether(1))], // Balance: 1000
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [intToBytes(1), KECCAK256_RLP], // CodeHash: KECCAK256_RLP
        [intToBytes(1), intToUnpaddedBytes(50)], // CodeSize: 50
        [intToBytes(1), intToUnpaddedBytes(1)], // Version: 1
      ],
    },
    {
      description: 'should correctly serialize when only some fields are provided',
      account: new Account(BigInt(123), null, KECCAK256_RLP, null, null, 42),
      expectedDecoded: [
        [intToBytes(1), bigIntToUnpaddedBytes(BigInt(123))], // Nonce: 123
        [new Uint8Array()], // Balance: null
        [intToBytes(1), KECCAK256_RLP], // StorageRoot: KECCAK256_RLP
        [new Uint8Array()], // CodeHash: null
        [new Uint8Array()], // CodeSize: null
        [intToBytes(1), intToUnpaddedBytes(42)], // Version: 42
      ],
    },
  ]

  for (const { description, account, expectedDecoded } of testCases) {
    it(description, () => {
      const serialized = account.serializeWithPartialInfo()
      const decoded = RLP.decode(serialized)
      assert.deepEqual(decoded, expectedDecoded)
    })
  }

  it('serializeWithPartialInfo() round-trips through createPartialAccountFromRLP', () => {
    const account = new Account(BigInt(2), Units.ether(1), KECCAK256_RLP, KECCAK256_RLP, 50, 1)
    const serialized = account.serializeWithPartialInfo()

    // Now deserialize the serialized data back into a partial account
    const deserializedAccount = createPartialAccountFromRLP(serialized)

    assert.deepEqual(deserializedAccount, account)
  })
})
