[@ethereumjs/devp2p](../README.md) / DNS

# Class: DNS

## Table of contents

### Constructors

- [constructor](DNS.md#constructor)

### Methods

- [\_\_setNativeDNSModuleResolve](DNS.md#__setnativednsmoduleresolve)
- [getPeers](DNS.md#getpeers)

## Constructors

### constructor

• **new DNS**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`DNSOptions`](../README.md#dnsoptions) |

#### Defined in

[packages/devp2p/src/dns/dns.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L27)

## Methods

### \_\_setNativeDNSModuleResolve

▸ **__setNativeDNSModuleResolve**(`mock`): `void`

Only used for testing. A stopgap to enable successful
TestDouble mocking of the native `dns` module.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mock` | `any` | TestDouble fn |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dns/dns.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L208)

___

### getPeers

▸ **getPeers**(`maxQuantity`, `dnsNetworks`): `Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

Returns a list of verified peers listed in an EIP-1459 DNS tree. Method may
return fewer peers than requested if `maxQuantity` is larger than the number
of ENR records or the number of errors/duplicate peers encountered by randomized
search exceeds `maxQuantity` plus the `errorTolerance` factor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxQuantity` | `number` | max number to get |
| `dnsNetworks` | `string`[] | enrTree strings (See EIP-1459 for format) |

#### Returns

`Promise`<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

#### Defined in

[packages/devp2p/src/dns/dns.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L45)
