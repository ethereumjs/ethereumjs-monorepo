import * as tape from 'tape'
import { multiaddr } from 'multiaddr'
import { parseMultiaddrs, parseTransports, parseCustomParams } from '../../lib/util'

tape('[Util/Parse]', (t) => {
  t.test('should parse multiaddrs', (t) => {
    t.plan(7)
    t.deepEquals(parseMultiaddrs(''), [], 'handle empty')
    t.deepEquals(
      parseMultiaddrs('10.0.0.1:1234'),
      [multiaddr('/ip4/10.0.0.1/tcp/1234')],
      'parse ip:port'
    )
    t.deepEquals(
      parseMultiaddrs('enode://abc@10.0.0.1:1234'),
      [multiaddr('/ip4/10.0.0.1/tcp/1234')],
      'parse url'
    )
    t.deepEquals(
      parseMultiaddrs('/ip4/1.1.1.1/tcp/50507/ws'),
      [multiaddr('/ip4/1.1.1.1/tcp/50507/ws')],
      'parse multiaddr'
    )
    t.deepEquals(
      parseMultiaddrs(
        '/ip4/1.1.1.2/tcp/50508/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa'
      ),
      [multiaddr('/ip4/1.1.1.2/tcp/50508/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa')],
      'parse multiaddr with peer id'
    )
    t.deepEquals(
      parseMultiaddrs(
        '10.0.0.1:1234,enode://343149e4feefa15d882d9fe4ac7d88f885bd05ebb735e547f12e12080a9fa07c8014ca6fd7f373123488102fe5e34111f8509cf0b7de3f5b44339c9f25e87cb8@127.0.0.1:2345'
      ),
      [multiaddr('/ip4/10.0.0.1/tcp/1234'), multiaddr('/ip4/127.0.0.1/tcp/2345')],
      'parse multiple'
    )
    t.throws(() => parseMultiaddrs(10 as any), /not a function/, 'throws error')
  })

  t.test('should parse transports', (t) => {
    t.plan(2)
    t.deepEquals(
      parseTransports(['t1']),
      [{ name: 't1', options: {} }],
      'parsed transport without options'
    )
    t.deepEquals(
      parseTransports(['t2:k1=v1,k:k=v2,k3="v3",k4,k5=']),
      [
        {
          name: 't2',
          options: { k1: 'v1', 'k:k': 'v2', k3: '"v3"', k4: undefined, k5: '' },
        },
      ],
      'parsed transport with options'
    )
  })

  t.test('should parse geth params file', async (t) => {
    const json = require('../testdata/geth-genesis/testnet.json')
    const params = await parseCustomParams(json, 'rinkeby')
    t.equals(params.genesis.nonce, '0x0000000000000042', 'nonce should be correctly formatted')
  })

  t.test('should throw with invalid Spurious Dragon blocks', async (t) => {
    t.plan(1)
    const json = require('../testdata/geth-genesis/invalid-spurious-dragon.json')
    try {
      await parseCustomParams(json, 'bad_params')
      t.fail('should have thrown')
    } catch {
      t.pass('should throw')
    }
  })

  t.test('should import poa network params correctly', async (t) => {
    t.plan(3)
    const json = require('../testdata/geth-genesis/poa.json')
    let params = await parseCustomParams(json, 'poa')
    t.equals(params.genesis.nonce, '0x0000000000000000', 'nonce is formatted correctly')
    t.deepEquals(
      params.consensus,
      { type: 'poa', algorithm: 'clique', clique: { period: 15, epoch: 30000 } },
      'consensus config matches'
    )
    json.nonce = '00'
    params = await parseCustomParams(json, 'poa')
    t.equals(
      params.genesis.nonce,
      '0x0000000000000000',
      'non-hex prefixed nonce is formatted correctly'
    )
  })

  t.test(
    'should generate expected hash with london block zero and base fee per gas defined',
    async (t) => {
      const json = require('../testdata/geth-genesis/post-merge.json')
      const params = await parseCustomParams(json, 'post-merge')
      t.equals(params.genesis.baseFeePerGas, json.baseFeePerGas)
    }
  )
  t.test('should successfully parse genesis file with no extraData', async (st) => {
    st.plan(2)
    const json = require('../testdata/geth-genesis/no-extra-data.json')
    const params = await parseCustomParams(json, 'noExtraData')
    st.equal(params.genesis.extraData, '0x', 'extraData set to 0x')
    st.equal(params.genesis.timestamp, '0x10', 'timestamp parsed correctly')
  })
})
