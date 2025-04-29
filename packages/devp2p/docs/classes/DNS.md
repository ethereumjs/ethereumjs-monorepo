[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DNS

# Class: DNS

Defined in: [packages/devp2p/src/dns/dns.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L18)

## Constructors

### Constructor

> **new DNS**(`options`): `DNS`

Defined in: [packages/devp2p/src/dns/dns.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L26)

#### Parameters

##### options

[`DNSOptions`](../type-aliases/DNSOptions.md) = `{}`

#### Returns

`DNS`

## Methods

### \_\_setNativeDNSModuleResolve()

> **\_\_setNativeDNSModuleResolve**(`mock`): `void`

Defined in: [packages/devp2p/src/dns/dns.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L216)

Only used for testing. A stopgap to enable successful
TestDouble mocking of the native `dns` module.

#### Parameters

##### mock

`any`

TestDouble fn

#### Returns

`void`

***

### getPeers()

> **getPeers**(`maxQuantity`, `dnsNetworks`): `Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>

Defined in: [packages/devp2p/src/dns/dns.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L49)

Returns a list of verified peers listed in an EIP-1459 DNS tree. Method may
return fewer peers than requested if `maxQuantity` is larger than the number
of ENR records or the number of errors/duplicate peers encountered by randomized
search exceeds `maxQuantity` plus the `errorTolerance` factor.

#### Parameters

##### maxQuantity

`number`

max number to get

##### dnsNetworks

`string`[]

enrTree strings (See EIP-1459 for format)

#### Returns

`Promise`\<[`PeerInfo`](../interfaces/PeerInfo.md)[]\>
