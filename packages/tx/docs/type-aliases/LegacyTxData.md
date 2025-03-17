[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxData

# Type Alias: LegacyTxData

> **LegacyTxData**: `object`

Defined in: [types.ts:306](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L306)

Legacy [Transaction](../interfaces/Transaction.md) Data

## Type declaration

### data?

> `optional` **data**: `BytesLike` \| `""`

This will contain the data of the message or the init of a contract.

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

### gasPrice?

> `optional` **gasPrice**: `BigIntLike` \| `null`

The transaction's gas price.

### nonce?

> `optional` **nonce**: `BigIntLike`

The transaction's nonce.

### r?

> `optional` **r**: `BigIntLike`

EC signature parameter.

### s?

> `optional` **s**: `BigIntLike`

EC signature parameter.

### to?

> `optional` **to**: `AddressLike` \| `""`

The transaction's the address is sent to.

### type?

> `optional` **type**: `BigIntLike`

The transaction type

### v?

> `optional` **v**: `BigIntLike`

EC recovery ID.

### value?

> `optional` **value**: `BigIntLike`

The amount of Ether sent.
