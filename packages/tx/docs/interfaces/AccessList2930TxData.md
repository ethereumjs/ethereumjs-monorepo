[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930TxData

# Interface: AccessList2930TxData

Defined in: [types.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L366)

[AccessList2930Tx](../classes/AccessList2930Tx.md) data.

## Extends

- [`LegacyTxData`](../type-aliases/LegacyTxData.md)

## Extended by

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: `null` \| [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L375)

The access list which contains the addresses/storage slots which the transaction wishes to access

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L370)

The transaction's chain ID

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L339)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`data`](../type-aliases/LegacyTxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L324)

The transaction's gas limit.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`gasLimit`](../type-aliases/LegacyTxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null` \| `BigIntLike`

Defined in: [types.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L319)

The transaction's gas price.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`gasPrice`](../type-aliases/LegacyTxData.md#gasprice)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L314)

The transaction's nonce.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`nonce`](../type-aliases/LegacyTxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L349)

EC signature parameter.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`r`](../type-aliases/LegacyTxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L354)

EC signature parameter.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`s`](../type-aliases/LegacyTxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L329)

The transaction's the address is sent to.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`to`](../type-aliases/LegacyTxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L360)

The transaction type

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`type`](../type-aliases/LegacyTxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L344)

EC recovery ID.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`v`](../type-aliases/LegacyTxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L334)

The amount of Ether sent.

#### Inherited from

[`LegacyTxData`](../type-aliases/LegacyTxData.md).[`value`](../type-aliases/LegacyTxData.md#value)
