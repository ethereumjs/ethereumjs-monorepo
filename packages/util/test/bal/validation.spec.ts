import {
  balAllTransactionTypesJSON,
  balInvalidAccountOrderJSON,
  balInvalidDuplicateAccountJSON,
  balInvalidHashMismatchJSON,
  balSimple,
  balSimpleJSON,
} from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import {
  BLOCK_ACCESS_LIST_ITEM_COST,
  countBlockAccessListItems,
  equalsBlockAccessList,
  isAccountOrderOnlyViolation,
  validateBlockAccessListGasLimit,
  validateBlockAccessListHash,
  validateBlockAccessListHashFromJSON,
  validateBlockAccessListJSONStructure,
  validateBlockAccessListStructure,
} from '../../src/bal/validation.ts'
import {
  type BALJSONBlockAccessList,
  BlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
  hexToBytes,
  randomBytes,
} from '../../src/index.ts'
type EstInvalidFixtureBlock = {
  rlp_decoded: {
    blockAccessList: BALJSONBlockAccessList
    blockHeader: { blockAccessListHash: `0x${string}` }
  }
}

type EstInvalidFixture = Record<string, { blocks: EstInvalidFixtureBlock[] }>

describe('validateBlockAccessListJSONStructure', () => {
  it('accepts valid fixture JSON', () => {
    validateBlockAccessListJSONStructure(balSimpleJSON as BALJSONBlockAccessList)
    validateBlockAccessListJSONStructure(balAllTransactionTypesJSON as BALJSONBlockAccessList)
  })

  it('detects full account reordering', () => {
    const json = structuredClone(balSimpleJSON as BALJSONBlockAccessList).reverse()
    assert.isTrue(isAccountOrderOnlyViolation(json))
    validateBlockAccessListJSONStructure(json)
  })

  it('does not treat a single out-of-place account as full reorder', () => {
    const json = structuredClone(balSimpleJSON as BALJSONBlockAccessList)
    json.push(structuredClone(json[0]))
    json.splice(0, 1)
    assert.isFalse(isAccountOrderOnlyViolation(json))
  })

  it('rejects duplicate accounts with INCORRECT_BLOCK_FORMAT', () => {
    const json = structuredClone(balSimpleJSON as BALJSONBlockAccessList)
    json.splice(1, 0, structuredClone(json[0]))
    assert.throws(
      () => validateBlockAccessListJSONStructure(json),
      /invalid header: duplicate account in block access list/,
    )
  })

  it('rejects storage slot in both reads and changes', () => {
    const json: BALJSONBlockAccessList = [
      {
        address: '0x0000000000000000000000000000000000000001',
        nonceChanges: [],
        balanceChanges: [],
        codeChanges: [],
        storageChanges: [
          {
            slot: '0x01',
            slotChanges: [{ blockAccessIndex: '0x01', postValue: '0x02' }],
          },
        ],
        storageReads: ['0x01'],
      },
    ]
    assert.throws(
      () => validateBlockAccessListJSONStructure(json),
      /invalid block access list: storage slot appears in both storageChanges and storageReads/,
    )
  })
})

describe('validateBlockAccessListStructure', () => {
  it('accepts valid internal access lists', () => {
    const bal = new BlockLevelAccessList(balSimple)
    validateBlockAccessListStructure(bal)
  })

  it('accepts lists built from valid JSON', () => {
    const bal = createBlockLevelAccessListFromJSON(balSimpleJSON as BALJSONBlockAccessList)
    validateBlockAccessListStructure(bal)
  })
})

describe('validateBlockAccessListHash', () => {
  it('accepts matching header hash', () => {
    const bal = createBlockLevelAccessListFromJSON(balSimpleJSON as BALJSONBlockAccessList)
    validateBlockAccessListHash(bal, bal.hash())
  })

  it('rejects mismatched header hash', () => {
    const bal = createBlockLevelAccessListFromJSON(balSimpleJSON as BALJSONBlockAccessList)
    const wrongHash = randomBytes(32)
    assert.throws(
      () => validateBlockAccessListHash(bal, wrongHash),
      /invalid block access list hash:/,
    )
  })
})

describe('equalsBlockAccessList', () => {
  it('compares canonical RLP equality', () => {
    const a = createBlockLevelAccessListFromJSON(balSimpleJSON as BALJSONBlockAccessList)
    const b = new BlockLevelAccessList(balSimple)
    assert.isTrue(equalsBlockAccessList(a, b))
  })
})

describe('execution-spec invalid BAL fixtures', () => {
  it('rejects duplicate accounts and detects account reordering', () => {
    const dupJSON = Object.values(balInvalidDuplicateAccountJSON as EstInvalidFixture)[0].blocks[0]
      .rlp_decoded.blockAccessList
    assert.throws(() => validateBlockAccessListJSONStructure(dupJSON), /duplicate account/)

    const orderJSON = Object.values(balInvalidAccountOrderJSON as EstInvalidFixture)[0].blocks[0]
      .rlp_decoded.blockAccessList
    assert.isTrue(isAccountOrderOnlyViolation(orderJSON))
  })

  it('rejects header hash mismatch using JSON-ordered RLP', () => {
    const data = balInvalidHashMismatchJSON as EstInvalidFixture
    const name = Object.keys(data)[0]
    const block = data[name].blocks[0]
    const balJSON = block.rlp_decoded.blockAccessList
    const headerHash = hexToBytes(block.rlp_decoded.blockHeader.blockAccessListHash)
    assert.throws(
      () => validateBlockAccessListHashFromJSON(balJSON, headerHash),
      /invalid block access list hash:/,
    )
  })
})

describe('validateBlockAccessListGasLimit', () => {
  // Minimal fixture mirroring bal_gas_limit_boundary (4 addresses + 11 storage keys = 15 items)
  const boundaryBalJson: BALJSONBlockAccessList = [
    {
      address: '0x00000961ef480eb55e80d19ad83579a64c007002',
      nonceChanges: [],
      balanceChanges: [],
      codeChanges: [],
      storageChanges: [],
      storageReads: ['0x00', '0x01', '0x02', '0x03'],
    },
    {
      address: '0x0000bbddc7ce488642fb579f8b00f3a590007251',
      nonceChanges: [],
      balanceChanges: [],
      codeChanges: [],
      storageChanges: [],
      storageReads: ['0x00', '0x01', '0x02', '0x03'],
    },
    {
      address: '0x0000f90827f1c53a10cb7a02335b175320002935',
      nonceChanges: [],
      balanceChanges: [],
      codeChanges: [],
      storageChanges: [
        {
          slot: '0x00',
          slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x01' }],
        },
      ],
      storageReads: [],
    },
    {
      address: '0x000f3df6d732807ef1319fb7b8bb8522d0beac02',
      nonceChanges: [],
      balanceChanges: [],
      codeChanges: [],
      storageChanges: [
        {
          slot: '0x0c',
          slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x0c' }],
        },
      ],
      storageReads: ['0x200b'],
    },
  ]

  it('counts BAL items as addresses plus storage keys', () => {
    const bal = createBlockLevelAccessListFromJSON(boundaryBalJson)
    assert.equal(countBlockAccessListItems(bal), 15)
    assert.equal(BLOCK_ACCESS_LIST_ITEM_COST, 2000)
  })

  it('accepts at-boundary gas limit and rejects one below', () => {
    const bal = createBlockLevelAccessListFromJSON(boundaryBalJson)
    validateBlockAccessListGasLimit(bal, 30000n)
    assert.throws(
      () => validateBlockAccessListGasLimit(bal, 29999n),
      /block access list gas limit exceeded/,
    )
  })
})
