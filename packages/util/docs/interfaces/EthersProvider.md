[@ethereumjs/util](../README.md) / EthersProvider

# Interface: EthersProvider

A partial interface for an `ethers` `JsonRpcProvider`
We only use the url string since we do raw `fetch` calls to
retrieve the necessary data

## Table of contents

### Properties

- [\_getConnection](EthersProvider.md#_getconnection)

## Properties

### \_getConnection

• **\_getConnection**: () => { `url`: `string`  }

#### Type declaration

▸ (): `Object`

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Defined in

[packages/util/src/provider.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L79)
