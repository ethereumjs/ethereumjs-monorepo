[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / FeeMarketEIP1559TxData

# Interface: FeeMarketEIP1559TxData

Defined in: [types.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L424)

[FeeMarket1559Tx](../classes/FeeMarket1559Tx.md) data.

## Extends

- [`AccessList2930TxData`](AccessList2930TxData.md)

## Extended by

- [`BlobEIP4844TxData`](BlobEIP4844TxData.md)
- [`EOACode7702TxData`](EOACode7702TxData.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: [types.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L418)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`accessList`](AccessList2930TxData.md#accesslist)

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L413)

The transaction's chain ID

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`chainId`](AccessList2930TxData.md#chainid)

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L382)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`data`](AccessList2930TxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L367)

The transaction's gas limit.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`gasLimit`](AccessList2930TxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null`

Defined in: [types.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L429)

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Overrides

[`AccessList2930TxData`](AccessList2930TxData.md).[`gasPrice`](AccessList2930TxData.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigIntLike`

Defined in: [types.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L437)

The maximum total fee

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigIntLike`

Defined in: [types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L433)

The maximum inclusion fee per gas (this fee is given to the miner)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L357)

The transaction's nonce.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`nonce`](AccessList2930TxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

EC signature parameter.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`r`](AccessList2930TxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

EC signature parameter.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`s`](AccessList2930TxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L372)

The transaction's the address is sent to.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`to`](AccessList2930TxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L403)

The transaction type

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`type`](AccessList2930TxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

EC recovery ID.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`v`](AccessList2930TxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L377)

The amount of Ether sent.

#### Inherited from

[`AccessList2930TxData`](AccessList2930TxData.md).[`value`](AccessList2930TxData.md#value)
