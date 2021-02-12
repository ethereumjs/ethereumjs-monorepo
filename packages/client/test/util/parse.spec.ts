import tape from 'tape-catch'
import multiaddr from 'multiaddr'
import { parseMultiaddrs, parseTransports, parseParams } from '../../lib/util'

tape('[Util/Parse]', (t) => {
  t.test('should parse multiaddrs', (t) => {
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
    t.end()
  })

  t.test('should parse transports', (t) => {
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
    t.end()
  })

  t.test('should parse geth params file', async (t) => {
    const json = require('./rinkeby.json')
    const params = await parseParams(json, 'rinkeby')
    const expected = require('./params.json')
    expected.genesis.hash = Buffer.from(expected.genesis.hash)
    expected.genesis.stateRoot = Buffer.from(expected.genesis.stateRoot)
    t.deepEquals(params, expected, 'parsed params correctly')
    t.end()
  })

  t.test('should parse contracts from geth params file', async (t) => {
    const json = require('./lisinski.json')
    const params = await parseParams(json, 'lisinsky')
    const expected = 'e7fd8db206dcaf066b7c97b8a42a0abc18653613560748557ab44868652a78b6'
    t.equals(params.genesis.hash.toString('hex'), expected, 'parsed contracts correctly')
    t.end()
  })
})
