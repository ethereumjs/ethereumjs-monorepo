[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / eoaCode7702AuthorizationMessageToSign

# Function: eoaCode7702AuthorizationMessageToSign()

> **eoaCode7702AuthorizationMessageToSign**(`input`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/util/src/authorization.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/authorization.ts#L90)

Returns the bytes (RLP-encoded) to sign

## Parameters

### input

[`EOACode7702AuthorizationListItemUnsigned`](../type-aliases/EOACode7702AuthorizationListItemUnsigned.md) \| [`EOACode7702AuthorizationListBytesItemUnsigned`](../type-aliases/EOACode7702AuthorizationListBytesItemUnsigned.md)

Either the bytes or the object format of the authorization list item

## Returns

`Uint8Array`\<`ArrayBuffer`\>
