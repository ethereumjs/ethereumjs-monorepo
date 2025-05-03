[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxData

# Type Alias: LegacyTxData

> **LegacyTxData** = `object`

Defined in: [types.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L310)

Legacy [Transaction](../interfaces/Transaction.md) Data

## Extended by

- [`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

## Properties

### data?

> `optional` **data**: `BytesLike` \| `""`

Defined in: [types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L339)

This will contain the data of the message or the init of a contract.

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L324)

The transaction's gas limit.

***

### gasPrice?

> `optional` **gasPrice**: `BigIntLike` \| `null`

Defined in: [types.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L319)

The transaction's gas price.

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L314)

The transaction's nonce.

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L349)

EC signature parameter.

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L354)

EC signature parameter.

***

### to?

> `optional` **to**: `AddressLike` \| `""`

Defined in: [types.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L329)

The transaction's the address is sent to.

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L360)

The transaction type

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L344)

EC recovery ID.

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L334)

The amount of Ether sent.
