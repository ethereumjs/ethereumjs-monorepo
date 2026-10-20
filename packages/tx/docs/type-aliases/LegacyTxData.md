[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / LegacyTxData

# Type Alias: LegacyTxData

> **LegacyTxData** = `object`

Defined in: [types.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L383)

Legacy [Transaction](../interfaces/Transaction.md) Data

## Extended by

- [`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

## Properties

### data?

> `optional` **data?**: `BytesLike` \| `""`

Defined in: [types.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L412)

This will contain the data of the message or the init of a contract.

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

The transaction's gas limit.

***

### gasPrice?

> `optional` **gasPrice?**: `BigIntLike` \| `null`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

The transaction's gas price.

***

### nonce?

> `optional` **nonce?**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

The transaction's nonce.

***

### r?

> `optional` **r?**: `BigIntLike`

Defined in: [types.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L422)

EC signature parameter.

***

### s?

> `optional` **s?**: `BigIntLike`

Defined in: [types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L427)

EC signature parameter.

***

### to?

> `optional` **to?**: `AddressLike` \| `""`

Defined in: [types.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L402)

The transaction's the address is sent to.

***

### type?

> `optional` **type?**: `BigIntLike`

Defined in: [types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L433)

The transaction type

***

### v?

> `optional` **v?**: `BigIntLike`

Defined in: [types.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L417)

EC recovery ID.

***

### value?

> `optional` **value?**: `BigIntLike`

Defined in: [types.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L407)

The amount of Ether sent.
