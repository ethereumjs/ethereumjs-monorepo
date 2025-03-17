[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / EthersProvider

# Interface: EthersProvider

Defined in: [packages/util/src/provider.ts:79](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L79)

A partial interface for an `ethers` `JSONRPCProvider`
We only use the url string since we do raw `fetch` calls to
retrieve the necessary data

## Properties

### \_getConnection()

> **\_getConnection**: () => `object`

Defined in: [packages/util/src/provider.ts:80](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L80)

#### Returns

`object`

##### url

> **url**: `string`
