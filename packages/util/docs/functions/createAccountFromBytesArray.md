[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / createAccountFromBytesArray

# Function: createAccountFromBytesArray()

> **createAccountFromBytesArray**(`values`): [`Account`](../classes/Account.md)

Defined in: [packages/util/src/account.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L334)

Creates an account from an RLP-decoded values array:
`[nonce, balance, storageRoot, codeHash]`.

## Parameters

### values

`Uint8Array`\<`ArrayBufferLike`\>[]

## Returns

[`Account`](../classes/Account.md)
