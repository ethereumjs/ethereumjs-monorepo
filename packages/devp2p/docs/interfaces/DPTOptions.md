[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPTOptions

# Interface: DPTOptions

Defined in: [packages/devp2p/src/types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L113)

## Properties

### common?

> `optional` **common**: `Common`

Defined in: [packages/devp2p/src/types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L192)

Common instance to allow for crypto primitive (e.g. keccak) replacement

***

### createSocket?

> `optional` **createSocket**: `Function`

Defined in: [packages/devp2p/src/types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L133)

Function for socket creation

Default: dgram-created socket

***

### dnsAddr?

> `optional` **dnsAddr**: `string`

Defined in: [packages/devp2p/src/types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L187)

DNS server to query DNS TXT records from for peer discovery

***

### dnsNetworks?

> `optional` **dnsNetworks**: `string`[]

Defined in: [packages/devp2p/src/types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L182)

EIP-1459 ENR tree urls to query for peer discovery

Default: (network dependent)

***

### dnsRefreshQuantity?

> `optional` **dnsRefreshQuantity**: `number`

Defined in: [packages/devp2p/src/types.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L175)

Max number of candidate peers to retrieve from DNS records when
attempting to discover new nodes

Default: 25

***

### endpoint?

> `optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Defined in: [packages/devp2p/src/types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L126)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

***

### onlyConfirmed?

> `optional` **onlyConfirmed**: `boolean`

Defined in: [packages/devp2p/src/types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L160)

Send findNeighbour requests to and only answer with respective peers
being confirmed by calling the `confirmPeer()` method

(allows for a more selective and noise reduced discovery)

Note: Bootstrap nodes are confirmed by default.

Default: false

***

### refreshInterval?

> `optional` **refreshInterval**: `number`

Defined in: [packages/devp2p/src/types.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L140)

Interval for peer table refresh

Default: 60s

***

### shouldFindNeighbours?

> `optional` **shouldFindNeighbours**: `boolean`

Defined in: [packages/devp2p/src/types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L148)

Toggles whether or not peers should be queried with 'findNeighbours'
to discover more peers

Default: true

***

### shouldGetDnsPeers?

> `optional` **shouldGetDnsPeers**: `boolean`

Defined in: [packages/devp2p/src/types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L167)

Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists

Default: false

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/devp2p/src/types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L119)

Timeout for peer requests

Default: 10s
