import { assert, describe, it } from 'vitest'

import { RLP } from '@ethereumjs/rlp'
import {
  type BALJSONBlockAccessList,
  BlockLevelAccessList,
  createBlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
  createBlockLevelAccessListFromRLP,
} from '../src/bal.ts'
import { bytesToHex, hexToBytes } from '../src/bytes.ts'
import { KECCAK256_RLP_ARRAY_S, SYSTEM_ADDRESS } from '../src/constants.ts'
import type { PrefixedHexString } from '../src/types.ts'
import bal_all_transaction_types from './testdata/bal/bal_all_transaction_types.json' with {
  type: 'json',
}
import {
  balAllTransactionTypes,
  balAllTransactionTypesHash,
  balAllTransactionTypesRLP,
} from './testdata/bal/bal_all_transaction_types.ts'
import bal_empty_block_no_coinbase from './testdata/bal/bal_empty_block_no_coinbase.json' with {
  type: 'json',
}
import {
  balEmptyBlockNoCoinbase,
  balEmptyBlockNoCoinbaseHash,
  balEmptyBlockNoCoinbaseRLP,
} from './testdata/bal/bal_empty_block_no_coinbase.ts'
import bal_simple from './testdata/bal/bal_simple.json' with { type: 'json' }
import { balSimple, balSimpleHash, balSimpleRLP } from './testdata/bal/bal_simple.ts'

describe('Basic initialization', () => {
  it('should create an empty access list', () => {
    const bal = createBlockLevelAccessList()
    assert.isNotNull(bal)
  })

  it('should create an access list from Accesses data', () => {
    const bal = new BlockLevelAccessList(balSimple)
    assert.isNotNull(bal)
    assert.deepEqual(bal.accesses, balSimple)

    // Verify some specific data was loaded correctly
    const address1 = '0x00000961ef480eb55e80d19ad83579a64c007002'
    assert.equal(bal.accesses[address1].storageReads.size, 4)
    assert.isTrue(bal.accesses[address1].storageReads.has('0x00'))

    const addressWithBalanceChanges = '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba'
    assert.equal(bal.accesses[addressWithBalanceChanges].balanceChanges.size, 2)
    assert.deepEqual(bal.accesses[addressWithBalanceChanges].balanceChanges.get(1), '0xf618')

    assert.deepEqual(bytesToHex(bal.hash()), balSimpleHash)
  })

  it('hashes and RLP should match', () => {
    let bal = new BlockLevelAccessList()
    assert.deepEqual(bytesToHex(bal.hash()), KECCAK256_RLP_ARRAY_S)

    bal = new BlockLevelAccessList(balSimple)
    assert.deepEqual(bytesToHex(bal.serialize()), balSimpleRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balSimpleHash)

    bal = new BlockLevelAccessList(balEmptyBlockNoCoinbase)
    assert.deepEqual(bytesToHex(bal.serialize()), balEmptyBlockNoCoinbaseRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balEmptyBlockNoCoinbaseHash)

    bal = new BlockLevelAccessList(balAllTransactionTypes)
    assert.deepEqual(bytesToHex(bal.serialize()), balAllTransactionTypesRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balAllTransactionTypesHash)
  })
})

describe('JSON', () => {
  it('should convert to JSON', () => {
    const bal = createBlockLevelAccessListFromJSON(
      bal_all_transaction_types as BALJSONBlockAccessList,
    )
    assert.isNotNull(bal)
  })

  it('should map JSON fields to internal types', () => {
    const bal = createBlockLevelAccessListFromJSON(
      bal_all_transaction_types as BALJSONBlockAccessList,
    )
    const addressWithReads = bal_all_transaction_types[0].address as PrefixedHexString
    for (const read of bal_all_transaction_types[0].storageReads) {
      assert.isTrue(bal.accesses[addressWithReads].storageReads.has(read as PrefixedHexString))
    }

    const addressWithStorageWrite = bal_all_transaction_types[2].address as PrefixedHexString
    for (const write of bal_all_transaction_types[2].storageChanges) {
      const storageWrite =
        bal.accesses[addressWithStorageWrite].storageChanges[write.slot as PrefixedHexString][0]
      assert.deepEqual(storageWrite[0], parseInt(write.slotChanges[0].blockAccessIndex, 16))
      assert.equal(bytesToHex(storageWrite[1]), write.slotChanges[0].postValue)
    }

    const addressWithCodeChange = bal_all_transaction_types[3].address as PrefixedHexString
    for (const codeChange of bal_all_transaction_types[3].codeChanges) {
      const codeChangeData = bal.accesses[addressWithCodeChange].codeChanges[0]
      assert.deepEqual(codeChangeData[0], parseInt(codeChange.blockAccessIndex, 16))
      assert.equal(codeChangeData[1].length > 0, true)
      assert.equal(bytesToHex(codeChangeData[1]), codeChange.newCode)
    }
  })

  it('Creating from JSON should do the full round trip', () => {
    let bal = createBlockLevelAccessListFromJSON(
      bal_empty_block_no_coinbase as BALJSONBlockAccessList,
    )
    assert.isNotNull(bal)
    assert.deepEqual(bal.accesses, balEmptyBlockNoCoinbase)
    assert.deepEqual(bytesToHex(bal.serialize()), balEmptyBlockNoCoinbaseRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balEmptyBlockNoCoinbaseHash)

    bal = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    assert.isNotNull(bal)
    assert.deepEqual(bal.accesses, balSimple)
    assert.deepEqual(bytesToHex(bal.serialize()), balSimpleRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balSimpleHash)

    bal = createBlockLevelAccessListFromJSON(bal_all_transaction_types as BALJSONBlockAccessList)
    assert.isNotNull(bal)
    assert.deepEqual(bal.accesses, balAllTransactionTypes)
    assert.deepEqual(bytesToHex(bal.serialize()), balAllTransactionTypesRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balAllTransactionTypesHash)
  })

  it('should canonically serialize quantity-like storage slots and values from JSON', () => {
    const bal = createBlockLevelAccessListFromJSON([
      {
        address: '0x0000000000000000000000000000000000000001',
        nonceChanges: [],
        balanceChanges: [],
        codeChanges: [],
        storageChanges: [
          {
            slot: '0x0001',
            slotChanges: [
              {
                blockAccessIndex: '0x0',
                postValue: '0x0',
              },
              {
                blockAccessIndex: '0x1',
                postValue: '0x0002',
              },
            ],
          },
        ],
        storageReads: ['0x0', '0x0003'],
      },
    ] satisfies BALJSONBlockAccessList)

    const expected = RLP.encode([
      [
        hexToBytes('0x0000000000000000000000000000000000000001'),
        [
          [
            hexToBytes('0x01'),
            [
              [0, new Uint8Array([])],
              [1, hexToBytes('0x02')],
            ],
          ],
        ],
        [new Uint8Array([]), hexToBytes('0x03')],
        [],
        [],
        [],
      ],
    ])

    assert.deepEqual(bytesToHex(bal.serialize()), bytesToHex(expected))
  })

  it('should omit an empty system address entry when serializing', () => {
    const bal = createBlockLevelAccessListFromJSON([
      {
        address: SYSTEM_ADDRESS,
        nonceChanges: [],
        balanceChanges: [],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ] satisfies BALJSONBlockAccessList)

    assert.deepEqual(bal.raw(), [])
    assert.deepEqual(bal.toJSON(), [])
  })

  it('should preserve a touched system address entry when serializing', () => {
    const bal = createBlockLevelAccessListFromJSON([
      {
        address: SYSTEM_ADDRESS,
        nonceChanges: [],
        balanceChanges: [
          {
            blockAccessIndex: '0x1',
            postBalance: '0x01',
          },
        ],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ] satisfies BALJSONBlockAccessList)

    assert.deepEqual(bal.raw(), [[SYSTEM_ADDRESS, [], [], [[1, '0x01']], [], []]])
    assert.deepEqual(bal.toJSON(), [
      {
        address: SYSTEM_ADDRESS,
        nonceChanges: [],
        balanceChanges: [
          {
            blockAccessIndex: '0x01',
            postBalance: '0x01',
          },
        ],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])
  })

  it('toJSON() should produce correct JSON from Accesses data', () => {
    // bal_simple and bal_all_transaction_types use even-padded hex,
    // so toJSON() output should match the JSON test data directly.
    let bal = new BlockLevelAccessList(balSimple)
    assert.deepEqual(bal.toJSON(), bal_simple as BALJSONBlockAccessList)

    bal = new BlockLevelAccessList(balAllTransactionTypes)
    assert.deepEqual(bal.toJSON(), bal_all_transaction_types as BALJSONBlockAccessList)
  })

  it('toJSON() roundtrip: JSON -> internal -> toJSON()', () => {
    // For already-normalized JSON (even-padded hex), toJSON() output matches input.
    let bal = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    assert.deepEqual(bal.toJSON(), bal_simple as BALJSONBlockAccessList)

    bal = createBlockLevelAccessListFromJSON(bal_all_transaction_types as BALJSONBlockAccessList)
    assert.deepEqual(bal.toJSON(), bal_all_transaction_types as BALJSONBlockAccessList)

    // bal_empty_block_no_coinbase uses un-normalized hex (e.g. "0x0" vs "0x00"),
    // so direct JSON comparison won't match. Verify semantic roundtrip instead:
    // JSON -> internal -> toJSON() -> internal -> RLP/hash must still match.
    bal = createBlockLevelAccessListFromJSON(bal_empty_block_no_coinbase as BALJSONBlockAccessList)
    const roundtripJSON = bal.toJSON()
    const bal2 = createBlockLevelAccessListFromJSON(roundtripJSON)
    assert.deepEqual(bal2.accesses, balEmptyBlockNoCoinbase)
    assert.deepEqual(bytesToHex(bal2.serialize()), balEmptyBlockNoCoinbaseRLP)
    assert.deepEqual(bytesToHex(bal2.hash()), balEmptyBlockNoCoinbaseHash)
  })
})

describe('RLP', () => {
  it('serialize() should produce correct RLP output', () => {
    let bal = new BlockLevelAccessList(balSimple)
    assert.deepEqual(bytesToHex(bal.serialize()), balSimpleRLP)

    bal = new BlockLevelAccessList(balEmptyBlockNoCoinbase)
    assert.deepEqual(bytesToHex(bal.serialize()), balEmptyBlockNoCoinbaseRLP)

    bal = new BlockLevelAccessList(balAllTransactionTypes)
    assert.deepEqual(bytesToHex(bal.serialize()), balAllTransactionTypesRLP)
  })

  it('serialize() roundtrip: RLP -> internal -> serialize()', () => {
    let bal = createBlockLevelAccessListFromRLP(hexToBytes(balSimpleRLP))
    assert.deepEqual(bytesToHex(bal.serialize()), balSimpleRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balSimpleHash)

    bal = createBlockLevelAccessListFromRLP(hexToBytes(balEmptyBlockNoCoinbaseRLP))
    assert.deepEqual(bytesToHex(bal.serialize()), balEmptyBlockNoCoinbaseRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balEmptyBlockNoCoinbaseHash)

    bal = createBlockLevelAccessListFromRLP(hexToBytes(balAllTransactionTypesRLP))
    assert.deepEqual(bytesToHex(bal.serialize()), balAllTransactionTypesRLP)
    assert.deepEqual(bytesToHex(bal.hash()), balAllTransactionTypesHash)
  })
})
