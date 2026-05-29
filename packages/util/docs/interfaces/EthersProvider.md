[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / EthersProvider

# Interface: EthersProvider

Defined in: [packages/util/src/provider.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L105)

A partial interface for an `ethers` `JSONRPCProvider`
We only use the url string since we do raw `fetch` calls to
retrieve the necessary data

## Properties

### \_getConnection()

> **\_getConnection**: () => `object`

Defined in: [packages/util/src/provider.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L106)

#### Returns

`object`

##### url

> **url**: `string`
