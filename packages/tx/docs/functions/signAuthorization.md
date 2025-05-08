[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / signAuthorization

# Function: signAuthorization()

> **signAuthorization**(`input`, `privateKey`, `common?`): [`AuthorizationListBytesItem`](../type-aliases/AuthorizationListBytesItem.md)

Defined in: [util/authorization.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/authorization.ts#L127)

Signs an authorization list item and returns it in `bytes` format.
To get the JSON format, use `authorizationListBytesToJSON([signed])[0] to convert it`

## Parameters

### input

[`AuthorizationListItemUnsigned`](../type-aliases/AuthorizationListItemUnsigned.md) | [`AuthorizationListBytesItemUnsigned`](../type-aliases/AuthorizationListBytesItemUnsigned.md)

### privateKey

`Uint8Array`

### common?

`Common`

## Returns

[`AuthorizationListBytesItem`](../type-aliases/AuthorizationListBytesItem.md)
