[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / accountBodyToRLP

# Function: accountBodyToRLP()

> **accountBodyToRLP**(`body`, `couldBeSlim`): `Uint8Array`

Defined in: [packages/util/src/account.ts:658](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L658)

Converts a slim account (per snap protocol spec) to the RLP encoded version of the account

## Parameters

### body

[`AccountBodyBytes`](../type-aliases/AccountBodyBytes.md)

Array of 4 Uint8Array-like items to represent the account

### couldBeSlim

`boolean` = `true`

## Returns

`Uint8Array`

RLP encoded version of the account
