[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / eoaCode7702SignAuthorization

# Function: eoaCode7702SignAuthorization()

> **eoaCode7702SignAuthorization**(`input`, `privateKey`, `ecSign?`): [`EOACode7702AuthorizationListBytesItem`](../type-aliases/EOACode7702AuthorizationListBytesItem.md)

Defined in: [packages/util/src/authorization.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/authorization.ts#L127)

Signs an authorization list item and returns it in `bytes` format.
To get the JSON format, use `authorizationListBytesToJSON([signed])[0] to convert it`

## Parameters

### input

[`EOACode7702AuthorizationListItemUnsigned`](../type-aliases/EOACode7702AuthorizationListItemUnsigned.md) | [`EOACode7702AuthorizationListBytesItemUnsigned`](../type-aliases/EOACode7702AuthorizationListBytesItemUnsigned.md)

### privateKey

`Uint8Array`

### ecSign?

(`msg`, `pk`, `ecSignOpts?`) => `Pick`\<`ReturnType`\<*typeof* `secp256k1.sign`\>, `"recovery"` \| `"r"` \| `"s"`\>

## Returns

[`EOACode7702AuthorizationListBytesItem`](../type-aliases/EOACode7702AuthorizationListBytesItem.md)
