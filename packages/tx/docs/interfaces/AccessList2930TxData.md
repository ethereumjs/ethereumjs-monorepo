[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930TxData

# Interface: AccessList2930TxData

Defined in: [types.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L439)

[AccessList2930Tx](../classes/AccessList2930Tx.md) data.

## Extends

- [`LegacyTxData`](../type-aliases/LegacyTxData.md)

## Extended by

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList?**: [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: [types.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L448)

The access list which contains the addresses/storage slots which the transaction wishes to access

***

### chainId?

> `optional` **chainId?**: `BigIntLike`

Defined in: [types.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L443)

The transaction's chain ID

***

### data?

> `optional` **data?**: `""` \| `BytesLike`

Defined in: [types.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L412)

This will contain the data of the message or the init of a contract.

#### Inherited from

`LegacyTxData.data`

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

The transaction's gas limit.

#### Inherited from

`LegacyTxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `BigIntLike` \| `null`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

The transaction's gas price.

#### Inherited from

`LegacyTxData.gasPrice`

***

### nonce?

> `optional` **nonce?**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

The transaction's nonce.

#### Inherited from

`LegacyTxData.nonce`

***

### r?

> `optional` **r?**: `BigIntLike`

Defined in: [types.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L422)

EC signature parameter.

#### Inherited from

`LegacyTxData.r`

***

### s?

> `optional` **s?**: `BigIntLike`

Defined in: [types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L427)

EC signature parameter.

#### Inherited from

`LegacyTxData.s`

***

### to?

> `optional` **to?**: `""` \| `AddressLike`

Defined in: [types.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L402)

The transaction's the address is sent to.

#### Inherited from

`LegacyTxData.to`

***

### type?

> `optional` **type?**: `BigIntLike`

Defined in: [types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L433)

The transaction type

#### Inherited from

`LegacyTxData.type`

***

### v?

> `optional` **v?**: `BigIntLike`

Defined in: [types.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L417)

EC recovery ID.

#### Inherited from

`LegacyTxData.v`

***

### value?

> `optional` **value?**: `BigIntLike`

Defined in: [types.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L407)

The amount of Ether sent.

#### Inherited from

`LegacyTxData.value`
