[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / generateAddress2

# Function: generateAddress2()

> **generateAddress2**(`from`, `salt`, `initCode`): `Uint8Array`

Defined in: [packages/util/src/account.ts:473](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L473)

Generates an address for a contract created using CREATE2.

## Parameters

### from

`Uint8Array`

The address which is creating this new address

### salt

`Uint8Array`

A salt

### initCode

`Uint8Array`

The init code of the contract being created

## Returns

`Uint8Array`
