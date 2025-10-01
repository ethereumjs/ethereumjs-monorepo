import { rmSync } from 'fs'
import { resolve } from 'path'
import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import {
  Address,
  bytesToHex,
  concatBytes,
  hexToBytes,
  parseGethGenesisState,
} from '@ethereumjs/util'
import { assert, afterAll, beforeAll, describe, it } from 'vitest'
import type { EthereumClient } from '../../src/client.ts'
import { Config } from '../../src/config.ts'
import { getLogger } from '../../src/logging.ts'
import { Event } from '../../src/types.ts'
import { createInlineClient, purgeHistory } from '../../src/util/index.ts'

async function setupDevnet(prefundAddress: Address) {
  const addr = prefundAddress.toString().slice(2)
  const consensusConfig = {
    clique: {
      period: 1,
      epoch: 30000,
    },
  }
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
  const extraData = concatBytes(new Uint8Array(32), prefundAddress.toBytes(), new Uint8Array(65))

  const chainData = {
    ...defaultChainData,
    extraData: bytesToHex(extraData),
    alloc: { [addr]: { balance: '0x10000000000000000000' } },
  }

  const common = createCommonFromGethGenesis(chainData, {
    chain: 'devnet',
    hardfork: Hardfork.London,
  })
  const customGenesisState = parseGethGenesisState(chainData)
  return { common, customGenesisState }
}

const accounts: [Address, Uint8Array][] = [
  [
    new Address(hexToBytes('0x0b90087d864e82a284dca15923f3776de6bb016f')),
    hexToBytes('0x64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
  ],
]

async function minerSetup(): Promise<EthereumClient[]> {
  const { common, customGenesisState } = await setupDevnet(accounts[0][0])
  const config1 = new Config({
    common,
    accountCache: 10000,
    storageCache: 1000,
    mine: true,
    accounts,
    logger: getLogger({ logLevel: 'warn' }),
  })

  const miner = await createInlineClient(config1, common, customGenesisState, './datadir', false)

  return [miner]
}

describe('should mine blocks and then purge a few', () => {
  beforeAll(() => {
    rmSync(resolve(__dirname, '../../datadir/devnet'), { recursive: true, force: true })
  })
  it('should work', async () => {
    const [miner] = await minerSetup()

    const targetHeight = BigInt(5)
    await new Promise((resolve) => {
      miner.config.events.on(Event.SYNC_SYNCHRONIZED, (chainHeight) => {
        if (chainHeight === targetHeight) {
          assert.equal(miner.chain.blocks.height, targetHeight, 'synced blocks successfully')
          resolve(undefined)
        }
      })
    })

    await miner.stop()
    // We have to manually close the dbs or we'll get a db lock error
    // @ts-expect-error leveldb is not visible in interface (but it's there!)
    await miner.chain.chainDB['_leveldb'].close()
    await miner.service.execution['metaDB']?.close()

    // Purge history prior to block 3 and delete headers
    await purgeHistory('./datadir', 'devnet', 2n, true)

    assert.throws(async () => miner.chain.getBlock(1n), 'should not have block 1')
  }, 60000)
  afterAll(() => {
    rmSync(resolve(__dirname, '../../datadir/devnet'), { recursive: true, force: true })
  })
})
