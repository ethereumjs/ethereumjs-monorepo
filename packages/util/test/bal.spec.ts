import { assert, describe, it } from 'vitest'

import {
  type BALJSONBlockAccessList,
  BlockLevelAccessList,
  createBlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
} from '../src/bal.ts'
import { bytesToHex } from '../src/bytes.ts'
import { KECCAK256_RLP_ARRAY_S } from '../src/constants.ts'
import bal_all_transaction_types from './testdata/bal/bal_all_transaction_types.json' with {
  type: 'json',
}
import { balEmptyBlock, balEmptyBlockHash } from './testdata/bal/bal_empty_block.ts'
import { balSimple, balSimpleHash } from './testdata/bal/bal_simple.ts'

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
    assert.equal(bal.accesses[addressWithBalanceChanges].balanceChanges.length, 2)
    assert.deepEqual(bal.accesses[addressWithBalanceChanges].balanceChanges[0], ['0x01', '0xf618'])

    assert.deepEqual(bytesToHex(bal.hash()), balSimpleHash)
  })

  it('hashes should match', () => {
    let bal = new BlockLevelAccessList()
    assert.deepEqual(bytesToHex(bal.hash()), KECCAK256_RLP_ARRAY_S)

    bal = new BlockLevelAccessList(balEmptyBlock)
    bal.hash()
    assert.deepEqual(bytesToHex(bal.hash()), balEmptyBlockHash)
  })
})

describe('JSON', () => {
  it('should convert to JSON', () => {
    const bal = createBlockLevelAccessListFromJSON(
      bal_all_transaction_types as BALJSONBlockAccessList,
    )
    assert.isNotNull(bal)
  })
})
