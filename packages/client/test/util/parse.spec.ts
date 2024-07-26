import { multiaddr } from '@multiformats/multiaddr'
import { assert, describe, it } from 'vitest'

import { parseMultiaddrs } from '../../src/util/parse.js'

describe('[Util/Parse]', () => {
  it('should parse multiaddrs', () => {
    assert.deepEqual(parseMultiaddrs(''), [], 'handle empty')
    assert.deepEqual(
      parseMultiaddrs('10.0.0.1:1234'),
      [multiaddr('/ip4/10.0.0.1/tcp/1234')],
      'parse ip:port',
    )
    assert.deepEqual(
      parseMultiaddrs('enode://abc@10.0.0.1:1234'),
      [multiaddr('/ip4/10.0.0.1/tcp/1234')],
      'parse url',
    )
    assert.deepEqual(
      parseMultiaddrs('/ip4/1.1.1.1/tcp/50507/ws'),
      [multiaddr('/ip4/1.1.1.1/tcp/50507/ws')],
      'parse multiaddr',
    )
    assert.deepEqual(
      parseMultiaddrs(
        '/ip4/1.1.1.2/tcp/50508/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa',
      ),
      [multiaddr('/ip4/1.1.1.2/tcp/50508/ws/p2p/QmYAuYxw6QX1x5aafs6g3bUrPbMDifP5pDun3N9zbVLpEa')],
      'parse multiaddr with peer id',
    )
    assert.deepEqual(
      parseMultiaddrs(
        '10.0.0.1:1234,enode://343149e4feefa15d882d9fe4ac7d88f885bd05ebb735e547f12e12080a9fa07c8014ca6fd7f373123488102fe5e34111f8509cf0b7de3f5b44339c9f25e87cb8@127.0.0.1:2345',
      ),
      [multiaddr('/ip4/10.0.0.1/tcp/1234'), multiaddr('/ip4/127.0.0.1/tcp/2345')],
      'parse multiple',
    )
    assert.throws(() => parseMultiaddrs(10 as any), /not a function/, 'throws error')
    assert.deepEqual(
      parseMultiaddrs('[2607:f8b0:4003:c00::6a]:5678'),
      [multiaddr('/ip6/2607:f8b0:4003:c00::6a/tcp/5678')],
      'parse ipv6 multiaddr',
    )
  })
})
