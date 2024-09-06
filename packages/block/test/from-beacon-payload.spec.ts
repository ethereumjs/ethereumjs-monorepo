import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { loadKZG } from 'kzg-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import * as shardingJSON from '../../client/test/sim/configs/4844-devnet.json'
import { createBlockFromBeaconPayloadJSON, createBlockHeader } from '../src/index.js'

import * as payloadKaustinen from './testdata/payload-kaustinen.json'
import * as payload87335 from './testdata/payload-slot-87335.json'
import * as payload87475 from './testdata/payload-slot-87475.json'
import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'

import type { BeaconPayloadJSON } from '../src/index.js'
import type { Common } from '@ethereumjs/common'
import type { VerkleExecutionWitness } from '@ethereumjs/util'

describe('[fromExecutionPayloadJSON]: 4844 devnet 5', () => {
  let common: Common
  beforeAll(async () => {
    const kzg = await loadKZG()

    const commonJSON = { ...shardingJSON }
    commonJSON.config = { ...commonJSON.config, chainId: 4844001005 }
    const network = 'sharding'
    common = createCommonFromGethGenesis(commonJSON, { chain: network, customCrypto: { kzg } })
    // safely change chainId without modifying underlying json

    common.setHardfork(Hardfork.Cancun)
  })

  it('reconstruct cancun block with blob txs', async () => {
    for (const payload of [payload87335, payload87475]) {
      try {
        const block = await createBlockFromBeaconPayloadJSON(payload as BeaconPayloadJSON, {
          common,
        })
        const parentHeader = createBlockHeader(
          { excessBlobGas: BigInt(0), blobGasUsed: block.header.excessBlobGas! + BigInt(393216) },
          { common },
        )
        block.validateBlobTransactions(parentHeader)
        assert.ok(true, `successfully constructed block=${block.header.number}`)
      } catch (e) {
        assert.fail(`failed to construct block, error: ${e}`)
      }
    }
  })

  it('should validate block hash', async () => {
    try {
      // construct a payload with differing block hash
      await createBlockFromBeaconPayloadJSON(
        {
          ...payload87335,
          block_hash: payload87475.block_hash,
        } as BeaconPayloadJSON,
        { common },
      )
      assert.fail(`should have failed constructing the block`)
    } catch (e) {
      assert.ok(true, `correctly failed constructing block, error: ${e}`)
      assert.ok(`${e}`.includes('Invalid blockHash'), 'failed with correct error')
    }
  })

  it('should validate excess blob gas', async () => {
    try {
      // construct a payload with a different excess blob gas but matching hash
      const block = await createBlockFromBeaconPayloadJSON(
        {
          ...payload87475,
          block_hash: '0x573714bdd0ca5e47bc32008751c4fc74237f8cb354fbc1475c1d0ece38236ea4',
        } as BeaconPayloadJSON,
        { common },
      )
      const parentHeader = createBlockHeader({ excessBlobGas: BigInt(0) }, { common })
      block.validateBlobTransactions(parentHeader)
      assert.fail(`should have failed constructing the block`)
    } catch (e) {
      assert.ok(true, `correctly failed constructing block, error: ${e}`)
      assert.ok(`${e}`.includes('block excessBlobGas mismatch'), 'failed with correct error')
    }
  })
})

describe('[fromExecutionPayloadJSON]: kaustinen', () => {
  const network = 'kaustinen'

  // safely change chainId without modifying underlying json
  const common = createCommonFromGethGenesis(testnetVerkleKaustinen, {
    chain: network,
    eips: [6800],
  })
  it('reconstruct kaustinen block', async () => {
    assert.ok(common.isActivatedEIP(6800), 'verkle eip should be activated')
    const block = await createBlockFromBeaconPayloadJSON(payloadKaustinen as BeaconPayloadJSON, {
      common,
    })
    // the witness object in payload has camel casing for now
    // the current block hash doesn't include witness data so deep match is required
    assert.deepEqual(
      block.executionWitness,
      payloadKaustinen.execution_witness as VerkleExecutionWitness,
      'execution witness should match',
    )
  })
})
