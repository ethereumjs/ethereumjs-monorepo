[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930TxData

# Interface: AccessList2930TxData

Defined in: [types.ts:362](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L362)

[AccessList2930Tx](../classes/AccessList2930Tx.md) data.

## Extends

- [`LegacyTxData`](../type-aliases/LegacyTxData.md)

## Extended by

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: `null` \| [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:371](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L371)

The access list which contains the addresses/storage slots which the transaction wishes to access

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:366](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L366)

The transaction's chain ID

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:335](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L335)

This will contain the data of the message or the init of a contract.

#### Inherited from

`LegacyTxData.data`

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:320](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L320)

The transaction's gas limit.

#### Inherited from

`LegacyTxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice**: `null` \| `BigIntLike`

Defined in: [types.ts:315](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L315)

The transaction's gas price.

#### Inherited from

`LegacyTxData.gasPrice`

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:310](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L310)

The transaction's nonce.

#### Inherited from

`LegacyTxData.nonce`

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:345](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L345)

EC signature parameter.

#### Inherited from

`LegacyTxData.r`

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:350](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L350)

EC signature parameter.

#### Inherited from

`LegacyTxData.s`

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:325](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L325)

The transaction's the address is sent to.

#### Inherited from

`LegacyTxData.to`

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:356](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L356)

The transaction type

#### Inherited from

`LegacyTxData.type`

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:340](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L340)

EC recovery ID.

#### Inherited from

`LegacyTxData.v`

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:330](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L330)

The amount of Ether sent.

#### Inherited from

`LegacyTxData.value`
