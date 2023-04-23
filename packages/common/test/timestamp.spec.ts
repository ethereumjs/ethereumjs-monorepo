import { hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Chain, Common, Hardfork } from '../src'

import * as timestampJson from './data/shanghai-time.json'

tape('[Common]: Timestamp Hardfork logic', function (t: tape.Test) {
  t.test('shanghai-time', function (st: tape.Test) {
    const c = Common.fromGethGenesis(timestampJson, {
      chain: 'withdrawals',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699476),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699576),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.end()
  })

  t.test('schedule sharding on shanghai-time', function (st: tape.Test) {
    const config = Object.assign({}, timestampJson.config, {
      cancunTime: timestampJson.config.shanghaiTime,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    st.equal(
      c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai),
      null,
      'should give null on next Hardfork block'
    )

    st.end()
  })

  t.test('schedule sharding post shanghai-time', function (st: tape.Test) {
    const config = Object.assign({}, timestampJson.config, {
      cancunTime: timestampJson.config.shanghaiTime + 1000,
    })
    const modifiedJson = Object.assign({}, timestampJson, { config })
    const c = Common.fromGethGenesis(modifiedJson, {
      chain: 'modified',
    })
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 0),
      Hardfork.MergeForkIdTransition,
      'should match the HF'
    )
    // Should give the shanghai as sharding is schedule a bit post shanghai
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699476),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.equal(
      c.getHardforkByBlockNumber(1, undefined, 1668699576),
      Hardfork.Shanghai,
      'should match the HF'
    )
    st.end()
  })

  t.test('forkHash', function (st) {
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
        st.equal(c._calcForkHash(hf.name, mainnetGenesisHash), hf.forkHash, msg)
      }
    }

    c.setHardfork(Hardfork.MergeForkIdTransition)
    st.equal(c.nextHardforkBlockOrTimestamp(), BigInt(1668000000), 'Next hf shanghai')

    c.setHardfork(Hardfork.Shanghai)
    st.equal(c.forkHash(), '0xc1fdf181', 'Shanghai forkHash should match')
    st.equal(
      c.hardforkForForkHash('0xc1fdf181')?.name,
      Hardfork.Shanghai,
      'Should be able to get Shanghai from forkHash'
    )

    t.end()
  })

  t.test('setForkHashes', function (st) {
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
    st.equal(noForkHashes, 2, 'missing forkhashes')

    c.setForkHashes(mainnetGenesisHash)
    noForkHashes = c.hardforks().reduce((acc, hf) => {
      if (hf.forkHash === undefined) {
        acc++
      }
      return acc
    }, 0)
    st.equal(noForkHashes, 0, 'all forkhashes should be set')
    st.equal(c.forkHash(Hardfork.Shanghai), '0xc1fdf181', 'Shanghai forkHash should match')
    st.end()
  })
})
