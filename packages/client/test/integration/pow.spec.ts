import { rmSync } from 'fs'
import {
  type GethGenesis,
  Hardfork,
  createCommonFromGethGenesis,
  parseGethGenesisState,
} from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src/index.ts'
import { createInlineClient } from '../../src/util/index.ts'

import { SIGNER_A } from '@ethereumjs/testdata'
import { type Address } from '@ethereumjs/util'
import { getLogger } from '../../src/logging.ts'

const pk = SIGNER_A.privateKey
const minerAddress = SIGNER_A.address

async function setupPowDevnet(prefundAddress: Address, cleanStart: boolean) {
  if (cleanStart) {
    rmSync(`datadir/devnet`, { recursive: true, force: true })
  }
  const addr = prefundAddress.toString().slice(2)
  const consensusConfig = { ethash: true }

  const defaultChainData: GethGenesis = {
    config: {
      chainId: 123456,
      homesteadBlock: 0,
      eip150Block: 0,
      eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      ...consensusConfig,
    },
    nonce: '0x0',
    timestamp: '0x614b3731',
    gasLimit: '0x47b760',
    difficulty: '0x1',
    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x0000000000000000000000000000000000000000',
    number: '0x0',
    gasUsed: '0x0',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    baseFeePerGas: 7,
    alloc: {},
  }
  const extraData = `0x${'0'.repeat(32)}`
  const chainData: GethGenesis = {
    ...defaultChainData,
    extraData,
    alloc: { [addr]: { balance: '0x10000000000000000000' } },
  }
  const common = createCommonFromGethGenesis(chainData, {
    chain: 'devnet',
    hardfork: Hardfork.London,
  })
  const customGenesisState = parseGethGenesisState(chainData)

  const config = new Config({
    common,
    bootnodes: [],
    multiaddrs: [],
    discDns: false,
    discV4: false,
    port: 30304,
    maxAccountRange: (BigInt(2) ** BigInt(256) - BigInt(1)) / BigInt(10),
    maxFetcherJobs: 10,
    datadir: 'devnet',
    accounts: [[minerAddress, pk]],
    mine: true,
    logger: getLogger(),
  })

  const client = await createInlineClient(config, common, customGenesisState)
  return client
}

describe('PoW client test', async () => {
  const client = await setupPowDevnet(minerAddress, true)
  const started = client.started
  it('starts the client successfully', () => {
    assert.isTrue(started, 'client started successfully')
  }, 60000)
  const message: string = await new Promise((resolve) => {
    client.config.logger?.on('data', (data: any) => {
      if (data.message.includes('Miner: Found PoW solution') === true) {
        resolve(data.message)
      }
    })
  })
  it('should find a PoW solution', () => {
    assert.include(message, 'Miner: Found PoW solution')
  })
  await client.stop()
  it('should stop client', () => {
    assert.isFalse(client.started, 'client stopped successfully')
  })
})
