import * as tape from 'tape'

import { Common } from '../src/common'
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
    t.plan(3)
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
      genesisHash: Buffer.from(
        '51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8',
        'hex'
      ),
    })
    for (const hf of common.hardforks()) {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      st.equal(hf.forkHash, kilnForkHashes[hf.name], `${hf.name} forkHash should match`)
    }
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
  merge: '0x013fd1b5',
}
