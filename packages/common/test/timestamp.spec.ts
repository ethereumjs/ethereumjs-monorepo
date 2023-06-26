import { hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Chain, Common, Hardfork } from '../src/index.js'

import * as timestampJson from './data/shanghai-time.json'

describe('[Common]: Timestamp Hardfork logic', () => {
  it('shanghai-time', () => {
    const c = Common.fromGethGenesis(timestampJson, {
      chain: 'withdrawals',
    })
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 0n }),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 1668699476n }),
      Hardfork.Shanghai,
      'should match the HF'
    )
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 1668699576n }),
      Hardfork.Shanghai,
      'should match the HF'
    )
  })

  it('schedule sharding on shanghai-time', () => {
    const config = Object.assign({}, timestampJson.config, {
      cancunTime: timestampJson.config.shanghaiTime,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 0n }),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    assert.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai),
      null,
      'should give null on next Hardfork block'
    )
  })

  it('schedule sharding post shanghai-time', () => {
    const config = Object.assign({}, timestampJson.config, {
      cancunTime: timestampJson.config.shanghaiTime + 1000,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 0n }),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    // Should give the shanghai as sharding is schedule a bit post shanghai
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 1668699476n }),
      Hardfork.Shanghai,
      'should match the HF'
    )
    assert.equal(
      c.getHardforkBy({ blockNumber: 1n, timestamp: 1668699576n }),
      Hardfork.Shanghai,
      'should match the HF'
    )
  })

  it('forkHash', () => {
    const mainnet = new Common({ chain: Chain.Mainnet })
    const hfs = mainnet.hardforks()
    const mergeIndex = hfs.findIndex((hf) => hf.name === Hardfork.Paris)
    const hardforks = hfs.slice(0, mergeIndex + 1).concat([
      // Add these hardforks as specified here:
      //   https://github.com/ethereum/EIPs/pull/6122/files
      {
        name: 'mergeForkIdTransition',
        block: 18000000,
        forkHash: '0x4fb8a872',
      },
      {
        name: 'shanghai',
        block: null,
        timestamp: '1668000000',
        forkHash: '0xc1fdf181',
      },
    ])

    const c = Common.custom({ hardforks }, { baseChain: Chain.Mainnet })
    const mainnetGenesisHash = hexStringToBytes(
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    )
    for (const hf of c.hardforks()) {
      if (typeof hf.forkHash === 'string') {
        const msg = `Verify forkHash calculation for: ${hf.name}`
        assert.equal(c._calcForkHash(hf.name, mainnetGenesisHash), hf.forkHash, msg)
      }
    }

    c.setHardfork(Hardfork.MergeForkIdTransition)
    assert.equal(c.nextHardforkBlockOrTimestamp(), BigInt(1668000000), 'Next hf shanghai')

    c.setHardfork(Hardfork.Shanghai)
    assert.equal(c.forkHash(), '0xc1fdf181', 'Shanghai forkHash should match')
    assert.equal(
      c.hardforkForForkHash('0xc1fdf181')?.name,
      Hardfork.Shanghai,
      'Should be able to get Shanghai from forkHash'
    )
  })

  it('setForkHashes', () => {
    const mainnet = new Common({ chain: Chain.Mainnet })
    const hfs = mainnet.hardforks()
    const mergeIndex = hfs.findIndex((hf) => hf.name === Hardfork.Paris)
    const hardforks = hfs.slice(0, mergeIndex + 1).concat([
      // Add these hardforks as specified here:
      //   https://github.com/ethereum/EIPs/pull/6122/files
      {
        name: 'mergeForkIdTransition',
        block: 18000000,
      },
      {
        name: 'shanghai',
        block: null,
        timestamp: '1668000000',
      },
    ])

    const c = Common.custom({ hardforks }, { baseChain: Chain.Mainnet })
    const mainnetGenesisHash = hexStringToBytes(
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    )

    let noForkHashes = c.hardforks().reduce((acc, hf) => {
      if (hf.forkHash === undefined) {
        acc++
      }
      return acc
    }, 0)
    assert.equal(noForkHashes, 2, 'missing forkhashes')

    c.setForkHashes(mainnetGenesisHash)
    noForkHashes = c.hardforks().reduce((acc, hf) => {
      if (hf.forkHash === undefined) {
        acc++
      }
      return acc
    }, 0)
    assert.equal(noForkHashes, 0, 'all forkhashes should be set')
    assert.equal(c.forkHash(Hardfork.Shanghai), '0xc1fdf181', 'Shanghai forkHash should match')
  })
})
