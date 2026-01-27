import { assert, describe, it } from 'vitest'

import {
  type BALJSONBlockAccessList,
  createBlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
} from '../src/bal.ts'
import bal_all_transaction_types from './testdata/bal/bal_all_transaction_types.json' with {
  type: 'json',
}

describe('Basic initialization', () => {
  it('should create an empty access list', () => {
    const bal = createBlockLevelAccessList()
    assert.isNotNull(bal)
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
