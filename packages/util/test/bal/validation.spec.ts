import fs from 'fs'
import path from 'path'
import { assert, describe, it } from 'vitest'

import {
  equalsBlockAccessList,
  isAccountOrderOnlyViolation,
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
import bal_all_transaction_types from '../testdata/bal/bal_all_transaction_types.json' with {
  type: 'json',
}
import bal_simple from '../testdata/bal/bal_simple.json' with { type: 'json' }
import { balSimple } from '../testdata/bal/bal_simple.ts'

type EstInvalidFixtureBlock = {
  rlp_decoded: {
    blockAccessList: BALJSONBlockAccessList
    blockHeader: { blockAccessListHash: `0x${string}` }
  }
}

type EstInvalidFixture = Record<string, { blocks: EstInvalidFixtureBlock[] }>

describe('validateBlockAccessListJSONStructure', () => {
  it('accepts valid fixture JSON', () => {
    validateBlockAccessListJSONStructure(bal_simple as BALJSONBlockAccessList)
    validateBlockAccessListJSONStructure(bal_all_transaction_types as BALJSONBlockAccessList)
  })

  it('detects full account reordering', () => {
    const json = structuredClone(bal_simple as BALJSONBlockAccessList).reverse()
    assert.isTrue(isAccountOrderOnlyViolation(json))
    validateBlockAccessListJSONStructure(json)
  })

  it('does not treat a single out-of-place account as full reorder', () => {
    const json = structuredClone(bal_simple as BALJSONBlockAccessList)
    json.push(structuredClone(json[0]))
    json.splice(0, 1)
    assert.isFalse(isAccountOrderOnlyViolation(json))
  })

  it('rejects duplicate accounts with INCORRECT_BLOCK_FORMAT', () => {
    const json = structuredClone(bal_simple as BALJSONBlockAccessList)
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
    const bal = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    validateBlockAccessListStructure(bal)
  })
})

describe('validateBlockAccessListHash', () => {
  it('accepts matching header hash', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    validateBlockAccessListHash(bal, bal.hash())
  })

  it('rejects mismatched header hash', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    const wrongHash = randomBytes(32)
    assert.throws(
      () => validateBlockAccessListHash(bal, wrongHash),
      /invalid block access list hash:/,
    )
  })
})

describe('equalsBlockAccessList', () => {
  it('compares canonical RLP equality', () => {
    const a = createBlockLevelAccessListFromJSON(bal_simple as BALJSONBlockAccessList)
    const b = new BlockLevelAccessList(balSimple)
    assert.isTrue(equalsBlockAccessList(a, b))
  })
})

const invalidFixturesRoot = path.resolve(
  import.meta.dirname,
  '../../execution-spec-tests/dev/blockchain_tests/amsterdam/v700_mixed_with_other_eips/eip7928_block_level_access_lists/block_access_lists_invalid',
)

describe.skipIf(fs.existsSync(invalidFixturesRoot) === false)(
  'execution-spec invalid BAL fixtures',
  () => {
    it('rejects duplicate accounts and detects account reordering', () => {
      const dupData = JSON.parse(
        fs.readFileSync(
          path.join(invalidFixturesRoot, 'bal_invalid_duplicate_account.json'),
          'utf8',
        ),
      ) as EstInvalidFixture
      const dupJSON = Object.values(dupData)[0].blocks[0].rlp_decoded.blockAccessList
      assert.throws(() => validateBlockAccessListJSONStructure(dupJSON), /duplicate account/)

      const orderData = JSON.parse(
        fs.readFileSync(path.join(invalidFixturesRoot, 'bal_invalid_account_order.json'), 'utf8'),
      ) as EstInvalidFixture
      const orderJSON = Object.values(orderData)[0].blocks[0].rlp_decoded.blockAccessList
      assert.isTrue(isAccountOrderOnlyViolation(orderJSON))
    })

    it('rejects header hash mismatch using JSON-ordered RLP', () => {
      const data = JSON.parse(
        fs.readFileSync(path.join(invalidFixturesRoot, 'bal_invalid_hash_mismatch.json'), 'utf8'),
      ) as EstInvalidFixture
      const name = Object.keys(data)[0]
      const block = data[name].blocks[0]
      const balJSON = block.rlp_decoded.blockAccessList
      const headerHash = hexToBytes(block.rlp_decoded.blockHeader.blockAccessListHash)
      assert.throws(
        () => validateBlockAccessListHashFromJSON(balJSON, headerHash),
        /invalid block access list hash:/,
      )
    })
  },
)
