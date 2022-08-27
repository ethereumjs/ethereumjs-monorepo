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

[packages/devp2p/src/dpt/dpt.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L44)

___

### dnsAddr

• `Optional` **dnsAddr**: `string`

DNS server to query DNS TXT records from for peer discovery

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L86)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

EIP-1459 ENR tree urls to query for peer discovery

Default: (network dependent)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L81)

___

### dnsRefreshQuantity

• `Optional` **dnsRefreshQuantity**: `number`

Max number of candidate peers to retrieve from DNS records when
attempting to discover new nodes

Default: 25

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L74)

___

### endpoint

• `Optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L37)

___

### refreshInterval

• `Optional` **refreshInterval**: `number`

Interval for peer table refresh

Default: 60s

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L51)

___

### shouldFindNeighbours

• `Optional` **shouldFindNeighbours**: `boolean`

Toggles whether or not peers should be queried with 'findNeighbours'
to discover more peers

Default: true

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L59)

___

### shouldGetDnsPeers

• `Optional` **shouldGetDnsPeers**: `boolean`

Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists

Default: false

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L66)

___

### timeout

• `Optional` **timeout**: `number`

Timeout for peer requests

Default: 10s

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L30)
