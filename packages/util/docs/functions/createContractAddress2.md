[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / createContractAddress2

# Function: createContractAddress2()

> **createContractAddress2**(`from`, `salt`, `initCode`): [`Address`](../classes/Address.md)

Defined in: [packages/util/src/address.ts:145](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L145)

Generates an address for a contract created using CREATE2.

## Parameters

### from

[`Address`](../classes/Address.md)

The address which is creating this new address

### salt

`Uint8Array`

A salt

### initCode

`Uint8Array`

The init code of the contract being created

## Returns

[`Address`](../classes/Address.md)
