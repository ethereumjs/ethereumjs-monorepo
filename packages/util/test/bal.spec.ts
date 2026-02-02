import { assert, describe, it } from 'vitest'

import {
  type BALJSONBlockAccessList,
  BlockLevelAccessList,
  createBlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
} from '../src/bal.ts'
import { bytesToHex } from '../src/bytes.ts'
import { KECCAK256_RLP_ARRAY_S } from '../src/constants.ts'
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
})
