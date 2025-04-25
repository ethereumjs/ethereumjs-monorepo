[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DNSOptions

# Type Alias: DNSOptions

> **DNSOptions** = `object`

Defined in: [packages/devp2p/src/types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L98)

## Properties

### common?

> `optional` **common**: `Common`

Defined in: [packages/devp2p/src/types.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L110)

Common instance to allow for crypto primitive (e.g. keccak) replacement

***

### dnsServerAddress?

> `optional` **dnsServerAddress**: `string`

Defined in: [packages/devp2p/src/types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L105)

ipv4 or ipv6 address of server to pass to native dns.setServers()
Sets the IP address of servers to be used when performing
DNS resolution.
