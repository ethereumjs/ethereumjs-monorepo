import * as tape from 'tape'

import { parseGethGenesis } from '../src/utils'

const testDataPath = '../../client/test/testdata/geth-genesis'
tape('[Utils/Parse]', (t) => {
  t.test('should parse geth params file', async (t) => {
    const json = require(`${testDataPath}/testnet.json`)
    const params = parseGethGenesis(json, 'rinkeby')
    t.equals(params.genesis.nonce, '0x0000000000000042', 'nonce should be correctly formatted')
  })

  t.test('should throw with invalid Spurious Dragon blocks', async (t) => {
    t.plan(1)
    const json = require(`${testDataPath}/invalid-spurious-dragon.json`)
    try {
      parseGethGenesis(json, 'bad_params')
      t.fail('should have thrown')
    } catch {
      t.pass('should throw')
    }
  })

  t.test('should import poa network params correctly', async (t) => {
    t.plan(3)
    const json = require(`${testDataPath}/poa.json`)
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
      const json = require(`${testDataPath}/post-merge.json`)
      const params = parseGethGenesis(json, 'post-merge')
      t.equals(params.genesis.baseFeePerGas, json.baseFeePerGas)
    }
  )
  t.test('should successfully parse genesis file with no extraData', async (st) => {
    st.plan(2)
    const json = require(`${testDataPath}/no-extra-data.json`)
    const params = parseGethGenesis(json, 'noExtraData')
    st.equal(params.genesis.extraData, '0x', 'extraData set to 0x')
    st.equal(params.genesis.timestamp, '0x10', 'timestamp parsed correctly')
  })
})
