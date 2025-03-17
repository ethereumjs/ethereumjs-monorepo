[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / generateCodeStems

# Function: generateCodeStems()

> **generateCodeStems**(`numChunks`, `address`, `verkleCrypto`): `Promise`\<`Uint8Array`[]\>

Defined in: [packages/util/src/verkle.ts:380](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L380)

Helper method for generating the code stems necessary for putting code

## Parameters

### numChunks

`number`

the number of code chunks to be put

### address

[`Address`](../classes/Address.md)

the address of the account getting the code

### verkleCrypto

[`VerkleCrypto`](../interfaces/VerkleCrypto.md)

an initialized [VerkleCrypto](../interfaces/VerkleCrypto.md) object

## Returns

`Promise`\<`Uint8Array`[]\>

an array of stems for putting code
