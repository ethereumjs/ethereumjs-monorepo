[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / EthersProvider

# Interface: EthersProvider

Defined in: [packages/util/src/provider.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L81)

A partial interface for an `ethers` `JSONRPCProvider`
We only use the url string since we do raw `fetch` calls to
retrieve the necessary data

## Properties

### \_getConnection()

> **\_getConnection**: () => `object`

Defined in: [packages/util/src/provider.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L82)

#### Returns

`object`

##### url

> **url**: `string`
