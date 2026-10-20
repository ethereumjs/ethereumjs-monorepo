[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / TransactionCache

# Interface: TransactionCache

Defined in: [types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L135)

Per-instance cache populated when [TxOptions.freeze](TxOptions.md#freeze) is enabled.

## Properties

### accessListJSON?

> `optional` **accessListJSON?**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L146)

Cached JSON representation of the access list

***

### authorityListJSON?

> `optional` **authorityListJSON?**: `EOACode7702AuthorizationList`

Defined in: [types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

Cached JSON representation of the EIP-7702 authority list

***

### dataFee?

> `optional` **dataFee?**: `object`

Defined in: [types.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L139)

Cached data fee for blob transactions

#### hardfork

> **hardfork**: `string`

#### value

> **value**: `bigint`

***

### hash?

> `optional` **hash?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L137)

Cached transaction hash (populated when `freeze` is enabled)

***

### senderPubKey?

> `optional` **senderPubKey?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L144)

Cached sender public key from signature recovery
