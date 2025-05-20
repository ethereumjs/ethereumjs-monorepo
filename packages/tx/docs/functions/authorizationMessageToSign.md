[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / authorizationMessageToSign

# Function: authorizationMessageToSign()

> **authorizationMessageToSign**(`input`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [util/authorization.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/authorization.ts#L90)

Returns the bytes (RLP-encoded) to sign

## Parameters

### input

Either the bytes or the object format of the authorization list item

[`AuthorizationListItemUnsigned`](../type-aliases/AuthorizationListItemUnsigned.md) | [`AuthorizationListBytesItemUnsigned`](../type-aliases/AuthorizationListBytesItemUnsigned.md)

## Returns

`Uint8Array`\<`ArrayBufferLike`\>
