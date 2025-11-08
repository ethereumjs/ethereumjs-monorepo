[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EOACode7702TxData

# Interface: EOACode7702TxData

Defined in: [types.ts:477](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L477)

[EOACode7702Tx](../classes/EOACode7702Tx.md) data.

## Extends

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: [types.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L418)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`accessList`](FeeMarketEIP1559TxData.md#accesslist)

***

### authorizationList?

> `optional` **authorizationList**: `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList`

Defined in: [types.ts:478](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L478)

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L413)

The transaction's chain ID

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`chainId`](FeeMarketEIP1559TxData.md#chainid)

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L382)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`data`](FeeMarketEIP1559TxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L367)

The transaction's gas limit.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasLimit`](FeeMarketEIP1559TxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null`

Defined in: [types.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L429)

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasPrice`](FeeMarketEIP1559TxData.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigIntLike`

Defined in: [types.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L437)

The maximum total fee

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxFeePerGas`](FeeMarketEIP1559TxData.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigIntLike`

Defined in: [types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L433)

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxPriorityFeePerGas`](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L357)

The transaction's nonce.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`nonce`](FeeMarketEIP1559TxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`r`](FeeMarketEIP1559TxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`s`](FeeMarketEIP1559TxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L372)

The transaction's the address is sent to.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`to`](FeeMarketEIP1559TxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L403)

The transaction type

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`type`](FeeMarketEIP1559TxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

EC recovery ID.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`v`](FeeMarketEIP1559TxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L377)

The amount of Ether sent.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`value`](FeeMarketEIP1559TxData.md#value)
