import { Common, Hardfork } from '@ethereumjs/common'
import { Address, hexToBytes, parseGethGenesisState } from '@ethereumjs/util'
import { removeSync } from 'fs-extra'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src'
import { createInlineClient } from '../sim/simutils'

const pk = hexToBytes('0x95a602ff1ae30a2243f400dcf002561b9743b2ae9827b1008e3714a5cc1c0cfe')
const minerAddress = Address.fromPrivateKey(pk)

async function setupPowDevnet(prefundAddress: Address, cleanStart: boolean) {
  if (cleanStart) {
    removeSync(`datadir/devnet`)
  }
  const addr = prefundAddress.toString().slice(2)
  const consensusConfig = { ethash: true }

  const defaultChainData = {
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
  }
  const extraData = '0x' + '0'.repeat(32)
  const chainData = {
    ...defaultChainData,
    extraData,
    alloc: { [addr]: { balance: '0x10000000000000000000' } },
  }
  const common = Common.fromGethGenesis(chainData, { chain: 'devnet', hardfork: Hardfork.London })
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
  })

  const client = await createInlineClient(config, common, customGenesisState)
  return client
}

describe('PoW client test', async () => {
  const client = await setupPowDevnet(minerAddress, true)
  const started = client.started
  it('starts the client successfully', () => {
    assert.ok(started, 'client started successfully')
  }, 60000)
  const message: string = await new Promise((resolve) => {
    client.config.logger.on('data', (data) => {
      if (data.message.includes('Miner: Found PoW solution') === true) {
        resolve(data.message)
      }
    })
  })
  it('should find a PoW solution', () => {
    assert.ok(message.includes('Miner: Found PoW solution'))
  })
  await client.stop()
  it('should stop client', () => {
    assert.ok(!client.started, 'client stopped successfully')
  })
})
