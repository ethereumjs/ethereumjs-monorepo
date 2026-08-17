import {
  type GethGenesis,
  Hardfork,
  createCommonFromGethGenesis,
  parseGethGenesisState,
} from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import { bytesToHex, concatBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Config } from '../../src/config.ts'
import { Event } from '../../src/types.ts'
import { createInlineClient } from '../../src/util/index.ts'
import { parseMultiaddrs } from '../../src/util/parse.ts'

import { SIGNER_A } from '@ethereumjs/testdata'
import type { EthereumClient } from '../../src/index.ts'

async function setupDevnet(prefundAddress: Address) {
  const addr = prefundAddress.toString().slice(2)
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

const accounts: [Address, Uint8Array][] = [[SIGNER_A.address, SIGNER_A.privateKey]]

async function minerSetup(): Promise<EthereumClient[]> {
  const { common, customGenesisState } = await setupDevnet(accounts[0][0])
  const config1 = new Config({
    common,
    accountCache: 10000,
    storageCache: 1000,
    mine: true,
    accounts,
  })

  const miner = await createInlineClient(config1, common, customGenesisState, '', true)

  const config2 = new Config({
    common,
    accountCache: 10000,
    storageCache: 1000,
    bootnodes: parseMultiaddrs(miner.config.server!.getRlpxInfo().enode as string),
    accounts,
    port: 30304,
    mine: false,
  })

  const follower = await createInlineClient(config2, common, customGenesisState, '', true)
  return [miner, follower]
}

describe('should mine blocks while a peer stays connected to tip of chain', () => {
  it('should work', async () => {
    const [follower] = await minerSetup()

    const targetHeight = BigInt(5)
    await new Promise((resolve) => {
      follower.config.events.on(Event.SYNC_SYNCHRONIZED, (chainHeight) => {
        if (chainHeight === targetHeight) {
          assert.strictEqual(
            follower.chain.blocks.height,
            targetHeight,
            'synced blocks successfully',
          )
          resolve(undefined)
        }
      })
    })
  }, 200000)
})
