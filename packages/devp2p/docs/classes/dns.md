[@ethereumjs/devp2p](../README.md) / DNS

# Class: DNS

## Table of contents

### Constructors

- [constructor](dns.md#constructor)

### Methods

- [\_\_setNativeDNSModuleResolve](dns.md#__setnativednsmoduleresolve)
- [getPeers](dns.md#getpeers)

## Constructors

### constructor

\+ **new DNS**(`options?`: [*DNSOptions*](../README.md#dnsoptions)): [*DNS*](dns.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*DNSOptions*](../README.md#dnsoptions) |

**Returns:** [*DNS*](dns.md)

Defined in: [dns/dns.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L33)

## Methods

### \_\_setNativeDNSModuleResolve

▸ **__setNativeDNSModuleResolve**(`mock`: *any*): *void*

Only used for testing. A stopgap to enable successful
TestDouble mocking of the native `dns` module.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`mock` | *any* | TestDouble fn    |

**Returns:** *void*

Defined in: [dns/dns.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L215)

___

### getPeers

▸ **getPeers**(`maxQuantity`: *number*, `dnsNetworks`: *string*[]): *Promise*<[*PeerInfo*](../interfaces/peerinfo.md)[]\>

Returns a list of verified peers listed in an EIP-1459 DNS tree. Method may
return fewer peers than requested if `maxQuantity` is larger than the number
of ENR records or the number of errors/duplicate peers encountered by randomized
search exceeds `maxQuantity` plus the `errorTolerance` factor.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`maxQuantity` | *number* | max number to get   |
`dnsNetworks` | *string*[] | - |

**Returns:** *Promise*<[*PeerInfo*](../interfaces/peerinfo.md)[]\>

Defined in: [dns/dns.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L53)
