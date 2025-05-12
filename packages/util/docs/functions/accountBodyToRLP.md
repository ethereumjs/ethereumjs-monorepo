[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / accountBodyToRLP

# Function: accountBodyToRLP()

> **accountBodyToRLP**(`body`, `couldBeSlim`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/util/src/account.ts:627](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L627)

Converts a slim account (per snap protocol spec) to the RLP encoded version of the account

## Parameters

### body

[`AccountBodyBytes`](../type-aliases/AccountBodyBytes.md)

Array of 4 Uint8Array-like items to represent the account

### couldBeSlim

`boolean` = `true`

## Returns

`Uint8Array`\<`ArrayBufferLike`\>

RLP encoded version of the account
