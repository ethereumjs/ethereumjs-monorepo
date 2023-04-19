import { hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Common } from '../src/common'
import { Hardfork } from '../src/enums'
import { parseGethGenesis } from '../src/utils'

tape('[Utils/Parse]', (t) => {
  t.test('should parse geth params file', async (t) => {
    const json = require(`../../client/test/testdata/geth-genesis/testnet.json`)
    const params = parseGethGenesis(json, 'rinkeby')
    t.equals(params.genesis.nonce, '0x0000000000000042', 'nonce should be correctly formatted')
  })

  t.test('should throw with invalid Spurious Dragon blocks', async (t) => {
    t.plan(1)
    const json = require(`../../client/test/testdata/geth-genesis/invalid-spurious-dragon.json`)
    try {
      parseGethGenesis(json, 'bad_params')
      t.fail('should have thrown')
    } catch {
      t.pass('should throw')
    }
  })

  t.test('should import poa network params correctly', async (t) => {
    t.plan(4)
    const json = require(`../../client/test/testdata/geth-genesis/poa.json`)
    let params = parseGethGenesis(json, 'poa')
    t.equals(params.genesis.nonce, '0x0000000000000000', 'nonce is formatted correctly')
    t.deepEquals(
      params.consensus,
      { type: 'poa', algorithm: 'clique', clique: { period: 15, epoch: 30000 } },
      'consensus config matches'
    )
    json.nonce = '00'
    params = parseGethGenesis(json, 'poa')
    t.equals(
      params.genesis.nonce,
      '0x0000000000000000',
      'non-hex prefixed nonce is formatted correctly'
    )
    t.equal(params.hardfork, Hardfork.London, 'should correctly infer current hardfork')
  })

  t.test(
    'should generate expected hash with london block zero and base fee per gas defined',
    async (t) => {
      const json = require(`../../client/test/testdata/geth-genesis/post-merge.json`)
      const params = parseGethGenesis(json, 'post-merge')
      t.equals(params.genesis.baseFeePerGas, json.baseFeePerGas)
    }
  )

  t.test('should successfully parse genesis file with no extraData', async (st) => {
    st.plan(2)
    const json = require(`../../client/test/testdata/geth-genesis/no-extra-data.json`)
    const params = parseGethGenesis(json, 'noExtraData')
    st.equal(params.genesis.extraData, '0x', 'extraData set to 0x')
    st.equal(params.genesis.timestamp, '0x10', 'timestamp parsed correctly')
  })

  t.test('should successfully parse kiln genesis and set forkhash', async (st) => {
    const json = require(`../../blockchain/test/testdata/geth-genesis-kiln.json`)
    const common = Common.fromGethGenesis(json, {
      chain: 'customChain',
      genesisHash: hexStringToBytes(
        '51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8'
      ),
      mergeForkIdPostMerge: false,
    })
    st.deepEqual(
      common.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'berlin',
        'london',
        'mergeForkIdTransition',
        'paris',
      ],
      'hardfork parse order should be correct'
    )
    for (const hf of common.hardforks()) {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      st.equal(hf.forkHash, kilnForkHashes[hf.name], `${hf.name} forkHash should match`)
    }

    st.equal(common.hardfork(), Hardfork.Paris, 'should correctly infer current hardfork')

    // Ok lets schedule shanghai at block 0, this should force merge to be scheduled at just after
    // genesis if even mergeForkIdTransition is not confirmed to be post merge
    // This will also check if the forks are being correctly sorted based on block
    Object.assign(json.config, { shanghaiTime: Math.floor(Date.now() / 1000) })
    const common1 = Common.fromGethGenesis(json, {
      chain: 'customChain',
    })
    // merge hardfork is now scheduled just after shanghai even if mergeForkIdTransition is not confirmed
    // to be post merge
    st.deepEqual(
      common1.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'berlin',
        'london',
        'paris',
        'mergeForkIdTransition',
        'shanghai',
      ],
      'hardfork parse order should be correct'
    )

    st.equal(common1.hardfork(), Hardfork.Shanghai, 'should correctly infer current hardfork')
  })

  t.test('should successfully parse genesis with hardfork scheduled post merge', async (st) => {
    const json = require(`./data/post-merge-hardfork.json`)
    const common = Common.fromGethGenesis(json, {
      chain: 'customChain',
    })
    st.deepEqual(
      common.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'muirGlacier',
        'berlin',
        'london',
        'paris',
        'shanghai',
      ],
      'hardfork parse order should be correct'
    )

    st.equal(common.getHardforkByBlockNumber(0), Hardfork.London, 'london at genesis')
    st.equal(common.getHardforkByBlockNumber(1, BigInt(2)), Hardfork.Paris, 'merge at block 1')
    // shanghai is at timestamp 8
    st.equal(common.getHardforkByBlockNumber(8), Hardfork.London, 'without timestamp still london')
    st.equal(
      common.getHardforkByBlockNumber(8, BigInt(2)),
      Hardfork.Paris,
      'without timestamp at merge'
    )
    st.equal(
      common.getHardforkByBlockNumber(8, undefined, 8),
      Hardfork.Shanghai,
      'with timestamp at shanghai'
    )
    // should be post merge at shanghai
    st.equal(
      common.getHardforkByBlockNumber(8, BigInt(2), 8),
      Hardfork.Shanghai,
      'post merge shanghai'
    )
    // if not post merge, then should error
    try {
      common.getHardforkByBlockNumber(8, BigInt(1), 8)
      st.fail('should have failed since merge not completed before shanghai')
    } catch (e) {
      st.pass('correctly fails if merge not completed before shanghai')
    }

    st.equal(common.hardfork(), Hardfork.Shanghai, 'should correctly infer common hardfork')

    st.end()
  })
})

const kilnForkHashes: any = {
  chainstart: '0xbcadf543',
  homestead: '0xbcadf543',
  tangerineWhistle: '0xbcadf543',
  spuriousDragon: '0xbcadf543',
  byzantium: '0xbcadf543',
  constantinople: '0xbcadf543',
  petersburg: '0xbcadf543',
  istanbul: '0xbcadf543',
  berlin: '0xbcadf543',
  london: '0xbcadf543',
  mergeForkIdTransition: '0x013fd1b5',
  paris: '0x013fd1b5',
}
