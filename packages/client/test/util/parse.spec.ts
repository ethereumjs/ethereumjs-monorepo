import { multiaddr } from 'multiaddr'
import * as tape from 'tape'

import { parseMultiaddrs, parseTransports } from '../../src/util'

tape('[Util/Parse]', (t) => {
  t.test('should parse multiaddrs', (t) => {
    t.plan(8)
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
    t.deepEquals(
      parseMultiaddrs('[2607:f8b0:4003:c00::6a]:5678'),
      [multiaddr('/ip6/2607:f8b0:4003:c00::6a/tcp/5678')],
      'parse ipv6 multiaddr'
    )
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
})
