import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, expect, it } from 'vitest'

import { createBlockFromBeaconPayloadJSON, createBlockHeader } from '../src/index.ts'

import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { payloadKaustinenData } from './testdata/payload-kaustinen.ts'
import { payloadSlot87335Data } from './testdata/payload-slot-87335.ts'
import { payloadSlot87475Data } from './testdata/payload-slot-87475.ts'
import { verkleKaustinenGethGenesis } from './testdata/testnetVerkleKaustinen.ts'

const kzg = new microEthKZG(trustedSetup)
describe('[fromExecutionPayloadJSON]: 4844 devnet 5', () => {
  const commonConfig = { ...eip4844GethGenesis }
  commonConfig.config = { ...commonConfig.config, chainId: 4844001005 }
  const network = 'sharding'
  const common = createCommonFromGethGenesis(commonConfig, {
    chain: network,
    customCrypto: { kzg },
  })
  // safely change chainId without modifying underlying json

  common.setHardfork(Hardfork.Cancun)

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
        assert.isTrue(true, `successfully constructed block=${block.header.number}`)
      } catch (e) {
        assert.fail(`failed to construct block, error: ${e}`)
      }
    }
  })

  it('should validate block hash', async () => {
    await expect(
      createBlockFromBeaconPayloadJSON(
        {
          ...payloadSlot87335Data,
          block_hash: payloadSlot87475Data.block_hash,
        },
        { common },
      ),
      'should have failed constructing the block',
    ).rejects.toThrow('Invalid blockHash')
  })

  it('should validate excess blob gas', async () => {
    await expect(async () => {
      const block = await createBlockFromBeaconPayloadJSON(
        {
          ...payloadSlot87475Data,
          block_hash: '0x573714bdd0ca5e47bc32008751c4fc74237f8cb354fbc1475c1d0ece38236ea4',
        },
        { common },
      )
      const parentHeader = createBlockHeader({ excessBlobGas: BigInt(0) }, { common })
      block.validateBlobTransactions(parentHeader)
    }, 'should fail constructing the block').rejects.toThrow('block excessBlobGas mismatch')
  })
})

describe('[fromExecutionPayloadJSON]: kaustinen', () => {
  const network = 'kaustinen'

  // safely change chainId without modifying underlying json
  const common = createCommonFromGethGenesis(verkleKaustinenGethGenesis, {
    chain: network,
    eips: [6800],
  })
  it('reconstruct kaustinen block', async () => {
    assert.isTrue(common.isActivatedEIP(6800), 'verkle eip should be activated')
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
