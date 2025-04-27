[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxData

# Type Alias: LegacyTxData

> **LegacyTxData** = `object`

Defined in: [types.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L293)

Legacy [Transaction](../interfaces/Transaction.md) Data

## Extended by

- [`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

## Properties

### data?

> `optional` **data**: `BytesLike` \| `""`

Defined in: [types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L322)

This will contain the data of the message or the init of a contract.

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L307)

The transaction's gas limit.

***

### gasPrice?

> `optional` **gasPrice**: `BigIntLike` \| `null`

Defined in: [types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L302)

The transaction's gas price.

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L297)

The transaction's nonce.

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L332)

EC signature parameter.

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L337)

EC signature parameter.

***

### to?

> `optional` **to**: `AddressLike` \| `""`

Defined in: [types.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L312)

The transaction's the address is sent to.

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L343)

The transaction type

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L327)

EC recovery ID.

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L317)

The amount of Ether sent.
