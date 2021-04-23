[@ethereumjs/devp2p](../README.md) / DPTOptions

# Interface: DPTOptions

## Table of contents

### Properties

- [createSocket](dptoptions.md#createsocket)
- [dnsAddr](dptoptions.md#dnsaddr)
- [dnsNetworks](dptoptions.md#dnsnetworks)
- [dnsRefreshQuantity](dptoptions.md#dnsrefreshquantity)
- [endpoint](dptoptions.md#endpoint)
- [refreshInterval](dptoptions.md#refreshinterval)
- [shouldFindNeighbours](dptoptions.md#shouldfindneighbours)
- [shouldGetDnsPeers](dptoptions.md#shouldgetdnspeers)
- [timeout](dptoptions.md#timeout)

## Properties

### createSocket

• `Optional` **createSocket**: Function

Function for socket creation

Default: dgram-created socket

Defined in: [dpt/dpt.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L41)

___

### dnsAddr

• `Optional` **dnsAddr**: *string*

DNS server to query DNS TXT records from for peer discovery

Defined in: [dpt/dpt.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L83)

___

### dnsNetworks

• `Optional` **dnsNetworks**: *string*[]

EIP-1459 ENR tree urls to query for peer discovery

Default: (network dependent)

Defined in: [dpt/dpt.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L78)

___

### dnsRefreshQuantity

• `Optional` **dnsRefreshQuantity**: *number*

Max number of candidate peers to retrieve from DNS records when
attempting to discover new nodes

Default: 25

Defined in: [dpt/dpt.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L71)

___

### endpoint

• `Optional` **endpoint**: [*PeerInfo*](peerinfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

Defined in: [dpt/dpt.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L34)

___

### refreshInterval

• `Optional` **refreshInterval**: *number*

Interval for peer table refresh

Default: 60s

Defined in: [dpt/dpt.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L48)

___

### shouldFindNeighbours

• `Optional` **shouldFindNeighbours**: *boolean*

Toggles whether or not peers should be queried with 'findNeighbours'
to discover more peers

Default: true

Defined in: [dpt/dpt.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L56)

___

### shouldGetDnsPeers

• `Optional` **shouldGetDnsPeers**: *boolean*

Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists

Default: false

Defined in: [dpt/dpt.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L63)

___

### timeout

• `Optional` **timeout**: *number*

Timeout for peer requests

Default: 10s

Defined in: [dpt/dpt.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L27)
