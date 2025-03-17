[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPTOptions

# Interface: DPTOptions

Defined in: [packages/devp2p/src/types.ts:99](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L99)

## Properties

### common?

> `optional` **common**: `Common`

Defined in: [packages/devp2p/src/types.ts:178](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L178)

Common instance to allow for crypto primitive (e.g. keccak) replacement

***

### createSocket?

> `optional` **createSocket**: `Function`

Defined in: [packages/devp2p/src/types.ts:119](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L119)

Function for socket creation

Default: dgram-created socket

***

### dnsAddr?

> `optional` **dnsAddr**: `string`

Defined in: [packages/devp2p/src/types.ts:173](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L173)

DNS server to query DNS TXT records from for peer discovery

***

### dnsNetworks?

> `optional` **dnsNetworks**: `string`[]

Defined in: [packages/devp2p/src/types.ts:168](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L168)

EIP-1459 ENR tree urls to query for peer discovery

Default: (network dependent)

***

### dnsRefreshQuantity?

> `optional` **dnsRefreshQuantity**: `number`

Defined in: [packages/devp2p/src/types.ts:161](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L161)

Max number of candidate peers to retrieve from DNS records when
attempting to discover new nodes

Default: 25

***

### endpoint?

> `optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Defined in: [packages/devp2p/src/types.ts:112](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L112)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

***

### onlyConfirmed?

> `optional` **onlyConfirmed**: `boolean`

Defined in: [packages/devp2p/src/types.ts:146](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L146)

Send findNeighbour requests to and only answer with respective peers
being confirmed by calling the `confirmPeer()` method

(allows for a more selective and noise reduced discovery)

Note: Bootstrap nodes are confirmed by default.

Default: false

***

### refreshInterval?

> `optional` **refreshInterval**: `number`

Defined in: [packages/devp2p/src/types.ts:126](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L126)

Interval for peer table refresh

Default: 60s

***

### shouldFindNeighbours?

> `optional` **shouldFindNeighbours**: `boolean`

Defined in: [packages/devp2p/src/types.ts:134](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L134)

Toggles whether or not peers should be queried with 'findNeighbours'
to discover more peers

Default: true

***

### shouldGetDnsPeers?

> `optional` **shouldGetDnsPeers**: `boolean`

Defined in: [packages/devp2p/src/types.ts:153](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L153)

Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists

Default: false

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/devp2p/src/types.ts:105](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L105)

Timeout for peer requests

Default: 10s
