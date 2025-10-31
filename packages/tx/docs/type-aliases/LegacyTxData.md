[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxData

# Type Alias: LegacyTxData

> **LegacyTxData** = `object`

Defined in: [types.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L353)

Legacy [Transaction](../interfaces/Transaction.md) Data

## Extended by

- [`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

## Properties

### data?

> `optional` **data**: `BytesLike` \| `""`

Defined in: [types.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L382)

This will contain the data of the message or the init of a contract.

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L367)

The transaction's gas limit.

***

### gasPrice?

> `optional` **gasPrice**: `BigIntLike` \| `null`

Defined in: [types.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L362)

The transaction's gas price.

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L357)

The transaction's nonce.

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

EC signature parameter.

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

EC signature parameter.

***

### to?

> `optional` **to**: `AddressLike` \| `""`

Defined in: [types.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L372)

The transaction's the address is sent to.

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L403)

The transaction type

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

EC recovery ID.

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L377)

The amount of Ether sent.
