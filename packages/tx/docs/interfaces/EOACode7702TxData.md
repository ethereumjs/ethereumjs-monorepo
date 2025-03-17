[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EOACode7702TxData

# Interface: EOACode7702TxData

Defined in: [types.ts:426](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L426)

[EOACode7702Tx](../classes/EOACode7702Tx.md) data.

## Extends

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: `null` \| [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:371](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L371)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`accessList`](FeeMarketEIP1559TxData.md#accesslist)

***

### authorizationList?

> `optional` **authorizationList**: [`AuthorizationListBytes`](../type-aliases/AuthorizationListBytes.md) \| [`AuthorizationList`](../type-aliases/AuthorizationList.md)

Defined in: [types.ts:427](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L427)

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:366](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L366)

The transaction's chain ID

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`chainId`](FeeMarketEIP1559TxData.md#chainid)

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:335](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L335)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`data`](FeeMarketEIP1559TxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:320](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L320)

The transaction's gas limit.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasLimit`](FeeMarketEIP1559TxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null`

Defined in: [types.ts:382](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L382)

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasPrice`](FeeMarketEIP1559TxData.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigIntLike`

Defined in: [types.ts:390](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L390)

The maximum total fee

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxFeePerGas`](FeeMarketEIP1559TxData.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigIntLike`

Defined in: [types.ts:386](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L386)

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxPriorityFeePerGas`](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:310](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L310)

The transaction's nonce.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`nonce`](FeeMarketEIP1559TxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:345](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L345)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`r`](FeeMarketEIP1559TxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:350](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L350)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`s`](FeeMarketEIP1559TxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:325](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L325)

The transaction's the address is sent to.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`to`](FeeMarketEIP1559TxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:356](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L356)

The transaction type

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`type`](FeeMarketEIP1559TxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:340](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L340)

EC recovery ID.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`v`](FeeMarketEIP1559TxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:330](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L330)

The amount of Ether sent.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`value`](FeeMarketEIP1559TxData.md#value)
