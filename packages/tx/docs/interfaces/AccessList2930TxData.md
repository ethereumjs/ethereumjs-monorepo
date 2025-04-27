[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930TxData

# Interface: AccessList2930TxData

Defined in: [types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L349)

[AccessList2930Tx](../classes/AccessList2930Tx.md) data.

## Extends

- [`LegacyTxData`](../type-aliases/LegacyTxData.md)

## Extended by

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: `null` \| [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L358)

The access list which contains the addresses/storage slots which the transaction wishes to access

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L353)

The transaction's chain ID

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L322)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`data`](../type-aliases/LegacyTxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L307)

The transaction's gas limit.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`gasLimit`](../type-aliases/LegacyTxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null` \| `BigIntLike`

Defined in: [types.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L302)

The transaction's gas price.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`gasPrice`](../type-aliases/LegacyTxData.md#gasprice)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L297)

The transaction's nonce.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`nonce`](../type-aliases/LegacyTxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L332)

EC signature parameter.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`r`](../type-aliases/LegacyTxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L337)

EC signature parameter.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`s`](../type-aliases/LegacyTxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L312)

The transaction's the address is sent to.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`to`](../type-aliases/LegacyTxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:343](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L343)

The transaction type

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`type`](../type-aliases/LegacyTxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L327)

EC recovery ID.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`v`](../type-aliases/LegacyTxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L317)

The amount of Ether sent.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`value`](../type-aliases/LegacyTxData.md#value)
