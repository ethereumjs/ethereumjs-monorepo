[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930TxData

# Interface: AccessList2930TxData

Defined in: [types.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L409)

[AccessList2930Tx](../classes/AccessList2930Tx.md) data.

## Extends

- [`LegacyTxData`](../type-aliases/LegacyTxData.md)

## Extended by

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: [types.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L418)

The access list which contains the addresses/storage slots which the transaction wishes to access

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L413)

The transaction's chain ID

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L382)

This will contain the data of the message or the init of a contract.

#### Inherited from

`LegacyTxData.data`

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L367)

The transaction's gas limit.

#### Inherited from

`LegacyTxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice**: `BigIntLike` \| `null`

Defined in: [types.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L362)

The transaction's gas price.

#### Inherited from

`LegacyTxData.gasPrice`

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L357)

The transaction's nonce.

#### Inherited from

`LegacyTxData.nonce`

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

EC signature parameter.

#### Inherited from

`LegacyTxData.r`

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

EC signature parameter.

#### Inherited from

`LegacyTxData.s`

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L372)

The transaction's the address is sent to.

#### Inherited from

`LegacyTxData.to`

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L403)

The transaction type

#### Inherited from

`LegacyTxData.type`

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

EC recovery ID.

#### Inherited from

`LegacyTxData.v`

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L377)

The amount of Ether sent.

#### Inherited from

`LegacyTxData.value`
