[@ethereumjs/devp2p](../README.md) / DPTOptions

# Interface: DPTOptions

## Table of contents

### Properties

- [createSocket](DPTOptions.md#createsocket)
- [dnsAddr](DPTOptions.md#dnsaddr)
- [dnsNetworks](DPTOptions.md#dnsnetworks)
- [dnsRefreshQuantity](DPTOptions.md#dnsrefreshquantity)
- [endpoint](DPTOptions.md#endpoint)
- [refreshInterval](DPTOptions.md#refreshinterval)
- [shouldFindNeighbours](DPTOptions.md#shouldfindneighbours)
- [shouldGetDnsPeers](DPTOptions.md#shouldgetdnspeers)
- [timeout](DPTOptions.md#timeout)

## Properties

### createSocket

• `Optional` **createSocket**: `Function`

Function for socket creation

Default: dgram-created socket

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L42)

___

### dnsAddr

• `Optional` **dnsAddr**: `string`

DNS server to query DNS TXT records from for peer discovery

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L84)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

EIP-1459 ENR tree urls to query for peer discovery

Default: (network dependent)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L79)

___

### dnsRefreshQuantity

• `Optional` **dnsRefreshQuantity**: `number`

Max number of candidate peers to retrieve from DNS records when
attempting to discover new nodes

Default: 25

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L72)

___

### endpoint

• `Optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L35)

___

### refreshInterval

• `Optional` **refreshInterval**: `number`

Interval for peer table refresh

Default: 60s

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L49)

___

### shouldFindNeighbours

• `Optional` **shouldFindNeighbours**: `boolean`

Toggles whether or not peers should be queried with 'findNeighbours'
to discover more peers

Default: true

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L57)

___

### shouldGetDnsPeers

• `Optional` **shouldGetDnsPeers**: `boolean`

Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists

Default: false

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L64)

___

### timeout

• `Optional` **timeout**: `number`

Timeout for peer requests

Default: 10s

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L28)
