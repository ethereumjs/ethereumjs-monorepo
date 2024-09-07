import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { loadKZG } from 'kzg-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { devnet4844Config } from '../../client/test/sim/configs/4844-devnet.js'
import { createBlockFromBeaconPayloadJSON, createBlockHeader } from '../src/index.js'

import { payloadKaustinenData } from './testdata/payload-kaustinen.js'
import { payloadSlot87335Data } from './testdata/payload-slot-87335.js'
import { payloadSlot87475Data } from './testdata/payload-slot-87475.js'
import { testnetVerkleKaustinenData } from './testdata/testnetVerkleKaustinen.js'

import type { Common } from '@ethereumjs/common'

describe('[fromExecutionPayloadJSON]: 4844 devnet 5', () => {
  let common: Common
  beforeAll(async () => {
    const kzg = await loadKZG()

    const commonConfig = { ...devnet4844Config }
    commonConfig.config = { ...commonConfig.config, chainId: 4844001005 }
    const network = 'sharding'
    common = createCommonFromGethGenesis(commonConfig, { chain: network, customCrypto: { kzg } })
    // safely change chainId without modifying underlying json

    common.setHardfork(Hardfork.Cancun)
  })

  it('reconstruct cancun block with blob txs', async () => {
    for (const payload of [payloadSlot87335Data, payloadSlot87475Data]) {
      try {
        const block = await createBlockFromBeaconPayloadJSON(payload, {
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
          ...payloadSlot87335Data,
          block_hash: payloadSlot87475Data.block_hash,
        },
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
          ...payloadSlot87475Data,
          block_hash: '0x573714bdd0ca5e47bc32008751c4fc74237f8cb354fbc1475c1d0ece38236ea4',
        },
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
  const common = createCommonFromGethGenesis(testnetVerkleKaustinenData, {
    chain: network,
    eips: [6800],
  })
  it('reconstruct kaustinen block', async () => {
    assert.ok(common.isActivatedEIP(6800), 'verkle eip should be activated')
    const block = await createBlockFromBeaconPayloadJSON(payloadKaustinenData, {
      common,
    })
    // the witness object in payload has camel casing for now
    // the current block hash doesn't include witness data so deep match is required
    assert.deepEqual(
      block.executionWitness,
      payloadKaustinenData.execution_witness,
      'execution witness should match',
    )
  })
})
